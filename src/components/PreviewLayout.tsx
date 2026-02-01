import React from 'react';
import { PreviewCanvas } from './PreviewCanvas';
import { OverlayToggles } from './OverlayToggles';

export function PreviewLayout(): JSX.Element {
  return (
    <div className="preview-layout">
      <OverlayToggles />
      <PreviewCanvas />
    </div>
  );
}
