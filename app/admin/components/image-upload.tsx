"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type ImageUploadProps = {
    name: string;
    value: string;
    onChange: (url: string) => void;
    label?: string;
};

export default function ImageUpload({ name, value, onChange, label = "Obrázek" }: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [dragOver, setDragOver] = useState(false);

    const uploadFile = async (file: File) => {
        setUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/admin/upload", {
                method: "POST",
                body: formData,
            });

            const data = (await response.json()) as { url?: string; error?: string };

            if (!response.ok || !data.url) {
                throw new Error(data.error ?? "Nahrání se nezdařilo.");
            }

            onChange(data.url);
        } catch (uploadError) {
            setError(uploadError instanceof Error ? uploadError.message : "Nahrání se nezdařilo.");
        } finally {
            setUploading(false);
        }
    };

    const handleFiles = (files: FileList | null) => {
        const file = files?.[0];
        if (file) {
            void uploadFile(file);
        }
    };

    return (
        <div className="space-y-3">
            <span className="block font-sans text-sm text-black/70">{label}</span>
            <input type="hidden" name={name} value={value} />

            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        inputRef.current?.click();
                    }
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragOver(false);
                    handleFiles(event.dataTransfer.files);
                }}
                className={`flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-8 transition-colors ${
                    dragOver ? "border-black/40 bg-black/5" : "border-black/15 bg-white"
                }`}
            >
                {value ? (
                    <div className="relative h-40 w-32">
                        <Image src={value} alt="Náhled" fill className="object-contain" sizes="128px" />
                    </div>
                ) : (
                    <p className="text-center font-sans text-sm text-black/50">
                        Přetáhněte obrázek nebo klikněte pro výběr
                    </p>
                )}

                <p className="mt-3 font-sans text-xs text-black/40">
                    {uploading ? "Nahrávám…" : "PNG, JPG, WEBP"}
                </p>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => handleFiles(event.target.files)}
            />

            {value ? (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="font-sans text-sm text-red-700 underline-offset-2 hover:underline"
                >
                    Odebrat obrázek
                </button>
            ) : null}

            {error ? <p className="font-sans text-sm text-red-700">{error}</p> : null}
        </div>
    );
}
