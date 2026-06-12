/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  async headers() {
    return [
      {
        // Sensible security headers on every response.
        source: '/:path*',
        headers: [
          // Stop the site being framed by other domains (clickjacking).
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Stop browsers MIME-sniffing responses into the wrong type.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Don't leak full URLs to third parties in the Referer header.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Force HTTPS for two years (Vercel already serves HTTPS only).
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // We don't use these device APIs — deny them.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
