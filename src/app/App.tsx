import React, { useEffect } from 'react';
import { AppStateProvider, useAppState } from './AppStateContext';
import { TopBar } from '../components/TopBar';
import { EditorLayout } from '../components/EditorLayout';
import { PreviewLayout } from '../components/PreviewLayout';
import { ToastProvider } from '../components/ToastProvider';

function Workspace(): JSX.Element {
  const { appWorkspaceState } = useAppState();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', appWorkspaceState.activeThemeMode);
  }, [appWorkspaceState.activeThemeMode]);

  return (
    <div className="app-shell">
      <TopBar />
      <main className="app-content">
        {appWorkspaceState.activeWorkspaceTab === 'editor' ? (
          <EditorLayout />
        ) : (
          <PreviewLayout />
        )}
      </main>
    </div>
  );
}

export function App(): JSX.Element {
  return (
    <AppStateProvider>
      <ToastProvider>
        <Workspace />
      </ToastProvider>
    </AppStateProvider>
  );
}
