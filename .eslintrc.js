module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "prettier"],
  plugins: ["prettier", "graphql", "react"],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        trailingComma: "es5",
      },
    ],
    "no-confusing-arrow": 0,
    "no-else-return": 0,
    "no-underscore-dangle": 0,
    "no-unused-vars": [
      2,
      {
        argsIgnorePattern: "^_",
      },
    ],
    "no-restricted-syntax": 0,
    "no-await-in-loop": 0,
    camelcase: 0,
    "react/prop-types": 0,
  },
};
