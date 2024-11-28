import reactHooks from "eslint-plugin-react-hooks";
import pandaCss from "@pandacss/eslint-plugin";
import reactRefresh from "eslint-plugin-react-refresh";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import eslint from "@eslint/js";
import tsESLint from "typescript-eslint";

export default tsESLint.config(
  {
    plugins: {
      "react-refresh": reactRefresh,
      "@pandacss": pandaCss,
      "react-hooks": reactHooks,
    },
    rules: {
      ...pandaCss.configs.recommended.rules,
      "@pandacss/file-not-included": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
    },
  },
  eslint.configs.recommended,
  ...tsESLint.configs.recommended,
  prettierRecommended,
  {
    ignores: ["dist/", "styled-system/", "**/*.cjs"],
  }
);
