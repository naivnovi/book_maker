import React from 'react';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';
import { WorkbookBlock } from '../app/types';

export function BlockPropertiesPanel(): JSX.Element {
  const { appWorkspaceState, updateSelectedBlock } = useAppState();
  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);

  const selectedBlock = appWorkspaceState.workbookBlocks.find(
    (workbookBlock) => workbookBlock.blockId === appWorkspaceState.selectedWorkbookBlockId
  );

  if (!selectedBlock) {
    return <div className="muted-text">{uiText('noBlockSelected')}</div>;
  }

  const updateBlock = (updatedFields: Partial<WorkbookBlock>) => {
    updateSelectedBlock({ ...selectedBlock, ...updatedFields } as WorkbookBlock);
  };

  switch (selectedBlock.blockType) {
    case 'heading':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldHeadingText')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.headingText}
              onChange={(event) => updateBlock({ headingText: event.target.value })}
            />
          </label>
        </div>
      );
    case 'paragraph':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldParagraphText')}</span>
            <textarea
              className="form-textarea"
              value={selectedBlock.paragraphText}
              onChange={(event) => updateBlock({ paragraphText: event.target.value })}
            />
          </label>
        </div>
      );
    case 'chapterStart':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldChapterTitle')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.chapterTitleText}
              onChange={(event) => updateBlock({ chapterTitleText: event.target.value })}
            />
          </label>
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldChapterSubtitle')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.chapterSubtitleText}
              onChange={(event) => updateBlock({ chapterSubtitleText: event.target.value })}
            />
          </label>
        </div>
      );
    case 'checklist':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldChecklistTitle')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.checklistTitleText}
              onChange={(event) => updateBlock({ checklistTitleText: event.target.value })}
            />
          </label>
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldChecklistItems')}</span>
            <textarea
              className="form-textarea"
              value={selectedBlock.checklistItems.join('\n')}
              onChange={(event) =>
                updateBlock({ checklistItems: event.target.value.split('\n').filter(Boolean) })
              }
            />
          </label>
        </div>
      );
    case 'answerLines':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldAnswerLinesPrompt')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.answerLinesPromptText}
              onChange={(event) => updateBlock({ answerLinesPromptText: event.target.value })}
            />
          </label>
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldAnswerLineCount')}</span>
            <input
              type="number"
              className="form-input"
              min={1}
              value={selectedBlock.answerLineCount}
              onChange={(event) =>
                updateBlock({ answerLineCount: Number(event.target.value) || 1 })
              }
            />
          </label>
        </div>
      );
    case 'calloutBox':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldCalloutTitle')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.calloutTitleText}
              onChange={(event) => updateBlock({ calloutTitleText: event.target.value })}
            />
          </label>
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldCalloutBody')}</span>
            <textarea
              className="form-textarea"
              value={selectedBlock.calloutBodyText}
              onChange={(event) => updateBlock({ calloutBodyText: event.target.value })}
            />
          </label>
        </div>
      );
    case 'image':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldImageAssetId')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.imageAssetId}
              onChange={(event) => updateBlock({ imageAssetId: event.target.value })}
            />
          </label>
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldImageCaption')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.imageCaptionText}
              onChange={(event) => updateBlock({ imageCaptionText: event.target.value })}
            />
          </label>
        </div>
      );
    case 'sectionBreak':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldSectionBreakStyle')}</span>
            <select
              className="form-select"
              value={selectedBlock.sectionBreakStyleId}
              onChange={(event) =>
                updateBlock({ sectionBreakStyleId: event.target.value as 'line' | 'space' | 'ornament' })
              }
            >
              <option value="line">{uiText('sectionBreakStyleLine')}</option>
              <option value="space">{uiText('sectionBreakStyleSpace')}</option>
              <option value="ornament">{uiText('sectionBreakStyleOrnament')}</option>
            </select>
          </label>
        </div>
      );
    case 'pageBreak':
      return (
        <div className="form-stack">
          <label className="form-field">
            <span className="form-label">{uiText('blockFieldPageBreakNote')}</span>
            <input
              type="text"
              className="form-input"
              value={selectedBlock.pageBreakNote}
              onChange={(event) => updateBlock({ pageBreakNote: event.target.value })}
            />
          </label>
        </div>
      );
    default:
      return <div className="muted-text">{uiText('noBlockSelected')}</div>;
  }
}
