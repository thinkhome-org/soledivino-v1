"use client";

import { useState } from "react";
import { Button } from "./button";
import { useWineSelection } from "../lib/wine-selection";

type AddWineButtonProps = {
    wineName: string;
    className?: string;
};

export default function AddWineButton({ wineName, className }: AddWineButtonProps) {
    const { addWine, isSelected } = useWineSelection();
    const [justAdded, setJustAdded] = useState(false);
    const alreadySelected = isSelected(wineName);

    const handleClick = () => {
        addWine(wineName);
        setJustAdded(true);
        window.setTimeout(() => setJustAdded(false), 1800);
    };

    const label = justAdded ? "Přidáno" : alreadySelected ? "Ve výběru" : "Přidat";

    return (
        <Button type="button" onClick={handleClick} className={className}>
            {label}
        </Button>
    );
}
