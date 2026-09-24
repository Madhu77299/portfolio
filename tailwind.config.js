/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B1020",
        surface: "rgba(255,255,255,0.08)",
        glow: "#7B61FF",
        accent: "#00E5FF",
        cyan: {
          50: "#e5fdff",
          100: "#b3faff",
          200: "#80f5ff",
          300: "#4df1ff",
          400: "#1aebff",
          500: "#00e5ff", // Neon Cyan
          600: "#00b7cc",
          700: "#008a99",
          800: "#005c66",
          900: "#002e33",
          950: "#00171a",
        },
        purple: {
          50: "#f2efff",
          100: "#ddd6ff",
          200: "#c0b3ff",
          300: "#9e8bff",
          400: "#856eff",
          500: "#7b61ff", // Neon Purple
          600: "#614bcc",
          700: "#493899",
          800: "#312566",
          900: "#181233",
          955: "#0c091a",
        },
        fuchsia: {
          50: "#fff0f5",
          100: "#ffd9e4",
          200: "#ffb3ca",
          300: "#ff8cb0",
          400: "#ff6696",
          500: "#ff4d8d", // Neon Pink
          600: "#cc3d71",
          700: "#992e55",
          800: "#661f38",
          900: "#330f1c",
          950: "#1a080e",
        }
      },
      boxShadow: {
        soft: "0 35px 120px rgba(5, 8, 27, 0.45)",
        glass: "0 10px 60px rgba(11, 16, 32, 0.55)"
      },
      backgroundImage: {
        cosmic: "radial-gradient(circle at top, rgba(0, 229, 255, 0.15), transparent 30%), radial-gradient(circle at 20% 20%, rgba(123, 97, 255, 0.15), transparent 25%), radial-gradient(circle at 80% 80%, rgba(255, 77, 141, 0.1), transparent 20%), linear-gradient(180deg, #0B1020 0%, #151B35 100%)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
