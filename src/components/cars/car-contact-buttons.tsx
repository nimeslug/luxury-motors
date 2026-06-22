"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { ContactForm } from "@/components/contact/contact-form";

type InquiryType = "bilgi" | "test_surusu" | "fiyat_teklifi";

export function CarContactButtons({
  carId,
  carModel,
  defaultName,
  defaultEmail,
}: {
  carId: string;
  carModel: string;
  defaultName: string;
  defaultEmail: string;
}) {
  const [openType, setOpenType] = useState<InquiryType | null>(null);

  const titleMap: Record<InquiryType, string> = {
    bilgi: `${carModel} Hakkında Bilgi Al`,
    test_surusu: `${carModel} Test Sürüşü`,
    fiyat_teklifi: `${carModel} Fiyat Teklifi`,
  };

  const messageMap: Record<InquiryType, string> = {
    bilgi: `${carModel} hakkında daha fazla bilgi almak istiyorum.`,
    test_surusu: `${carModel} için test sürüşü talep ediyorum.`,
    fiyat_teklifi: `${carModel} için fiyat teklifi almak istiyorum.`,
  };

  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setOpenType("bilgi")}
          className="w-full px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase cursor-pointer"
        >
          İletişime Geç
        </button>
        <button
          onClick={() => setOpenType("test_surusu")}
          className="w-full px-6 py-3 border border-border hover:bg-surface transition-colors text-xs tracking-[0.3em] uppercase cursor-pointer"
        >
          Test Sürüşü Talep Et
        </button>
      </div>

      <Modal
        open={openType !== null}
        onClose={() => setOpenType(null)}
        title={openType ? titleMap[openType] : undefined}
      >
        {openType && (
          <ContactForm
            carId={carId}
            defaultType={openType}
            defaultMessage={messageMap[openType]}
            defaultName={defaultName}
            defaultEmail={defaultEmail}
          />
        )}
      </Modal>
    </>
  );
}