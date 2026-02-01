import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ label, isActive, onClick }: TabButtonProps): JSX.Element {
  return (
    <button
      type="button"
      className={isActive ? 'tab-button is-active' : 'tab-button'}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
