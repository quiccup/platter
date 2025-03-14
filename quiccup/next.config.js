/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 