import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Hakusan Badge Quest',
        short_name: 'Hakusan Quest',
        description: 'Collect digital badges in the Hakusan Tedorigawa Geopark',
        start_url: '/',
        display: 'standalone',
        background_color: '#1a1a2e',
        theme_color: '#1a1a2e',
        icons: [
            {
                src: '/assets/badges/processed_icon_sample.png',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/assets/badges/processed_icon_sample.png',
                sizes: '512x512',
                type: 'image/png',
            }
        ],
    };
}
