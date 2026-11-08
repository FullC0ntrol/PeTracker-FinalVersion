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
      // Parametr zaczynający się od _ jest celowo nieużywany.
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
])
