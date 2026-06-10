/** @type {import('tailwindcss').Config} */
import preset, { antdTokenPlugin } from './preset'
export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            ...preset,
        },
    },
    darkMode: 'selector',
    plugins: [antdTokenPlugin],
}
