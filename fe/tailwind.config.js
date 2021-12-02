const colors = require('tailwindcss/colors')

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      blue: {
        light: '#85d7ff',
        DEFAULT: '#1fb6ff',
        dark: '#009eeb'
      },
      pink: {
        light: '#ff7ce5',
        DEFAULT: '#ff49db',
        dark: '#ff16d1'
      },
      gray: {
        darkest: '#1f2d3d',
        dark: '#3c4858',
        DEFAULT: '#c0ccda',
        light: '#e0e6ed',
        lightest: '#f9fafc'
      }
    },
    textColor: {
      default: '#333',
      primary: '#22a7f0',
      secondary: '#ffed4a',
      danger: '#e3342f',
      link: '#22a7f0'
    },
    colors: {
      ...colors,
      aurora: '#22a7f0'
    },
    light: {
      bg: '#fff',
      text: '#333'
    },
    dark: {
      bg: '#333',
      text: '#fff'
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
