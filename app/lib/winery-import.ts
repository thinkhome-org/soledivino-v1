import type { Product, Winery } from "./content-types";
import { newId } from "./content-migrate";
import { findWineBySlug, toWineSlug } from "./wine-slug";

export const WINERY_IMPORT_MAX_ITEMS = 100;
export const WINERY_IMPORT_MAX_CHARS = 200_000;
export const WINERY_IMPORT_PLACEHOLDER_TILE = "/hero.png";
export const WINERY_IMPORT_PLACEHOLDER_HERO = "/main-objevte.jpg";

export type WineryImportIssue = {
    index: number;
    name?: string;
    message: string;
};

export type ParseWineryImportResult =
    | { ok: false; error: string }
    | {
          ok: true;
          wineries: Winery[];
          skipped: WineryImportIssue[];
          failed: WineryImportIssue[];
      };

function asText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return "";
}

function optionalText(value: unknown): string | undefined {
    const text = asText(value);
    return text || undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function parseWineSlugs(
    value: unknown,
    products: Product[],
    index: number,
    name: string,
    skipped: WineryImportIssue[],
): string[] {
    if (value === undefined || value === null) {
        return [];
    }

    const raw = Array.isArray(value) ? value : [value];
    const slugs: string[] = [];
    const seen = new Set<string>();

    for (const item of raw) {
        const slug = asText(item);
        if (!slug) continue;

        const wine = findWineBySlug(products, slug);
        if (!wine) {
            skipped.push({
                index,
                name,
                message: `Neznámé víno „${slug}“ — přeskočeno.`,
            });
            continue;
        }

        if (seen.has(wine.slug)) continue;
        seen.add(wine.slug);
        slugs.push(wine.slug);
    }

    return slugs;
}

export function parseWineryImportPayload(
    raw: string,
    existing: Winery[],
    products: Product[],
): ParseWineryImportResult {
    const trimmed = raw.trim();
    if (!trimmed) {
        return { ok: false, error: "Vložte JSON nebo nahrajte soubor." };
    }

    if (trimmed.length > WINERY_IMPORT_MAX_CHARS) {
        return { ok: false, error: "JSON je příliš velký." };
    }

    let parsed: unknown;
    try {
        parsed = JSON.parse(trimmed);
    } catch {
        return { ok: false, error: "JSON se nepodařilo přečíst. Zkontrolujte syntaxi." };
    }

    const records = Array.isArray(parsed) ? parsed : [parsed];
    if (records.length > WINERY_IMPORT_MAX_ITEMS) {
        return { ok: false, error: `Najednou lze importovat nejvýše ${WINERY_IMPORT_MAX_ITEMS} vinařství.` };
    }

    const bySlug = new Map(existing.map((winery) => [winery.slug, winery]));
    const wineries: Winery[] = [...existing];
    const skipped: WineryImportIssue[] = [];
    const failed: WineryImportIssue[] = [];
    const seenInPayload = new Set<string>();

    records.forEach((record, index) => {
        if (!isRecord(record)) {
            failed.push({ index, message: "Záznam musí být objekt." });
            return;
        }

        const name = asText(record.name);
        if (!name) {
            failed.push({ index, message: "Chybí název." });
            return;
        }

        const slug = optionalText(record.slug) ?? toWineSlug(name);
        if (!slug) {
            failed.push({ index, name, message: "Nelze vytvořit slug." });
            return;
        }

        if (seenInPayload.has(slug)) {
            failed.push({ index, name, message: `Slug „${slug}“ je v souboru vícekrát.` });
            return;
        }
        seenInPayload.add(slug);

        const country = asText(record.country);
        const description = asText(record.description);
        if (!country || !description) {
            failed.push({ index, name, message: "Vyplňte zemi a popis." });
            return;
        }

        const wineSlugs = parseWineSlugs(record.wineSlugs, products, index, name, skipped);
        const existingWinery = bySlug.get(slug);
        const winery: Winery = {
            id: existingWinery?.id ?? newId(),
            slug,
            name,
            country,
            description,
            logo: optionalText(record.logo) ?? existingWinery?.logo,
            tileImage:
                optionalText(record.tileImage) ??
                existingWinery?.tileImage ??
                WINERY_IMPORT_PLACEHOLDER_TILE,
            heroImage:
                optionalText(record.heroImage) ??
                existingWinery?.heroImage ??
                WINERY_IMPORT_PLACEHOLDER_HERO,
            wineSlugs,
        };

        if (existingWinery) {
            const position = wineries.findIndex((item) => item.id === existingWinery.id);
            wineries[position] = winery;
            bySlug.set(slug, winery);
            return;
        }

        wineries.push(winery);
        bySlug.set(slug, winery);
    });

    return { ok: true, wineries, skipped, failed };
}

export const WINERY_IMPORT_EXAMPLE = {
    name: "Antinori",
    slug: "antinori",
    country: "Itálie",
    description:
        "Marchesi Antinori patří k nejstarším rodinným vinařstvím na světě. Sídlo má v Toskánsku.",
    tileImage: "/hero.png",
    heroImage: "/main-objevte.jpg",
    wineSlugs: ["barolo-bussia", "amarone", "costadoro-marche-rosso"],
};

export function getWineryImportExampleJson(): string {
    return `${JSON.stringify([WINERY_IMPORT_EXAMPLE], null, 2)}\n`;
}

export function getWineryImportPrompt(): string {
    return `ÚKOL
Z podkladů o vinařstvích vytvoř importní JSON pro katalog Soledivino.

VÝSTUP
- Vrať POUZE validní JSON — nic jiného. Žádný komentář, žádný úvod, žádné markdown plotýnky.
- Kořen je pole objektů: [ { ... }, { ... } ]
- Kódování UTF-8. Soubor pojmenuj wineries-import.json.

POVINNÁ POLE u každého vinařství
- name (string) — název vinařství
- country — země zobrazená na detailu, např. "Itálie"
- description — 2–4 věty česky o vinařství

VOLITELNÁ POLE
- slug — URL část, např. "antinori". Pokud chybí, vytvoří se z názvu.
- logo — URL loga (jinak se na mřížce zobrazí název)
- tileImage — fotka na mřížce
- heroImage — velká fotka na detailu
- wineSlugs — pole slugů existujících vín v katalogu, v pořadí na detailu

JAZYK A TÓN
- Popisy piš česky, klidně a věcně. Nevymýšlej fakta, která v podkladech nejsou.

PŘÍKLAD JEDNOHO ZÁZNAMU
${JSON.stringify(WINERY_IMPORT_EXAMPLE, null, 2)}
`;
}
