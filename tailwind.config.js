/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neo: {
                    black: '#0a0a0c',
                    dark: '#121216',
                    cyan: '#00f3ff',
                    pink: '#ff00aa',
                    purple: '#b026ff',
                    glass: 'rgba(255, 255, 255, 0.05)',
                    glassDark: 'rgba(0, 0, 0, 0.6)'
                }
            },
            backdropBlur: {
                'liquid': '20px',
            },
            boxShadow: {
                'neon-cyan': '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
                'neon-pink': '0 0 10px rgba(255, 0, 170, 0.5), 0 0 20px rgba(255, 0, 170, 0.3)',
                'glass-glow': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 32px 0 rgba(0, 0, 0, 0.3)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            }
        },
    },
    plugins: [],
}
