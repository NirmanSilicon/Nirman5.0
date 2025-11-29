/** @type {import('next').NextConfig} */
const nextConfig = {
    // basePath: '/hack',
    images: {
        unoptimized: true,
    },
    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,
    trailingSlash: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
}

module.exports = nextConfig
