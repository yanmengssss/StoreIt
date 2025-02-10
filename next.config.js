/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  // 确保没有禁用默认的 CSS 处理
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "c-ssl.dtstatic.com",
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "dthezntil550i.cloudfront.net",
      },
      {
        protocol: "http",
        hostname: "srd1wyx4f.hn-bkt.clouddn.com",
      },
    ],
  },
};

module.exports = nextConfig;
