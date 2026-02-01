import React from 'react';
import { BlockList } from './BlockList';
import { BlockOutline } from './BlockOutline';
import { DocumentSettingsPanel } from './DocumentSettingsPanel';
import { BlockPropertiesPanel } from './BlockPropertiesPanel';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';
import { getBlockTypeUiTextKey } from '../app/ui-helpers';

const blockTypeOptions = [
  'paragraph',
  'heading',
  'sectionBreak',
  'pageBreak',
  'chapterStart',
  'checklist',
  'answerLines',
  'calloutBox',
  'image'
] as const;

export function EditorLayout(): JSX.Element {
  const { appWorkspaceState, addWorkbookBlock } = useAppState();
  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);

  return (
    <div className="editor-layout">
      <aside className="sidebar-panel">
        <div className="panel-section">
          <div className="panel-title">{uiText('sidebarBlocksTitle')}</div>
          <div className="block-button-grid">
            {blockTypeOptions.map((blockType) => (
              <button
                key={blockType}
                type="button"
                className="secondary-button"
                onClick={() => addWorkbookBlock(blockType)}
              >
                {uiText('blockAddLabel')} {uiText(getBlockTypeUiTextKey(blockType))}
              </button>
            ))}
          </div>
        </div>
        <div className="panel-section">
          <div className="panel-title">{uiText('sidebarOutlineTitle')}</div>
          <BlockOutline />
        </div>
      </aside>
      <section className="editor-center">
        <div className="panel-title">{uiText('editorBlocksTitle')}</div>
        <BlockList />
      </section>
      <aside className="sidebar-panel">
        <div className="panel-section">
          <div className="panel-title">{uiText('documentSettingsTitle')}</div>
          <DocumentSettingsPanel />
        </div>
        <div className="panel-section">
          <div className="panel-title">{uiText('propertiesTitle')}</div>
          <BlockPropertiesPanel />
        </div>
      </aside>
    </div>
  );
}
