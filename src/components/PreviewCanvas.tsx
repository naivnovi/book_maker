import React from 'react';
import { useAppState } from '../app/AppStateContext';
import { getLocalizedUiText } from '../app/i18n';
import { uiLocalizationDictionary } from '../app/i18n-dictionaries';

const previewPageCount = 3;

export function PreviewCanvas(): JSX.Element {
  const { appWorkspaceState } = useAppState();
  const uiText = (uiTextKey: Parameters<typeof getLocalizedUiText>[2]) =>
    getLocalizedUiText(uiLocalizationDictionary, appWorkspaceState.activeUiLanguageCode, uiTextKey);

  return (
    <div className="preview-canvas">
      {Array.from({ length: previewPageCount }).map((pageSlot, index) => {
        void pageSlot;
        return (
          <div key={`preview_page_${index}`} className="preview-page">
            <div className="preview-page-label">
              {uiText('previewPageLabel')} {index + 1}
            </div>
            <div className="preview-page-content">
              <div className="preview-placeholder-title">{uiText('previewPlaceholderTitle')}</div>
              <div className="preview-placeholder-body">{uiText('previewPlaceholderBody')}</div>
            </div>
            {appWorkspaceState.previewOverlayVisibility.isBleedVisible && (
              <div className="overlay-bleed" aria-hidden="true" />
            )}
            {appWorkspaceState.previewOverlayVisibility.isMarginsVisible && (
              <div className="overlay-margins" aria-hidden="true" />
            )}
            {appWorkspaceState.previewOverlayVisibility.isSafeAreaVisible && (
              <div className="overlay-safe" aria-hidden="true" />
            )}
            {appWorkspaceState.previewOverlayVisibility.isGutterVisible && (
              <div className="overlay-gutter" aria-hidden="true" />
            )}
          </div>
        );
      })}
    </div>
  );
}
