// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "react-native", "react-hooks"],
  rules: {
    "react/no-children-prop": "off",
    "unreachable-code": "off",
    "no-console": "warn",
    "no-undef": "warn",
    "no-prototype-builtins": "off",
    "no-unused-vars": "warn",
    "react-hooks/rules-of-hooks": "off",
    "react-hooks/exhaustive-deps": "off",
    "react-native/no-inline-styles": "off",
    "react-native/no-raw-text": "off",
    "react/react-in-jsx-scope": "off",
    "react/no-unescaped-entities": "off",
    "no-trailing-spaces": "warn",
    "no-unsafe-optional-chaining":"off",
    "no=prototype-built-ins": "off",
  },
};
