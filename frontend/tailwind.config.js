/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // base whites and light tints
                white: '#FFFFFF',
                'light-green': '#D1FAE5',   // pale spring green
                'light-blue': '#E0F2FE',    // pale sky blue
                'light-purple': '#F3E8FF',  // pale lavender
                // you can still keep semantic primary/secondary or map them
                primary: '#4F46E5',   // deep indigo (can be adjusted)
                secondary: '#10B981', // emerald
                dark: '#1F2937',      // slate gray
                // override slate palette to light shades so existing classes invert
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#ffffff',
                },
            },
        },
    },
    plugins: [],
}
