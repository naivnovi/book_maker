import { UiTextKey } from './i18n-dictionaries';
import { WorkbookBlockType } from './types';

const blockTypeToUiTextKeyMap: Record<WorkbookBlockType, UiTextKey> = {
  paragraph: 'blockTypeParagraph',
  heading: 'blockTypeHeading',
  sectionBreak: 'blockTypeSectionBreak',
  pageBreak: 'blockTypePageBreak',
  chapterStart: 'blockTypeChapterStart',
  checklist: 'blockTypeChecklist',
  answerLines: 'blockTypeAnswerLines',
  calloutBox: 'blockTypeCalloutBox',
  image: 'blockTypeImage'
};

export function getBlockTypeUiTextKey(blockType: WorkbookBlockType): UiTextKey {
  return blockTypeToUiTextKeyMap[blockType];
}
