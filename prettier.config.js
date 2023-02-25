require('prettier-config-apteryx/helper').modifyPrettierModule();

module.exports = {
    printWidth: 100,
    endOfLine: 'lf',

    tabWidth: 4,
    useTabs: false,

    trailingComma: 'es5',
    semi: true,

    singleQuote: true,
    jsxSingleQuote: false,
    quoteProps: 'as-needed',

    bracketSpacing: true,
    bracketSameLine: false,
    arrowParens: 'avoid',

    overrides: [
        {
            files: ['*.yml', '*.yaml'],
            options: { tabWidth: 2 }
        },
        {
            files: ['*.json'],
            options: { parser: 'json' },
        }
    ]
};