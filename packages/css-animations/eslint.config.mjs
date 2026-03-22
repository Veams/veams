import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const packageRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig(
  {
    ignores: ['dist/**', 'coverage/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      sourceType: 'module',
    },
    rules: {},
  }
);
