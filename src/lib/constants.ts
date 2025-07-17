export const WEBSITE = {
    NAME: "HOME - Viceroy Properties",
    DOMAIN: "https://www.viceroyproperties.in/",
    DEFAULT_TITLE: "Viceroy Properties - Think different, build different.",
    DEFAULT_DESCRIPTION:
        "Viceroy Properties - Think different, build different.",
    DEFAULT_IMAGE: "/assets/shared/meta/share/0.jpg",
};

export const ENV = {
    FULL_DOMAIN_URL: process.env.NEXT_PUBLIC_FULL_PATH?.replace(/\/$/, "") ?? '',
    BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

export const SEO = {
    INDEXABLE_DOMAINS: ["viceroyproperties.in"],
};
