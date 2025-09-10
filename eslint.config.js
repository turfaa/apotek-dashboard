import typeScriptEsLintPlugin from '@typescript-eslint/eslint-plugin';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Translate ESLintRC-style configs into flat configs.
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: typeScriptEsLintPlugin.configs['recommended'],
});

export default [
    ...compat.config({
        extends: ["next/core-web-vitals"],
        rules: {
            semi: ["error", "never"],
            indent: ["error", 4],
            },
        ignorePatterns: ["components/ui/*.tsx"],
    }),
];
