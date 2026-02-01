const localStorageWorkspaceStateKey = 'kdpWorkbookEditorWorkspaceState';

const trimSizeGutterBaseMillimetersByPresetId = {
  trim_6x9: 6,
  trim_85x11: 7,
  trim_5x8: 5
};

let blockIdCounter = 1;

export const workbookBlockTypeList = [
  'paragraph',
  'heading',
  'sectionBreak',
  'pageBreak',
  'chapterStart',
  'checklist',
  'answerLines',
  'calloutBox',
  'image'
];

const initialDocumentSettings = {
  trimSizePresetId: 'trim_6x9',
  isBleedEnabled: false,
  estimatedPageCount: 120,
  calculatedGutterWidthMillimeters: calculateGutterWidthMillimetersByPageCount(120, false, 'trim_6x9')
};

const initialPreviewOverlayVisibility = {
  isSafeAreaVisible: true,
  isBleedVisible: false,
  isMarginsVisible: true,
  isGutterVisible: true
};

const initialWorkbookBlocks = [
  createNewWorkbookBlock('chapterStart'),
  createNewWorkbookBlock('heading'),
  createNewWorkbookBlock('paragraph'),
  createNewWorkbookBlock('checklist'),
  createNewWorkbookBlock('answerLines')
];

const initialAppWorkspaceState = {
  activeUiLanguageCode: 'en',
  activeThemeMode: 'light',
  documentSettings: initialDocumentSettings,
  workbookBlocks: initialWorkbookBlocks,
  selectedWorkbookBlockId: initialWorkbookBlocks[0]?.blockId ?? null,
  previewOverlayVisibility: initialPreviewOverlayVisibility,
  activeWorkspaceTab: 'editor'
};

const appStateChangeListeners = new Set();
let appWorkspaceState = initializeAppWorkspaceState(initialAppWorkspaceState);

export function subscribeToAppWorkspaceStateChanges(stateChangeListener) {
  appStateChangeListeners.add(stateChangeListener);
  return () => {
    appStateChangeListeners.delete(stateChangeListener);
  };
}

export function getAppWorkspaceState() {
  return appWorkspaceState;
}

export function setActiveUiLanguageCode(activeUiLanguageCode) {
  appWorkspaceState = { ...appWorkspaceState, activeUiLanguageCode };
  persistWorkspaceState();
}

export function setActiveThemeMode(activeThemeMode) {
  appWorkspaceState = { ...appWorkspaceState, activeThemeMode };
  persistWorkspaceState();
}

export function setActiveWorkspaceTab(activeWorkspaceTab) {
  appWorkspaceState = { ...appWorkspaceState, activeWorkspaceTab };
  persistWorkspaceState();
}

export function addWorkbookBlock(blockType) {
  const newBlock = createNewWorkbookBlock(blockType);
  appWorkspaceState = {
    ...appWorkspaceState,
    workbookBlocks: [...appWorkspaceState.workbookBlocks, newBlock],
    selectedWorkbookBlockId: newBlock.blockId
  };
  persistWorkspaceState();
}

export function selectWorkbookBlock(blockId) {
  appWorkspaceState = { ...appWorkspaceState, selectedWorkbookBlockId: blockId };
  persistWorkspaceState();
}

export function reorderWorkbookBlockByDirection(targetBlockId, direction) {
  appWorkspaceState = {
    ...appWorkspaceState,
    workbookBlocks: reorderWorkbookBlock(appWorkspaceState.workbookBlocks, targetBlockId, direction)
  };
  persistWorkspaceState();
}

export function reorderWorkbookBlocksByDrag(sourceBlockId, targetBlockId) {
  appWorkspaceState = {
    ...appWorkspaceState,
    workbookBlocks: reorderWorkbookBlocksByDragInternal(
      appWorkspaceState.workbookBlocks,
      sourceBlockId,
      targetBlockId
    )
  };
  persistWorkspaceState();
}

