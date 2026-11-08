#!/usr/bin/env node
/**
 * Download Simplemaps Europe + admin1 SVGs and write app/data JSON.
 *
 * Source: https://simplemaps.com/resources/svg-license
 * Usage: node scripts/extract-region-svgs.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "app/data");
const regionsDir = path.join(outDir, "regions");
const cacheDir = path.join(root, ".cache/simplemaps");

const EUROPE_SVG_URL =
    "https://simplemaps.com/static/demos/resources/svg-library/svgs/europe.svg";

/** ISO2 → CountryId slug (existing IT/DE/AT/FR ids preserved). */
const ISO_TO_COUNTRY_ID = {
    AL: "albania",
    AD: "andorra",
    AT: "austria",
    BA: "bosnia",
    BE: "belgium",
    BG: "bulgaria",
    BY: "belarus",
    CH: "switzerland",
    CY: "cyprus",
    CZ: "czechia",
    DE: "germany",
    DK: "denmark",
    EE: "estonia",
    ES: "spain",
    FI: "finland",
    FR: "france",
    GB: "united_kingdom",
    GR: "greece",
    HR: "croatia",
    HU: "hungary",
    IE: "ireland",
    IS: "iceland",
    IT: "italy",
    LI: "liechtenstein",
    LT: "lithuania",
    LU: "luxembourg",
    LV: "latvia",
    MD: "moldova",
    ME: "montenegro",
    MK: "north_macedonia",
    NL: "netherlands",
    NO: "norway",
    PL: "poland",
    PT: "portugal",
    RO: "romania",
    RS: "serbia",
    SE: "sweden",
    SI: "slovenia",
    SK: "slovakia",
    UA: "ukraine",
    XK: "kosovo",
};

/** Exclude from Europe overview (user request). */
const EXCLUDED_ISO = new Set(["TR", "AM", "GE"]);

const LABEL_CS = {
    albania: "Albánie",
    andorra: "Andorra",
    austria: "Rakousko",
    bosnia: "Bosna a Hercegovina",
    belgium: "Belgie",
    bulgaria: "Bulharsko",
    belarus: "Bělorusko",
    switzerland: "Švýcarsko",
    cyprus: "Kypr",
    czechia: "Česko",
    germany: "Německo",
    denmark: "Dánsko",
    estonia: "Estonsko",
    spain: "Španělsko",
    finland: "Finsko",
    france: "Francie",
    united_kingdom: "Spojené království",
    greece: "Řecko",
    croatia: "Chorvatsko",
    hungary: "Maďarsko",
    ireland: "Irsko",
    iceland: "Island",
    italy: "Itálie",
    liechtenstein: "Lichtenštejnsko",
    lithuania: "Litva",
    luxembourg: "Lucembursko",
    latvia: "Lotyšsko",
    moldova: "Moldavsko",
    montenegro: "Černá Hora",
    north_macedonia: "Severní Makedonie",
    netherlands: "Nizozemsko",
    norway: "Norsko",
    poland: "Polsko",
    portugal: "Portugalsko",
    romania: "Rumunsko",
    serbia: "Srbsko",
    sweden: "Švédsko",
    slovenia: "Slovinsko",
    slovakia: "Slovensko",
    ukraine: "Ukrajina",
    kosovo: "Kosovo",
};

/** Preserve Italian display names used by existing product data. */
const ITALY_ID_TO_REGION = {
    IT21: "Piemonte",
    IT23: "Valle d'Aosta",
    IT42: "Liguria",
    IT25: "Lombardia",
    IT32: "Trentino-Alto Adige",
    IT34: "Veneto",
    IT36: "Friuli-Venezia Giulia",
    IT45: "Emilia-Romagna",
    IT52: "Toscana",
    IT55: "Umbria",
    IT57: "Marche",
    IT62: "Lazio",
    IT65: "Abruzzo",
    IT67: "Molise",
    IT72: "Campania",
    IT75: "Puglia",
    IT77: "Basilicata",
    IT78: "Calabria",
    IT82: "Sicilia",
    IT88: "Sardegna",
};

const GERMANY_ID_TO_REGION = {
    DESN: "Sachsen",
    DEBY: "Bayern",
    DERP: "Rheinland-Pfalz",
    DESL: "Saarland",
    DESH: "Schleswig-Holstein",
    DENI: "Niedersachsen",
    DENW: "Nordrhein-Westfalen",
    DEBW: "Baden-Württemberg",
    DEBB: "Brandenburg",
    DEMV: "Mecklenburg-Vorpommern",
    DEHB: "Bremen",
    DEHH: "Hamburg",
    DEHE: "Hessen",
    DETH: "Thüringen",
    DEST: "Sachsen-Anhalt",
    DEBE: "Berlin",
};

