import React from 'react';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';

export function OverlayToggles(): JSX.Element {
  const { appWorkspaceState, updatePreviewOverlayVisibility } = useAppState();
  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);

  const { previewOverlayVisibility } = appWorkspaceState;

  return (
    <div className="overlay-toggle-bar">
      <div className="panel-title">{uiText('previewOverlaysTitle')}</div>
      <div className="overlay-chip-group">
        <button
          type="button"
          className={previewOverlayVisibility.isSafeAreaVisible ? 'overlay-chip is-active' : 'overlay-chip'}
          onClick={() =>
            updatePreviewOverlayVisibility({
              isSafeAreaVisible: !previewOverlayVisibility.isSafeAreaVisible
            })
          }
        >
          {uiText('overlaySafeArea')}
        </button>
        <button
          type="button"
          className={previewOverlayVisibility.isBleedVisible ? 'overlay-chip is-active' : 'overlay-chip'}
          onClick={() =>
            updatePreviewOverlayVisibility({ isBleedVisible: !previewOverlayVisibility.isBleedVisible })
          }
        >
          {uiText('overlayBleed')}
        </button>
        <button
          type="button"
          className={previewOverlayVisibility.isMarginsVisible ? 'overlay-chip is-active' : 'overlay-chip'}
          onClick={() =>
            updatePreviewOverlayVisibility({
              isMarginsVisible: !previewOverlayVisibility.isMarginsVisible
            })
          }
        >
          {uiText('overlayMargins')}
        </button>
        <button
          type="button"
          className={previewOverlayVisibility.isGutterVisible ? 'overlay-chip is-active' : 'overlay-chip'}
          onClick={() =>
            updatePreviewOverlayVisibility({
              isGutterVisible: !previewOverlayVisibility.isGutterVisible
            })
          }
        >
          {uiText('overlayGutter')}
        </button>
      </div>
    </div>
  );
}
