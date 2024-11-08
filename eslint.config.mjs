import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,    // add env Node.js
        ...globals.jest,    // add env Jest
      },
    },
  },
  pluginJs.configs.recommended,
];
