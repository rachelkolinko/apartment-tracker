import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats } from '../api/stats';
import type { DashboardStats, ApartmentStatus } from '../types';

const statusLabels: Record<ApartmentStatus, string> = {
  Interested: 'מתעניינת',
  Visited: 'ביקרתי',
  PendingResponse: 'מחכה לתשובה',
  Rejected: 'נדחה',
  GotIt: 'קיבלתי!',
};

const statusFill: Record<ApartmentStatus, string> = {
  Interested: '#3b82f6',
  Visited: '#eab308',
  PendingResponse: '#a855f7',
  Rejected: '#ef4444',
  GotIt: '#22c55e',
};

export default function Dashboard() {
  const { email, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch {
        setError('Failed to load stats');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        טוען...
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error || 'שגיאה'}
      </div>
    );
  }

  const pieData = stats.statusBreakdown.map((s) => ({
    name: statusLabels[s.status],
    value: s.count,
    fill: statusFill[s.status],
  }));

  const weekData = stats.apartmentsPerWeek.map((w) => ({
    week: new Date(w.weekStart).toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
    }),
    count: w.count,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">🏠 Apartment Tracker</h1>
            <nav className="flex gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
                דירות
              </Link>
              <Link to="/dashboard" className="text-blue-600 font-semibold">
                דשבורד
              </Link>
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

      <main className="max-w-6xl mx-auto p-8 space-y-6">
        <h2 className="text-xl font-semibold">סטטיסטיקות חיפוש</h2>

        <div className="grid grid-cols-2 gap-4">
          <StatCard label="סה״כ דירות" value={stats.totalApartments} />
          <StatCard label="ימי חיפוש" value={stats.searchDurationDays} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="פילוח לפי סטטוס">
            {pieData.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="ממוצע מחיר לפי שכונה (₪)">
            {stats.averagePriceByNeighborhood.length === 0 ? (
              <Empty />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={stats.averagePriceByNeighborhood}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="neighborhood" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averagePrice" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        <ChartCard title="דירות שנוספו לפי שבוע">
          {weekData.length === 0 ? (
            <Empty />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weekData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-4xl font-bold text-gray-900 mt-1">{value}</div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function Empty() {
  return (
    <div className="h-[280px] flex items-center justify-center text-gray-400">
      אין מספיק נתונים
    </div>
  );
}