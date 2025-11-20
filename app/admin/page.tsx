'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Client {
  _id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
}

interface LinkData {
  _id: string;
  clientId?: { _id: string; name: string; company?: string };
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
  const [activeTab, setActiveTab] = useState<'links' | 'clients'>('links');

  // Links state
  const [links, setLinks] = useState<LinkData[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<LinkData[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('all');
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkFormData, setLinkFormData] = useState({
    destinationUrl: '',
    title: '',
    description: '',
    customCode: '',
    clientId: '',
  });

  // Clients state
  const [clients, setClients] = useState<Client[]>([]);
  const [showClientForm, setShowClientForm] = useState(false);
  const [clientFormData, setClientFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchClients();
      fetchLinks();
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    if (selectedClient === 'all') {
      setFilteredLinks(links);
    } else if (selectedClient === 'unassigned') {
      setFilteredLinks(links.filter(link => !link.clientId));
    } else {
      setFilteredLinks(links.filter(link => link.clientId?._id === selectedClient));
    }
  }, [selectedClient, links]);

  const fetchClients = async () => {
    try {
      const res = await fetch('/api/clients');
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links');
      const data = await res.json();
      if (data.success) {
        setLinks(data.data);
        setFilteredLinks(data.data);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(linkFormData),
      });

      const data = await res.json();
      if (data.success) {
        setLinks([data.data, ...links]);
        setLinkFormData({ destinationUrl: '', title: '', description: '', customCode: '', clientId: '' });
        setShowLinkForm(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating link:', error);
      alert('Link oluşturulurken hata oluştu');
    }
  };

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientFormData),
      });

      const data = await res.json();
      if (data.success) {
        setClients([data.data, ...clients]);
        setClientFormData({ name: '', company: '', email: '', phone: '' });
        setShowClientForm(false);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Müşteri oluşturulurken hata oluştu');
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

  const stats = {
    totalLinks: links.length,
    activeLinks: links.filter(l => l.isActive).length,
    totalClicks: links.reduce((sum, l) => sum + l.clickCount, 0),
    totalClients: clients.length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dinamik NFC & QR</h1>
              <p className="text-sm text-gray-600">Admin Panel</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
            >
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Toplam Link</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalLinks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Aktif Linkler</p>
            <p className="text-2xl font-bold text-green-600">{stats.activeLinks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Toplam Tıklama</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalClicks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600">Müşteriler</p>
            <p className="text-2xl font-bold text-orange-600">{stats.totalClients}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('links')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === 'links'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                QR & NFC Linkler
              </button>
              <button
                onClick={() => setActiveTab('clients')}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition ${
                  activeTab === 'clients'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Müşteriler
              </button>
            </nav>
          </div>

          {/* Links Tab */}
          {activeTab === 'links' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center">
                  <select
                    value={selectedClient}
                    onChange={(e) => setSelectedClient(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">Tüm Linkler</option>
                    <option value="unassigned">Atanmamış</option>
                    {clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.name} {client.company && `(${client.company})`}
                      </option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    {filteredLinks.length} link
                  </span>
                </div>
                <button
                  onClick={() => setShowLinkForm(!showLinkForm)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                >
                  {showLinkForm ? 'İptal' : '+ Yeni Link'}
                </button>
              </div>

              {showLinkForm && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-4">Yeni Link Oluştur</h3>
                  <form onSubmit={handleLinkSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <input
                        type="url"
                        required
                        value={linkFormData.destinationUrl}
                        onChange={(e) => setLinkFormData({ ...linkFormData, destinationUrl: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg text-sm text-gray-900"
                        placeholder="Hedef URL *"
                      />
                    </div>
                    <input
                      type="text"
                      value={linkFormData.title}
                      onChange={(e) => setLinkFormData({ ...linkFormData, title: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                      placeholder="Başlık"
                    />
                    <input
                      type="text"
                      value={linkFormData.customCode}
                      onChange={(e) => setLinkFormData({ ...linkFormData, customCode: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                      placeholder="Özel Kod (opsiyonel)"
                    />
                    <textarea
                      value={linkFormData.description}
                      onChange={(e) => setLinkFormData({ ...linkFormData, description: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                      placeholder="Açıklama"
                      rows={2}
                    />
                    <select
                      value={linkFormData.clientId}
                      onChange={(e) => setLinkFormData({ ...linkFormData, clientId: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                    >
                      <option value="">Müşteri Seç (opsiyonel)</option>
                      {clients.map((client) => (
                        <option key={client._id} value={client._id}>
                          {client.name} {client.company && `- ${client.company}`}
                        </option>
                      ))}
                    </select>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                      >
                        Oluştur
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredLinks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  Henüz link oluşturulmamış
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLinks.map((link) => (
                    <div key={link._id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {link.title || 'İsimsiz Link'}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs ${link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                              {link.isActive ? 'Aktif' : 'Pasif'}
                            </span>
                            {link.clientId && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {link.clientId.name}
                              </span>
                            )}
                          </div>
                          {link.description && <p className="text-sm text-gray-600 mb-2">{link.description}</p>}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <code className="bg-gray-100 px-2 py-1 rounded text-blue-600">
                                {baseUrl}/{link.shortCode}
                              </code>
                              <button onClick={() => copyToClipboard(`${baseUrl}/${link.shortCode}`)} className="text-blue-600 hover:text-blue-700">
                                📋
                              </button>
                            </div>
                            <span>→</span>
                            <a href={link.destinationUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate max-w-xs">
                              {link.destinationUrl}
                            </a>
                            <span>•</span>
                            <span>{link.clickCount} tıklama</span>
                            <Link href={`/analytics/${link.shortCode}`} className="text-blue-600 hover:underline">
                              Analitik
                            </Link>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => toggleActive(link._id, link.isActive)}
                              className={`px-3 py-1 rounded text-xs transition ${link.isActive ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                            >
                              {link.isActive ? 'Pasif Yap' : 'Aktif Yap'}
                            </button>
                            <button
                              onClick={() => deleteLink(link._id)}
                              className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs hover:bg-red-200 transition"
                            >
                              Sil
                            </button>
                          </div>
                        </div>
                        {link.qrCodeData && (
                          <div className="flex-shrink-0">
                            <img src={link.qrCodeData} alt="QR" className="w-20 h-20 border rounded" />
                            <a href={link.qrCodeData} download={`qr-${link.shortCode}.png`} className="block text-center mt-1 text-xs text-blue-600 hover:underline">
                              İndir
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clients Tab */}
          {activeTab === 'clients' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold">Müşteriler ({clients.length})</h3>
                <button
                  onClick={() => setShowClientForm(!showClientForm)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                >
                  {showClientForm ? 'İptal' : '+ Yeni Müşteri'}
                </button>
              </div>

              {showClientForm && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-4">Yeni Müşteri Ekle</h3>
                  <form onSubmit={handleClientSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      value={clientFormData.name}
                      onChange={(e) => setClientFormData({ ...clientFormData, name: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                      placeholder="İsim *"
                    />
                    <input
                      type="text"
                      value={clientFormData.company}
                      onChange={(e) => setClientFormData({ ...clientFormData, company: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                      placeholder="Şirket"
                    />
                    <input
                      type="email"
                      value={clientFormData.email}
                      onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                      placeholder="Email"
                    />
                    <input
                      type="tel"
                      value={clientFormData.phone}
                      onChange={(e) => setClientFormData({ ...clientFormData, phone: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm text-gray-900"
                      placeholder="Telefon"
                    />
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition"
                      >
                        Ekle
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clients.map((client) => (
                  <div key={client._id} className="border rounded-lg p-4 hover:shadow-md transition">
                    <h4 className="font-semibold text-gray-900">{client.name}</h4>
                    {client.company && <p className="text-sm text-gray-600">{client.company}</p>}
                    {client.email && <p className="text-xs text-gray-500 mt-2">{client.email}</p>}
                    {client.phone && <p className="text-xs text-gray-500">{client.phone}</p>}
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-xs text-gray-500">
                        {links.filter(l => l.clientId?._id === client._id).length} link
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
