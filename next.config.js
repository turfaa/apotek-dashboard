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
        ppr: true,
    },
}

module.exports = nextConfig