export function updateDocumentSettings(partialDocumentSettings) {
  const mergedDocumentSettings = {
    ...appWorkspaceState.documentSettings,
    ...partialDocumentSettings
  };
  const calculatedGutterWidthMillimeters = calculateGutterWidthMillimetersByPageCount(
    mergedDocumentSettings.estimatedPageCount,
    mergedDocumentSettings.isBleedEnabled,
    mergedDocumentSettings.trimSizePresetId
  );
  appWorkspaceState = {
    ...appWorkspaceState,
    documentSettings: {
      ...mergedDocumentSettings,
      calculatedGutterWidthMillimeters
    }
  };
  persistWorkspaceState();
}

export function updatePreviewOverlayVisibility(partialPreviewOverlayVisibility) {
  appWorkspaceState = {
    ...appWorkspaceState,
    previewOverlayVisibility: {
      ...appWorkspaceState.previewOverlayVisibility,
      ...partialPreviewOverlayVisibility
    }
  };
  persistWorkspaceState();
}

export function updateSelectedBlockFields(partialBlockFields) {
  const selectedBlockId = appWorkspaceState.selectedWorkbookBlockId;
  if (!selectedBlockId) {
    return;
  }
  const updatedBlocks = appWorkspaceState.workbookBlocks.map((workbookBlock) =>
    workbookBlock.blockId === selectedBlockId
      ? { ...workbookBlock, ...partialBlockFields }
      : workbookBlock
  );
  appWorkspaceState = { ...appWorkspaceState, workbookBlocks: updatedBlocks };
  persistWorkspaceState();
}

export function calculateGutterWidthMillimetersByPageCount(
  estimatedPageCount,
  isBleedEnabled,
  trimSizePresetId
) {
  const baseGutterWidth = trimSizeGutterBaseMillimetersByPresetId[trimSizePresetId];
  const pageCountMultiplier = Math.min(Math.max(estimatedPageCount / 200, 0.5), 2.5);
  const bleedAdjustment = isBleedEnabled ? 0.5 : 0;
  return Number((baseGutterWidth * pageCountMultiplier + bleedAdjustment).toFixed(1));
}

export function createNewWorkbookBlock(blockType) {
  const blockId = `block_${blockIdCounter}`;
  blockIdCounter += 1;

  switch (blockType) {
    case 'paragraph':
      return { blockId, blockType, paragraphText: 'New paragraph text' };
    case 'heading':
      return { blockId, blockType, headingText: 'New heading' };
    case 'sectionBreak':
      return { blockId, blockType, sectionBreakStyleId: 'line' };
    case 'pageBreak':
      return { blockId, blockType, pageBreakNote: 'New page break' };
    case 'chapterStart':
      return {
        blockId,
        blockType,
        chapterTitleText: 'New chapter',
        chapterSubtitleText: 'Chapter subtitle'
      };
    case 'checklist':
      return {
        blockId,
        blockType,
        checklistTitleText: 'Checklist title',
        checklistItems: ['First item', 'Second item']
      };
    case 'answerLines':
      return {
        blockId,
        blockType,
        answerLinesPromptText: 'Prompt text',
        answerLineCount: 5
      };
    case 'calloutBox':
      return {
        blockId,
        blockType,
        calloutTitleText: 'Callout title',
        calloutBodyText: 'Callout body text'
      };
    case 'image':
      return {
        blockId,
        blockType,
        imageAssetId: 'image_001',
        imageCaptionText: 'Image caption'
      };
    default:
      return { blockId, blockType, paragraphText: 'New paragraph text' };
  }
}

export function reorderWorkbookBlock(workbookBlocks, targetBlockId, direction) {
  const targetIndex = workbookBlocks.findIndex(
    (workbookBlock) => workbookBlock.blockId === targetBlockId
  );

  if (targetIndex < 0) {
    return workbookBlocks;
  }

  const swapIndex = direction === 'up' ? targetIndex - 1 : targetIndex + 1;
  if (swapIndex < 0 || swapIndex >= workbookBlocks.length) {
    return workbookBlocks;
  }

  const reorderedBlocks = [...workbookBlocks];
  const targetBlock = reorderedBlocks[targetIndex];
  reorderedBlocks[targetIndex] = reorderedBlocks[swapIndex];
  reorderedBlocks[swapIndex] = targetBlock;
  return reorderedBlocks;
}

