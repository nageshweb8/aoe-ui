/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shell': path.resolve(__dirname, './src/shell'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@modules': path.resolve(__dirname, './src/modules'),
    },
  },
  test: {
    /* ── Environment ─────────────────────────────────────────────── */
    environment: 'jsdom',
    globals: true,

    /* ── Setup ───────────────────────────────────────────────────── */
    setupFiles: ['./vitest.setup.ts'],

    /* ── File patterns ───────────────────────────────────────────── */
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'dist', 'coverage'],

    /* ── Coverage ────────────────────────────────────────────────── */
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'lcov', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/**/index.ts',
        'src/app/**/{layout,page,not-found,error,loading}.tsx',
        'src/**/*.stories.{ts,tsx}',
      ],
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },

    /* ── Performance ─────────────────────────────────────────────── */
    pool: 'forks',
    css: false,
  },
});
