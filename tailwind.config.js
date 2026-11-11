/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anaci: {
          primary: '#008051',      // --e-global-color-primary (Verde Istituzionale ANACI)
          primaryDark: '#006741',  // Active / Hover Verde Scuro ANACI
          forest: '#001A10',       // Hero Gradient End (#008051 -> #001A10)
          accent: '#009B62',       // --e-global-color-accent (Verde Brillante ANACI)
          secondary: '#C23030',    // --e-global-color-secondary (Rosso Istituzionale ANACI / CTA Hover)
          secondaryHover: '#A3242B',
          secondarySoft: '#FDF2F2',
          mint: '#EFF7F3',         // --e-global-color-299a2af (Sfondo Soft Mint ANACI)
          surface: '#F6F6F6',      // --e-global-color-f1d6e1b (Grigio Chiaro Sezioni ANACI)
          text: '#444444',         // --e-global-color-text (Testo Principale ANACI)
          heading: '#333333',      // Titoli Card ANACI
          dark: '#222529',         // Footer & Contrast Background ANACI
          muted: '#B9B9B9',        // Testo secondario su sfondo scuro
          // Alias di retrocompatibilità mappati sul nuovo tema ufficiale anaci.it
          navy: '#008051',
          navyLight: '#009B62',
          navyDark: '#001A10',
          bordeaux: '#C23030',
          bordeauxHover: '#A3242B',
          bordeauxSoft: '#FDF2F2',
          subtle: '#EFF7F3',
        }
      },
      fontFamily: {
        sans: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['"Poppins"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'anaci-card': '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
        'anaci-popup': '2px 8px 23px 3px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'anaci-btn': '6px',
        'anaci-card': '10px',
      },
      backgroundImage: {
        'anaci-hero': 'linear-gradient(90deg, #008051 0%, #001A10 100%)',
      }
    },
  },
  plugins: [],
};

