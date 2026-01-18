import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    ...(process.env.NODE_ENV === 'development' ? {dangerouslyAllowSVG: true} : {}),
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default nextConfig;
