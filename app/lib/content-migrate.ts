import productsJson from "@/app/data/products-wines.json";
import winesJson from "@/app/data/wines.json";
import featuredJson from "@/app/data/nas-vyber-wines.json";
import contactJson from "@/app/data/contact.json";
import type { CarouselItem, Contact, FeaturedItem, Product, WineType } from "./content-types";
import { toWineSlug } from "./wine-slug";

type LegacyProduct = {
    name: string;
    region: string;
    regione: string;
    color: string;
    image: string;
    description: string;
};

type LegacyCarousel = {
    name: string;
    description: string;
    color: string;
    image: string;
    productName: string;
};

type LegacyFeatured = {
    name: string;
    description: string;
    image: string;
};

export function inferWineType(name: string): WineType {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("rosato")) {
        return "rose";
    }

    if (
        lowerName.includes("soave") ||
        lowerName.includes("falanghina") ||
        lowerName.includes("vermentino") ||
        lowerName.includes("greco") ||
        lowerName.includes("lugana")
    ) {
        return "white";
    }

    return "red";
}

function stableId(prefix: string, key: string): string {
    return `${prefix}-${toWineSlug(key)}`;
}

export function defaultProducts(): Product[] {
    return (productsJson as LegacyProduct[]).map((wine) => ({
        id: stableId("product", wine.name),
        slug: toWineSlug(wine.name),
        name: wine.name,
        region: wine.region,
        regione: wine.regione,
        type: inferWineType(wine.name),
        color: wine.color,
        image: wine.image,
        description: wine.description,
        alcohol: "xx%",
        volume: "0.75l",
        vintage: "2020",
    }));
}

export function defaultCarousel(): CarouselItem[] {
    return (winesJson as LegacyCarousel[]).map((wine) => ({
        id: stableId("carousel", wine.name),
        name: wine.name,
        description: wine.description,
        color: wine.color,
        image: wine.image,
        productSlug: toWineSlug(wine.productName),
    }));
}

export function defaultFeatured(): FeaturedItem[] {
    return (featuredJson as LegacyFeatured[]).map((wine) => ({
        id: stableId("featured", wine.name),
        name: wine.name,
        description: wine.description,
        image: wine.image,
        productSlug: toWineSlug(wine.name),
    }));
}

export function defaultContact(): Contact {
    return contactJson as Contact;
}

export function newId(): string {
    return crypto.randomUUID();
}
