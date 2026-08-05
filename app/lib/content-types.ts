import type { CountryId } from "./regions";

export type WineType = "red" | "white" | "rose";

export type ProductionStyle = "traditional" | "modern";

export type NaturalCategory =
    | "classic"
    | "low-intervention"
    | "natural"
    | "biodynamic"
    | "orange";

export type { CountryId };

export type Product = {
    id: string;
    slug: string;
    name: string;
    country: CountryId;
    region: string;
    regione: string;
    type: WineType;
    color: string;
    image: string;
    description: string;
    alcohol: string;
    volume: string;
    vintage: string;
    aroma?: string;
    tasteProfile?: string;
    finish?: string;
    terroir?: string;
    winemaker?: string;
    productionStyle?: ProductionStyle;
    productionStyleNote?: string;
    naturalCategory?: NaturalCategory;
    winemakerPhilosophy?: string;
    emotionalTrace?: string;
    pairing?: string;
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

export const PRODUCTION_STYLE_LABELS: Record<ProductionStyle, string> = {
    traditional: "Tradiční",
    modern: "Moderní",
};

export const NATURAL_CATEGORY_LABELS: Record<NaturalCategory, string> = {
    classic: "Klasické",
    "low-intervention": "Nízká intervence",
    natural: "Naturál",
    biodynamic: "Biodynamické",
    orange: "Orange / macerované",
};
