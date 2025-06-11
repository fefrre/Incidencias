// postcss.config.mjs
export default {
  plugins: {
    // Mantén el plugin de Tailwind CSS que ya tienes
    '@tailwindcss/postcss': {},

    // Agrega el plugin de postcss-preset-env para la compatibilidad de colores
    'postcss-preset-env': {
      features: {
        'oklab-and-lab-colors': true,
      },
    },
  },
};