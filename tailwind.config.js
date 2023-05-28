/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                "primary": "#b09872",
                "secondary": "#fff6dc",
                "colorOne": "#5a4e3b",
            },
            borderWidth: {
                "3": "3px"
            },
        },
    },
    plugins: [],
}

