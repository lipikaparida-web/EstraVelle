/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Your New Sanctuary Palette
                'plum-deep': '#1A0410',
                'plum-wine': '#450920',
                'rose-dusty': '#A6808C',
                'mist-rose': '#F4EBEB',
                'serenity-purple': '#450920',
                'tangerine': '#A6808C',
            },
        },
    },
    plugins: [],
}