const AUSTRIA_ID_TO_REGION = {
    AT3: "Niederösterreich",
    AT4: "Oberösterreich",
    AT1: "Burgenland",
    AT8: "Vorarlberg",
    AT7: "Tirol",
    AT5: "Salzburg",
    AT2: "Kärnten",
    AT6: "Steiermark",
    AT9: "Wien",
};

const FRANCE_ID_TO_REGION = {
    FRHDF: "Hauts-de-France",
    FRGES: "Grand Est",
    FRPAC: "Provence-Alpes-Côte d'Azur",
    FRARA: "Auvergne-Rhône-Alpes",
    FRBFC: "Bourgogne-Franche-Comté",
    FROCC: "Occitanie",
    FRPDL: "Pays de la Loire",
    FRBRE: "Bretagne",
    FRNOR: "Normandie",
    FR20R: "Corse",
    FRNAQ: "Nouvelle-Aquitaine",
    FRCVL: "Centre-Val de Loire",
    FRIDF: "Île-de-France",
};

const LEGACY_ID_TO_REGION = {
    italy: ITALY_ID_TO_REGION,
    germany: GERMANY_ID_TO_REGION,
    austria: AUSTRIA_ID_TO_REGION,
    france: FRANCE_ID_TO_REGION,
};

const USER_AGENT = "Mozilla/5.0 (compatible; SoleDiVinoMapBot/1.0)";

