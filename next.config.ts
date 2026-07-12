import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // スマートフォンなど同一Wi-Fi内の端末からLAN IP経由で開発サーバーへアクセスできるようにする
  allowedDevOrigins: ["192.168.2.82"],
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