function reorderWorkbookBlocksByDragInternal(
  workbookBlocks,
  sourceBlockId,
  targetBlockId
) {
  if (sourceBlockId === targetBlockId) {
    return workbookBlocks;
  }

  const sourceIndex = workbookBlocks.findIndex(
    (workbookBlock) => workbookBlock.blockId === sourceBlockId
  );
  const targetIndex = workbookBlocks.findIndex(
    (workbookBlock) => workbookBlock.blockId === targetBlockId
  );

  if (sourceIndex < 0 || targetIndex < 0) {
    return workbookBlocks;
  }

  const reorderedBlocks = [...workbookBlocks];
  const [movedBlock] = reorderedBlocks.splice(sourceIndex, 1);
  const normalizedTargetIndex = sourceIndex < targetIndex ? targetIndex - 1 : targetIndex;
  reorderedBlocks.splice(normalizedTargetIndex, 0, movedBlock);
  return reorderedBlocks;
}

function initializeAppWorkspaceState(fallbackWorkspaceState) {
  synchronizeBlockIdCounter(fallbackWorkspaceState.workbookBlocks);
  const storedWorkspaceStateJson = window.localStorage.getItem(localStorageWorkspaceStateKey);
  if (!storedWorkspaceStateJson) {
    return fallbackWorkspaceState;
  }

  try {
    const parsedWorkspaceState = JSON.parse(storedWorkspaceStateJson);
    const mergedWorkspaceState = mergeWorkspaceState(fallbackWorkspaceState, parsedWorkspaceState);
    synchronizeBlockIdCounter(mergedWorkspaceState.workbookBlocks);
    return mergedWorkspaceState;
  } catch {
    return fallbackWorkspaceState;
  }
}

function mergeWorkspaceState(fallbackWorkspaceState, storedWorkspaceState) {
  const supportedTrimSizePresetIdList = ['trim_6x9', 'trim_85x11', 'trim_5x8'];
  const storedTrimSizePresetId = storedWorkspaceState.documentSettings?.trimSizePresetId;
  const resolvedTrimSizePresetId = supportedTrimSizePresetIdList.includes(storedTrimSizePresetId)
    ? storedTrimSizePresetId
    : fallbackWorkspaceState.documentSettings.trimSizePresetId;

  const mergedDocumentSettings = {
    ...fallbackWorkspaceState.documentSettings,
    ...storedWorkspaceState.documentSettings,
    trimSizePresetId: resolvedTrimSizePresetId
  };

  const updatedDocumentSettings = {
    ...mergedDocumentSettings,
    calculatedGutterWidthMillimeters: calculateGutterWidthMillimetersByPageCount(
      mergedDocumentSettings.estimatedPageCount,
      mergedDocumentSettings.isBleedEnabled,
      mergedDocumentSettings.trimSizePresetId
    )
  };

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
  const activeWorkspaceTab = storedWorkspaceState.activeWorkspaceTab === 'preview' ? 'preview' : 'editor';

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

function persistWorkspaceState() {
  try {
    window.localStorage.setItem(localStorageWorkspaceStateKey, JSON.stringify(appWorkspaceState));
  } catch {
    // Ignore storage failures (private mode or quota limits).
  }
  appStateChangeListeners.forEach((stateChangeListener) => stateChangeListener(appWorkspaceState));
}

function synchronizeBlockIdCounter(workbookBlocks) {
  const highestBlockIdSuffix = workbookBlocks.reduce((currentMax, workbookBlock) => {
    const blockIdMatch = /^block_(\d+)$/.exec(workbookBlock.blockId);
    if (!blockIdMatch) {
      return currentMax;
    }
    const parsedSuffix = Number(blockIdMatch[1]);
    return Number.isNaN(parsedSuffix) ? currentMax : Math.max(currentMax, parsedSuffix);
  }, 0);

  blockIdCounter = highestBlockIdSuffix + 1;
}
