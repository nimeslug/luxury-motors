"use client";

import { useActionState } from "react";
import { submitInquiry } from "@/app/actions/inquiries";
import { Check } from "lucide-react";

const inquiryTypes = [
  { value: "bilgi", label: "Genel Bilgi" },
  { value: "test_surusu", label: "Test Sürüşü" },
  { value: "fiyat_teklifi", label: "Fiyat Teklifi" },
];

export function ContactForm({
  carId,
  defaultType = "bilgi",
  defaultMessage = "",
  defaultEmail = "",
  defaultName = "",
}: {
  carId?: string;
  defaultType?: string;
  defaultMessage?: string;
  defaultEmail?: string;
  defaultName?: string;
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, {
    error: null,
    success: false,
  });

  if (state.success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-accent/10 mx-auto mb-6 flex items-center justify-center">
          <Check className="w-8 h-8 text-accent" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-2xl mb-3">Mesajınız İletildi</h3>
        <p className="text-sm text-muted">
          En kısa sürede sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors";

  return (
    <form action={formAction} className="space-y-5">
      {carId && <input type="hidden" name="carId" value={carId} />}

      <div>
        <label className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block">
          İletişim Konusu
        </label>
        <select
          name="type"
          defaultValue={defaultType}
          className={inputClass}
        >
          {inquiryTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label
            htmlFor="fullName"
            className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block"
          >
            Ad Soyad *
          </label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            defaultValue={defaultName}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block"
          >
            E-posta *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            defaultValue={defaultEmail}
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone"
          className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block"
        >
          Telefon
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          className={inputClass}
          placeholder="+90 ..."
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="text-xs tracking-[0.2em] uppercase text-muted mb-2 block"
        >
          Mesajınız *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          defaultValue={defaultMessage}
          className={inputClass + " resize-none"}
          placeholder="Sorunuzu veya talebinizi belirtiniz..."
        />
      </div>

      {state.error && (
        <div className="text-xs text-accent border-l-2 border-accent pl-3 py-2">
          {state.error}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full px-6 py-4 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Gönderiliyor..." : "Mesajı Gönder"}
      </button>
    </form>
  );
}