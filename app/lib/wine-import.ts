import type {
    NaturalCategory,
    Product,
    ProductionStyle,
    WineType,
} from "./content-types";
import type { CountryId } from "./regions";
import { COUNTRY_DEFINITIONS, COUNTRY_LABELS, COUNTRY_ORDER } from "./regions";
import { toWineSlug } from "./wine-slug";

export const WINE_IMPORT_PLACEHOLDER_IMAGE = "/placeholder-wine.png";
export const WINE_IMPORT_MAX_ITEMS = 300;
export const WINE_IMPORT_MAX_CHARS = 500_000;

const TYPE_COLORS: Record<WineType, string> = {
    red: "#8B2D3D",
    white: "#A18136",
    rose: "#BF8993",
};

const PRODUCTION_STYLES = new Set<ProductionStyle>(["traditional", "modern"]);
const NATURAL_CATEGORIES = new Set<NaturalCategory>([
    "classic",
    "low-intervention",
    "natural",
    "biodynamic",
    "orange",
]);

export type WineImportIssue = {
    index: number;
    name?: string;
    message: string;
};

export type ParseWineImportResult =
    | { ok: false; error: string }
    | {
          ok: true;
          wines: Product[];
          skipped: WineImportIssue[];
          failed: WineImportIssue[];
      };

function normalizeKey(value: string): string {
    return value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "");
}

function asText(value: unknown): string {
    if (typeof value === "string") return value.trim();
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return "";
}

function optionalText(value: unknown): string | undefined {
    const text = asText(value);
    return text || undefined;
}

const COUNTRY_ALIASES: Record<string, CountryId> = {};

function addCountryAlias(alias: string, country: CountryId) {
    COUNTRY_ALIASES[normalizeKey(alias)] = country;
}

for (const id of COUNTRY_ORDER) {
    addCountryAlias(id, id);
    addCountryAlias(COUNTRY_LABELS[id], id);
}

addCountryAlias("italia", "italy");
addCountryAlias("italien", "italy");
addCountryAlias("it", "italy");
addCountryAlias("deutschland", "germany");
addCountryAlias("de", "germany");
addCountryAlias("german", "germany");
addCountryAlias("osterreich", "austria");
addCountryAlias("oesterreich", "austria");
addCountryAlias("at", "austria");
addCountryAlias("frankreich", "france");
addCountryAlias("francia", "france");
addCountryAlias("fr", "france");

const REGION_INDEX: Record<CountryId, Map<string, string>> = {
    italy: new Map(),
    germany: new Map(),
    austria: new Map(),
    france: new Map(),
};

function addRegionAlias(country: CountryId, alias: string, canonical: string) {
    REGION_INDEX[country].set(normalizeKey(alias), canonical);
}

for (const country of COUNTRY_ORDER) {
    for (const region of COUNTRY_DEFINITIONS[country].regions) {
        addRegionAlias(country, region, region);
    }
}

