
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				oswald: ['Oswald', 'sans-serif'],
				lato: ['Lato', 'sans-serif'],
				merriweather: ['Merriweather', 'serif'],
			},
			colors: {
				// palette principale
				sabbia: "#F4F1EA",
				verdesalvia: "#7B8B6F",
				ruggine: "#8B5E3C",
				cemento: "#A9A9A9",
				antracite: "#2E2E2E",
				senape: "#D4A017",
				bianco: "#fff"
			},
			boxShadow: {
				'rustic-card': '0 2px 14px -2px #2E2E2E14, 0 1px 0 #ded9d3 inset',
				'cement-shadow': '0 1.5px 14px -4px #A9A9A944, 0 1px 0 #cccccc inset',
			},
			backgroundImage: {
				// texture cemento/parete realistica
				'cemento-texture': "url('https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&w=1000&q=30')",
				'mattone-texture': "url('https://images.unsplash.com/photo-1520880867055-1e30d1cb001c?auto=format&fit=crop&w=1000&q=40')",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
