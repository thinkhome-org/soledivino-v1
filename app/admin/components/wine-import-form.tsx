"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/app/components/button";
import { importWinesAction, type WineImportState } from "../vina/actions";

const initialState: WineImportState = {};

const inputClassName =
    "w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40";

type WineImportFormProps = {
    prompt: string;
    exampleJson: string;
};

function IssueList({
    title,
    items,
}: {
    title: string;
    items: { index: number; name?: string; message: string }[];
}) {
    if (items.length === 0) return null;

    return (
        <div>
            <p className="font-sans text-sm font-medium text-black">{title}</p>
            <ul className="mt-2 space-y-1.5">
                {items.map((item) => (
                    <li key={`${item.index}-${item.message}`} className="font-sans text-sm text-black/70">
                        #{item.index + 1}
                        {item.name ? ` ${item.name}` : ""} — {item.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function WineImportForm({ prompt, exampleJson }: WineImportFormProps) {
    const [state, formAction, pending] = useActionState(importWinesAction, initialState);
    const [copied, setCopied] = useState<"prompt" | "example" | null>(null);
    const [fileReading, setFileReading] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    async function copy(kind: "prompt" | "example", text: string) {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(kind);
            window.setTimeout(() => setCopied(null), 2000);
        } catch {
            setCopied(null);
        }
    }

    function downloadExample() {
        const blob = new Blob([exampleJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "wines-import.example.json";
        link.click();
        URL.revokeObjectURL(url);
    }

    return (
        <div className="max-w-3xl space-y-10">
            <section className="rounded-2xl border border-black/10 bg-white p-5 md:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <h2 className="font-serif text-xl text-black">Prompt pro klienta</h2>
                        <p className="mt-1 font-sans text-sm text-black/60">
                            Pošlete ho spolu se seznamem vín do ChatGPT / Claude. Výstup je soubor k
                            importu.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => copy("prompt", prompt)}
                        className="rounded-xl border border-black/15 px-4 py-2 font-sans text-sm text-black transition-colors hover:bg-black/5"
                    >
                        {copied === "prompt" ? "Zkopírováno" : "Kopírovat prompt"}
                    </button>
                </div>
                <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-black/[0.03] p-4 font-sans text-xs leading-relaxed text-black/75">
                    {prompt}
                </pre>
            </section>

            <form action={formAction} className="space-y-6">
                <div>
                    <label className="mb-1.5 block font-sans text-sm text-black/70">Soubor JSON</label>
                    <input
                        type="file"
                        accept=".json,application/json,text/plain"
                        className={inputClassName}
                        onChange={async (event) => {
                            const file = event.target.files?.[0];
                            if (!file || !textareaRef.current) return;
                            setFileReading(true);
                            try {
                                textareaRef.current.value = await file.text();
                            } finally {
                                setFileReading(false);
                            }
                        }}
                    />
                </div>

                <div>
                    <label className="mb-1.5 block font-sans text-sm text-black/70">
                        Nebo vložte JSON
                    </label>
                    <textarea
                        ref={textareaRef}
                        name="json"
                        rows={16}
                        spellCheck={false}
                        placeholder='[{ "name": "Barolo Bussia", "country": "italy", ... }]'
                        className={`${inputClassName} resize-y font-mono text-sm`}
                    />
                </div>

                {state.error ? (
                    <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
                        {state.error}
                    </p>
                ) : null}

                {state.success ? (
                    <p className="rounded-xl bg-green-50 px-4 py-3 font-sans text-sm text-green-800">
                        {state.success}
                    </p>
                ) : null}

                {state.failed?.length || state.skipped?.length ? (
                    <div className="space-y-4 rounded-xl border border-black/10 bg-white px-4 py-4">
                        <IssueList title="S chybami" items={state.failed ?? []} />
                        <IssueList title="Přeskočeno" items={state.skipped ?? []} />
                    </div>
                ) : null}

                <div className="flex flex-wrap items-center gap-3">
                    <Button type="submit" disabled={pending || fileReading} className="w-full sm:w-auto">
                        {pending ? "Importuji…" : fileReading ? "Načítám soubor…" : "Importovat"}
                    </Button>
                    <button
                        type="button"
                        onClick={downloadExample}
                        className="rounded-xl border border-black/15 px-4 py-2 font-sans text-sm text-black transition-colors hover:bg-black/5"
                    >
                        Stáhnout vzor JSON
                    </button>
                    <button
                        type="button"
                        onClick={() => copy("example", exampleJson)}
                        className="rounded-xl border border-black/15 px-4 py-2 font-sans text-sm text-black transition-colors hover:bg-black/5"
                    >
                        {copied === "example" ? "Zkopírováno" : "Kopírovat vzor"}
                    </button>
                </div>
            </form>
        </div>
    );
}
