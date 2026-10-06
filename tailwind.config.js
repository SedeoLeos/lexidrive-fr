module.exports = {
  content: ["./App.tsx", "./src/**/*.{ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: "#842E1B",
        paper: "#FAF7F2",
        ink: "#26211F",
        muted: "#756C65",
        line: "#E8E1D8",
        sage: "#426C52",
        blush: "#F1E3DA",
      },
    },
  },
  plugins: [],
};
