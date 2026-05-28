'use client';

import { useState } from 'react';
import type { Salon } from '@/types/salon';

type SalonEditFormProps = {
  salon: Salon;
  onSave: (updated: Partial<Salon>) => Promise<void>;
  onCancel: () => void;
};

const PRICE_OPTIONS = ['€', '€€', '€€€', '€€€€'];

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-fuchsia-300 transition';

const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-stone-400 mb-1';

export default function SalonEditForm({ salon, onSave, onCancel }: SalonEditFormProps) {
  const [form, setForm] = useState({
    name: salon.name,
    address: salon.address,
    district: salon.district,
    phone: salon.phone ?? '',
    website: salon.website ?? '',
    services: salon.services?.join(', ') ?? '',
    priceRange: salon.priceRange ?? '',
    rating: salon.rating?.toString() ?? '',
    reviewCount: salon.reviewCount?.toString() ?? '',
    latitude: salon.latitude?.toString() ?? '',
    longitude: salon.longitude?.toString() ?? '',
  });
  const [saving, setSaving] = useState(false);

  const set = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave({
      name: form.name,
      address: form.address,
      district: form.district,
      phone: form.phone || null,
      website: form.website || null,
      services: form.services ? form.services.split(',').map((s) => s.trim()).filter(Boolean) : null,
      priceRange: form.priceRange || null,
      rating: form.rating ? parseFloat(form.rating) : null,
      reviewCount: form.reviewCount ? parseInt(form.reviewCount) : null,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
    });
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className={labelClass}>Name</label>
          <input className={inputClass} value={form.name} onChange={set('name')} required />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Address</label>
          <input className={inputClass} value={form.address} onChange={set('address')} required />
        </div>

        <div>
          <label className={labelClass}>District</label>
          <input className={inputClass} value={form.district} onChange={set('district')} required />
        </div>

        <div>
          <label className={labelClass}>Price Range</label>
          <select className={inputClass} value={form.priceRange} onChange={set('priceRange')}>
            <option value="">—</option>
            {PRICE_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <input className={inputClass} value={form.phone} onChange={set('phone')} type="tel" />
        </div>

        <div>
          <label className={labelClass}>Website</label>
          <input className={inputClass} value={form.website} onChange={set('website')} type="url" />
        </div>

        <div>
          <label className={labelClass}>Rating (0–5)</label>
          <input className={inputClass} value={form.rating} onChange={set('rating')} type="number" min="0" max="5" step="0.1" />
        </div>

        <div>
          <label className={labelClass}>Review Count</label>
          <input className={inputClass} value={form.reviewCount} onChange={set('reviewCount')} type="number" min="0" />
        </div>

        <div>
          <label className={labelClass}>Latitude</label>
          <input className={inputClass} value={form.latitude} onChange={set('latitude')} type="number" step="any" />
        </div>

        <div>
          <label className={labelClass}>Longitude</label>
          <input className={inputClass} value={form.longitude} onChange={set('longitude')} type="number" step="any" />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass}>Services (comma-separated)</label>
          <input className={inputClass} value={form.services} onChange={set('services')} />
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2 rounded-xl bg-fuchsia-600 text-white text-sm font-semibold hover:bg-fuchsia-700 disabled:opacity-50 transition"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
