const withMDX = require("@next/mdx")();
import { withPlausibleProxy } from 'next-plausible';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure `pageExtensions` to include MDX files
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  reactStrictMode: false,
  // Optionally, add any other Next.js config below
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*-hack-club-bot.vercel.app",
        port: "",
      },
    ],
  },
};

export default withPlausibleProxy()({
  ...nextConfig
});
