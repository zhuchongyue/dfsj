module.exports = {
  plugins: {
    autoprefixer: {},
    "postcss-pxtorem": {
      rootValue: 16,
      propList: ["*"],
      unitPrecision: 5,
    },
  },
}
