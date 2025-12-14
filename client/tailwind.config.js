/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00FF94', // Electric Green
                secondary: '#A855F7', // Cyber Purple
                surface: '#0A0A0A',
                background: '#000000',
            },
            fontFamily: {
                outfit: ['Outfit', 'sans-serif'],
            },
            animation: {
                'spin-slow': 'spin 10s linear infinite',
            }
        },
    },
    plugins: [],
}
