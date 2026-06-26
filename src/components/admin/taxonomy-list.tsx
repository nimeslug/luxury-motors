"use client";

import { useActionState, useState, useTransition } from "react";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";

type Item = { id: string; name: string; slug: string };

type Actions = {
  create: (
    prev: { error: string | null },
    formData: FormData
  ) => Promise<{ error: string | null }>;
  update: (id: string, name: string) => Promise<{ error: string | null }>;
  remove: (id: string) => Promise<{ error: string | null }>;
};

export function TaxonomyList({
  items,
  actions,
  itemLabel,
}: {
  items: Item[];
  actions: Actions;
  itemLabel: string;
}) {
  const [state, formAction, pending] = useActionState(actions.create, {
    error: null,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [busy, startTransition] = useTransition();

  function handleEditStart(item: Item) {
    setEditingId(item.id);
    setEditName(item.name);
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditName("");
  }

  function handleEditSave(id: string) {
    if (!editName.trim()) return;
    startTransition(() => {
      actions.update(id, editName.trim()).then(() => {
        setEditingId(null);
        setEditName("");
      });
    });
  }

  function handleDelete(item: Item) {
    if (!confirm(itemLabel + " \"" + item.name + "\" silinecek. Emin misiniz?")) return;
    startTransition(() => {
      actions.remove(item.id);
    });
  }

  return (
    <div className="space-y-8">
      <form action={formAction} className="border border-border p-6">
        <p className="text-xs tracking-[0.3em] uppercase text-accent mb-4">
          Yeni {itemLabel} Ekle
        </p>
        <div className="flex gap-3">
          <input
            name="name"
            required
            placeholder={itemLabel + " adı"}
            className="flex-1 px-4 py-3 bg-transparent border border-border text-sm focus:outline-none focus:border-foreground transition-colors"
          />
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background hover:bg-accent transition-colors text-xs tracking-[0.3em] uppercase disabled:opacity-50"
          >
            <Plus className="w-4 h-4" strokeWidth={1.5} />
            Ekle
          </button>
        </div>
        {state.error && (
          <p className="text-xs text-accent mt-3">{state.error}</p>
        )}
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-muted text-center py-12">
          Henüz {itemLabel.toLowerCase()} yok.
        </p>
      ) : (
        <div className="border border-border">
          <table className="w-full text-sm">
            <thead className="bg-surface/50">
              <tr className="text-xs tracking-[0.2em] uppercase text-muted">
                <th className="text-left p-4 font-normal">İsim</th>
                <th className="text-left p-4 font-normal">Slug</th>
                <th className="text-right p-4 font-normal">Eylem</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isEditing = editingId === item.id;
                return (
                  <tr
                    key={item.id}
                    className="border-t border-border hover:bg-surface/30 transition-colors"
                  >
                    <td className="p-4">
                      {isEditing ? (
                        <input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          autoFocus
                          className="w-full px-3 py-2 bg-transparent border border-foreground text-sm focus:outline-none"
                        />
                      ) : (
                        <span className="font-medium">{item.name}</span>
                      )}
                    </td>
                    <td className="p-4 text-muted font-mono text-xs">
                      {item.slug}
                    </td>
                    <td className="p-4 text-right">
                      {isEditing ? (
                        <div className="inline-flex gap-3">
                          <button
                            onClick={() => handleEditSave(item.id)}
                            disabled={busy}
                            className="text-xs hover:text-accent transition-colors inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" strokeWidth={1.5} />
                            Kaydet
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="text-xs text-muted hover:text-foreground transition-colors inline-flex items-center gap-1"
                          >
                            <X className="w-3 h-3" strokeWidth={1.5} />
                            İptal
                          </button>
                        </div>
                      ) : (
                        <div className="inline-flex gap-4">
                          <button
                            onClick={() => handleEditStart(item)}
                            className="text-xs tracking-[0.2em] uppercase hover:text-accent transition-colors inline-flex items-center gap-1"
                          >
                            <Pencil className="w-3 h-3" strokeWidth={1.5} />
                            Düzenle
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            disabled={busy}
                            className="text-xs tracking-[0.2em] uppercase text-accent hover:opacity-70 transition-opacity inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" strokeWidth={1.5} />
                            Sil
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
