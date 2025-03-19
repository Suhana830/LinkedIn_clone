import daisyui from 'daisyui';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        linkedin: {
          primary: "#0A66C2",//LinkedIn Blue
          secondary: '#FFFFFF', //white
          accent: '#7FC15E', // LinkedIn Green (for accents)
          neutral: "#000000", // Black (for text)
          base_: "#E5E4E2 ", // Light Gray (background)
          info: "#5E5ESE", // Dark Gray (for secondary text)
          success: "#057642", // Dark Green (for success message)
          warning: "#F5C75D", //yellow (for warning)
          error: "#CC1016", //Red (for errors)


        },
      },
    ],
  }
}
