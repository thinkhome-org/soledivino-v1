"use client";

import { useActionState } from "react";
import { Button } from "@/app/components/button";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm({ from }: { from: string }) {
    const [state, formAction, pending] = useActionState(loginAction, initialState);

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-6">
            <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-8 shadow-sm">
                <h1 className="font-serif text-3xl text-black">Administrace</h1>
                <p className="mt-2 font-sans text-sm text-black/60">
                    Přihlaste se pro správu obsahu webu.
                </p>

                <form action={formAction} className="mt-8 space-y-5">
                    <input type="hidden" name="from" value={from} />

                    <div>
                        <label htmlFor="username" className="mb-1.5 block font-sans text-sm text-black/70">
                            Uživatelské jméno
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            required
                            className="w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="mb-1.5 block font-sans text-sm text-black/70">
                            Heslo
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full rounded-xl border border-black/15 px-4 py-3 font-sans text-black outline-none focus:border-black/40"
                        />
                    </div>

                    {state.error ? (
                        <p className="rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-700">
                            {state.error}
                        </p>
                    ) : null}

                    <Button type="submit" disabled={pending} className="w-full">
                        {pending ? "Přihlašuji…" : "Přihlásit se"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
