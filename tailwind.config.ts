import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            screens: {
                xs: '475px'
            },
            colors: {
                primary: {
                    "100": '#FFDFA6', // Soft sunset glow (pale orange)
                    DEFAULT: '#F59E0B', // Sunset orange#
                    dark: '#D97706', // Deep amber
                },
                secondary: {
                    light: '#FFB3B3', // Soft coral pink
                    DEFAULT: '#FF4D4D', // Vibrant crimson red
                    dark: '#C54047', // Deep ruby red
                },                
                accent: {
                    light: '#FFEDCC', // Warm sandy beige
                    DEFAULT: '#F4C078', // Sandy peach
                    dark: '#D6A054', // Deep warm sand
                },
                neutral: {
                    light: '#E5E7EB', // Soft mist gray
                    DEFAULT: '#6B7280', // Balanced medium gray
                    dark: '#1F2937', // Charcoal gray
                    black: '#111827', // Jet black
                },
                highlight: {
                    light: '#FDE047', // Soft lemon yellow
                    DEFAULT: '#FACC15', // Golden yellow (sunlit accents)
                    dark: '#B45309', // Earthy ochre
                },
                danger: {
                    light: '#FEB2B2', // Light coral pink
                    DEFAULT: '#F87171', // Warm red (alerts/warnings)
                    dark: '#B91C1C', // Deep crimson
                },
                success: {
                    light: '#BBF7D0', // Soft mint green
                    DEFAULT: '#34D399', // Vibrant sea green
                    dark: '#065F46', // Deep jungle green
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                },
				black: {
                    "100": "#333333",
                    "200": "#141413",
                    "300": "#7D8087",
                    DEFAULT: "#000000",
                },
                white: {
                    "100": "#F7F7F7",
                    DEFAULT: "#FFFFFF",
                },
            },
            fontFamily: {
                'work-sans': [
                    'var(--font-work-sans)'
                ]
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            boxShadow: {
                '100': '2px 2px 0px 0px rgb(0, 0, 0)',
                '200': '2px 2px 0px 2px rgb(0, 0, 0)',
                '300': '2px 2px 0px 2px rgb(217, 119, 6)'
            }
        }
    },
    plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
