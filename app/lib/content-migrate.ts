import productsJson from "@/app/data/products-wines.json";
import winesJson from "@/app/data/wines.json";
import featuredJson from "@/app/data/nas-vyber-wines.json";
import contactJson from "@/app/data/contact.json";
import inquirySettingsJson from "@/app/data/inquiry-settings.json";
import type {
    CarouselItem,
    Contact,
    FeaturedItem,
    InquirySettings,
    NaturalCategory,
    Product,
    ProductionStyle,
    WineType,
} from "./content-types";
import { toWineSlug } from "./wine-slug";

type LegacyProduct = {
    name: string;
    region: string;
    regione: string;
    color: string;
    image: string;
    description: string;
};

type ProductNarrative = Pick<
    Product,
    | "aroma"
    | "tasteProfile"
    | "finish"
    | "terroir"
    | "winemaker"
    | "productionStyle"
    | "productionStyleNote"
    | "naturalCategory"
    | "winemakerPhilosophy"
    | "emotionalTrace"
    | "pairing"
>;

/** Sample narratives for demo/default catalog. */
const SAMPLE_NARRATIVES: Record<string, ProductNarrative> = {
    "Barolo Bussia": {
        aroma: "Třešně, fialky, růže a jemný kouř s nádechem tabáku a cedru.",
        tasteProfile: "Plné, strukturované tělo s jemnými tříslovinami, minerální páteří a tóny červeného ovoce.",
        finish: "Dlouhý, vyvážený závěr s přetrvávající mineralitou a jemnou hořčinkou.",
        terroir: "Vinice Bussia v srdci Barola — jílovito-vápencové půdy, chladnější mikroklima a delší zrání hroznů.",
        winemaker: "Rodinné vinařství pečující o historické parcely v Bussii, s důrazem na Nebbiolo a dlouhodobé zrání v sudu.",
        productionStyle: "traditional" as ProductionStyle,
        productionStyleNote:
            "Klasická fermentace, dlouhá macerace a zrání v velkých dubových sudech — bez spekulací o moderních zkratkách.",
        naturalCategory: "low-intervention" as NaturalCategory,
        winemakerPhilosophy:
            "Méně je více: respekt k ročníku, ruční sklizeň a víno, které má čas ukázat charakter místa, ne vinaře.",
        emotionalTrace: "Tiché, noblesní víno k pomalému večeru — hloubka bez okázalosti.",
        pairing: "Hovězí ragú, houbové risotto, zralé sýry (Castelmagno, Parmigiano) a pečená zvěřina.",
    },
    Amarone: {
        aroma: "Sušené třešně, švestky, kakao, vanilka a nádech hořké čokolády.",
        tasteProfile: "Bohaté, sametové tělo s koncentrovaným ovocem, jemnou sladkostí a kulatými tříslovinami.",
        finish: "Dlouhý, teplý závěr s tóny kakaa a sušeného ovoce.",
        terroir: "Kopce Valpolicelly — vápenité a čedičové půdy, teplé dny a chladnější noci, ideální pro appassimento.",
        winemaker: "Vinařství navazující na generace sušení hroznů Corvina, Rondinella a Molinara na rohožích.",
        productionStyle: "traditional" as ProductionStyle,
        productionStyleNote:
            "Tradiční appassimento — hrozny se suší měsíce před lisováním, aby získaly hloubku a hedvábnost.",
        naturalCategory: "classic" as NaturalCategory,
        winemakerPhilosophy: "Respektovat čas: víno vzniká pomalu, stejně jako sušení hroznů, které mu dává charakter.",
        emotionalTrace: "Slavnostní, hluboké víno k večeru, kdy se nepospíchá.",
        pairing: "Zvěřina, zralé sýry, risotto s houbami, hořká čokoláda.",
    },
    "Chianti Classico": {
        aroma: "Třešně, fialky, jemné koření a nádech sušených bylin.",
        tasteProfile: "Střední tělo, svěží kyselina, jemné třísloviny a čisté červené ovoce.",
        finish: "Vyvážený, středně dlouhý závěr s ovocným dozvukem.",
        terroir: "Kopce Chianti Classico mezi Florencií a Sienou — galestro a alberese, typické toskánské půdy.",
        winemaker: "Rodinné toskánské vinařství s důrazem na Sangiovese a klasickou vinifikaci.",
        productionStyle: "traditional" as ProductionStyle,
        productionStyleNote:
            "Tradiční Chianti: Sangiovese v centru, zrání v sudu a velkých sudech, žádný moderní extrakt.",
        naturalCategory: "classic" as NaturalCategory,
        winemakerPhilosophy: "Chianti má být jídlo u stolu, ne spekulace. Pitelnost a autenticita nad vše.",
        pairing: "Těstoviny s ragú, pizza, pečené kuře, pecorino, bistecca alla fiorentina.",
    },
    "Soave Classico": {
        aroma: "Citrusová kůra, bílé květy, mandle a jemná minerální note.",
        tasteProfile: "Lehké tělo, živá kyselina, čistý ovocný projev s jemnou hořčinkou.",
        finish: "Svěží, suchý závěr s minerálním dozvukem.",
        terroir: "Klasická zóna Soave — vulkanické a vápencové půdy, svahy s dobrým prouděním vzduchu.",
        winemaker: "Rodinné vinařství v Soave Classico, zaměřené na Garganegu a dlouhou práci ve vinici.",
        productionStyle: "traditional" as ProductionStyle,
        productionStyleNote:
            "Klasická fermentace v nerezových tancích, žádné zbytečné barikování — Soave má zůstat svěží a přesné.",
        naturalCategory: "low-intervention" as NaturalCategory,
        winemakerPhilosophy: "Garganega nepotřebuje make-up. Stačí zdravé hrozny a čistý sklep.",
        pairing: "Ryby, mořské plody, lehké saláty, risotto s citronem, kozí sýry.",
    },
    "Greco di Tufo": {
        aroma: "Hruška, citrusová kůra, bílý pepř a vulkanický kámen.",
        tasteProfile: "Střední tělo, výrazná struktura, minerální páteř a zralé bílé ovoce.",
        finish: "Dlouhý, slaný závěr s přetrvávající mineralitou.",
        terroir: "Tufo v Campanii — sopečné tufové podloží, které vínu dává sílu a slanost.",
        winemaker: "Vinař pracující s Greco na historických parcelách kolem Tufa, s důrazem na biodynamiku.",
        productionStyle: "modern" as ProductionStyle,
        productionStyleNote:
            "Moderní citlivost k staré odrůdě: spontánní kvašení, kontakt s kaly, minimum síry.",
        naturalCategory: "biodynamic" as NaturalCategory,
        winemakerPhilosophy: "Vinice je organismus. Když je půda živá, víno nemusí nic předstírat.",
        emotionalTrace: "Přesné, napjaté víno — jako první doušek po dlouhé cestě k moři.",
        pairing: "Pečené ryby, chobotnice, sýry z ovčího mléka, bílé maso s bylinkami.",
    },
    "Etna Rosso": {
        aroma: "Višně, divoké byliny, kouř a jemná vulkanická mineralita.",
        tasteProfile: "Lehčí až střední tělo, svěží kyselina, jemné třísloviny a ovocná čistota.",
        finish: "Čistý, minerální závěr s přetrvávající slaností a bylinkami.",
        terroir: "Svahy Etny — černá sopečná půda, výška nad mořem a velké rozdíly mezi dnem a nocí.",
        winemaker: "Malé vinařství na severním úbočí Etny, práce s Nerello Mascalese a autoktonními kvasinkami.",
        productionStyle: "modern" as ProductionStyle,
        productionStyleNote:
            "Moderní přístup k staré odrůdě: krátká macerace, beton a velké sudy, důraz na pitelnost místo síly.",
        naturalCategory: "natural" as NaturalCategory,
        winemakerPhilosophy: "Etna mluví sama — vinař jen nepřekáží. Žádné přílišné zásahy, žádné maskování terroiru.",
        emotionalTrace: "Víno jako procházka po lávovém poli za soumraku — lehkost s tíhou místa.",
        pairing: "Grilované ryby, těstoviny s rajčaty, caponata, jemné uzené maso.",
    },
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
        country: "italy" as const,
        region: wine.region,
        regione: wine.regione,
        type: inferWineType(wine.name),
        color: wine.color,
        image: wine.image,
        description: wine.description,
        alcohol: "xx%",
        volume: "0.75l",
        vintage: "2020",
        ...SAMPLE_NARRATIVES[wine.name],
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

export function defaultInquirySettings(): InquirySettings {
    return inquirySettingsJson as InquirySettings;
}

export function newId(): string {
    return crypto.randomUUID();
}
