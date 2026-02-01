import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  AppWorkspaceState,
  DocumentSettings,
  PreviewOverlayVisibility,
  ThemeMode,
  UiLanguageCode,
  WorkbookBlock,
  WorkbookBlockType
} from './types';
import {
  calculateGutterWidthMillimetersByPageCount,
  createNewWorkbookBlock,
  reorderWorkbookBlock,
  reorderWorkbookBlocksByDrag,
  synchronizeBlockIdCounter
} from './state-helpers';

interface AppStateContextValue {
  appWorkspaceState: AppWorkspaceState;
  setActiveUiLanguageCode: (activeUiLanguageCode: UiLanguageCode) => void;
  setActiveThemeMode: (activeThemeMode: ThemeMode) => void;
  setActiveWorkspaceTab: (activeWorkspaceTab: 'editor' | 'preview') => void;
  addWorkbookBlock: (blockType: WorkbookBlockType) => void;
  selectWorkbookBlock: (blockId: string) => void;
  reorderWorkbookBlocks: (targetBlockId: string, direction: 'up' | 'down') => void;
  reorderWorkbookBlocksByDrag: (sourceBlockId: string, targetBlockId: string) => void;
  updateDocumentSettings: (documentSettings: Partial<DocumentSettings>) => void;
  updatePreviewOverlayVisibility: (previewOverlayVisibility: Partial<PreviewOverlayVisibility>) => void;
  updateSelectedBlock: (updatedBlock: WorkbookBlock) => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

const initialDocumentSettings: DocumentSettings = {
  trimSizePresetId: 'trim_6x9',
  isBleedEnabled: false,
  estimatedPageCount: 120,
  calculatedGutterWidthMillimeters: calculateGutterWidthMillimetersByPageCount(120, false, 'trim_6x9')
};

const initialPreviewOverlayVisibility: PreviewOverlayVisibility = {
  isSafeAreaVisible: true,
  isBleedVisible: false,
  isMarginsVisible: true,
  isGutterVisible: true
};

const initialWorkbookBlocks: WorkbookBlock[] = [
  createNewWorkbookBlock('chapterStart'),
  createNewWorkbookBlock('heading'),
  createNewWorkbookBlock('paragraph'),
  createNewWorkbookBlock('checklist'),
  createNewWorkbookBlock('answerLines')
];

const initialAppWorkspaceState: AppWorkspaceState = {
  activeUiLanguageCode: 'en',
  activeThemeMode: 'light',
  documentSettings: initialDocumentSettings,
  workbookBlocks: initialWorkbookBlocks,
  selectedWorkbookBlockId: initialWorkbookBlocks[0]?.blockId ?? null,
  previewOverlayVisibility: initialPreviewOverlayVisibility,
  activeWorkspaceTab: 'editor'
};

const localStorageWorkspaceStateKey = 'kdpWorkbookEditorWorkspaceState';

type AppStateAction =
  | { type: 'setActiveUiLanguageCode'; activeUiLanguageCode: UiLanguageCode }
  | { type: 'setActiveThemeMode'; activeThemeMode: ThemeMode }
  | { type: 'setActiveWorkspaceTab'; activeWorkspaceTab: 'editor' | 'preview' }
  | { type: 'addWorkbookBlock'; blockType: WorkbookBlockType }
  | { type: 'selectWorkbookBlock'; blockId: string }
  | { type: 'reorderWorkbookBlocks'; targetBlockId: string; direction: 'up' | 'down' }
  | { type: 'reorderWorkbookBlocksByDrag'; sourceBlockId: string; targetBlockId: string }
  | { type: 'updateDocumentSettings'; documentSettings: Partial<DocumentSettings> }
  | { type: 'updatePreviewOverlayVisibility'; previewOverlayVisibility: Partial<PreviewOverlayVisibility> }
  | { type: 'updateSelectedBlock'; updatedBlock: WorkbookBlock };

function updateDocumentSettingsWithGutter(documentSettings: DocumentSettings): DocumentSettings {
  const calculatedGutterWidthMillimeters = calculateGutterWidthMillimetersByPageCount(
    documentSettings.estimatedPageCount,
    documentSettings.isBleedEnabled,
    documentSettings.trimSizePresetId
  );

  return {
    ...documentSettings,
    calculatedGutterWidthMillimeters
  };
}

function appStateReducer(
  currentState: AppWorkspaceState,
  action: AppStateAction
): AppWorkspaceState {
  switch (action.type) {
    case 'setActiveUiLanguageCode':
      return { ...currentState, activeUiLanguageCode: action.activeUiLanguageCode };
    case 'setActiveThemeMode':
      return { ...currentState, activeThemeMode: action.activeThemeMode };
    case 'setActiveWorkspaceTab':
      return { ...currentState, activeWorkspaceTab: action.activeWorkspaceTab };
    case 'addWorkbookBlock': {
      const newBlock = createNewWorkbookBlock(action.blockType);
      return {
        ...currentState,
        workbookBlocks: [...currentState.workbookBlocks, newBlock],
        selectedWorkbookBlockId: newBlock.blockId
      };
    }
    case 'selectWorkbookBlock':
      return { ...currentState, selectedWorkbookBlockId: action.blockId };
    case 'reorderWorkbookBlocks':
      return {
        ...currentState,
        workbookBlocks: reorderWorkbookBlock(
          currentState.workbookBlocks,
          action.targetBlockId,
          action.direction
        )
      };
    case 'reorderWorkbookBlocksByDrag':
      return {
        ...currentState,
        workbookBlocks: reorderWorkbookBlocksByDrag(
          currentState.workbookBlocks,
          action.sourceBlockId,
          action.targetBlockId
        )
      };
    case 'updateDocumentSettings': {
      const mergedDocumentSettings = {
        ...currentState.documentSettings,
        ...action.documentSettings
      };
      return {
        ...currentState,
        documentSettings: updateDocumentSettingsWithGutter(mergedDocumentSettings)
      };
    }
    case 'updatePreviewOverlayVisibility':
      return {
        ...currentState,
        previewOverlayVisibility: {
          ...currentState.previewOverlayVisibility,
          ...action.previewOverlayVisibility
        }
      };
    case 'updateSelectedBlock': {
      const updatedBlocks = currentState.workbookBlocks.map((workbookBlock) =>
        workbookBlock.blockId === action.updatedBlock.blockId ? action.updatedBlock : workbookBlock
      );
      return { ...currentState, workbookBlocks: updatedBlocks };
    }
    default:
      return currentState;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [appWorkspaceState, dispatch] = useReducer(
    appStateReducer,
    initialAppWorkspaceState,
    initializeAppWorkspaceState
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(
        localStorageWorkspaceStateKey,
        JSON.stringify(appWorkspaceState)
      );
    } catch {
      // Ignore storage write failures (private mode or quota limits).
    }
  }, [appWorkspaceState]);

