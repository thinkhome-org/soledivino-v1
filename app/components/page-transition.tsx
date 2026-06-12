"use client";

import { usePathname, useRouter } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
    type ReactNode,
    type TransitionEvent,
} from "react";

type Phase = "idle" | "covering" | "covered" | "revealing";

type PageTransitionContextValue = {
    navigate: (href: string) => void;
};

const PageTransitionContext = createContext<PageTransitionContextValue | null>(null);

const REVEAL_FALLBACK_MS = 2000;

function prefersReducedMotion(): boolean {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isAdminPath(pathname: string): boolean {
    return pathname === "/admin" || pathname.startsWith("/admin/");
}

function hrefMatchesLocation(href: string): boolean {
    const target = new URL(href, window.location.origin);
    return (
        target.pathname === window.location.pathname &&
        target.search === window.location.search &&
        target.hash === window.location.hash
    );
}

function shouldAnimateNavigation(targetHref: string): boolean {
    const target = new URL(targetHref, window.location.origin);

    if (isAdminPath(target.pathname) || isAdminPath(window.location.pathname)) {
        return false;
    }

    const current = window.location;

    if (
        target.pathname === current.pathname &&
        target.search === current.search &&
        target.hash === current.hash
    ) {
        return false;
    }

    if (target.pathname === current.pathname && target.search !== current.search) {
        return false;
    }

    return true;
}

function resolveInternalHref(href: string): string | null {
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
        return null;
    }

    try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) {
            return null;
        }
        return `${url.pathname}${url.search}${url.hash}`;
    } catch {
        return null;
    }
}

/**
 * Browser back/forward (popstate) does not trigger the curtain — v1 limitation.
 */
export function PageTransitionProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [phase, setPhase] = useState<Phase>("idle");
    const phaseRef = useRef<Phase>("idle");
    const pendingHrefRef = useRef<string | null>(null);
    const revealFallbackRef = useRef<number | null>(null);

    const setPhaseSafe = useCallback((next: Phase) => {
        phaseRef.current = next;
        setPhase(next);
    }, []);

    const startReveal = useCallback(() => {
        if (phaseRef.current !== "covered") {
            return;
        }

        if (revealFallbackRef.current !== null) {
            window.clearTimeout(revealFallbackRef.current);
            revealFallbackRef.current = null;
        }

        pendingHrefRef.current = null;
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setPhaseSafe("revealing");
            });
        });
    }, [setPhaseSafe]);

    const navigate = useCallback(
        (href: string) => {
            if (phaseRef.current !== "idle") {
                return;
            }

            const resolved = resolveInternalHref(href);
            if (!resolved || !shouldAnimateNavigation(resolved)) {
                router.push(href);
                return;
            }

            if (prefersReducedMotion()) {
                router.push(resolved);
                return;
            }

            pendingHrefRef.current = resolved;
            setPhaseSafe("covering");
        },
        [router, setPhaseSafe],
    );

    const handleTransitionEnd = useCallback(
        (event: TransitionEvent<HTMLDivElement>) => {
            if (event.propertyName !== "transform") {
                return;
            }

            if (phaseRef.current === "covering" && pendingHrefRef.current) {
                const href = pendingHrefRef.current;
                setPhaseSafe("covered");
                router.push(href);

                if (hrefMatchesLocation(href)) {
                    startReveal();
                    return;
                }

                revealFallbackRef.current = window.setTimeout(() => {
                    startReveal();
                }, REVEAL_FALLBACK_MS);
                return;
            }

            if (phaseRef.current === "revealing") {
                setPhaseSafe("idle");
            }
        },
        [router, setPhaseSafe, startReveal],
    );

    useEffect(() => {
        const pending = pendingHrefRef.current;
        if (!pending || phaseRef.current !== "covered") {
            return;
        }

        if (hrefMatchesLocation(pending)) {
            startReveal();
        }
    }, [pathname, startReveal]);

    useEffect(() => {
        return () => {
            if (revealFallbackRef.current !== null) {
                window.clearTimeout(revealFallbackRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (event.defaultPrevented || event.button !== 0) {
                return;
            }

            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            const anchor = (event.target as HTMLElement).closest("a");
            if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
                return;
            }

            const href = anchor.getAttribute("href");
            const resolved = href ? resolveInternalHref(href) : null;
            if (!resolved) {
                return;
            }

            if (!shouldAnimateNavigation(resolved)) {
                return;
            }

            event.preventDefault();
            navigate(resolved);
        };

        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [navigate]);

    return (
        <PageTransitionContext.Provider value={{ navigate }}>
            {children}
            <div
                aria-hidden
                className={`page-curtain${phase !== "idle" ? " is-active" : ""}${phase === "covering" ? " is-covering" : ""}${phase === "covered" ? " is-covered" : ""}${phase === "revealing" ? " is-revealing" : ""}`}
                onTransitionEnd={handleTransitionEnd}
            />
        </PageTransitionContext.Provider>
    );
}

export function usePageTransition(): PageTransitionContextValue {
    const context = useContext(PageTransitionContext);
    if (!context) {
        throw new Error("usePageTransition must be used within PageTransitionProvider");
    }
    return context;
}
