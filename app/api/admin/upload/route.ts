import { NextResponse } from "next/server";
import { uploadImage } from "@/app/lib/blob";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!(file instanceof File) || file.size === 0) {
            return NextResponse.json({ error: "Soubor nebyl nahrán." }, { status: 400 });
        }

        const url = await uploadImage(file);
        return NextResponse.json({ url });
    } catch (error) {
        console.error("Upload failed:", error);
        const message =
            error instanceof Error ? error.message : "Nahrání obrázku se nezdařilo.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
