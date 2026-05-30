// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

const config = defineConfig([
  // Ignore patterns (replaces .eslintignore in flat config)
  {
    ignores: ['**/node_modules/**', 'dist/**', 'build/**', 'coverage/**'],
  },

  // Base ESLint recommended rules
  js.configs.recommended,

  // Typescript ESLint recommended rules with type checking
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylistic,

  // React and React Hooks rules
  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  {
    settings: {
      react: { version: 'detect' },
    },
  },
  {
    files: ['src/theme/sariyanta/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: './src/theme/sariyanta/tsconfig.json',
      },
    },
  },

  // Disable type-aware rules everywhere there's no tsconfig project
  // (config files, JS scripts, and src files outside the theme app)
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    ignores: ['src/theme/sariyanta/**/*.{ts,tsx}'],
    ...tseslint.configs.disableTypeChecked,
  },

  // React Hooks rules
  reactHooks.configs.flat['recommended-latest'],

  // Unused imports detection (auto-fixable with --fix)
  {
    plugins: {
      'unused-imports': unusedImports,
      import: importPlugin,
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      // Disable default import sorting rules
      'sort-imports': 'off',
      // Use importPlugin's sorting rules.
      'import/order': [
        'error',
        {
          alphabetize: { order: 'asc', caseInsensitive: true },
          pathGroups: [
            {
              pattern: '@hubspot/**',
              group: 'external',
              position: 'after',
            },
          ],
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  },

  // Prettier compatibility (must be last to override other configs)
  prettier,
]);

export default config;
