import Link from "next/link";
import type { ComponentProps } from "react";

const variants = {
    black: "bg-black hover:bg-black/90",
    gold: "bg-[#9B7E3E] hover:bg-[#8A7035]",
} as const;

type Variant = keyof typeof variants;

function buttonClassName(variant: Variant, className?: string) {
    return [
        "inline-flex items-center justify-center rounded-2xl px-8 py-3.5 font-sans text-sm text-white transition-colors sm:px-10 sm:py-4 sm:text-base",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
    ]
        .filter(Boolean)
        .join(" ");
}

type ButtonProps = ComponentProps<"button"> & {
    variant?: Variant;
};

export function Button({ variant = "black", className, ...props }: ButtonProps) {
    return <button className={buttonClassName(variant, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
    variant?: Variant;
};

export function ButtonLink({ variant = "black", className, ...props }: ButtonLinkProps) {
    return <Link className={buttonClassName(variant, className)} {...props} />;
}
