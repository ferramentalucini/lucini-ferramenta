
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
				playfair: ['"Playfair Display"', "serif"],
				sans: ['Inter', "sans-serif"],
			},
			colors: {
				oro: "#b08d37",
				oroDark: "#7f6b30",
				ferramentaCemento: "#ece4d6",
				ferramentaLegno: "#d3b790",
			},
      boxShadow: {
        'deep-gold': '0 5px 25px -4px #c9b03744, 0 1.5px 0px #e5e7eb inset',
      }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
