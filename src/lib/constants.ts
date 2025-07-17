export const WEBSITE = {
    NAME: "Branded by Bombay DC",
    DOMAIN: "https://wearebranded.in",
    DEFAULT_TITLE: "Branded by Bombay DC - Brand Design for a New India",
    DEFAULT_DESCRIPTION:
        "Explore how the Branded A Bombay DC company crafts future-forward brand identities for modern India. See our process, strategy, and design thinking in action.",
    DEFAULT_IMAGE: "/assets/shared/meta/share/branded-logo.jpg",
};

export const ENV = {
    FULL_DOMAIN_URL: process.env.NEXT_PUBLIC_FULL_PATH?.replace(/\/$/, "") ?? '',
    BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
};

export const SEO = {
    INDEXABLE_DOMAINS: ["wearebranded.in"],
};
