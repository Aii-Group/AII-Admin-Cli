/** @type {import('tailwindcss').Config} */
import preset, { antdTokenPlugin } from './preset'
export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    theme: {
        extend: {
            ...preset,
        },
    },
    darkMode: 'selector',
    plugins: [antdTokenPlugin],
}
