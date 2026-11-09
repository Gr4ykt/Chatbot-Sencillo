import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  ...(isProd
    ? {
        // Producción: genera la carpeta out/ que sirve Nginx
        output: "export",
        images: { unoptimized: true },
      }
    : {
        // Desarrollo: /api se redirige al backend local
        async rewrites() {
          return [
            {
              source: "/api/:path*",
              destination: "http://localhost:8000/api/:path*",
            },
          ];
        },
      }),
};

export default nextConfig;