async function fetchText(url) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} for ${url}`);
    }
    return res.text();
}

async function cachedFetch(url, cacheName) {
    fs.mkdirSync(cacheDir, { recursive: true });
    const cachePath = path.join(cacheDir, cacheName);
    if (fs.existsSync(cachePath) && fs.statSync(cachePath).size > 200) {
        return fs.readFileSync(cachePath, "utf8");
    }
    const text = await fetchText(url);
    fs.writeFileSync(cachePath, text);
    return text;
}

/** Drop Svalbard / northern outlying islands and Jan Mayen from Norway path. */
function trimNorwayIslands(d) {
    const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d+\.?\d*/g) || [];
    let x = 0;
    let y = 0;
    let cmd = null;
    let i = 0;
    const subpaths = [];
    let cur = [];

    const flush = () => {
        if (cur.length) {
            subpaths.push(cur);
            cur = [];
        }
    };

    while (i < tokens.length) {
        const t = tokens[i];
        if (/^[A-Za-z]$/.test(t)) {
            cmd = t;
            if (cmd === "Z" || cmd === "z") {
                cur.push(["Z", []]);
                flush();
                i += 1;
                continue;
            }
            i += 1;
            continue;
        }

        if (cmd === "M" || cmd === "L") {
            x = Number(t);
            y = Number(tokens[i + 1]);
            i += 2;
            const isMove = cmd === "M" && (cur.length === 0 || cur[cur.length - 1][0] === "Z");
            cur.push([isMove ? "M" : "L", [x, y]]);
            if (cmd === "M") cmd = "L";
        } else if (cmd === "m" || cmd === "l") {
            x += Number(t);
            y += Number(tokens[i + 1]);
            i += 2;
            const isMove = cmd === "m" && cur.length === 0;
            cur.push([isMove ? "M" : "L", [x, y]]);
            if (cmd === "m") cmd = "l";
        } else if (cmd === "H") {
            x = Number(t);
            i += 1;
            cur.push(["L", [x, y]]);
        } else if (cmd === "h") {
            x += Number(t);
            i += 1;
            cur.push(["L", [x, y]]);
        } else if (cmd === "V") {
            y = Number(t);
            i += 1;
            cur.push(["L", [x, y]]);
        } else if (cmd === "v") {
            y += Number(t);
            i += 1;
            cur.push(["L", [x, y]]);
        } else {
            i += 1;
        }
    }
    flush();

    const kept = subpaths.filter((sp) => {
        const xs = sp.filter(([, a]) => a.length).map(([, a]) => a[0]);
        const ys = sp.filter(([, a]) => a.length).map(([, a]) => a[1]);
        if (!xs.length) return false;
        const minx = Math.min(...xs);
        const miny = Math.min(...ys);
        return miny >= 100 && minx >= 400;
    });

    return kept
        .map((sp) => {
            const parts = sp.map(([c, a]) => {
                if (c === "Z") return "z";
                return `${c}${a[0].toFixed(1)} ${a[1].toFixed(1)}`;
            });
            if (!parts[parts.length - 1]?.endsWith("z")) parts.push("z");
            return parts.join("");
        })
        .join("");
}

function pathBBox(d) {
    const tokens = d.match(/[MmLlHhVvCcSsQqTtAaZz]|-?\d+\.?\d*/g) || [];
    let x = 0;
    let y = 0;
    let cmd = null;
    let i = 0;
    const xs = [];
    const ys = [];

    while (i < tokens.length) {
        const t = tokens[i];
        if (/^[A-Za-z]$/.test(t)) {
            cmd = t;
            i += 1;
            continue;
        }
        if (cmd === "M" || cmd === "L") {
            x = Number(t);
            y = Number(tokens[i + 1]);
            xs.push(x);
            ys.push(y);
            i += 2;
            if (cmd === "M") cmd = "L";
        } else if (cmd === "m" || cmd === "l") {
            x += Number(t);
            y += Number(tokens[i + 1]);
            xs.push(x);
            ys.push(y);
            i += 2;
            if (cmd === "m") cmd = "l";
        } else if (cmd === "H") {
            x = Number(t);
            xs.push(x);
            ys.push(y);
            i += 1;
        } else if (cmd === "h") {
            x += Number(t);
            xs.push(x);
            ys.push(y);
            i += 1;
        } else if (cmd === "V") {
            y = Number(t);
            xs.push(x);
            ys.push(y);
            i += 1;
        } else if (cmd === "v") {
            y += Number(t);
            xs.push(x);
            ys.push(y);
            i += 1;
        } else {
            i += 1;
        }
    }

    if (!xs.length) return null;
    return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

function tightViewBox(paths, pad = 8) {
    let minx = Infinity;
    let miny = Infinity;
    let maxx = -Infinity;
    let maxy = -Infinity;
    for (const p of paths) {
        const b = pathBBox(p.d);
        if (!b) continue;
        minx = Math.min(minx, b[0]);
        miny = Math.min(miny, b[1]);
        maxx = Math.max(maxx, b[2]);
        maxy = Math.max(maxy, b[3]);
    }
    return `${(minx - pad).toFixed(1)} ${(miny - pad).toFixed(1)} ${(maxx - minx + 2 * pad).toFixed(1)} ${(maxy - miny + 2 * pad).toFixed(1)}`;
}

function extractPaths(svg, { idPrefix = null, allowIso2 = false } = {}) {
    const viewBox = (svg.match(/view[Bb]ox="([^"]+)"/) || [])[1] || "0 0 1000 1000";
    const paths = [];
    const re = /<path\b[^>]*>/g;
    let m;
    while ((m = re.exec(svg))) {
        const tag = m[0];
        const id = (tag.match(/\bid="([^"]+)"/) || [])[1];
        const name = (tag.match(/\bname="([^"]+)"/) || [])[1];
        const d = (tag.match(/\bd="([^"]+)"/) || [])[1];
        if (!id || !d) continue;
        if (id === "features" || id === "points" || id === "label_points" || /^\d+$/.test(id)) {
            continue;
        }
        if (idPrefix && !id.startsWith(idPrefix)) continue;
        if (allowIso2 && !/^[A-Z]{2}$/.test(id) && !/^XK$/.test(id)) continue;
        paths.push({ id, name: name || id, d });
    }

    // Merge same-id multipaths (islands) into one compound path
    const byId = new Map();
    for (const p of paths) {
        const existing = byId.get(p.id);
        if (!existing) {
            byId.set(p.id, { ...p });
        } else {
            existing.d = `${existing.d} ${p.d}`;
        }
    }
    return { viewBox, paths: [...byId.values()] };
}

function cleanRegionName(name) {
    return name
        .replace(/\s+/g, " ")
        .replace(/,.*?(Region|District|County|Province|Canton|State|Area).*$/i, "")
        .trim();
}

async function tryFetchSvg(url, cacheName) {
    try {
        const text = await cachedFetch(url, cacheName);
        if (text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html")) {
            return null;
        }
        return text;
    } catch {
        return null;
    }
}

async function loadAdmin1(iso2) {
    const lower = iso2.toLowerCase();
    const candidates = [
        [`https://simplemaps.com/static/svg/country/${lower}/admin1/${lower}.svg`, `${lower}-admin1.svg`],
        [`https://simplemaps.com/static/svg/country/${lower}/all/${lower}.svg`, `${lower}-all.svg`],
    ];

    for (const [url, cacheName] of candidates) {
        const svg = await tryFetchSvg(url, cacheName);
        if (!svg) continue;

        const extracted = extractPaths(svg, { idPrefix: iso2 });
        let paths = extracted.paths;
        let source = cacheName.includes("admin1") ? "admin1" : "all";

        if (paths.length === 0) {
            const loose = extractPaths(svg);
            paths = loose.paths.filter((p) => !/^(features|points)/.test(p.id) && p.d.length > 20);
            if (paths.length > 0) {
                return { viewBox: loose.viewBox, paths, source: `${source}-loose` };
            }
            continue;
        }

        return { viewBox: extracted.viewBox, paths, source };
    }

    return { viewBox: null, paths: [], source: "none" };
}

