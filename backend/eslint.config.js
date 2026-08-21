import js from "@eslint/js";
import globals from "globals";
import jestPlugin from "eslint-plugin-jest";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // 1 file 170 muruus iluu bolohgui - project-iin durem
      "max-lines": [
        "warn",
        { max: 170, skipBlankLines: true, skipComments: true },
      ],
      "no-unused-vars": "warn",
      "no-console": "off",
      eqeqeq: "error",
      "prefer-const": "warn",
    },
  },
  {
    // test file-uudad zoriulsan tusgai durem
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/expect-expect": "error",
      "max-lines": "off",
    },
  },
];
