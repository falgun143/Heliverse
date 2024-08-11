/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
      return [
        {
          source: '/api/:path*', // Matches all API routes
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, no-cache, must-revalidate, proxy-revalidate',
            },
            {
              key: 'Expires',
              value: '0',
            },
            {
              key: 'Pragma',
              value: 'no-cache',
            },
            {
              key: 'Surrogate-Control',
              value: 'no-store',
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  