function buildIdToRegion(countryId, paths) {
    const legacy = LEGACY_ID_TO_REGION[countryId];
    if (legacy) {
        const map = {};
        for (const p of paths) {
            map[p.id] = legacy[p.id] || cleanRegionName(p.name);
        }
        return map;
    }
    const map = {};
    for (const p of paths) {
        map[p.id] = cleanRegionName(p.name);
    }
    return map;
}

async function main() {
    fs.mkdirSync(regionsDir, { recursive: true });

    console.log("Downloading Europe SVG…");
    const europeSvg = await cachedFetch(EUROPE_SVG_URL, "europe.svg");
    const europe = extractPaths(europeSvg, { allowIso2: true });

    const countryPaths = europe.paths.filter((p) => !EXCLUDED_ISO.has(p.id) && ISO_TO_COUNTRY_ID[p.id]);
    const skipped = europe.paths.filter((p) => EXCLUDED_ISO.has(p.id) || !ISO_TO_COUNTRY_ID[p.id]);
    if (skipped.length) {
        console.log(
            "Skipped ISO:",
            skipped.map((p) => p.id).join(", "),
        );
    }

    // Include documented ISO mapping even if somehow missing from SVG (shouldn't happen)
    // Trim Norway: drop Svalbard / northern outlying islands + Jan Mayen
    const trimmedPaths = countryPaths.map(({ id, d }) => ({
        id,
        d: id === "NO" ? trimNorwayIslands(d) : d,
    }));

    const europeOut = {
        viewBox: tightViewBox(trimmedPaths),
        paths: trimmedPaths,
    };
    fs.writeFileSync(
        path.join(outDir, "europe-countries-paths.json"),
        JSON.stringify(europeOut, null, 2) + "\n",
    );
    console.log(`Europe: ${europeOut.paths.length} countries → europe-countries-paths.json`);
    console.log(`Europe viewBox: ${europeOut.viewBox}`);

    const registry = [];
    for (const { id: iso2 } of countryPaths) {
        const countryId = ISO_TO_COUNTRY_ID[iso2];
        process.stdout.write(`  ${iso2} (${countryId})… `);
        const { viewBox, paths, source } = await loadAdmin1(iso2);

        if (paths.length === 0) {
            console.log("no admin SVG — single region from Europe outline");
            const outline = trimmedPaths.find((p) => p.id === iso2);
            const single = [{ id: iso2, name: LABEL_CS[countryId], d: outline.d }];
            const idToRegion = { [iso2]: LABEL_CS[countryId] };
            const slim = single.map(({ id, d }) => ({ id, d }));
            fs.writeFileSync(
                path.join(regionsDir, `${countryId}-regions-paths.json`),
                JSON.stringify(slim, null, 2) + "\n",
            );
            registry.push({
                id: countryId,
                iso2,
                labelCs: LABEL_CS[countryId],
                viewBox: tightViewBox(slim, 12),
                idToRegion,
            });
            continue;
        }

        const idToRegion = buildIdToRegion(countryId, paths);
        const slim = paths.map(({ id, d }) => ({ id, d }));
        fs.writeFileSync(
            path.join(regionsDir, `${countryId}-regions-paths.json`),
            JSON.stringify(slim, null, 2) + "\n",
        );
        registry.push({
            id: countryId,
            iso2,
            labelCs: LABEL_CS[countryId],
            viewBox: tightViewBox(slim, 12),
            idToRegion,
        });
        console.log(`${paths.length} regions (${source})`);
    }

    // Stable order: west→east-ish by known wine countries first, then alpha by Czech label
    const PRIORITY = ["france", "spain", "portugal", "italy", "switzerland", "germany", "austria", "czechia", "slovakia", "hungary", "slovenia", "croatia"];
    registry.sort((a, b) => {
        const ai = PRIORITY.indexOf(a.id);
        const bi = PRIORITY.indexOf(b.id);
        if (ai !== -1 || bi !== -1) {
            if (ai === -1) return 1;
            if (bi === -1) return -1;
            return ai - bi;
        }
        return a.labelCs.localeCompare(b.labelCs, "cs");
    });

    fs.writeFileSync(
        path.join(outDir, "europe-registry.json"),
        JSON.stringify(registry, null, 2) + "\n",
    );
    console.log(`Wrote europe-registry.json (${registry.length} countries)`);

    // Remove obsolete outlines file if present
    const obsolete = path.join(outDir, "countries-outlines.json");
    if (fs.existsSync(obsolete)) {
        fs.unlinkSync(obsolete);
        console.log("Removed countries-outlines.json");
    }

    // Remove legacy top-level region path files (moved under regions/)
    for (const legacy of [
        "italy-regions-paths.json",
        "germany-regions-paths.json",
        "austria-regions-paths.json",
        "france-regions-paths.json",
    ]) {
        const p = path.join(outDir, legacy);
        if (fs.existsSync(p)) {
            fs.unlinkSync(p);
            console.log(`Removed ${legacy}`);
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
