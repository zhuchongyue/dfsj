module.exports = {
    printWidth: 100,// 一行字符
    tabWidth: 2, // 空格缩进
    useTabs: false,// 缩进符，而使用空格
    semi: true, // 行尾分号
    vueIndentScriptAndStyle: true,
    singleQuote: true,//使用单引号
    quoteProps: 'as-needed',// 对象的 key 仅在必要时用引号
    bracketSpacing: true,//大括号内的首尾需要空格
    trailingComma: 'es5',//末尾不需要逗号
    jsxBracketSameLine: false,
    jsxSingleQuote: false,//jsx 标签的反尖括号需要换行
    arrowParens: 'always',
    insertPragma: false,
    requirePragma: false,
    proseWrap: 'never',
    htmlWhitespaceSensitivity: 'strict',
    endOfLine: 'auto',
    rangeStart: 0,
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    singleAttributePerLine:true,
    vueWrapAttributes:true,
    importOrder: [
        "^@dfsj/(.*)$",
        "^vue",
        "<THIRD_PARTY_MODULES>",
        '^/@/(.*)$',
        '^@/(.*)$',
        '^/#/(.*)$',
        "@/(.*)", "^[./]"],
    importOrderParserPlugins: [
        "typescript",
        "classProperties",
        "decorators-legacy",
    ]
}
