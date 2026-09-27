/** Run `npm run build` after editing any page. Add new .html files to `content`. */
module.exports = {
  content: ['./*.html', './*.js'],
  theme: {
    extend: {
      fontFamily: { sans: ['"Orbitron"', 'sans-serif'] },
      colors: {
        dark: '#000000', darker: '#050505', surface: '#121212', surfaceHover: '#1a1a1a',
        textMain: '#f4f4f5', textMuted: '#a1a1aa', accent: '#9d4edd', accentHover: '#c77dff'
      },
      letterSpacing: { widest: '.25em' }
    }
  }
};
