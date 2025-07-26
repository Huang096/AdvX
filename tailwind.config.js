/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: '#E2CFFC',
          "primary-focus": '#C49FEF',
          secondary: '#7E57C2',
          "secondary-focus": '#5E35B1',
          "primary-content": "#212121",
        },
      },
    ],
  },
}

