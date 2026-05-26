import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    getApartments,
    deleteApartment,
    updateApartmentStatus,
} from '../api/apartments';
import type { Apartment, ApartmentStatus } from '../types';
import ApartmentForm from '../components/ApartmentForm';
import { Link } from 'react-router-dom';

const statusColors: Record<ApartmentStatus, string> = {
    Interested: 'bg-blue-100 text-blue-800',
    Visited: 'bg-yellow-100 text-yellow-800',
    PendingResponse: 'bg-purple-100 text-purple-800',
    Rejected: 'bg-red-100 text-red-800',
    GotIt: 'bg-green-100 text-green-800',
};

const statusOptions: { value: ApartmentStatus; label: string }[] = [
    { value: 'Interested', label: 'מתעניינת' },
    { value: 'Visited', label: 'ביקרתי' },
    { value: 'PendingResponse', label: 'מחכה לתשובה' },
    { value: 'Rejected', label: 'נדחה' },
    { value: 'GotIt', label: 'קיבלתי!' },
];

export default function Apartments() {
    const { email, logout } = useAuth();
    const [apartments, setApartments] = useState<Apartment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Apartment | null>(null);

    async function loadApartments() {
        try {
            setLoading(true);
            const data = await getApartments();
            setApartments(data);
        } catch {
            setError('Failed to load apartments');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadApartments();
    }, []);

    async function handleDelete(id: number) {
        if (!confirm('למחוק את הדירה?')) return;
        try {
            await deleteApartment(id);
            setApartments((prev) => prev.filter((a) => a.id !== id));
        } catch {
            alert('המחיקה נכשלה');
        }
    }

    async function handleStatusChange(id: number, status: ApartmentStatus) {
        try {
            await updateApartmentStatus(id, status);
            setApartments((prev) =>
                prev.map((a) => (a.id === id ? { ...a, status } : a))
            );
        } catch {
            alert('עדכון הסטטוס נכשל');
        }
    }

    function openAdd() {
        setEditing(null);
        setModalOpen(true);
    }

    function openEdit(apt: Apartment) {
        setEditing(apt);
        setModalOpen(true);
    }

    function closeModal() {
        setModalOpen(false);
        setEditing(null);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-bold">🏠 Apartment Tracker</h1>
                        <nav className="flex gap-4">
                            <Link to="/" className="text-blue-600 font-semibold">דירות</Link>
                            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">דשבורד</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">{email}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">
                        הדירות שלי ({apartments.length})
                    </h2>
                    <button
                        onClick={openAdd}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        + הוסיפי דירה
                    </button>
                </div>

                {loading && <p className="text-gray-500">טוען...</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!loading && apartments.length === 0 && !error && (
                    <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
                        עדיין לא הוספת דירות. לחצי על "הוסיפי דירה" למעלה כדי להתחיל.
                    </div>
                )}

                {!loading && apartments.length > 0 && (
                    <div className="grid gap-4">
                        {apartments.map((apt) => (
                            <div
                                key={apt.id}
                                className="bg-white p-6 rounded-lg shadow hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold">{apt.neighborhood}</h3>
                                            <select
                                                value={apt.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        apt.id,
                                                        e.target.value as ApartmentStatus
                                                    )
                                                }
                                                className={`px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer ${statusColors[apt.status]}`}
                                            >
                                                {statusOptions.map((o) => (
                                                    <option key={o.value} value={o.value}>
                                                        {o.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <p className="text-gray-600 text-sm">{apt.address}</p>
                                        <div className="flex gap-4 mt-3 text-sm text-gray-700">
                                            <span>{apt.rooms} חדרים</span>
                                            <span>{apt.sizeSqm} מ"ר</span>
                                            <span className="font-semibold">
                                                ₪{apt.price.toLocaleString()}
                                            </span>
                                        </div>
                                        {apt.contactName && (
                                            <p className="text-xs text-gray-500 mt-2">
                                                איש קשר: {apt.contactName}
                                                {apt.contactPhone && ` · ${apt.contactPhone}`}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => openEdit(apt)}
                                            className="text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-sm"
                                        >
                                            ערוך
                                        </button>
                                        <button
                                            onClick={() => handleDelete(apt.id)}
                                            className="text-red-600 hover:bg-red-50 px-3 py-1 rounded text-sm"
                                        >
                                            מחק
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {modalOpen && (
                <ApartmentForm
                    apartment={editing}
                    onClose={closeModal}
                    onSaved={loadApartments}
                />
            )}
        </div>
    );
}