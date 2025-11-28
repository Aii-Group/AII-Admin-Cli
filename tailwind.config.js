/** @type {import('tailwindcss').Config} */
import preset from './preset'
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        extend: {
            ...preset,
            fontSize: ({ theme }) => ({
                ...theme('spacing'),
            }),
        },
        spacing: Array.from({ length: 1000 }).reduce((map, _, index) => {
            map[index] = `${index}px`
            return map
        }, {}),
    },
    darkMode: 'selector',
    plugins: [
        function ({ addComponents }) {
            addComponents({
                '.wrapper': {
                    '@apply px-16 py-24 rounded-2xl bg-light-colorBgContainer shadow-md dark:!bg-dark-colorBgContainer dark:!border dark:!border-dark-colorBorder':
                        {},
                },
                '.primary-text-btn': {
                    '@apply text-light-colorPrimary dark:!text-dark-colorPrimary': {},
                },
                '.error-text-btn': {
                    '@apply text-light-colorError dark:!text-dark-colorError': {},
                },
                '.warning-text-btn': {
                    '@apply text-light-colorWarning dark:!text-dark-colorWarning': {},
                },
                '.success-text-btn': {
                    '@apply text-light-colorSuccess dark:!text-dark-colorSuccess': {},
                },
            })
        },
    ],
}
