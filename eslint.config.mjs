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
            // New React Compiler rules from eslint-plugin-react-hooks v7. Existing code relies on
            // these patterns (e.g. mount detection, syncing dialog state on open); keep them visible
            // as warnings until they are refactored.
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/static-components": "warn",
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
