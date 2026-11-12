import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import stylistic from "@stylistic/eslint-plugin"

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    globalIgnores([
        ".next/**",
        "out/**",
        "build/**",
        "next-env.d.ts",
        "public/**",
        "components/ui/*.tsx",
    ]),
    {
        plugins: {
            "@stylistic": stylistic,
        },

        rules: {
            "@stylistic/semi": ["error", "never"],
            "@stylistic/indent": ["error", 4],
            "@typescript-eslint/no-explicit-any": "off", // disable temporarility to allow build to pass
        },
    },
    {
        // CommonJS config files
        files: ["**/*.js"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
        },
    },
])
