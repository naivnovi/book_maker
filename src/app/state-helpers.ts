import { TrimSizePresetId, WorkbookBlock, WorkbookBlockType } from './types';

const trimSizeGutterBaseMillimeters: Record<TrimSizePresetId, number> = {
  trim_6x9: 6,
  trim_85x11: 7,
  trim_5x8: 5
};

export function calculateGutterWidthMillimetersByPageCount(
  estimatedPageCount: number,
  isBleedEnabled: boolean,
  trimSizePresetId: TrimSizePresetId
): number {
  const baseGutterWidth = trimSizeGutterBaseMillimeters[trimSizePresetId];
  const pageCountMultiplier = Math.min(Math.max(estimatedPageCount / 200, 0.5), 2.5);
  const bleedAdjustment = isBleedEnabled ? 0.5 : 0;
  return Number((baseGutterWidth * pageCountMultiplier + bleedAdjustment).toFixed(1));
}

let blockIdCounter = 1;

export function createNewWorkbookBlock(blockType: WorkbookBlockType): WorkbookBlock {
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
    default: {
      const exhaustiveCheck: never = blockType;
      throw new Error(`Unsupported block type: ${exhaustiveCheck}`);
    }
  }
}

export function synchronizeBlockIdCounter(workbookBlocks: WorkbookBlock[]): void {
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

export function reorderWorkbookBlock(
  workbookBlocks: WorkbookBlock[],
  targetBlockId: string,
  direction: 'up' | 'down'
): WorkbookBlock[] {
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

export function reorderWorkbookBlocksByDrag(
  workbookBlocks: WorkbookBlock[],
  sourceBlockId: string,
  targetBlockId: string
): WorkbookBlock[] {
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
