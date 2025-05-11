import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
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
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
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
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
        // Custom CMD theme colors accessible via Tailwind classes e.g. text-cmd-prompt
        'cmd-prompt': 'hsl(var(--cmd-prompt-color))',
        'cmd-input': 'hsl(var(--cmd-input-color))', 
        'cmd-output': 'hsl(var(--cmd-output-color))',
        'cmd-error': 'hsl(var(--cmd-error-color))',
        'cmd-info': 'hsl(var(--cmd-info-color))',
        'cmd-suggestion': {
          DEFAULT: 'hsl(var(--cmd-suggestion-bg))',
          foreground: 'hsl(var(--cmd-suggestion-text))',
          hover: 'hsl(var(--cmd-suggestion-hover-bg))',
          'hover-foreground': 'hsl(var(--cmd-suggestion-hover-text))',
          active: 'hsl(var(--cmd-suggestion-active-bg))',
          'active-foreground': 'hsl(var(--cmd-suggestion-active-text))'
        }
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        'textflow-animation': { /* Added from globals.css for Tailwind awareness */
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'border-glow-animation': { /* Added from globals.css for Tailwind awareness */
          'from': {
            boxShadow: '0 0 4px 0px hsl(var(--primary) / 0.8), 0 0 6px 0px hsl(var(--ring) / 0.7)'
          },
          'to': {
            boxShadow: '0 0 8px 2px hsl(var(--primary) / 1), 0 0 12px 2px hsl(var(--ring) / 0.9)'
          }
        },
        'input-border-flow': { 
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'light-sweep': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%'},
        },
        'input-sheen-bg-sweep': { /* Added for reflective sheen */
          '0%': { backgroundPosition: '150% 0' },
          '100%': { backgroundPosition: '-150% 0'},
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
        'blink': 'blink 1s step-end infinite',
        'textflow': 'textflow-animation 10s ease infinite', 
        'border-glow': 'border-glow-animation 1.5s infinite alternate', 
        'input-border-flow': 'input-border-flow 4s linear infinite', 
        'light-sweep': 'light-sweep 1.5s linear infinite',
        'input-sheen-bg-sweep': 'input-sheen-bg-sweep 1s linear infinite', /* Added */
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

