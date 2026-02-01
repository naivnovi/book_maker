import React from 'react';

interface SegmentedToggleOption<TOption extends string> {
  value: TOption;
  label: string;
}

interface SegmentedToggleProps<TOption extends string> {
  label: string;
  activeValue: TOption;
  options: SegmentedToggleOption<TOption>[];
  onChange: (selectedValue: TOption) => void;
}

export function SegmentedToggle<TOption extends string>(
  props: SegmentedToggleProps<TOption>
): JSX.Element {
  const { label, activeValue, options, onChange } = props;

  return (
    <div className="segmented-toggle" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={
            option.value === activeValue
              ? 'segmented-toggle-button is-active'
              : 'segmented-toggle-button'
          }
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
