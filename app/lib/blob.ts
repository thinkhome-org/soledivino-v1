import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";

export async function uploadImage(file: File): Promise<string> {
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(`wines/${Date.now()}-${file.name}`, file, {
            access: "public",
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });

        return blob.url;
    }

    if (process.env.NODE_ENV === "development") {
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "wines");
        await mkdir(uploadsDir, { recursive: true });

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filename = `${Date.now()}-${safeName}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(uploadsDir, filename), buffer);

        return `/uploads/wines/${filename}`;
    }

    throw new Error(
        "BLOB_READ_WRITE_TOKEN není nastaven. Přidejte token z Vercel Blob do .env, nebo spouštějte v dev režimu.",
    );
}
