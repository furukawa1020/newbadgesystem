import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Hide API routes
        },
        sitemap: 'https://hakusan-quest.pages.dev/sitemap.xml',
    }
}
