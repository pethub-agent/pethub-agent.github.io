/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: { roboto: ["Roboto", "sans-serif"] },
      colors: {
        // Cores identidade visual
        primary: {
          DEFAULT: "#FF914D", // Cor primária padrão
          dark: "#E07E3A", // Versão escura da cor primária
          light: "#FFA877", // Versão clara da cor primária
        },
        secondary: {
          DEFAULT: "#FFC857", // Cor secundária padrão
          dark: "#E0B14B", // Versão escura da cor secundária
          light: "#FFD97D", // Versão clara da cor secundária
        },
        neutral: {
          100: "#FFFFFF", // Neutro 100
          200: "#F5F5F5", // Neutro 200
          500: "#BDBDBD", // Neutro 500
          800: "#4A4A4A", // Neutro 800
          900: "#2E2E2E", // Neutro 900
        },
        support: {
          blue: "#6366f1", // Azul de suporte
          green: "#58C77C", // Verde de suporte
        },
        g: {
          from: "#3B82F5",
          to: "#9333EA",
        },
        danger: {
          from: "#ef4444",
          to: "#ea580c",
        },
        // from-rose-600 (#e11d48)
        // to-pink-600 (#db2777)

        text: {
          primary: "#2E2E2E", // Cor primária do texto
          secondary: "#4A4A4A", // Cor secundária do texto
          disabled: "#BDBDBD", // Cor do texto desabilitado
        },
        background: {
          light: "#FFFFFF", // Fundo claro
        },
      },
    },
  },
  plugins: [require("tailwindcss-animated")],
};
