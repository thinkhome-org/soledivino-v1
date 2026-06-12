import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

function filePathForKey(key: string): string {
    return path.join(DATA_DIR, `${key.replace(/:/g, "-")}.json`);
}

export function isDevStorageEnabled(): boolean {
    return process.env.NODE_ENV === "development";
}

export async function devRead<T>(key: string): Promise<T | null> {
    try {
        const raw = await readFile(filePathForKey(key), "utf-8");
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export async function devWrite(key: string, value: unknown): Promise<void> {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(filePathForKey(key), JSON.stringify(value, null, 2), "utf-8");
}
