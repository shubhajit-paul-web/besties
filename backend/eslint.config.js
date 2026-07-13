import js from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**"],
    },

    js.configs.recommended,

    ...tseslint.config({
        files: ["**/*.ts"],

        extends: [...tseslint.configs.recommendedTypeChecked],

        languageOptions: {
            globals: globals.node,

            parserOptions: {
                // projectService: true,
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },

        rules: {
            "no-console": "warn",

            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                },
            ],
        },
    }),

    eslintConfigPrettier,
];
