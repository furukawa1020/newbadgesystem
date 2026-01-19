import { MetadataRoute } from 'next'
import { TOWNS } from '@/lib/towns'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://hakusan-quest.pages.dev'

    // Static routes
    const routes = [
        '',
        '/profile',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }))

    // Dynamic routes (Claims)
    const claimRoutes = TOWNS.map((town) => ({
        url: `${baseUrl}/claim/${town.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    return [...routes, ...claimRoutes]
}
