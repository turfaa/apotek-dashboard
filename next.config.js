const withPWA = require("next-pwa")({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**.googleusercontent.com",
            },
        ],
    },
    experimental: {
        // ppr: true,
        // dynamicIO: true,
    },
    // Empty turbopack config to silence webpack config warning
    turbopack: {},
}

module.exports = withPWA(nextConfig)
