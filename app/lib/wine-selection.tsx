"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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

const WineSelectionContext = createContext<WineSelectionContextValue | null>(null);

function readStoredWines(): SelectedWine[] {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return [];
        }

        const parsed = JSON.parse(raw) as SelectedWine[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function WineSelectionProvider({ children }: { children: React.ReactNode }) {
    const [selectedWines, setSelectedWines] = useState<SelectedWine[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setSelectedWines(readStoredWines());
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedWines));
    }, [selectedWines, isHydrated]);

    const addWine = useCallback((name: string) => {
        const slug = toWineSlug(name);

        setSelectedWines((current) => {
            if (current.some((wine) => wine.slug === slug)) {
                return current;
            }

            return [...current, { name, slug }];
        });
    }, []);

    const removeWine = useCallback((slug: string) => {
        setSelectedWines((current) => current.filter((wine) => wine.slug !== slug));
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
