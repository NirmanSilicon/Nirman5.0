/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the port for development server
  // This will be used when running `npm run dev`
  // Note: You can also set it via command: PORT=3001 npm run dev
  
  // Fix the lockfile warning by setting the workspace root
  outputFileTracingRoot: require('path').join(__dirname),
};

module.exports = nextConfig;

