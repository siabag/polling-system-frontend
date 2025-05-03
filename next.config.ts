import { env } from "process";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: env.NEXT_PUBLIC_API_URL,
  },
};

export default nextConfig;