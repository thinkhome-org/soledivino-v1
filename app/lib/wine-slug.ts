export function toWineSlug(name: string): string {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function findWineBySlug<T extends { name: string; slug?: string }>(
    wines: T[],
    slug: string,
): T | undefined {
    return wines.find((wine) => wine.slug === slug || toWineSlug(wine.name) === slug);
}