const REGION_ALIASES: Record<CountryId, [string, string][]> = {
    italy: [
        ["piedmont", "Piemonte"],
        ["piemont", "Piemonte"],
        ["langhe", "Piemonte"],
        ["barolo", "Piemonte"],
        ["barbaresco", "Piemonte"],
        ["roero", "Piemonte"],
        ["aosta", "Valle d'Aosta"],
        ["valledaosta", "Valle d'Aosta"],
        ["valdosta", "Valle d'Aosta"],
        ["lombardy", "Lombardia"],
        ["lombardie", "Lombardia"],
        ["franciacorta", "Lombardia"],
        ["valtellina", "Lombardia"],
        ["trentino", "Trentino-Alto Adige"],
        ["altoadige", "Trentino-Alto Adige"],
        ["sudtirol", "Trentino-Alto Adige"],
        ["southtyrol", "Trentino-Alto Adige"],
        ["benatsko", "Veneto"],
        ["valpolicella", "Veneto"],
        ["amarone", "Veneto"],
        ["soave", "Veneto"],
        ["prosecco", "Veneto"],
        ["friuli", "Friuli-Venezia Giulia"],
        ["friuliveneziagiulia", "Friuli-Venezia Giulia"],
        ["emilia", "Emilia-Romagna"],
        ["emiliaromagna", "Emilia-Romagna"],
        ["tuscany", "Toscana"],
        ["toskansko", "Toscana"],
        ["chianti", "Toscana"],
        ["montalcino", "Toscana"],
        ["brunello", "Toscana"],
        ["bolgheri", "Toscana"],
        ["latium", "Lazio"],
        ["abruzzi", "Abruzzo"],
        ["apulia", "Puglia"],
        ["apulie", "Puglia"],
        ["salento", "Puglia"],
        ["manduria", "Puglia"],
        ["kampanie", "Campania"],
        ["irpinia", "Campania"],
        ["tufo", "Campania"],
        ["taurasi", "Campania"],
        ["sicily", "Sicilia"],
        ["sicilie", "Sicilia"],
        ["etna", "Sicilia"],
        ["sardinia", "Sardegna"],
        ["sardinie", "Sardegna"],
    ],
    germany: [
        ["mosel", "Rheinland-Pfalz"],
        ["pfalz", "Rheinland-Pfalz"],
        ["palatinate", "Rheinland-Pfalz"],
        ["rheinhessen", "Rheinland-Pfalz"],
        ["nahe", "Rheinland-Pfalz"],
        ["ahr", "Rheinland-Pfalz"],
        ["rheingau", "Hessen"],
        ["franken", "Bayern"],
        ["franconia", "Bayern"],
        ["bavaria", "Bayern"],
        ["baden", "Baden-Württemberg"],
        ["wurttemberg", "Baden-Württemberg"],
        ["saaleunstrut", "Sachsen-Anhalt"],
        ["saxony", "Sachsen"],
    ],
    austria: [
        ["vienna", "Wien"],
        ["videň", "Wien"],
        ["styria", "Steiermark"],
        ["styrsko", "Steiermark"],
        ["wachau", "Niederösterreich"],
        ["kamptal", "Niederösterreich"],
        ["kremstal", "Niederösterreich"],
        ["weinviertel", "Niederösterreich"],
        ["carinthia", "Kärnten"],
        ["tyrol", "Tirol"],
        ["tyrolsko", "Tirol"],
    ],
    france: [
        ["provence", "Provence-Alpes-Côte d'Azur"],
        ["paca", "Provence-Alpes-Côte d'Azur"],
        ["cotedazur", "Provence-Alpes-Côte d'Azur"],
        ["bandol", "Provence-Alpes-Côte d'Azur"],
        ["bordeaux", "Nouvelle-Aquitaine"],
        ["rhone", "Auvergne-Rhône-Alpes"],
        ["rhonealpes", "Auvergne-Rhône-Alpes"],
        ["cotesdurhone", "Auvergne-Rhône-Alpes"],
        ["burgundy", "Bourgogne-Franche-Comté"],
        ["bourgogne", "Bourgogne-Franche-Comté"],
        ["beaune", "Bourgogne-Franche-Comté"],
        ["chablis", "Bourgogne-Franche-Comté"],
        ["beaujolais", "Auvergne-Rhône-Alpes"],
        ["champagne", "Grand Est"],
        ["alsace", "Grand Est"],
        ["languedoc", "Occitanie"],
        ["roussillon", "Occitanie"],
        ["loire", "Centre-Val de Loire"],
        ["sancerre", "Centre-Val de Loire"],
        ["corsica", "Corse"],
        ["korsika", "Corse"],
        ["iledefrance", "Île-de-France"],
    ],
};

for (const country of COUNTRY_ORDER) {
    for (const [alias, canonical] of REGION_ALIASES[country]) {
        if (!REGION_INDEX[country].has(normalizeKey(alias))) {
            addRegionAlias(country, alias, canonical);
        }
    }
}

function resolveCountry(value: unknown): CountryId | null {
    const key = normalizeKey(asText(value));
    return key ? (COUNTRY_ALIASES[key] ?? null) : null;
}

function resolveRegion(country: CountryId, value: unknown): string | null {
    const key = normalizeKey(asText(value));
    if (!key) return null;
    return REGION_INDEX[country].get(key) ?? null;
}

