import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // Enforce descriptive naming; allow a minimal exception list for common acronyms.
      'id-length': [
        'error',
        {
          min: 3,
          exceptions: ['ui', 'px', 'mm', 'ms']
        }
      ],
      // Block ambiguous short identifiers and placeholders.
      'id-denylist': [
        'error',
        'data',
        'temp',
        'val',
        'obj',
        'res',
        'arr',
        'x',
        'y',
        'item',
        'thing',
        'foo',
        'bar',
        'test',
        'info',
        'stuff',
        'misc'
      ]
    }
  }
];
