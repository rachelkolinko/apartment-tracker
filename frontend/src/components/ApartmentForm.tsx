import { useState, type FormEvent, type ReactNode } from 'react';
import type {
  Apartment,
  ApartmentStatus,
  CreateApartmentRequest,
} from '../types';
import { createApartment, updateApartment } from '../api/apartments';

interface Props {
  apartment: Apartment | null;
  onClose: () => void;
  onSaved: () => void;
}

const statusOptions: { value: ApartmentStatus; label: string }[] = [
  { value: 'Interested', label: 'מתעניינת' },
  { value: 'Visited', label: 'ביקרתי' },
  { value: 'PendingResponse', label: 'מחכה לתשובה' },
  { value: 'Rejected', label: 'נדחה' },
  { value: 'GotIt', label: 'קיבלתי!' },
];

const inputCls =
  'w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500';

function Field({
  label,
  wide,
  children,
}: {
  label: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? 'col-span-2' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ApartmentForm({ apartment, onClose, onSaved }: Props) {
  const [form, setForm] = useState<CreateApartmentRequest>({
    neighborhood: apartment?.neighborhood ?? '',
    address: apartment?.address ?? '',
    rooms: apartment?.rooms ?? 3,
    sizeSqm: apartment?.sizeSqm ?? 60,
    price: apartment?.price ?? 6000,
    status: apartment?.status ?? 'Interested',
    contactName: apartment?.contactName ?? '',
    contactPhone: apartment?.contactPhone ?? '',
    listingUrl: apartment?.listingUrl ?? '',
    notes: apartment?.notes ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update<K extends keyof CreateApartmentRequest>(
    key: K,
    value: CreateApartmentRequest[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (apartment) {
        await updateApartment(apartment.id, form);
      } else {
        await createApartment(form);
      }
      onSaved();
      onClose();
    } catch {
      setError('שמירה נכשלה');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-bold">
            {apartment ? 'עריכת דירה' : 'הוספת דירה חדשה'}
          </h2>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <Field label="שכונה *">
            <input
              value={form.neighborhood}
              onChange={(e) => update('neighborhood', e.target.value)}
              required
              className={inputCls}
            />
          </Field>

          <Field label="כתובת *">
            <input
              value={form.address}
              onChange={(e) => update('address', e.target.value)}
              required
              className={inputCls}
            />
          </Field>

          <Field label="חדרים">
            <input
              type="number"
              min={1}
              step={0.5}
              value={form.rooms}
              onChange={(e) => update('rooms', Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          <Field label='גודל (מ"ר)'>
            <input
              type="number"
              min={1}
              value={form.sizeSqm}
              onChange={(e) => update('sizeSqm', Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          <Field label="מחיר (₪)">
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => update('price', Number(e.target.value))}
              className={inputCls}
            />
          </Field>

          <Field label="סטטוס">
            <select
              value={form.status}
              onChange={(e) => update('status', e.target.value as ApartmentStatus)}
              className={inputCls}
            >
              {statusOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="שם איש קשר">
            <input
              value={form.contactName}
              onChange={(e) => update('contactName', e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="טלפון">
            <input
              value={form.contactPhone}
              onChange={(e) => update('contactPhone', e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="קישור למודעה" wide>
            <input
              type="url"
              value={form.listingUrl}
              onChange={(e) => update('listingUrl', e.target.value)}
              className={inputCls}
            />
          </Field>

          <Field label="הערות" wide>
            <textarea
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              rows={3}
              className={inputCls}
            />
          </Field>

          {error && <p className="col-span-2 text-red-600 text-sm">{error}</p>}
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end gap-2 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-100"
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? '...' : 'שמירה'}
          </button>
        </div>
      </form>
    </div>
  );
}