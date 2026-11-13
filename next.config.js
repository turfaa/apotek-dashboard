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
    reactCompiler: true,
}

module.exports = nextConfig
