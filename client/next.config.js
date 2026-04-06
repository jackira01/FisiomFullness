const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");

const ext = ["jsx", "tsx", "js", "ts"];

/** @type {import('next').NextConfig} */
const nextConfig = (phase, { defaultConfig }) => ({
  ...defaultConfig,
  pageExtensions:
    phase === PHASE_DEVELOPMENT_SERVER
      ? ext.concat(ext.map((item) => "dev." + item))
      : ext,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Reducir el uso de memoria del compilador en desarrollo
  experimental: {
    webpackMemoryOptimizations: true,
  },
});

module.exports = nextConfig;
