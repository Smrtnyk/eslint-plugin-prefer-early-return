import { test } from 'node:test';
import { RuleTester } from 'eslint';
import rule from '../rules/prefer-early-return.js';

test('prefer-early-return rule', () => {
    const ruleTester = new RuleTester({
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
        },
    });

    ruleTester.run('prefer-early-return', rule, {
    valid: [
        // Early return pattern (valid)
        {
            code: `
                function foo(bar) {
                    if (!bar) {
                        return;
                    }
                    doSomething();
                    doSomethingElse();
                }
            `,
        },
        // If-else statement (valid - has alternate)
        {
            code: `
                function foo(bar) {
                    if (bar) {
                        doSomething();
                    } else {
                        doSomethingElse();
                    }
                }
            `,
        },
        // Multiple statements in function (valid)
        {
            code: `
                function foo(bar) {
                    const baz = bar;
                    if (baz) {
                        doSomething();
                    }
                }
            `,
        },
        // Single statement with maximumStatements: 1 (valid)
        {
            code: `
                function foo(bar) {
                    if (bar) {
                        doSomething();
                    }
                }
            `,
            options: [{ maximumStatements: 1 }],
        },
        // Single expression statement with maximumStatements: 1 (valid)
        {
            code: `
                function foo(bar) {
                    if (bar) doSomething();
                }
            `,
            options: [{ maximumStatements: 1 }],
        },
        // Two statements with maximumStatements: 2 (valid)
        {
            code: `
                function foo(bar) {
                    if (bar) {
                        doSomething();
                        doSomethingElse();
                    }
                }
            `,
            options: [{ maximumStatements: 2 }],
        },
        // Empty function body (valid)
        {
            code: `
                function foo() {
                }
            `,
        },
        // No if statement (valid)
        {
            code: `
                function foo() {
                    doSomething();
                }
            `,
        },
        // Arrow function with implicit return (valid)
        {
            code: `
                const foo = (bar) => bar ? 'yes' : 'no';
            `,
        },
    ],

    invalid: [
        // Function declaration with wrapped body (default: maximumStatements = 1)
        {
            code: `
                function foo(bar) {
                    if (bar) {
                        doSomething();
                        doSomethingElse();
                    }
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Function expression with wrapped body
        {
            code: `
                const foo = function(bar) {
                    if (bar) {
                        doSomething();
                        doSomethingElse();
                    }
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Arrow function with wrapped body
        {
            code: `
                const foo = (bar) => {
                    if (bar) {
                        doSomething();
                        doSomethingElse();
                    }
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // maximumStatements: 0 - even single statement should fail
        {
            code: `
                function foo(bar) {
                    if (bar) {
                        doSomething();
                    }
                }
            `,
            options: [{ maximumStatements: 0 }],
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // maximumStatements: 0 - expression statement should fail
        {
            code: `
                function foo(bar) {
                    if (bar) doSomething();
                }
            `,
            options: [{ maximumStatements: 0 }],
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Multiple statements exceeding maximumStatements: 1
        {
            code: `
                function foo(bar) {
                    if (bar) {
                        doSomething();
                        doSomethingElse();
                        doAnotherThing();
                    }
                }
            `,
            options: [{ maximumStatements: 1 }],
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Exceeding maximumStatements: 2
        {
            code: `
                function foo(bar) {
                    if (bar) {
                        doSomething();
                        doSomethingElse();
                        doAnotherThing();
                    }
                }
            `,
            options: [{ maximumStatements: 2 }],
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Nested function with wrapped body
        {
            code: `
                function outer() {
                    function inner(bar) {
                        if (bar) {
                            doSomething();
                            doSomethingElse();
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Class method with wrapped body
        {
            code: `
                class MyClass {
                    myMethod(bar) {
                        if (bar) {
                            doSomething();
                            doSomethingElse();
                        }
                    }
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Async function with wrapped body
        {
            code: `
                async function foo(bar) {
                    if (bar) {
                        await doSomething();
                        await doSomethingElse();
                    }
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
    ],
    });
});
