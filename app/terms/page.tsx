export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Hizmet Şartları</h1>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <p className="text-sm text-gray-500">Son güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">1. Hizmet Tanımı</h2>
              <p>
                Bu platform, dinamik QR kod ve NFC yönlendirme hizmeti sunmaktadır. Kullanıcılar,
                kısa linkler oluşturabilir, QR kodlar üretebilir ve analitik veriler toplayabilirler.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2. Kullanım Koşulları</h2>
              <p>Platformu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Hizmeti yasalara uygun ve etik bir şekilde kullanacaksınız</li>
                <li>Zararlı, yanıltıcı veya yasadışı içeriğe yönlendirme yapmayacaksınız</li>
                <li>Spam, phishing veya kötü amaçlı kullanım yapılmayacaktır</li>
                <li>Başkalarının haklarını ihlal edecek şekilde kullanılmayacaktır</li>
                <li>Platform güvenliğini tehlikeye atacak eylemlerde bulunmayacaksınız</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3. Yasak Kullanımlar</h2>
              <p>Aşağıdaki içeriklere yönlendirme kesinlikle yasaktır:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Yasa dışı, zararlı veya tehditkar içerik</li>
                <li>Pornografik veya müstehcen materyal</li>
                <li>Telif hakkı ihlali içeren içerik</li>
                <li>Phishing veya dolandırıcılık siteleri</li>
                <li>Malware, virüs veya zararlı yazılım</li>
                <li>Nefret söylemi veya ayrımcılık içeren içerik</li>
                <li>Terör, şiddet veya suç teşvik eden içerik</li>
              </ul>
              <p className="mt-3">
                <strong>Bu kurallara uymayan linkler derhal silinecek ve hesap askıya alınabilir.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4. Hizmet Garantisi ve Sorumluluk</h2>
              <p>
                Platform sahibi, hizmetin kesintisiz ve hatasız çalışacağını garanti etmez.
                Aşağıdaki durumlardan sorumlu değildir:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Teknik arızalar veya sistem bakımları nedeniyle oluşan kesintiler</li>
                <li>Üçüncü taraf hizmet sağlayıcılardan kaynaklanan sorunlar</li>
                <li>Kullanıcıların oluşturduğu içerik ve yönlendirdikleri siteler</li>
                <li>Veri kaybı veya analitik verilerdeki hatalar</li>
                <li>Kullanıcıların yanlış konfigürasyonları</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5. Fikri Mülkiyet</h2>
              <p>
                Platform ve tüm içeriği (tasarım, kod, logo, vb.) telif hakkı ile korunmaktadır.
                Kullanıcılar yalnızca kendi oluşturdukları QR kod ve linklerin sahibidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6. Hesap Askıya Alma ve Sonlandırma</h2>
              <p>
                Platform yönetimi, hizmet şartlarını ihlal eden kullanıcıların hesaplarını
                uyarı vermeksizin askıya alma veya sonlandırma hakkını saklı tutar.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7. Veri Yedekleme</h2>
              <p>
                Kullanıcılar kendi verilerini yedeklemekle sorumludur. Platform yönetimi,
                veri kaybı durumunda sorumluluk kabul etmez. Kritik linkler için düzenli
                yedekleme yapılması önerilir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">8. Ücretlendirme</h2>
              <p>
                Platformun şu anki kullanımı ücretsizdir. Gelecekte ücretli planlar
                sunulması durumunda kullanıcılar önceden bilgilendirilecektir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9. Değişiklikler</h2>
              <p>
                Platform yönetimi, hizmet şartlarını önceden haber vermeksizin değiştirme
                hakkını saklı tutar. Önemli değişiklikler kullanıcılara duyurulacaktır.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10. Uygulanacak Hukuk</h2>
              <p>
                Bu şartlar Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlık durumunda
                Türkiye mahkemeleri yetkilidir.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11. İletişim</h2>
              <p>
                Hizmet şartları hakkında sorularınız için lütfen platform yöneticisiyle
                iletişime geçin.
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
