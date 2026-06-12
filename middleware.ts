import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "./app/lib/auth";

async function isValidSession(token: string | undefined): Promise<boolean> {
    if (!token || !process.env.AUTH_SECRET) {
        return false;
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
        return true;
    } catch {
        return false;
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === "/admin/login") {
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
        const token = request.cookies.get(COOKIE_NAME)?.value;
        const valid = await isValidSession(token);

        if (!valid) {
            if (pathname.startsWith("/api/admin")) {
                return NextResponse.json({ error: "Neautorizováno" }, { status: 401 });
            }

            const loginUrl = new URL("/admin/login", request.url);
            loginUrl.searchParams.set("from", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/api/admin/:path*"],
};
