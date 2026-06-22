"use client";

import { useActionState } from "react";
import { signUp } from "@/app/(auth)/actions";
import Link from "next/link";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(signUp, { error: null });

  const inputClass =
    "w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <div className="w-full max-w-md">
      <div className="mb-10 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-accent mb-3">
          Hoş Geldiniz
        </p>
        <h1 className="font-serif text-4xl mb-3">Hesap Oluştur</h1>
        <p className="text-sm text-muted">
          Favori araçlarınıza erişin ve özel teklifler alın.
        </p>
      </div>

      <form action={formAction} className="space-y-5">
        <div>
          <label
            htmlFor="fullName"
            className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block"
          >
            Ad Soyad
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            required
            className={inputClass}
            placeholder="Adınız Soyadınız"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block"
          >
            E-posta
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
            className={inputClass}
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block"
          >
            Şifre
          </label>
          <input
            id="password"
            type="password"
            name="password"
            required
            minLength={8}
            className={inputClass}
            placeholder="En az 8 karakter"
          />
        </div>

        {state?.error && (
          <div className="text-xs text-accent border-l-2 border-accent pl-3 py-2">
            {state.error}
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {pending ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
        </button>

        <p className="text-center text-sm text-muted pt-4">
          Zaten hesabınız var mı?{" "}
          <Link
            href="/login"
            className="text-foreground hover:text-accent transition-colors underline underline-offset-4"
          >
            Giriş Yap
          </Link>
        </p>
      </form>
    </div>
  );
}