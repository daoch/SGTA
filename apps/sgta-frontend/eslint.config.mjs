import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript", "prettier"],
    rules: {
      semi: ["error"],
      quotes: ["error", "double"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_", // Esto ignorará las variables cuyo nombre empiece con un guion bajo
        },
      ],
    },
  }),

  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/build/**"],
  },
];

export default eslintConfig;
