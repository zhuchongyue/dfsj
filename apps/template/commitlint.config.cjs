module.exports = {
    extends: ['@commitlint/config-conventional'],
    // 校验规则
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'code', //编写功能
                'comment',// 添加注释
                'feat', //新功能
                'fix',  //修改 bug
                'perf', //性能相关
                'style', //样式修改
                'docs',//文档
                'test', //测试用例
                'refactor', //代码重构（就是不影响使用，内部结构的调整）
                'build',//项目打包构建相关的配置修改
                'ci',//持续集成相关
                'chore', //其他修改（不在上述类型中的修改）
                'revert', //恢复上一次提交（回滚）
                'wip',// work in progress 工作中 还没完成
                'workflow',//工作流
                'types', //类型相关
                'release', //发版
            ],
        ],
        'type-case': [0],
        'type-empty': [0],
        'scope-empty': [0],
        'scope-case': [0],
        'subject-full-stop': [0, 'never'],
        'subject-case': [0, 'never'],
        'header-max-length': [0, 'always', 72],
    },
}
