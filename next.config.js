const VMEDIS_PROXY_URL = process.env.VMEDIS_PROXY_URL

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",

    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: `${VMEDIS_PROXY_URL}/:path*`
            }
        ]
    }
}

module.exports = nextConfig
