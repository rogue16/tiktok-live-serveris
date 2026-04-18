```js {
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'templates', 'vite.config.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-constant-condition': 'error',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-use-before-define': [
        'error',
        { functions: false, classes: true, variables: true, enums: true, typedefs: false },
      ],
      'react-hooks/exhaustive-deps': 'off',
      'no-use-before-define': 'off',
      'no-console': 'off',
      'no-empty': 'off',
      'prefer-const': 'off',
      'no-var': 'off',
      'prefer-rest-params': 'off',
      'prefer-spread': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-array-constructor': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/prefer-namespace-keyword': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
) }





