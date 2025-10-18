# ESLint Plugin Prefer Early Return

This is a maintained fork of [@regru/eslint-plugin-prefer-early-return](https://github.com/regru/eslint-plugin-prefer-early-return), which extracted the prefer-early-return rule from Shopify's `eslint-plugin-shopify`.

The original regru fork is no longer maintained, lacks unit tests, doesn't support auto-fix, and is not compatible with ESLint 9's flat config format.

## What's Different

This fork adds:

- **Auto-fix capability** with smart condition inversions
- **Comprehensive unit tests**
- **TypeScript type definitions** for better IDE support
- **ESLint 9+ flat config support**
- **ESM module format**
- **No unwanted dependencies**
- **Modern Node.js (22+) compatibility**

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

## Rule: prefer-early-return

Enforces early returns over full-body conditional wrapping in function declarations.

### Options

- `maximumStatements` (default: `1`): Maximum number of statements allowed inside the if block before requiring an early return pattern.

### Examples

This rule will automatically fix violations when you run ESLint with the `--fix` flag.

#### Invalid (will be auto-fixed)

```js
function processUser(user) {
  if (user) {
    console.log(user.name);
    saveUser(user);
  }
}
```

#### Valid (after auto-fix)

```js
function processUser(user) {
  if (!user) {
    return;
  }
  console.log(user.name);
  saveUser(user);
}
```

For more details, see [prefer-early-return](docs/rules/prefer-early-return.md)

## Development

```bash
npm test
```
