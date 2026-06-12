import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSecret() {
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
        throw new Error("AUTH_SECRET není nastaven.");
    }
    return new TextEncoder().encode(secret);
}

export async function createSession() {
    const token = await new SignJWT({ role: "admin" })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_MAX_AGE}s`)
        .sign(getSecret());

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE,
        path: "/",
    });
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function verifySession(): Promise<boolean> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) {
        return false;
    }

    try {
        await jwtVerify(token, getSecret());
        return true;
    } catch {
        return false;
    }
}

export async function verifySessionToken(token: string): Promise<boolean> {
    try {
        await jwtVerify(token, getSecret());
        return true;
    } catch {
        return false;
    }
}

export { COOKIE_NAME };

export function checkAdminCredentials(username: string, password: string): boolean {
    const expectedUser = process.env.ADMIN_USERNAME;
    const expectedPass = process.env.ADMIN_PASSWORD;

    if (!expectedUser || !expectedPass) {
        return false;
    }

    return username === expectedUser && password === expectedPass;
}
