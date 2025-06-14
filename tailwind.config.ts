
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
				oro: "#bfa046",
				rame: "#a1643b",
				acciaio: "#8e939b",
				cemento: "#ded9d3",
				noce: "#85775c",
				verdeFerramenta: "#60766b",
				scuroMetallo: "#55585c",
				// i colori chiari restano per background
				biancoFerramenta: "#f5f3ef",
				ombra: "#d1b46d44",
			},
      boxShadow: {
        'deep-gold': '0 5px 25px -4px #bfa04644, 0 1.5px 0px #e5e7eb inset',
        'rustic-card': '0 2px 12px -2px #85775c25, 0 1px 0 #eadbbb inset',
      }
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
