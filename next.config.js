/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ],
  },
};

module.exports = nextConfig;
