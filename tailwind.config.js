/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					green: 'hsl(var(--brand-green))',
					black: 'hsl(var(--brand-black))',
					white: 'hsl(var(--brand-white))'
				},
				bg: 'hsl(var(--bg))',
				gray: {
					900: 'hsl(var(--gray-900))',
					700: 'hsl(var(--gray-700))',
					400: 'hsl(var(--gray-400))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol']
			},
			boxShadow: {
				soft: '0 10px 24px -8px rgba(0,0,0,0.08), 0 6px 12px -6px rgba(0,0,0,0.06)'
			},
			borderRadius: {
				xl: '20px'
			}
		}
	},
	plugins: []
};
