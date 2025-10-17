# ESLint Plugin Prefer Early Return

This is a fork of the prefer-early-return rule from `eslint-plugin-shopify`. The original plugin is no longer actively maintained and is not compatible with ESLint 9's flat config format. This fork provides:

- ESLint 9+ flat config support
- ESM module format
- Auto-fix capability
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
