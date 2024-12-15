/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary' : '#31572c ',
        'secondary' : '#F2F2F2 ',
        'accent' : '#44854c ',
        'light-gray' : '#E0E0E0 ',
      },
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'], // Replace 'Roboto' with your desired font
    },
  },
  plugins: [],
}

