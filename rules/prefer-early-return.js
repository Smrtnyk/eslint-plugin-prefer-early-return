const defaultMaximumStatements = 1;

export default {
    meta: {
        type: 'suggestion',
        docs: {
            description:
                'Prefer early returns over full-body conditional wrapping in function declarations.',
            category: 'Best Practices',
            recommended: false,
            uri:
                'https://github.com/Smrtnyk/eslint-plugin-prefer-early-return/blob/master/docs/rules/prefer-early-return.md',
        },
        messages: {
            preferEarlyReturn: 'Prefer an early return to a conditionally-wrapped function body',
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    maximumStatements: {
                        type: 'integer',
                    },
                },
                additionalProperties: false,
            },
        ],
    },

    create(context) {
        const options = context.options[0] || {
            maximumStatements: defaultMaximumStatements,
        };
        const maxStatements = options.maximumStatements;

        function isLonelyIfStatement(statement) {
            return statement.type === 'IfStatement' && statement.alternate == null;
        }

        function isOffendingConsequent(consequent) {
            return (
                (consequent.type === 'ExpressionStatement' && maxStatements === 0) ||
                (consequent.type === 'BlockStatement' &&
                    consequent.body.length > maxStatements)
            );
        }

        function isOffendingIfStatement(statement) {
            return (
                isLonelyIfStatement(statement) &&
                isOffendingConsequent(statement.consequent)
            );
        }

        function hasSimplifiableConditionalBody(functionBody) {
            const body = functionBody.body;
            return (
                functionBody.type === 'BlockStatement' &&
                body.length === 1 &&
                isOffendingIfStatement(body[0])
            );
        }

        function invertCondition(test, sourceCode) {
            const testText = sourceCode.getText(test);

            // If the test is already negated with !, remove the negation
            if (test.type === 'UnaryExpression' && test.operator === '!') {
                return sourceCode.getText(test.argument);
            }

            // Otherwise, wrap in negation
            // Add parentheses if the test is a complex expression
            if (test.type === 'BinaryExpression' || test.type === 'LogicalExpression') {
                return `!(${testText})`;
            }

            return `!${testText}`;
        }

        function checkFunctionBody(functionNode) {
            const body = functionNode.body;

            if (hasSimplifiableConditionalBody(body)) {
                const ifStatement = body.body[0];
                const sourceCode = context.sourceCode;

                context.report({
                    node: body,
                    messageId: 'preferEarlyReturn',
                    fix(fixer) {
                        const test = ifStatement.test;
                        const consequent = ifStatement.consequent;

                        // Get the inverted condition
                        const invertedCondition = invertCondition(test, sourceCode);

                        // Get indentation from the if statement line
                        const ifStatementLine = sourceCode.lines[ifStatement.loc.start.line - 1];
                        const baseIndent = ifStatementLine.match(/^(\s*)/)?.[1] || '';

                        // Get the body statements with proper indentation
                        let bodyStatements;
                        if (consequent.type === 'BlockStatement') {
                            bodyStatements = consequent.body
                                .map(stmt => {
                                    const stmtText = sourceCode.getText(stmt);
                                    return `${baseIndent}${stmtText}`;
                                })
                                .join('\n');
                        } else {
                            bodyStatements = `${baseIndent}${sourceCode.getText(consequent)}`;
                        }

                        // Build the fixed code with proper indentation
                        // Note: fixer.replaceText only replaces the node, not leading whitespace
                        const fixedCode = [
                            `if (${invertedCondition}) {`,
                            `${baseIndent}    return;`,
                            `${baseIndent}}`,
                            bodyStatements
                        ].join('\n');

                        return fixer.replaceText(ifStatement, fixedCode);
                    },
                });
            }
        }

        return {
            FunctionDeclaration: checkFunctionBody,
            FunctionExpression: checkFunctionBody,
            ArrowFunctionExpression: checkFunctionBody,
        };
    },
};
