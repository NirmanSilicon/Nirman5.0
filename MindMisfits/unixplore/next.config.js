console.log(">>> NEXT CONFIG LOADED <<<");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js you are using src/app as your app directory
  experimental: {
    typedRoutes: true,
  },

  // Enable the /src/app structure
  srcDir: "src",

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
