/* eslint-disable */
const globals = require("globals");
const path = require("path");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");
const stylisticJs = require("@stylistic/eslint-plugin-js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: 2021,
      sourceType: "commonjs",
    },
    plugins: {
      "@stylistic/js": stylisticJs,
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": ["error", { allow: ["error"] }],
      "no-async-promise-executor": "off",
      "no-shadow": "error",
      "prefer-const": "warn",
      yoda: "error",
      "max-nested-callbacks": ["error", { max: 4 }],
      "@stylistic/js/comma-spacing": ["error", { before: false, after: true }],
      "no-case-declarations": "error",
      "no-empty": "error",
      "no-eq-null": "error",
      "no-eval": "warn",
      "no-invalid-this": "error",
      "no-redeclare": "error",
      "default-case-last": "warn",
      eqeqeq: ["warn", "always"],
      "curly": "error",
      "no-useless-assignment": "error",
      "no-use-before-define": ["error", { functions: false }],
      "no-template-curly-in-string": "error",
      "no-duplicate-imports": "error",
      "no-duplicate-case": "error",
      "no-dupe-keys": "error",
    },
  },
];