import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // ─── Next.js + TypeScript base ───────────────────────────────────
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // ─── Prettier (must come after all other configs) ────────────────
  ...compat.extends('prettier'),

  // ─── Import sorting ──────────────────────────────────────────────
  {
    plugins: {
      'simple-import-sort': (await import('eslint-plugin-simple-import-sort')).default,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Node builtins & React/Next
            ['^node:', '^react', '^next'],
            // 2. External packages
            ['^@?\\w'],
            // 3. Shell layer
            ['^@shell'],
            // 4. Shared layer
            ['^@shared'],
            // 5. Module layer
            ['^@modules'],
            // 6. Internal relative imports
            ['^\\.\\./'],
            ['^\\./'],
            // 7. Side-effect imports & styles
            ['^\\u0000', '\\.css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },

  // ─── Strict TypeScript & React rules ─────────────────────────────
  {
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // requires strict TS project service
      '@typescript-eslint/prefer-optional-chain': 'off', // requires strict TS project service

      // React best practices
      'react/jsx-no-leaked-render': ['warn', { validStrategies: ['ternary', 'coerce'] }],
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],

      // General best practices
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'all'],
      'no-nested-ternary': 'warn',
      'no-duplicate-imports': 'off', // handled by simple-import-sort
    },
  },

  // ─── Architectural boundary enforcement ──────────────────────────
  {
    files: ['src/modules/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@modules/!(${0})/**', '@modules/!(${0})'],
              message:
                'Modules must not import from other modules. Use @shared or @shell abstractions.',
            },
          ],
        },
      ],
    },
  },

  // Cross-cutting import restrictions
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@modules/*', '@shell', '@shell/*'],
              message:
                'Shared layer must not import from modules or shell. It must remain dependency-free.',
            },
          ],
        },
      ],
    },
  },

  // ─── Overrides for config files ──────────────────────────────────
  {
    files: [
      '*.config.{js,mjs,ts}',
      'eslint.config.mjs',
      'vitest.config.ts',
      'vitest.setup.ts',
    ],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
    },
  },

  // ─── Global ignores ──────────────────────────────────────────────
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'coverage/**',
      'out/**',
      'dist/**',
      'public/**',
      'next-env.d.ts',
    ],
  },
];

export default eslintConfig;
