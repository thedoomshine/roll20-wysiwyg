/**
 * Name: prettier-config-diary
 * @type {import("prettier").Linter.Config}
 */
module.exports = {
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: 'lf',
  importOrder: ['^~/(.*)', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  jsxSingleQuote: true,
  printWidth: 80,
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  useTabs: false,
  plugins: [require('@trivago/prettier-plugin-sort-imports')],
};
