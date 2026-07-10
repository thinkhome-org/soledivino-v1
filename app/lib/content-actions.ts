"use server";

import { revalidateTag } from "next/cache";
import type { CarouselItem, Contact, FeaturedItem, InquirySettings, Product } from "./content-types";
import {
    writeCarousel,
    writeContact,
    writeFeatured,
    writeInquirySettings,
    writeProducts,
} from "./content";

function revalidateContent() {
    revalidateTag("content", "max");
}

export async function saveProducts(products: Product[]) {
    await writeProducts(products);
    revalidateContent();
}

export async function saveCarousel(items: CarouselItem[]) {
    await writeCarousel(items);
    revalidateContent();
}

export async function saveFeatured(items: FeaturedItem[]) {
    await writeFeatured(items);
    revalidateContent();
}

export async function saveContact(contact: Contact) {
    await writeContact(contact);
    revalidateContent();
}

export async function saveInquirySettings(settings: InquirySettings) {
    await writeInquirySettings(settings);
    revalidateContent();
}
