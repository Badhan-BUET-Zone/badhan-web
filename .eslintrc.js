module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.VUE_APP_ENVIRONMENT === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.VUE_APP_ENVIRONMENT === 'production' ? 'warn' : 'off',
    "@typescript-eslint/no-unused-vars": ['error', { vars: 'all', 'argsIgnorePattern': '^_' }],
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
