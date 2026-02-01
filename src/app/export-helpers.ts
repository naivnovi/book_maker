import { AppWorkspaceState } from './types';

export interface PdfExportPayload {
  generatedAtIsoTimestamp: string;
  documentSettings: AppWorkspaceState['documentSettings'];
  workbookBlocks: AppWorkspaceState['workbookBlocks'];
}

export function createPdfExportPayload(
  appWorkspaceState: AppWorkspaceState
): PdfExportPayload {
  return {
    generatedAtIsoTimestamp: new Date().toISOString(),
    documentSettings: appWorkspaceState.documentSettings,
    workbookBlocks: appWorkspaceState.workbookBlocks
  };
}

export function exportWorkbookPdfPlaceholder(
  appWorkspaceState: AppWorkspaceState
): PdfExportPayload {
  const pdfExportPayload = createPdfExportPayload(appWorkspaceState);
  window.console.log('PDF export placeholder payload', pdfExportPayload);
  return pdfExportPayload;
}
