import React from 'react';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';

export function BlockOutline(): JSX.Element {
  const { appWorkspaceState, selectWorkbookBlock } = useAppState();
  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);

  const chapterBlocks = appWorkspaceState.workbookBlocks.filter(
    (workbookBlock) => workbookBlock.blockType === 'chapterStart'
  );

  if (chapterBlocks.length === 0) {
    return <div className="muted-text">{uiText('outlineEmpty')}</div>;
  }

  return (
    <div className="outline-list">
      {chapterBlocks.map((chapterBlock) => (
        <button
          key={chapterBlock.blockId}
          type="button"
          className="outline-item"
          onClick={() => selectWorkbookBlock(chapterBlock.blockId)}
        >
          {chapterBlock.chapterTitleText}
        </button>
      ))}
    </div>
  );
}
