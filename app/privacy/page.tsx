export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Gizlilik Politikası</h1>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <p className="text-sm text-gray-500">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Veri Sorumlusu</h2>
              <p>
                Bu platform tarafından toplanan kişisel verilerinizin veri sorumlusu platform sahibidir.
                Kişisel verileriniz KVKK (Kişisel Verilerin Korunması Kanunu) ve GDPR uyarınca işlenmektedir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Toplanan Veriler</h2>
              <p>QR kod ve NFC bağlantılarınızı kullandığınızda aşağıdaki veriler otomatik olarak toplanır:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>IP Adresi:</strong> Coğrafi konum tahmini için</li>
                <li><strong>Tarayıcı Bilgisi:</strong> Kullandığınız tarayıcı (Chrome, Safari, vb.)</li>
                <li><strong>Cihaz Türü:</strong> Mobile, desktop veya tablet</li>
                <li><strong>İşletim Sistemi:</strong> iOS, Android, Windows, vb.</li>
                <li><strong>Tıklama Zamanı:</strong> Bağlantıya tıklama tarihi ve saati</li>
                <li><strong>Referans URL:</strong> Nereden geldiğiniz (opsiyonel)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Verilerin Kullanım Amacı</h2>
              <p>Toplanan veriler yalnızca aşağıdaki amaçlarla kullanılır:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Link tıklama istatistiklerinin oluşturulması</li>
                <li>Kullanıcı davranışlarının analiz edilmesi</li>
                <li>Hizmet kalitesinin iyileştirilmesi</li>
                <li>Teknik sorunların tespit edilmesi ve çözülmesi</li>
              </ul>
              <p className="mt-3">
                <strong>Verileriniz hiçbir şekilde üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Veri Saklama Süresi</h2>
              <p>
                Analitik verileri belirsiz süre boyunca saklanır. Ancak, kullanıcıların talep etmesi
                durumunda veriler silinebilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Haklarınız (KVKK & GDPR)</h2>
              <p>Kişisel verilerinizle ilgili aşağıdaki haklara sahipsiniz:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenmişse buna ilişkin bilgi talep etme</li>
                <li>Verilerin işlenme amacını öğrenme</li>
                <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>Verilerin eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
                <li>KVKK'da öngörülen şartlar çerçevesinde silinmesini isteme</li>
                <li>İşlenen verilerin münhasıran otomatik sistemler ile analiz edilmesi durumunda
                    aleyhine bir sonuç doğmasına itiraz etme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Çerezler (Cookies)</h2>
              <p>
                Platformumuz, kullanıcı deneyimini iyileştirmek için session storage kullanmaktadır.
                Bu veriler tarayıcınız kapatıldığında otomatik olarak silinir. Kalıcı çerez kullanmamaktayız.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Veri Güvenliği</h2>
              <p>
                Kişisel verileriniz, yetkisiz erişime, kayba veya kötüye kullanıma karşı korumak için
                endüstri standardı güvenlik önlemleri alınmıştır:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>SSL/TLS şifrelemesi</li>
                <li>Güvenli veritabanı bağlantıları</li>
                <li>Şifreli veri depolama</li>
                <li>Erişim kontrolü ve yetkilendirme</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8. Politika Değişiklikleri</h2>
              <p>
                Bu gizlilik politikası zaman zaman güncellenebilir. Önemli değişiklikler olması durumunda
                kullanıcılar bilgilendirilecektir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9. İletişim</h2>
              <p>
                Gizlilik politikamız hakkında sorularınız veya talepleriniz için lütfen platform
                yöneticisiyle iletişime geçin.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <a href="/" className="text-blue-600 hover:text-blue-700 text-sm">
              ← Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
