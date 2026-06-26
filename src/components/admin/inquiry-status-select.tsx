"use client";

import { useTransition } from "react";
import { updateInquiryStatus } from "@/app/actions/inquiry-admin";

type Status = "yeni" | "gorusuldu" | "tamamlandi" | "iptal";

export function InquiryStatusSelect({
  inquiryId,
  currentStatus,
}: {
  inquiryId: string;
  currentStatus: Status;
}) {
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as Status;
    startTransition(() => {
      updateInquiryStatus(inquiryId, status);
    });
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={pending}
      className="w-full px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
    >
      <option value="yeni">Yeni</option>
      <option value="gorusuldu">Görüşüldü</option>
      <option value="tamamlandi">Tamamlandı</option>
      <option value="iptal">İptal</option>
    </select>
  );
}
