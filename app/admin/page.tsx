'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface LinkData {
  _id: string;
  shortCode: string;
  destinationUrl: string;
  title?: string;
  description?: string;
  qrCodeData?: string;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    destinationUrl: '',
    title: '',
    description: '',
    customCode: '',
  });

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchLinks();
    } else {
      router.push('/');
    }
  }, [router]);

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setLinks([data.data, ...links]);
        setFormData({ destinationUrl: '', title: '', description: '', customCode: '' });
        setShowForm(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating link:', error);
      alert('Link oluşturulurken hata oluştu');
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setLinks(links.map((link) => (link._id === id ? data.data : link)));
      }
    } catch (error) {
      console.error('Error toggling link:', error);
    }
  };

  const deleteLink = async (id: string) => {
    if (!confirm('Bu linki silmek istediğinden emin misin?')) return;

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success) {
        setLinks(links.filter((link) => link._id !== id));
      }
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Kopyalandı!');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    router.push('/');
  };

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dinamik NFC & QR Platform</h1>
            <p className="text-gray-600 mt-1">QR kodlarını ve NFC etiketlerini yönet</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              {showForm ? 'İptal' : '+ Yeni Link'}
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Çıkış
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Yeni Link Oluştur</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hedef URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.destinationUrl}
                  onChange={(e) => setFormData({ ...formData, destinationUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Link başlığı"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Link açıklaması"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Özel Kod (opsiyonel)
                </label>
                <input
                  type="text"
                  value={formData.customCode}
                  onChange={(e) => setFormData({ ...formData, customCode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="ornek-kod (boş bırakılırsa otomatik oluşturulur)"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
              >
                Oluştur
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : links.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">Henüz link oluşturulmamış</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              İlk linki oluştur
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {links.map((link) => (
              <div
                key={link._id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {link.title || 'İsimsiz Link'}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          link.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {link.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    {link.description && (
                      <p className="text-gray-600 mb-3">{link.description}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Kısa Link:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
                          {baseUrl}/{link.shortCode}
                        </code>
                        <button
                          onClick={() => copyToClipboard(`${baseUrl}/${link.shortCode}`)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          📋
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Hedef:</span>
                        <a
                          href={link.destinationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline truncate max-w-md"
                        >
                          {link.destinationUrl}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Tıklama:</span>
                        <span className="font-medium">{link.clickCount}</span>
                        <Link
                          href={`/analytics/${link.shortCode}`}
                          className="text-blue-600 hover:text-blue-700 ml-2"
                        >
                          Detayları Gör →
                        </Link>
                      </div>
                    </div>
                  </div>

                  {link.qrCodeData && (
                    <div className="ml-6">
                      <img
                        src={link.qrCodeData}
                        alt="QR Code"
                        className="w-32 h-32 border-2 border-gray-200 rounded-lg"
                      />
                      <a
                        href={link.qrCodeData}
                        download={`qr-${link.shortCode}.png`}
                        className="block text-center mt-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        İndir
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => toggleActive(link._id, link.isActive)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      link.isActive
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {link.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                  </button>
                  <button
                    onClick={() => deleteLink(link._id)}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium hover:bg-red-200 transition"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
