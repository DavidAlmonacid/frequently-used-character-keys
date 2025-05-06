const js = require("@eslint/js");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const { defineConfig, globalIgnores } = require("eslint/config");
const globals = require("globals");

module.exports = defineConfig([
  globalIgnores(["package-lock.json"]),
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"]
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } }
  },
  eslintPluginPrettierRecommended
]);
