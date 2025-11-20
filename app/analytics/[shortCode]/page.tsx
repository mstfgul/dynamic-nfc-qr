'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Stats {
  total: number;
  last24Hours: number;
  last7Days: number;
  last30Days: number;
  byDevice: Record<string, number>;
  byBrowser: Record<string, number>;
  byOS: Record<string, number>;
  byCountry: Record<string, number>;
}

interface Click {
  _id: string;
  timestamp: string;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  referer?: string;
}

interface Link {
  shortCode: string;
  destinationUrl: string;
  title?: string;
  clickCount: number;
}

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const shortCode = params.shortCode as string;

  const [loading, setLoading] = useState(true);
  const [link, setLink] = useState<Link | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentClicks, setRecentClicks] = useState<Click[]>([]);

  useEffect(() => {
    fetchAnalytics();
  }, [shortCode]);

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`/api/analytics/${shortCode}`);
      const data = await res.json();

      if (data.success) {
        setLink(data.data.link);
        setStats(data.data.stats);
        setRecentClicks(data.data.recentClicks);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({
    title,
    value,
    color = 'blue',
  }: {
    title: string;
    value: number;
    color?: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
    </div>
  );

  const ChartCard = ({ title, data }: { title: string; data: Record<string, number> }) => {
    const sortedData = Object.entries(data).sort((a, b) => b[1] - a[1]);
    const total = Object.values(data).reduce((sum, val) => sum + val, 0);

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="space-y-3">
          {sortedData.length === 0 ? (
            <p className="text-gray-500 text-sm">Veri yok</p>
          ) : (
            sortedData.map(([key, value]) => {
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{key}</span>
                    <span className="text-gray-600">
                      {value} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!link || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Link bulunamadı</h2>
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Ana sayfaya dön
          </button>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-700 font-medium mb-4"
          >
            ← Geri
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Analitik Dashboard</h1>
          <div className="mt-4 bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">{link.title || 'İsimsiz Link'}</h2>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Kısa Link:</span>
                <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
                  {baseUrl}/{link.shortCode}
                </code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Hedef:</span>
                <a
                  href={link.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {link.destinationUrl}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Toplam Tıklama" value={stats.total} color="blue" />
          <StatCard title="Son 24 Saat" value={stats.last24Hours} color="green" />
          <StatCard title="Son 7 Gün" value={stats.last7Days} color="purple" />
          <StatCard title="Son 30 Gün" value={stats.last30Days} color="orange" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Cihaz Türü" data={stats.byDevice} />
          <ChartCard title="Tarayıcı" data={stats.byBrowser} />
          <ChartCard title="İşletim Sistemi" data={stats.byOS} />
          <ChartCard title="Ülke" data={stats.byCountry} />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Son Tıklamalar</h3>
          {recentClicks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz tıklama yok</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cihaz
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarayıcı
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ülke
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentClicks.map((click) => (
                    <tr key={click._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(click.timestamp).toLocaleString('tr-TR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {click.device || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {click.browser || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {click.os || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {click.country || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
