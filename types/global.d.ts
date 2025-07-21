interface BlogItem {
    type: string;
    slug: string;
    title: string;
    type: string;
    publishedAt: string;
    publisher: string;
    shortDesc: string;
    linkdetails: string;
    link: string;
    target: string;
    image: string;
    label: string;
    isExternal: boolean;
    desktopimage: {
        url: string;
    }; 
    mobileImage: {
        url: string;
    }; 
}

interface MediaItem { 
    publisher: string;
    title: string;
    publishedAt: string; 
    Datetime: string; 
    link: string;
    label: string;
    image: string;
    target: string;
    isExternal: boolean;
    desktopImage: {
        url: string;
    }; 
    mobileImage: {
        url: string;
    }; 
} 

interface SeoPropTypes{
    metaTitle: string;
    metaDescription: string;
    keywords: string; 
}

interface MenuLink { 
    title: string; 
    link: string;
    target: string; 
}

interface SocialItem {
    id: number;
    buttonText: string;
    buttonLink: string;
    buttonType: string;
    buttonIcon: {url:string};
}