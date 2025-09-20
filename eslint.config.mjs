import { defineConfig, globalIgnores } from "eslint/config"
import path from "node:path"
import { fileURLToPath } from "node:url"
import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import stylistic from "@stylistic/eslint-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

export default defineConfig([globalIgnores(["components/ui/*.tsx"]), {
    extends: compat.extends("next/core-web-vitals", "next/typescript"),
    
    plugins: {
        "@stylistic":stylistic,
    },

    rules: {
        "@stylistic/semi": ["error", "never"],
        "@stylistic/indent": ["error", 4],
    },
}])