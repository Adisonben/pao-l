/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_MODE: process.env.APP_MODE ?? "prod",
  },
};

export default nextConfig;
