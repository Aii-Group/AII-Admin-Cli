export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // New feature
                'fix', // Bug fix
                'docs', // Documentation only
                'style', // Formatting/style (no logic)
                'refactor', // Code refactor (no feature/fix)
                'perf', // Performance improvement
                'test', // Add/update tests
                'build', // Build system/dependencies
                'ci', // CI/config changes
                'chore', // Maintenance/misc
                'revert', // Revert commit
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
