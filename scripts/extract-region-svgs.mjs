#!/usr/bin/env node
/**
 * One-off helper: extract Simplemaps admin1 SVG paths into app/data JSON.
 * Usage (after downloading SVGs to /tmp):
 *   node scripts/extract-region-svgs.mjs
 *
 * Source: https://simplemaps.com/resources/svg-license
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "app/data");

const FR_NAME_FIXES = {
    FRPAC: "Provence-Alpes-Côte d'Azur",
    FRARA: "Auvergne-Rhône-Alpes",
    FRBFC: "Bourgogne-Franche-Comté",
    FRHDF: "Hauts-de-France",
    FRPDL: "Pays de la Loire",
    FRCVL: "Centre-Val de Loire",
    FRIDF: "Île-de-France",
    FRNAQ: "Nouvelle-Aquitaine",
    FR20R: "Corse",
    FRGES: "Grand Est",
    FROCC: "Occitanie",
    FRBRE: "Bretagne",
    FRNOR: "Normandie",
};

function extractAdmin1(svgPath) {
    const svg = fs.readFileSync(svgPath, "utf8");
    const viewBox = (svg.match(/viewBox="([^"]+)"/) || [])[1] || "0 0 1000 1000";
    const paths = [];
    const re = /<path\b[^>]*>/g;
    let m;
    while ((m = re.exec(svg))) {
        const tag = m[0];
        const id = (tag.match(/\bid="([^"]+)"/) || [])[1];
        const name = (tag.match(/\bname="([^"]+)"/) || [])[1];
        const d = (tag.match(/\bd="([^"]+)"/) || [])[1];
        if (!id || !d) continue;
        if (id === "features" || id === "points" || id === "label_points" || /^\d+$/.test(id)) continue;
        if (!/^(DE|AT|FR|IT)/.test(id)) continue;
        paths.push({ id, name: name || id, d });
    }
    const seen = new Set();
    return {
        viewBox,
        paths: paths.filter((p) => {
            if (seen.has(p.id)) return false;
            seen.add(p.id);
            return true;
        }),
    };
}

const countries = [
    { id: "germany", file: "/tmp/de-admin1.svg", out: "germany-regions-paths.json" },
    { id: "austria", file: "/tmp/at-admin1.svg", out: "austria-regions-paths.json" },
    { id: "france", file: "/tmp/fr-admin1.svg", out: "france-regions-paths.json", fixes: FR_NAME_FIXES },
];

const outlines = [];
for (const c of countries) {
    const { viewBox, paths } = extractAdmin1(c.file);
    const named = paths.map((p) => ({
        id: p.id,
        name: (c.fixes && c.fixes[p.id]) || p.name,
        d: p.d,
    }));
    const slim = named.map(({ id, d }) => ({ id, d }));
    fs.writeFileSync(path.join(outDir, c.out), JSON.stringify(slim, null, 2) + "\n");
    outlines.push({ id: c.id, viewBox, paths: slim });
    console.log(c.id, named.length, Object.fromEntries(named.map((p) => [p.id, p.name])));
}

const italyPaths = JSON.parse(fs.readFileSync(path.join(outDir, "italy-regions-paths.json"), "utf8"));
outlines.unshift({ id: "italy", viewBox: "0 0 1000 1000", paths: italyPaths });
fs.writeFileSync(path.join(outDir, "countries-outlines.json"), JSON.stringify(outlines, null, 2) + "\n");
console.log("Wrote countries-outlines.json");
