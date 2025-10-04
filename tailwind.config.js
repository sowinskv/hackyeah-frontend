/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "zus-orange": "rgb(255, 179, 79)",
        "zus-green": "rgb(0, 153, 63)",
        "zus-gray": "rgb(190, 195, 206)",
        "zus-blue": "rgb(63, 132, 210)",
        "zus-navy": "rgb(0, 65, 110)",
        "zus-red": "rgb(240, 94, 94)",
        "zus-black": "rgb(0, 0, 0)",
        "zus-bg": "#201e28",
      },
      animation: {
        parallax: "parallax 20s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
        "float-1": "float1 4s ease-in-out infinite",
        "float-2": "float2 3s ease-in-out infinite 1s",
        "float-3": "float3 5s ease-in-out infinite 2s",
        "bounce-slow": "bounce 2s infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        parallax: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        float1: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-20px) rotate(90deg)" },
          "50%": { transform: "translateY(0px) rotate(180deg)" },
          "75%": { transform: "translateY(-10px) rotate(270deg)" },
        },
        float2: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "33%": { transform: "translateY(-15px) scale(1.1)" },
          "66%": { transform: "translateY(-5px) scale(0.9)" },
        },
        float3: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg) scale(1)" },
          "20%": { transform: "translateY(-25px) rotate(72deg) scale(1.2)" },
          "40%": { transform: "translateY(-5px) rotate(144deg) scale(0.8)" },
          "60%": { transform: "translateY(-15px) rotate(216deg) scale(1.1)" },
          "80%": { transform: "translateY(-10px) rotate(288deg) scale(0.9)" },
        },
      },
    },
  },
  plugins: [],
};
