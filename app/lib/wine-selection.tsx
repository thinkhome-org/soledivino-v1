"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { toWineSlug } from "./wine-slug";

export type SelectedWine = {
    name: string;
    slug: string;
};

type WineSelectionContextValue = {
    selectedWines: SelectedWine[];
    addWine: (name: string) => void;
    removeWine: (slug: string) => void;
    isSelected: (name: string) => boolean;
};

const STORAGE_KEY = "soledivino-selected-wines";
const EMPTY_WINES: SelectedWine[] = [];

const WineSelectionContext = createContext<WineSelectionContextValue | null>(null);

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedSnapshot: SelectedWine[] = EMPTY_WINES;

function invalidateCache() {
    cachedRaw = undefined;
}

function emitChange() {
    for (const listener of listeners) {
        listener();
    }
}

function subscribe(listener: () => void) {
    listeners.add(listener);

    const handleStorage = (event: StorageEvent) => {
        if (event.key === STORAGE_KEY) {
            invalidateCache();
            listener();
        }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", handleStorage);
    };
}

function readStoredWines(): SelectedWine[] {
    if (typeof window === "undefined") {
        return EMPTY_WINES;
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);

        if (raw === cachedRaw) {
            return cachedSnapshot;
        }

        cachedRaw = raw;

        if (!raw) {
            cachedSnapshot = EMPTY_WINES;
            return cachedSnapshot;
        }

        const parsed = JSON.parse(raw) as SelectedWine[];
        cachedSnapshot = Array.isArray(parsed) ? parsed : EMPTY_WINES;
        return cachedSnapshot;
    } catch {
        cachedRaw = null;
        cachedSnapshot = EMPTY_WINES;
        return cachedSnapshot;
    }
}

function writeStoredWines(wines: SelectedWine[]) {
    const serialized = JSON.stringify(wines);
    window.localStorage.setItem(STORAGE_KEY, serialized);
    cachedRaw = serialized;
    cachedSnapshot = wines;
    emitChange();
}

export function WineSelectionProvider({ children }: { children: React.ReactNode }) {
    const selectedWines = useSyncExternalStore(subscribe, readStoredWines, () => EMPTY_WINES);

    const addWine = useCallback((name: string) => {
        const slug = toWineSlug(name);
        const current = readStoredWines();

        if (current.some((wine) => wine.slug === slug)) {
            return;
        }

        writeStoredWines([...current, { name, slug }]);
    }, []);

    const removeWine = useCallback((slug: string) => {
        const current = readStoredWines();
        writeStoredWines(current.filter((wine) => wine.slug !== slug));
    }, []);

    const isSelected = useCallback(
        (name: string) => selectedWines.some((wine) => wine.slug === toWineSlug(name)),
        [selectedWines],
    );

    const value = useMemo(
        () => ({
            selectedWines,
            addWine,
            removeWine,
            isSelected,
        }),
        [selectedWines, addWine, removeWine, isSelected],
    );

    return <WineSelectionContext.Provider value={value}>{children}</WineSelectionContext.Provider>;
}

export function useWineSelection() {
    const context = useContext(WineSelectionContext);

    if (!context) {
        throw new Error("useWineSelection must be used within WineSelectionProvider");
    }

    return context;
}
