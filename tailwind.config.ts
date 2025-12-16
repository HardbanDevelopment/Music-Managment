import type { Config } from 'tailwindcss';

export default {
  content: [
    './index.html',
    './**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#8B5CF6',
        'primary-blue': '#3B82F6',
        'dark-bg': '#0f0f13',
        'dark-border': '#222333'
      }
    }
  },
  plugins: []
} satisfies Config;
