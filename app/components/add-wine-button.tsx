"use client";

import { useRef, useState } from "react";
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

function PlusIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="h-[18px] w-[18px]"
            stroke="currentColor"
            strokeWidth="2.25"
            strokeLinecap="round"
        >
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="h-[18px] w-[18px]"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6.5 12.5 10 16l7.5-8" />
        </svg>
    );
}

type AddWineIconButtonProps = {
    wineName: string;
    className?: string;
};

type IconStep = "plus" | "plus-out" | "check-in" | "check";

const PLUS_SHRINK_MS = 110;
const CHECK_GROW_MS = 130;

export function AddWineIconButton({ wineName, className }: AddWineIconButtonProps) {
    const { addWine, isSelected } = useWineSelection();
    const alreadySelected = isSelected(wineName);
    const idleStep: IconStep = alreadySelected ? "check" : "plus";
    const [animStep, setAnimStep] = useState<IconStep | null>(null);
    const [isFlashing, setIsFlashing] = useState(false);
    const isAnimatingRef = useRef(false);
    const step = animStep ?? idleStep;

    const handleClick = () => {
        if (alreadySelected || idleStep !== "plus" || isAnimatingRef.current) {
            return;
        }

        isAnimatingRef.current = true;
        addWine(wineName);
        setIsFlashing(true);
        setAnimStep("plus-out");

        window.setTimeout(() => {
            setAnimStep("check-in");
        }, PLUS_SHRINK_MS);

        window.setTimeout(() => {
            setAnimStep(null);
            isAnimatingRef.current = false;
        }, PLUS_SHRINK_MS + CHECK_GROW_MS);

        window.setTimeout(() => {
            setIsFlashing(false);
        }, PLUS_SHRINK_MS + CHECK_GROW_MS + 80);
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={alreadySelected}
            aria-label={alreadySelected ? `${wineName} je ve výběru` : `Přidat ${wineName} do poptávky`}
            className={[
                "flex w-14 shrink-0 cursor-pointer items-center justify-center text-white transition-colors duration-200 ease-out hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-100",
                isFlashing ? "bg-[#9B7E3E]" : "bg-black",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <span className="relative flex h-[18px] w-[18px] items-center justify-center">
                {step === "plus" ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <PlusIcon />
                    </span>
                ) : null}
                {step === "plus-out" ? (
                    <span key="plus-out" className="add-wine-plus-shrink absolute inset-0 flex items-center justify-center">
                        <PlusIcon />
                    </span>
                ) : null}
                {step === "check-in" ? (
                    <span key="check-in" className="add-wine-check-grow absolute inset-0 flex items-center justify-center">
                        <CheckIcon />
                    </span>
                ) : null}
                {step === "check" ? (
                    <span className="absolute inset-0 flex items-center justify-center">
                        <CheckIcon />
                    </span>
                ) : null}
            </span>
        </button>
    );
}
