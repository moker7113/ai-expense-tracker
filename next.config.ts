import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 開發時允許用區網 IP（例如手機連 http://192.168.x.x:3003）存取，否則前端 JS 會被擋、按鈕沒反應
  allowedDevOrigins: ["192.168.141.214", "192.168.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
