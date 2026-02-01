import React from 'react';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';
import { TrimSizePresetId } from '../app/types';

export function DocumentSettingsPanel(): JSX.Element {
  const { appWorkspaceState, updateDocumentSettings } = useAppState();
  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);

  const handleTrimPresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateDocumentSettings({ trimSizePresetId: event.target.value as TrimSizePresetId });
  };

  const handleBleedToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateDocumentSettings({ isBleedEnabled: event.target.checked });
  };

  const handlePageCountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const parsedPageCount = Number(event.target.value);
    updateDocumentSettings({ estimatedPageCount: Number.isNaN(parsedPageCount) ? 0 : parsedPageCount });
  };

  return (
    <div className="form-stack">
      <label className="form-field">
        <span className="form-label">{uiText('trimSizeLabel')}</span>
        <select
          className="form-select"
          value={appWorkspaceState.documentSettings.trimSizePresetId}
          onChange={handleTrimPresetChange}
        >
          <option value="trim_6x9">{uiText('trimPreset6x9')}</option>
          <option value="trim_85x11">{uiText('trimPreset85x11')}</option>
          <option value="trim_5x8">{uiText('trimPreset5x8')}</option>
        </select>
      </label>
      <label className="form-field horizontal">
        <span className="form-label">{uiText('bleedToggleLabel')}</span>
        <input
          type="checkbox"
          className="form-toggle"
          checked={appWorkspaceState.documentSettings.isBleedEnabled}
          onChange={handleBleedToggleChange}
        />
      </label>
      <label className="form-field">
        <span className="form-label">{uiText('pageCountLabel')}</span>
        <input
          type="number"
          className="form-input"
          min={1}
          value={appWorkspaceState.documentSettings.estimatedPageCount}
          onChange={handlePageCountChange}
        />
      </label>
      <label className="form-field">
        <span className="form-label">{uiText('gutterWidthLabel')}</span>
        <input
          type="number"
          className="form-input"
          value={appWorkspaceState.documentSettings.calculatedGutterWidthMillimeters}
          readOnly
        />
      </label>
    </div>
  );
}