  const contextValue = useMemo<AppStateContextValue>(
    () => ({
      appWorkspaceState,
      setActiveUiLanguageCode: (activeUiLanguageCode) =>
        dispatch({ type: 'setActiveUiLanguageCode', activeUiLanguageCode }),
      setActiveThemeMode: (activeThemeMode) =>
        dispatch({ type: 'setActiveThemeMode', activeThemeMode }),
      setActiveWorkspaceTab: (activeWorkspaceTab) =>
        dispatch({ type: 'setActiveWorkspaceTab', activeWorkspaceTab }),
      addWorkbookBlock: (blockType) => dispatch({ type: 'addWorkbookBlock', blockType }),
      selectWorkbookBlock: (blockId) => dispatch({ type: 'selectWorkbookBlock', blockId }),
      reorderWorkbookBlocks: (targetBlockId, direction) =>
        dispatch({ type: 'reorderWorkbookBlocks', targetBlockId, direction }),
      reorderWorkbookBlocksByDrag: (sourceBlockId, targetBlockId) =>
        dispatch({ type: 'reorderWorkbookBlocksByDrag', sourceBlockId, targetBlockId }),
      updateDocumentSettings: (documentSettings) =>
        dispatch({ type: 'updateDocumentSettings', documentSettings }),
      updatePreviewOverlayVisibility: (previewOverlayVisibility) =>
        dispatch({ type: 'updatePreviewOverlayVisibility', previewOverlayVisibility }),
      updateSelectedBlock: (updatedBlock) =>
        dispatch({ type: 'updateSelectedBlock', updatedBlock })
    }),
    [appWorkspaceState]
  );

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppStateContextValue {
  const contextValue = useContext(AppStateContext);
  if (!contextValue) {
    throw new Error('useAppState must be used within AppStateProvider');
  }
  return contextValue;
}

function initializeAppWorkspaceState(
  fallbackWorkspaceState: AppWorkspaceState
): AppWorkspaceState {
  if (typeof window === 'undefined') {
    return fallbackWorkspaceState;
  }

  synchronizeBlockIdCounter(fallbackWorkspaceState.workbookBlocks);
  const storedWorkspaceStateJson = window.localStorage.getItem(localStorageWorkspaceStateKey);
  if (!storedWorkspaceStateJson) {
    return fallbackWorkspaceState;
  }

  try {
    const parsedWorkspaceState = JSON.parse(storedWorkspaceStateJson) as Partial<AppWorkspaceState>;
    const mergedWorkspaceState = mergeWorkspaceState(fallbackWorkspaceState, parsedWorkspaceState);
    synchronizeBlockIdCounter(mergedWorkspaceState.workbookBlocks);
    return mergedWorkspaceState;
  } catch {
    return fallbackWorkspaceState;
  }
}

function mergeWorkspaceState(
  fallbackWorkspaceState: AppWorkspaceState,
  storedWorkspaceState: Partial<AppWorkspaceState>
): AppWorkspaceState {
  const supportedTrimSizePresetIdList: DocumentSettings['trimSizePresetId'][] = [
    'trim_6x9',
    'trim_85x11',
    'trim_5x8'
  ];
  const storedTrimSizePresetId = storedWorkspaceState.documentSettings?.trimSizePresetId;
  const resolvedTrimSizePresetId = supportedTrimSizePresetIdList.includes(
    storedTrimSizePresetId as DocumentSettings['trimSizePresetId']
  )
    ? (storedTrimSizePresetId as DocumentSettings['trimSizePresetId'])
    : fallbackWorkspaceState.documentSettings.trimSizePresetId;

  const mergedDocumentSettings = {
    ...fallbackWorkspaceState.documentSettings,
    ...storedWorkspaceState.documentSettings,
    trimSizePresetId: resolvedTrimSizePresetId
  };
  const updatedDocumentSettings = updateDocumentSettingsWithGutter(mergedDocumentSettings);
  const mergedPreviewOverlayVisibility = {
    ...fallbackWorkspaceState.previewOverlayVisibility,
    ...storedWorkspaceState.previewOverlayVisibility
  };
  const mergedWorkbookBlocks =
    storedWorkspaceState.workbookBlocks && storedWorkspaceState.workbookBlocks.length > 0
      ? storedWorkspaceState.workbookBlocks
      : fallbackWorkspaceState.workbookBlocks;
  const storedSelectedBlockId = storedWorkspaceState.selectedWorkbookBlockId ?? null;
  const selectedWorkbookBlockId =
    storedSelectedBlockId &&
    mergedWorkbookBlocks.some((workbookBlock) => workbookBlock.blockId === storedSelectedBlockId)
      ? storedSelectedBlockId
      : mergedWorkbookBlocks[0]?.blockId ?? null;
  const activeUiLanguageCode =
    storedWorkspaceState.activeUiLanguageCode === 'ru' ||
    storedWorkspaceState.activeUiLanguageCode === 'fr'
      ? storedWorkspaceState.activeUiLanguageCode
      : 'en';
  const activeThemeMode = storedWorkspaceState.activeThemeMode === 'dark' ? 'dark' : 'light';
  const activeWorkspaceTab =
    storedWorkspaceState.activeWorkspaceTab === 'preview' ? 'preview' : 'editor';

  return {
    ...fallbackWorkspaceState,
    ...storedWorkspaceState,
    activeUiLanguageCode,
    activeThemeMode,
    activeWorkspaceTab,
    documentSettings: updatedDocumentSettings,
    previewOverlayVisibility: mergedPreviewOverlayVisibility,
    workbookBlocks: mergedWorkbookBlocks,
    selectedWorkbookBlockId
  };
}
