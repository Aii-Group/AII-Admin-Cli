const menu = [
    {
        key: 'Dashboard',
        label: 'Dashboard',
        icon: 'dashboard',
        path: '/dashboard',
    },
    {
        key: 'Tab',
        label: 'Tab',
        icon: 'tab',
        path: '/tab',
    },
    {
        key: 'Table',
        label: 'Table',
        icon: 'table',
        path: '/table',
        children: [],
    },
    {
        key: 'External_Link',
        label: 'External Link',
        icon: 'link',
        path: '/iframe',
        children: [
            {
                key: 'Baidu',
                label: 'Baidu',
                path: '/iframe/Baidu',
                link: 'https://www.baidu.com/',
            },
            {
                key: 'React',
                label: 'React',
                path: '/iframe/React',
                link: 'https://zh-hans.react.dev/',
            },
        ],
    },
    {
        key: 'Form',
        label: 'Form',
        icon: 'form',
        path: '/form',
        children: [
            {
                key: 'Basic_Form',
                label: 'Basic Form',
                path: '/form/basic-form',
            },
            {
                key: 'Advanced_Form',
                label: 'Advanced Form',
                path: '/form/advanced-form',
            },
        ],
    },
]

export default menu
