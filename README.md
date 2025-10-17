# ESLint Plugin Prefer Early Return

This is a fork of the prefer-early-return rule from `eslint-plugin-shopify`. The original plugin is no longer actively maintained and is not compatible with ESLint 9's flat config format. This fork provides:

- ESLint 9+ flat config support
- ESM module format
- No unwanted dependencies
- Modern Node.js (22+) compatibility

## Installation

```bash
npm install @smrtnyk/eslint-plugin-prefer-early-return --save-dev
```

## Usage

```js
import preferEarlyReturn from '@smrtnyk/eslint-plugin-prefer-early-return';

export default [
  {
    plugins: {
      'prefer-early-return': preferEarlyReturn,
    },
    rules: {
      'prefer-early-return/prefer-early-return': ['error', {
        maximumStatements: 1,
      }],
    },
  },
];
```

## Plugin-Provided Rule

[prefer-early-return](docs/rules/prefer-early-return.md)
