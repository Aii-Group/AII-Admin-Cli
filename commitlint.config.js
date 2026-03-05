export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // 新功能
                'fix', // 修复 bug
                'fixbug', // 修复 bug（兼容旧版）
                'refactor', // 重构
                'perf', // 性能优化
                'optimize', // 优化
                'style', // 代码格式
                'docs', // 文档
                'test', // 测试
                'chore', // 构建/工具
                'ci', // CI 配置
                'revert', // 回滚
                'i18n', // 国际化
                'build', // 构建
                'release', // 发布
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
