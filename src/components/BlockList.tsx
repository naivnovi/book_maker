import React, { useState } from 'react';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';
import { getBlockTypeUiTextKey } from '../app/ui-helpers';
import { WorkbookBlock } from '../app/types';

function getBlockPreviewText(workbookBlock: WorkbookBlock): string {
  switch (workbookBlock.blockType) {
    case 'paragraph':
      return workbookBlock.paragraphText;
    case 'heading':
      return workbookBlock.headingText;
    case 'sectionBreak':
      return workbookBlock.sectionBreakStyleId;
    case 'pageBreak':
      return workbookBlock.pageBreakNote;
    case 'chapterStart':
      return workbookBlock.chapterTitleText;
    case 'checklist':
      return workbookBlock.checklistTitleText;
    case 'answerLines':
      return workbookBlock.answerLinesPromptText;
    case 'calloutBox':
      return workbookBlock.calloutTitleText;
    case 'image':
      return workbookBlock.imageCaptionText;
    default: {
      const exhaustiveCheck: never = workbookBlock;
      return exhaustiveCheck;
    }
  }
}

export function BlockList(): JSX.Element {
  const {
    appWorkspaceState,
    selectWorkbookBlock,
    reorderWorkbookBlocks,
    reorderWorkbookBlocksByDrag
  } = useAppState();
  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  const handleDragStart = (
    dragStartEvent: React.DragEvent<HTMLDivElement>,
    blockId: string
  ) => {
    setDraggedBlockId(blockId);
    dragStartEvent.dataTransfer.setData('text/plain', blockId);
    dragStartEvent.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (dragOverEvent: React.DragEvent<HTMLDivElement>) => {
    dragOverEvent.preventDefault();
    dragOverEvent.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (dropEvent: React.DragEvent<HTMLDivElement>, targetBlockId: string) => {
    dropEvent.preventDefault();
    const sourceBlockId = dropEvent.dataTransfer.getData('text/plain');
    if (sourceBlockId) {
      reorderWorkbookBlocksByDrag(sourceBlockId, targetBlockId);
    }
    setDraggedBlockId(null);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
  };

  return (
    <div className="block-list">
      {appWorkspaceState.workbookBlocks.map((workbookBlock, index) => (
        <div
          key={workbookBlock.blockId}
          className={
            workbookBlock.blockId === appWorkspaceState.selectedWorkbookBlockId
              ? 'block-list-item is-selected'
              : 'block-list-item'
          }
          draggable
          onDragStart={(dragStartEvent) => handleDragStart(dragStartEvent, workbookBlock.blockId)}
          onDragOver={handleDragOver}
          onDrop={(dropEvent) => handleDrop(dropEvent, workbookBlock.blockId)}
          onDragEnd={handleDragEnd}
          aria-grabbed={draggedBlockId === workbookBlock.blockId}
        >
          <button
            type="button"
            className="block-list-content"
            onClick={() => selectWorkbookBlock(workbookBlock.blockId)}
          >
            <div className="block-list-label">{uiText(getBlockTypeUiTextKey(workbookBlock.blockType))}</div>
            <div className="block-list-preview">{getBlockPreviewText(workbookBlock)}</div>
          </button>
          <div className="block-list-actions">
            <button
              type="button"
              className="icon-button"
              onClick={() => reorderWorkbookBlocks(workbookBlock.blockId, 'up')}
              disabled={index === 0}
              aria-label={uiText('blockMoveUpLabel')}
            >
              ↑
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => reorderWorkbookBlocks(workbookBlock.blockId, 'down')}
              disabled={index === appWorkspaceState.workbookBlocks.length - 1}
              aria-label={uiText('blockMoveDownLabel')}
            >
              ↓
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
