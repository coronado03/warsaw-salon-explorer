'use client';

import { useState } from 'react';
import { HiPencil, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import type { Salon } from '@/types/salon';
import { patchSalon } from '@/lib/api';
import SalonDetailView from './SalonDetailView';
import SalonEditForm from './SalonEditForm';

type SalonDetailClientProps = {
  initial: Salon;
};

export default function SalonDetailClient({ initial }: SalonDetailClientProps) {
  const [salon, setSalon] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async (data: Partial<Salon>) => {
    setSaveError(null);
    try {
      const updated = await patchSalon(salon.id, data);
      setSalon(updated);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {saved && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
          <HiCheckCircle className="w-4 h-4 shrink-0" />
          Salon updated successfully.
        </div>
      )}

      {saveError && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
          <HiExclamationCircle className="w-4 h-4 shrink-0" />
          {saveError}
        </div>
      )}

      <div className="flex items-center justify-between">
        <span />
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 hover:border-fuchsia-300 hover:text-fuchsia-700 transition"
          >
            <HiPencil className="w-3.5 h-3.5" />
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <SalonEditForm
          salon={salon}
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <SalonDetailView salon={salon} />
      )}
    </div>
  );
}
