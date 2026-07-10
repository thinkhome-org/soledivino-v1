export type WineType = "red" | "white" | "rose";

export type Product = {
    id: string;
    slug: string;
    name: string;
    region: string;
    regione: string;
    type: WineType;
    color: string;
    image: string;
    description: string;
    alcohol: string;
    volume: string;
    vintage: string;
};

export type CarouselItem = {
    id: string;
    name: string;
    description: string;
    color: string;
    image: string;
    productSlug: string;
};

export type FeaturedItem = {
    id: string;
    name: string;
    description: string;
    image: string;
    productSlug: string;
};

export type Contact = {
    name: string;
    email: string;
    phone: string;
    address: string;
    ico: string;
};

export type InquirySettings = {
    enabled: boolean;
    recipientEmail: string;
    subject: string;
    successMessage: string;
    disabledMessage: string;
};

export const WINE_TYPE_LABELS: Record<WineType, string> = {
    red: "Červené víno",
    white: "Bílé víno",
    rose: "Růžové víno",
};
