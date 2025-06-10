import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    name: 'app/vue-rules',
    files: ['**/*.vue'],
    languageOptions: {
      globals: {
        console: 'readonly',
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },

  {
    name: 'app/js-rules',
    files: ['**/*.{js,mjs,jsx}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
] 