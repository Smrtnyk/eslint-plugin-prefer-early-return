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
            output: `
                function foo(bar) {
                    if (!bar) {
                        return;
                    }
                    doSomething();
                    doSomethingElse();
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
            output: `
                const foo = function(bar) {
                    if (!bar) {
                        return;
                    }
                    doSomething();
                    doSomethingElse();
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
            output: `
                const foo = (bar) => {
                    if (!bar) {
                        return;
                    }
                    doSomething();
                    doSomethingElse();
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Greater than operator (>) should become <=
        {
            code: `
                function foo(count) {
                    if (count > 0) {
                        processCount(count);
                        saveCount(count);
                    }
                }
            `,
            output: `
                function foo(count) {
                    if (count <= 0) {
                        return;
                    }
                    processCount(count);
                    saveCount(count);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Greater than or equal operator (>=) should become <
        {
            code: `
                function foo(age) {
                    if (age >= 18) {
                        processAdult(age);
                        notifyParent(age);
                    }
                }
            `,
            output: `
                function foo(age) {
                    if (age < 18) {
                        return;
                    }
                    processAdult(age);
                    notifyParent(age);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Less than operator (<) should become >=
        {
            code: `
                function foo(value) {
                    if (value < 100) {
                        process(value);
                        save(value);
                    }
                }
            `,
            output: `
                function foo(value) {
                    if (value >= 100) {
                        return;
                    }
                    process(value);
                    save(value);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Less than or equal operator (<=) should become >
        {
            code: `
                function foo(score) {
                    if (score <= 50) {
                        handleLowScore(score);
                        notifyUser(score);
                    }
                }
            `,
            output: `
                function foo(score) {
                    if (score > 50) {
                        return;
                    }
                    handleLowScore(score);
                    notifyUser(score);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Strict equality (===) should become !==
        {
            code: `
                function foo(status) {
                    if (status === 'active') {
                        processActive(status);
                        logStatus(status);
                    }
                }
            `,
            output: `
                function foo(status) {
                    if (status !== 'active') {
                        return;
                    }
                    processActive(status);
                    logStatus(status);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Strict inequality (!==) should become ===
        {
            code: `
                function foo(type) {
                    if (type !== 'guest') {
                        processUser(type);
                        saveUser(type);
                    }
                }
            `,
            output: `
                function foo(type) {
                    if (type === 'guest') {
                        return;
                    }
                    processUser(type);
                    saveUser(type);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Loose equality (==) should become !=
        {
            code: `
                function foo(x) {
                    if (x == null) {
                        handleNull(x);
                        logNull(x);
                    }
                }
            `,
            output: `
                function foo(x) {
                    if (x != null) {
                        return;
                    }
                    handleNull(x);
                    logNull(x);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Loose inequality (!=) should become ==
        {
            code: `
                function foo(val) {
                    if (val != undefined) {
                        process(val);
                        save(val);
                    }
                }
            `,
            output: `
                function foo(val) {
                    if (val == undefined) {
                        return;
                    }
                    process(val);
                    save(val);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Logical AND (&&) should use De Morgan's law: !(a && b) = !a || !b
        {
            code: `
                function foo(user, isActive) {
                    if (user && isActive) {
                        processUser(user);
                        logActivity(user);
                    }
                }
            `,
            output: `
                function foo(user, isActive) {
                    if (!user || !isActive) {
                        return;
                    }
                    processUser(user);
                    logActivity(user);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Logical OR (||) should use De Morgan's law: !(a || b) = !a && !b
        {
            code: `
                function foo(isAdmin, isModerator) {
                    if (isAdmin || isModerator) {
                        grantAccess();
                        logAccess();
                    }
                }
            `,
            output: `
                function foo(isAdmin, isModerator) {
                    if (!isAdmin && !isModerator) {
                        return;
                    }
                    grantAccess();
                    logAccess();
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Complex logical expression with comparisons and &&
        {
            code: `
                function foo(items) {
                    if (items.length > 0 && items.length < 100) {
                        processItems(items);
                        saveItems(items);
                    }
                }
            `,
            output: `
                function foo(items) {
                    if (items.length <= 0 || items.length >= 100) {
                        return;
                    }
                    processItems(items);
                    saveItems(items);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Complex nested logical expression
        {
            code: `
                function foo(user, data) {
                    if (user.isActive && (data.length > 0 || data.isValid)) {
                        processData(user, data);
                        saveData(user, data);
                    }
                }
            `,
            output: `
                function foo(user, data) {
                    if (!user.isActive || data.length <= 0 && !data.isValid) {
                        return;
                    }
                    processData(user, data);
                    saveData(user, data);
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Already negated simple expression
        {
            code: `
                function foo(flag) {
                    if (!flag) {
                        doSomething();
                        doSomethingElse();
                    }
                }
            `,
            output: `
                function foo(flag) {
                    if (flag) {
                        return;
                    }
                    doSomething();
                    doSomethingElse();
                }
            `,
            errors: [
                {
                    messageId: 'preferEarlyReturn',
                },
            ],
        },
        // Property access with comparison
        {
            code: `
                function foo(selectedItems) {
                    if (selectedItems.value.length > 0) {
                        emit("bulk-delete", selectedItems.value);
                        clearSelection();
                    }
                }
            `,
            output: `
                function foo(selectedItems) {
                    if (selectedItems.value.length <= 0) {
                        return;
                    }
                    emit("bulk-delete", selectedItems.value);
                    clearSelection();
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
            output: `
                function foo(bar) {
                    if (!bar) {
                        return;
                    }
                    doSomething();
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
            output: `
                function foo(bar) {
                    if (!bar) {
                        return;
                    }
                    doSomething();
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
            output: `
                function foo(bar) {
                    if (!bar) {
                        return;
                    }
                    doSomething();
                    doSomethingElse();
                    doAnotherThing();
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
            output: `
                function foo(bar) {
                    if (!bar) {
                        return;
                    }
                    doSomething();
                    doSomethingElse();
                    doAnotherThing();
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
            output: `
                function outer() {
                    function inner(bar) {
                        if (!bar) {
                            return;
                        }
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
            output: `
                class MyClass {
                    myMethod(bar) {
                        if (!bar) {
                            return;
                        }
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
            output: `
                async function foo(bar) {
                    if (!bar) {
                        return;
                    }
                    await doSomething();
                    await doSomethingElse();
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
