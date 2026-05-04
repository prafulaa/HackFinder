/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'd112y698as59ec.cloudfront.net' },
      { protocol: 'https', hostname: 'devpost.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'utfs.io' }, // UploadThing
    ],
  },
};

export default nextConfig;
