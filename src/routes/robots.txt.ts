import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots/txt")({
	loader: () => {
		const baseUrl = "https://textsync.app"; // Replace with your actual domain

		const robotsTxt = `User-agent: *
Allow: /
Disallow: /text-sync/
Disallow: /api/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Block common bot paths that aren't needed
Disallow: /_*
Disallow: /.*
Disallow: /*?*
Disallow: /*.json$
Disallow: /*.xml$
Disallow: /*.txt$

# Allow specific file types
Allow: /favicon.ico
Allow: /robots.txt
Allow: /sitemap.xml
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.svg$
Allow: /*.webp$
Allow: /*.ico$
Allow: /*.woff$
Allow: /*.woff2$
Allow: /*.ttf$
Allow: /*.eot$

# Block sensitive areas
Disallow: /admin/
Disallow: /dashboard/
Disallow: /private/
Disallow: /.env
Disallow: /.git/
Disallow: /node_modules/
Disallow: /src/
Disallow: /dist/
Disallow: /build/`;

		return new Response(robotsTxt, {
			headers: {
				"Content-Type": "text/plain",
				"Cache-Control": "public, max-age=86400", // Cache for 24 hours
			},
		});
	},
});
