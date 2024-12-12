module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'prettier', // 确保 Prettier 插件在最后
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', { endOfLine: 'auto' }], // 自动处理换行符
    'import/order': ['error', { 'groups': ['builtin', 'external', 'parent', 'sibling', 'index'] }], // 示例规则：导入顺序
    'no-console': 'warn', // 示例规则：禁止使用 console.log
  },
  settings: {
    'import/resolver': {
      typescript: {}, // 解析 TypeScript 模块
    },
  },
};