function inferCountryFromRegion(value: unknown): CountryId | null {
    const key = normalizeKey(asText(value));
    if (!key) return null;

    const matches: CountryId[] = [];
    for (const country of COUNTRY_ORDER) {
        if (REGION_INDEX[country].has(key)) {
            matches.push(country);
        }
    }

    return matches.length === 1 ? matches[0] : null;
}

function resolveType(value: unknown, name: string): WineType | null {
    const key = normalizeKey(asText(value));
    if (!key) {
        return inferTypeFromName(name);
    }

    if (["red", "cervene", "cervenavino", "rosso", "rouge", "rot", "tinto"].includes(key)) {
        return "red";
    }
    if (["white", "bile", "bilevino", "bianco", "blanc", "weiss", "whitewine"].includes(key)) {
        return "white";
    }
    if (["rose", "ruzove", "ruzovevino", "rosato", "rosé", "pink"].includes(key)) {
        return "rose";
    }

    return null;
}

function inferTypeFromName(name: string): WineType | null {
    const lower = name.toLowerCase();
    if (lower.includes("rosato") || lower.includes("rosé") || lower.includes("rose")) {
        return "rose";
    }
    if (
        lower.includes("soave") ||
        lower.includes("falanghina") ||
        lower.includes("vermentino") ||
        lower.includes("greco") ||
        lower.includes("lugana") ||
        lower.includes("chardonnay") ||
        lower.includes("riesling") ||
        lower.includes("gruner") ||
        lower.includes("grüner") ||
        lower.includes("sauvignon")
    ) {
        return "white";
    }
    return null;
}

function resolveProductionStyle(value: unknown): ProductionStyle | undefined {
    const key = normalizeKey(asText(value));
    if (!key) return undefined;
    if (["traditional", "tradicni", "classico", "classic"].includes(key)) return "traditional";
    if (["modern", "moderni"].includes(key)) return "modern";
    return PRODUCTION_STYLES.has(key as ProductionStyle) ? (key as ProductionStyle) : undefined;
}

function resolveNaturalCategory(value: unknown): NaturalCategory | undefined {
    const key = normalizeKey(asText(value));
    if (!key) return undefined;
    if (["classic", "klasicke", "konvencni"].includes(key)) return "classic";
    if (
        ["lowintervention", "nizkaintervence", "minimalintervention", "minimaleintervento"].includes(
            key,
        )
    ) {
        return "low-intervention";
    }
    if (["natural", "naturalni", "naturale"].includes(key)) return "natural";
    if (["biodynamic", "biodynamicke", "biodinamico"].includes(key)) return "biodynamic";
    if (["orange", "macerovane", "amber", "skincontact"].includes(key)) return "orange";
    return NATURAL_CATEGORIES.has(key as NaturalCategory) ? (key as NaturalCategory) : undefined;
}

