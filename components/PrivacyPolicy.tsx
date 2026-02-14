
import React from 'react';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="relative bg-slate-50 text-slate-700 w-full max-w-2xl max-h-[90vh] my-auto rounded-3xl shadow-xl flex flex-col overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b bg-white/70 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
            <h1 className="text-lg font-bold text-slate-900">Gizlilik Politikası</h1>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 transition-colors flex items-center justify-center text-xl font-light">&times;</button>
        </header>
        <div className="overflow-y-auto p-8">
            <p className="text-sm text-slate-500 mb-8">Son Güncelleme: 24 Mayıs 2024</p>
            <div className="space-y-6 text-base leading-relaxed">
                <p>Dijital Hakim ("Uygulama"), kullanıcılarımızın gizliliğine saygı duyar. Bu politika, uygulamayı kullandığınızda hangi bilgileri topladığımızı, nasıl kullandığımızı ve koruduğumuzu açıklamaktadır.</p>
                <h2 className="text-xl font-bold text-slate-800 pt-4">Toplanan Bilgiler</h2>
                <p>Uygulama, hukuki analiz yapılması amacıyla girdiğiniz metinleri ve yüklediğiniz belgeleri (resim, PDF vb.) toplar. Bu veriler, yalnızca analiz talebiniz sırasında işlenir.</p>
                <p><strong>Hiçbir kişisel veriniz, hukuki metinleriniz veya yüklediğiniz belgeler sunucularımızda saklanmaz veya kaydedilmez.</strong></p>
                <h2 className="text-xl font-bold text-slate-800 pt-4">Bilgilerin Kullanımı</h2>
                <p>Girdiğiniz metinler ve yüklediğiniz belgeler, Google'ın Gemini API'sine güvenli bir bağlantı üzerinden gönderilir. Bu veriler, yapay zeka modelinin size bir hukuki analiz sonucu üretmesi için kullanılır. Analiz süreci tamamlandıktan sonra verileriniz sistemlerimizden kalıcı olarak silinir.</p>
                <p>Google, API üzerinden gönderilen verileri kendi gizlilik politikalarına uygun olarak işleyebilir. Google'ın gizlilik politikalarını incelemenizi öneririz.</p>
                <h2 className="text-xl font-bold text-slate-800 pt-4">Bilgilerin Paylaşımı</h2>
                <p>Verileriniz, hukuki analiz hizmetini sağlamak amacıyla yalnızca Google Gemini API ile paylaşılır. Bunun dışında hiçbir üçüncü taraf ile paylaşılmaz.</p>
                <h2 className="text-xl font-bold text-slate-800 pt-4">Veri Güvenliği</h2>
                <p>Verilerinizin güvenliğini sağlamak için endüstri standardı şifreleme yöntemleri (SSL/TLS) kullanıyoruz. Ancak, internet üzerinden hiçbir iletim yönteminin %100 güvenli olmadığını lütfen unutmayın.</p>
                <h2 className="text-xl font-bold text-slate-800 pt-4">Politika Değişiklikleri</h2>
                <p>Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacaktır.</p>
                <h2 className="text-xl font-bold text-slate-800 pt-4">İletişim</h2>
                <p>Bu gizlilik politikası hakkında sorularınız varsa, lütfen bizimle iletişime geçin. <br/><i>(Buraya bir e-posta adresi eklemeniz tavsiye edilir.)</i></p>
                <div className="mt-12 p-4 bg-slate-100 rounded-lg text-sm">
                    <strong>Yasal Uyarı:</strong> Bu uygulama tarafından üretilen analizler yapay zeka tarafından oluşturulmuştur ve yalnızca bilgilendirme amaçlıdır. Hukuki bir tavsiye niteliği taşımaz ve kesin bir bağlayıcılığı yoktur. Profesyonel bir avukata danışmanız önerilir.
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
