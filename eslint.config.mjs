import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // ─── Next.js + TypeScript + Core Web Vitals (native flat config) ─
  ...nextCoreWebVitals,

  // ─── Prettier (must come after all other configs) ────────────────
  prettier,

  // ─── Import sorting ──────────────────────────────────────────────
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
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

  // ─── Strict TypeScript rules (scoped to TS/TSX files) ─────────────
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
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
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
    },
  },

  // ─── React & general best practices ──────────────────────────────
  {
    rules: {
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
      'no-duplicate-imports': 'off',
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
              group: ['@modules/*'],
              message:
                'Use relative imports within your own module. Cross-module imports via @modules/* are forbidden.',
            },
            {
              group: ['@shell', '@shell/*'],
              message:
                'Modules must not import from the shell layer. Use @shared abstractions instead.',
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
