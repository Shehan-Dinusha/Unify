module.exports = {
  env: {
    browser: true,
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: {
    ecmaFeatures: { jsx: true },
    sourceType: "module",
  },
  settings: {
    react: { version: "detect" },
  },
  plugins: ["react-refresh"],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "react-refresh/only-export-components": "warn",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "no-useless-catch": "warn",
  },
};
