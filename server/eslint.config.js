import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Parametr z „_” na początku = celowo nieużywany (np. `_next` w errorHandler).
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
])
