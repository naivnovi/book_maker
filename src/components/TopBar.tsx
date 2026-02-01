import React from 'react';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';
import { SegmentedToggle } from './SegmentedToggle';
import { TabButton } from './TabButton';
import { useToast } from './ToastProvider';
import { exportWorkbookPdfPlaceholder } from '../app/export-helpers';

export function TopBar(): JSX.Element {
  const { appWorkspaceState, setActiveUiLanguageCode, setActiveThemeMode, setActiveWorkspaceTab } =
    useAppState();
  const { showToastMessage } = useToast();

  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);

  const handleExportClick = () => {
    exportWorkbookPdfPlaceholder(appWorkspaceState);
    showToastMessage(uiText('toastExportPlaceholder'));
  };

  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div className="app-title">{uiText('appTitle')}</div>
        <div className="project-name">{uiText('projectName')}</div>
      </div>
      <div className="top-bar-center">
        <div className="tab-group" role="tablist" aria-label={uiText('workspaceTabsLabel')}>
          <TabButton
            label={uiText('tabEditor')}
            isActive={appWorkspaceState.activeWorkspaceTab === 'editor'}
            onClick={() => setActiveWorkspaceTab('editor')}
          />
          <TabButton
            label={uiText('tabPreview')}
            isActive={appWorkspaceState.activeWorkspaceTab === 'preview'}
            onClick={() => setActiveWorkspaceTab('preview')}
          />
        </div>
      </div>
      <div className="top-bar-right">
        <button
          type="button"
          className="primary-button"
          onClick={handleExportClick}
        >
          {uiText('buttonExportPdf')}
        </button>
        <SegmentedToggle
          label={uiText('languageLabel')}
          activeValue={appWorkspaceState.activeUiLanguageCode}
          options={[
            { value: 'en', label: 'EN' },
            { value: 'ru', label: 'RU' },
            { value: 'fr', label: 'FR' }
          ]}
          onChange={setActiveUiLanguageCode}
        />
        <SegmentedToggle
          label={uiText('themeLabel')}
          activeValue={appWorkspaceState.activeThemeMode}
          options={[
            { value: 'light', label: uiText('themeLight') },
            { value: 'dark', label: uiText('themeDark') }
          ]}
          onChange={setActiveThemeMode}
        />
      </div>
    </header>
  );
}
