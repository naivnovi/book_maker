export type UiLanguageCode = 'en' | 'ru' | 'fr';
export type ThemeMode = 'light' | 'dark';
export type TrimSizePresetId = 'trim_6x9' | 'trim_85x11' | 'trim_5x8';
export type WorkbookBlockType =
  | 'paragraph'
  | 'heading'
  | 'sectionBreak'
  | 'pageBreak'
  | 'chapterStart'
  | 'checklist'
  | 'answerLines'
  | 'calloutBox'
  | 'image';

export interface WorkbookBlockBase {
  blockId: string;
  blockType: WorkbookBlockType;
}

export interface ParagraphBlock extends WorkbookBlockBase {
  blockType: 'paragraph';
  paragraphText: string;
}

export interface HeadingBlock extends WorkbookBlockBase {
  blockType: 'heading';
  headingText: string;
}

export interface SectionBreakBlock extends WorkbookBlockBase {
  blockType: 'sectionBreak';
  sectionBreakStyleId: 'line' | 'space' | 'ornament';
}

export interface PageBreakBlock extends WorkbookBlockBase {
  blockType: 'pageBreak';
  pageBreakNote: string;
}

export interface ChapterStartBlock extends WorkbookBlockBase {
  blockType: 'chapterStart';
  chapterTitleText: string;
  chapterSubtitleText: string;
}

export interface ChecklistBlock extends WorkbookBlockBase {
  blockType: 'checklist';
  checklistTitleText: string;
  checklistItems: string[];
}

export interface AnswerLinesBlock extends WorkbookBlockBase {
  blockType: 'answerLines';
  answerLinesPromptText: string;
  answerLineCount: number;
}

export interface CalloutBoxBlock extends WorkbookBlockBase {
  blockType: 'calloutBox';
  calloutTitleText: string;
  calloutBodyText: string;
}

export interface ImageBlock extends WorkbookBlockBase {
  blockType: 'image';
  imageAssetId: string;
  imageCaptionText: string;
}

export type WorkbookBlock =
  | ParagraphBlock
  | HeadingBlock
  | SectionBreakBlock
  | PageBreakBlock
  | ChapterStartBlock
  | ChecklistBlock
  | AnswerLinesBlock
  | CalloutBoxBlock
  | ImageBlock;

export interface DocumentSettings {
  trimSizePresetId: TrimSizePresetId;
  isBleedEnabled: boolean;
  estimatedPageCount: number;
  calculatedGutterWidthMillimeters: number;
}

export interface PreviewOverlayVisibility {
  isSafeAreaVisible: boolean;
  isBleedVisible: boolean;
  isMarginsVisible: boolean;
  isGutterVisible: boolean;
}

export interface AppWorkspaceState {
  activeUiLanguageCode: UiLanguageCode;
  activeThemeMode: ThemeMode;
  documentSettings: DocumentSettings;
  workbookBlocks: WorkbookBlock[];
  selectedWorkbookBlockId: string | null;
  previewOverlayVisibility: PreviewOverlayVisibility;
  activeWorkspaceTab: 'editor' | 'preview';
}
