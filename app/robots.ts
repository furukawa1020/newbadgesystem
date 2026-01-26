import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Hide API routes from crawlers
        },
        sitemap: 'https://hakusan-badge-quest.dev/sitemap.xml',
    };
}
