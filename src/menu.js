export default [
    {
        title: 'Home',
        icon: 'lnr-home',
        href: '/',
    },
    {
        title: 'Workspace',
        icon: 'lnr-chart-bars',
        child: [
            // { title: 'Executing Analytics Jobs', href: '/workspace' },
            { title: 'Data Preparation', href: '/workspace/preparation' },
        ],
    },
    {
        title: 'Help',
        icon: 'lnr-question-circle',
        href: '/help',
    },
];
