/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	reactStrictMode: true,

	env: {
		APP_VERSION: process.env.npm_package_version || 'dev',
	},

	// Control stale-while-revalidate window for ISR cache-control headers.
	expireTime: 60 * 60,

	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'via.placeholder.com',
				pathname: '/**',
			},
		],
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60 * 60 * 24,
		qualities: [75, 80, 85],
	},

	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-Content-Type-Options',
						value: 'nosniff',
					},
					{
						key: 'X-Frame-Options',
						value: 'DENY',
					},
					{
						key: 'Referrer-Policy',
						value: 'strict-origin-when-cross-origin',
					},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
					},
					{
						key: 'Content-Security-Policy',
						value: [
							"default-src 'self'",
							"script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com https://va.vercel-scripts.com",
							"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
							"font-src 'self' https://fonts.gstatic.com data:",
							"img-src 'self' data: https: blob:",
							"connect-src 'self' https://res.cloudinary.com https://api.scalekit.com https://va.vercel-scripts.com",
							"frame-ancestors 'none'",
							"base-uri 'self'",
							"form-action 'self' https://formspree.io",
						].join('; '),
					},
				],
			},
			// Note: Avoid setting Cache-Control for '/_next/static' to preserve Next dev behavior
			{
				source: '/assets/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=31536000, immutable',
					},
				],
			},
			{
				source: '/api/auth/:path*',
				headers: [
					{
						key: 'Cache-Control',
						value: 'private, no-store, max-age=0, must-revalidate',
					},
				],
			},
		];
	},
};

export default nextConfig;