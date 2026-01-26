import { MetadataRoute } from 'next';
import { TOWNS } from '@/lib/towns';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://hakusan-badge-quest.dev';

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/profile`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
    ];

    // Dynamic pages (Badges)
    const badgePages = TOWNS.map((town) => ({
        url: `${baseUrl}/claim/${town.id}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
    }));

    return [...staticPages, ...badgePages];
}
