import type { Config } from 'tailwindcss';
import animate from 'tailwindcss-animate';

import colors from './colors';
import gap from './gap';
import {default as borderRadius} from './radius'
import { default as boxShadow } from './shadow'
import { default as fontSize } from './typography';


export const config: Config = {
  darkMode: 'class',
  content: ['./variables.css'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
        xl: '1200px',
      },
    },

    gap,
    boxShadow,
    fontSize,
    borderRadius,

    extend: {
      colors,

      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [animate],
};
