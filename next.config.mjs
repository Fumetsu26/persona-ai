/** @type {import('next').NextConfig} */
const nextConfig = { images: {
    domains: [
      "avatars.githubusercontent.com", // GitHub avatars
      "pbs.twimg.com",                  // Twitter avatars (optional, remove if not needed)
      // Add any other remote avatar hosts you use
    ],
  },};

export default nextConfig;
