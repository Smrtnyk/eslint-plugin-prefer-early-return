import { Rule } from 'eslint';

export interface PreferEarlyReturnOptions {
    /**
     * Maximum number of statements allowed inside the if block before requiring an early return pattern.
     * @default 1
     */
    maximumStatements?: number;
}

export interface PreferEarlyReturnRule extends Rule.RuleModule {
    meta: {
        type: 'suggestion';
        docs: {
            description: string;
            category: string;
            recommended: boolean;
            uri: string;
        };
        messages: {
            preferEarlyReturn: string;
        };
        fixable: 'code';
        schema: Array<{
            type: 'object';
            properties: {
                maximumStatements: {
                    type: 'integer';
                };
            };
            additionalProperties: false;
        }>;
    };
}

export interface Plugin {
    rules: {
        'prefer-early-return': PreferEarlyReturnRule;
    };
}

declare const plugin: Plugin;
export default plugin;