function resolveColor(value: unknown, type: WineType): string {
    const text = asText(value);
    if (/^#[0-9a-fA-F]{6}$/.test(text)) return text;
    return TYPE_COLORS[type];
}

function extractJson(raw: string): string {
    const trimmed = raw.trim().replace(/^\uFEFF/, "");
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    const body = (fenced ? fenced[1] : trimmed).trim();

    const startArr = body.indexOf("[");
    const startObj = body.indexOf("{");

    if (startArr === -1 && startObj === -1) {
        return body;
    }

    if (startArr !== -1 && (startObj === -1 || startArr < startObj)) {
        const end = body.lastIndexOf("]");
        return end > startArr ? body.slice(startArr, end + 1) : body;
    }

    const end = body.lastIndexOf("}");
    return end > startObj ? body.slice(startObj, end + 1) : body;
}

function asWineList(data: unknown): unknown[] | null {
    if (Array.isArray(data)) return data;
    if (data && typeof data === "object") {
        const record = data as Record<string, unknown>;
        if (Array.isArray(record.wines)) return record.wines;
        if (typeof record.name === "string") return [data];
    }
    return null;
}

function allowedRegionsHint(country: CountryId): string {
    return COUNTRY_DEFINITIONS[country].regions.join(", ");
}

export function parseWineImportPayload(raw: string, existing: Product[]): ParseWineImportResult {
    if (!raw.trim()) {
        return { ok: false, error: "Vložte JSON nebo nahrajte soubor." };
    }

    if (raw.length > WINE_IMPORT_MAX_CHARS) {
        return { ok: false, error: "Soubor je příliš velký." };
    }

    let data: unknown;
    try {
        data = JSON.parse(extractJson(raw));
    } catch {
        return { ok: false, error: "JSON se nepodařilo přečíst. Zkontrolujte čárky a uvozovky." };
    }

    const items = asWineList(data);
    if (!items) {
        return {
            ok: false,
            error: "Očekává se pole vín, nebo objekt s klíčem \"wines\".",
        };
    }

    if (items.length === 0) {
        return { ok: false, error: "Soubor neobsahuje žádné víno." };
    }

    if (items.length > WINE_IMPORT_MAX_ITEMS) {
        return {
            ok: false,
            error: `Najednou lze importovat nejvýše ${WINE_IMPORT_MAX_ITEMS} vín.`,
        };
    }

    const existingSlugs = new Set(existing.map((wine) => wine.slug || toWineSlug(wine.name)));
    const seenSlugs = new Set<string>();
    const wines: Product[] = [];
    const skipped: WineImportIssue[] = [];
    const failed: WineImportIssue[] = [];

    items.forEach((item, index) => {
        const record = item && typeof item === "object" ? (item as Record<string, unknown>) : null;
        const name = asText(record?.name);

        if (!record || !name) {
            failed.push({ index, message: "Chybí název vína (name)." });
            return;
        }

        const description = asText(record.description);
        if (!description) {
            failed.push({ index, name, message: "Chybí popis (description)." });
            return;
        }

        const country =
            resolveCountry(record.country) ?? inferCountryFromRegion(record.regione);
        if (!country) {
            failed.push({
                index,
                name,
                message: "Neznámá země (country). Použijte italy, germany, austria nebo france.",
            });
            return;
        }

        const regione = resolveRegion(country, record.regione);
        if (!regione) {
            failed.push({
                index,
                name,
                message: `Neznámý region (regione) pro ${COUNTRY_LABELS[country]}. Povolené: ${allowedRegionsHint(country)}.`,
            });
            return;
        }

        const type = resolveType(record.type, name);
        if (!type) {
            failed.push({
                index,
                name,
                message: "Neznámý typ (type). Použijte red, white nebo rose.",
            });
            return;
        }

        const slug = toWineSlug(name);
        if (!slug) {
            failed.push({ index, name, message: "Z názvu nelze vytvořit odkaz (slug)." });
            return;
        }

        if (existingSlugs.has(slug) || seenSlugs.has(slug)) {
            skipped.push({
                index,
                name,
                message: existingSlugs.has(slug)
                    ? "Víno se stejným názvem už v katalogu je."
                    : "Duplicitní název v importním souboru.",
            });
            return;
        }

        seenSlugs.add(slug);

        const region =
            optionalText(record.region) ?? COUNTRY_LABELS[country];

        wines.push({
            id: crypto.randomUUID(),
            slug,
            name,
            country,
            region,
            regione,
            type,
            color: resolveColor(record.color, type),
            image: WINE_IMPORT_PLACEHOLDER_IMAGE,
            description,
            alcohol: optionalText(record.alcohol) ?? "xx%",
            volume: optionalText(record.volume) ?? "0.75l",
            vintage: optionalText(record.vintage) ?? "2020",
            aroma: optionalText(record.aroma),
            tasteProfile: optionalText(record.tasteProfile),
            finish: optionalText(record.finish),
            terroir: optionalText(record.terroir),
            winemaker: optionalText(record.winemaker),
            productionStyle: resolveProductionStyle(record.productionStyle),
            productionStyleNote: optionalText(record.productionStyleNote),
            naturalCategory: resolveNaturalCategory(record.naturalCategory),
            winemakerPhilosophy: optionalText(record.winemakerPhilosophy),
            emotionalTrace: optionalText(record.emotionalTrace),
            pairing: optionalText(record.pairing),
        });
    });

    return { ok: true, wines, skipped, failed };
}

export const WINE_IMPORT_EXAMPLE = {
    name: "Barolo Bussia",
    country: "italy",
    regione: "Piemonte",
    type: "red",
    alcohol: "14%",
    volume: "0.75l",
    vintage: "2019",
    description:
        "Robustní a harmonické Barolo s jasnou minerálností a hlubokými tóny červeného ovoce.",
    aroma: "Třešně, fialky, růže a jemný kouř s nádechem tabáku.",
    tasteProfile: "Plné, strukturované tělo s jemnými tříslovinami a minerální páteří.",
    finish: "Dlouhý, vyvážený závěr s přetrvávající mineralitou.",
    terroir: "Vinice Bussia v srdci Barola — jílovito-vápencové půdy a chladnější mikroklima.",
    winemaker:
        "Rodinné vinařství pečující o historické parcely v Bussii, s důrazem na Nebbiolo.",
    winemakerPhilosophy:
        "Méně je více: respekt k ročníku, ruční sklizeň a víno, které má čas ukázat charakter místa.",
    productionStyle: "traditional",
    productionStyleNote: "Klasická fermentace, dlouhá macerace a zrání ve velkých dubových sudech.",
    naturalCategory: "low-intervention",
    pairing: "Hovězí ragú, houbové risotto, zralé sýry a pečená zvěřina.",
    emotionalTrace: "Tiché, noblesní víno k pomalému večeru.",
};

export function getWineImportExampleJson(): string {
    return `${JSON.stringify([WINE_IMPORT_EXAMPLE], null, 2)}\n`;
}

export function getWineImportPrompt(): string {
    const regionBlocks = COUNTRY_ORDER.map((id) => {
        const regions = COUNTRY_DEFINITIONS[id].regions.map((region) => `- ${region}`).join("\n");
        return `${COUNTRY_LABELS[id]} (country: "${id}"):\n${regions}`;
    }).join("\n\n");

    return `ÚKOL
Z podkladů, které ti uživatel pošle (seznam vín, tabulka, e-mail, text, PDF přepis), vytvoř importní JSON pro katalog Soledivino.

VÝSTUP
- Vrať POUZE validní JSON — nic jiného. Žádný komentář, žádný úvod, žádné markdown plotýnky.
- Kořen je pole objektů: [ { ... }, { ... } ]
- Kódování UTF-8. Soubor pojmenuj wines-import.json.
- Nepřidávej pole id, slug, image, color — ty doplníme my.

POVINNÁ POLE u každého vína
- name (string) — přesný název vína
- country — přesně jedna hodnota: "italy" | "germany" | "austria" | "france"
- regione — přesný název správního regionu ze seznamu níže (NE apelace typu Barolo / Chianti / Bordeaux)
- type — přesně: "red" | "white" | "rose"
- description — krátký úvod na detail vína, 1–3 věty česky

VOLITELNÁ POLE (vyplň, pokud to z podkladů víš; jinak pole úplně vynech)
- region — text na kartě, typicky "Itálie" / "Francie" / "Německo" / "Rakousko"
- alcohol — např. "13,5 %"
- volume — např. "0.75l"
- vintage — ročník, např. "2021"
- aroma
- tasteProfile
- finish
- terroir
- winemaker — kdo to dělá, kde, jak dlouho, čím je vinařství specifické
- winemakerPhilosophy — postoj k vinici a sklepu, 1–3 věty
- productionStyle — "traditional" | "modern"
- productionStyleNote — proč je víno tradiční / moderní, lidsky
- naturalCategory — "classic" | "low-intervention" | "natural" | "biodynamic" | "orange"
- pairing — jídlo
- emotionalTrace — nálada / situace (volitelné, krátce)

JAZYK A TÓN
- Všechny popisy piš česky.
- Klidný, řemeslný tón. Bez klišé („symfonie chutí“, „nebeský zážitek“, „unikátní terroir“).
- Nevymýšlej ročník, alkohol, jméno vinaře ani fakta, která v podkladech nejsou. Neznámé pole vynech.
- Jeden objekt = jedno víno. Stejný vinař u více vín se zopakuje v poli winemaker u každého vína.

REGIONY (pole regione — použij přesně tento řetězec)

${regionBlocks}

PŘÍKLAD JEDNOHO ZÁZNAMU
${JSON.stringify(WINE_IMPORT_EXAMPLE, null, 2)}
`;
}
