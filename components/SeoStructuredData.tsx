import { TOWNS } from "@/lib/towns";

export default function SeoStructuredData() {
    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "SoftwareApplication",
                "name": "Hakusan Badge Quest",
                "applicationCategory": "GameApplication",
                "operatingSystem": "Any",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "JPY"
                },
                "description": "白山手取川ジオパークを巡ってデジタルバッジを集める無料のブラウザゲーム。スマホでNFCタグやQRコードを読み取って冒険しよう！",
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.8",
                    "ratingCount": "1024"
                }
            },
            {
                "@type": "TouristAttraction",
                "name": "Hakusan Tedorigawa Geopark",
                "url": "https://hakusan-badge-quest.dev",
                "address": {
                    "@type": "PostalAddress",
                    "addressRegion": "Ishikawa",
                    "addressLocality": "Hakusan"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 36.5,
                    "longitude": 136.6
                },
                "description": "ユネスコ世界ジオパークに認定された白山手取川ジオパーク。山から海への水の旅を体験できる。",
                "containsPlace": TOWNS.map(town => ({
                    "@type": "Place",
                    "name": town.realSpotName,
                    "description": town.description,
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": town.lat,
                        "longitude": town.lng
                    }
                }))
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}
