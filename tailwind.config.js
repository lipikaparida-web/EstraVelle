/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Premium Dark Palette
                'brand-dark': '#0f1122',
                'card-dark': '#161a2b',
                'card-light': '#1e243b',
                'border-dark': '#2A2F4C',
                'accent-copper': '#c67e58',
                'accent-brown': '#8a4f3b',
                
                // Legacy colors mapped to dark theme to prevent breakage
                'plum-deep': '#0f1122',
                'plum-wine': '#e2e8f0', // Slate-200 for readable text
                'rose-dusty': '#2A2F4C', // Used for borders
                'mist-rose': '#0f1122', // Main background
                'serenity-purple': '#c67e58', // Primary accent
                'tangerine': '#c67e58',
            },
        },
    },
    plugins: [],
}