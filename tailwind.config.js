/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class", "media"],
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./public/index.html",
    ],
    theme: {
        extend: {
            keyframes: {
                highlightGreen: {
                    "0%": { backgroundColor: "rgb(220 252 231)" }, // bg-green-100
                    "100%": { backgroundColor: "transparent" },
                },
                highlightRed: {
                    "0%": { backgroundColor: "rgb(254 226 226)" }, // bg-red-100
                    "100%": { backgroundColor: "transparent" },
                },
            },
            animation: {
                highlightGreen: "highlightGreen 0.8s ease-out",
                highlightRed: "highlightRed 0.8s ease-out",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
        },
    },
    plugins: [],
}