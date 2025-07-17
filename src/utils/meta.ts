import { ENV, SEO, WEBSITE } from "@/lib/constants";
import type { Metadata } from "next";

interface MetadataProps {
    title?: string;
    description?: string;
    og_title?: string;
    og_description?: string;
    og_type?: "website" | "article" | "book" | "profile" | "music.song" | "music.album" | "music.playlist" | "music.radio_station" | "video.movie" | "video.episode" | "video.tv_show" | "video.other" | undefined;
    og_url?: string;
    og_image?: string;
    tw_title?: string;
    tw_description?: string;
    tw_image?: string;
    canonical?: string;
    robots?: boolean;
    google_site_verification?: string;
}

export const createMetadata = (metadata: MetadataProps = { og_type: "website" }): Metadata => {
    const isIndexable = metadata.robots ?? SEO.INDEXABLE_DOMAINS.some((domain) =>
        ENV.FULL_DOMAIN_URL.includes(domain)
    );
    return {
        title: metadata.title ?? WEBSITE.NAME,
        description: metadata.description ?? WEBSITE.DEFAULT_DESCRIPTION,

        alternates: {
            canonical: metadata.canonical ?? `${ENV.FULL_DOMAIN_URL}/`,
        },

        robots: {
            index: isIndexable,
            follow: isIndexable,
            googleBot: {
                index: isIndexable,
                follow: isIndexable,
                "max-snippet": -1,
                "max-image-preview": "large",
                "max-video-preview": -1,
            },
        },
        openGraph: {
            title: metadata.og_title ?? metadata.title ?? WEBSITE.NAME,
            description: metadata.og_description ?? metadata.description ?? WEBSITE.DEFAULT_DESCRIPTION,
            type: metadata.og_type ?? "website",
            url: metadata.og_url ?? `${ENV.FULL_DOMAIN_URL}/`,
            siteName: "Branded by Bombay DC",
            images: [
                {
                    url: metadata.og_image ?? WEBSITE.DEFAULT_IMAGE,
                    width: 1200,
                    height: 630,
                    alt: "Branded by Bombay DC Logo",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: metadata.tw_title ?? metadata.title ?? WEBSITE.NAME,
            description: metadata.tw_description ?? metadata.description ?? WEBSITE.DEFAULT_DESCRIPTION,
            images: [metadata.tw_image ?? metadata.og_image ?? WEBSITE.DEFAULT_IMAGE],
        },

        verification: {
            google: metadata.google_site_verification ?? "",
        },

        icons: [
            ...[57, 72, 76, 114, 120, 144, 152, 180].map((size) => ({
                rel: "apple-touch-icon",
                type: "image/png",
                sizes: `${size}x${size}`,
                url: `${ENV.BASE_PATH}/assets/shared/meta/apple-icons/${size}x${size}.png`,
            })),
            ...[16, 24, 32, 48, 64, 128, 256].map((size) => ({
                rel: "icon",
                sizes: `${size}x${size}`,
                type: "image/x-icon",
                url: `${ENV.BASE_PATH}/assets/shared/meta/favicons/${size}x${size}.ico`,
            })),
        ],
    };
};
