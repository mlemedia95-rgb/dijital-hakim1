
import React, { useState, useRef, useEffect } from 'react';
import { analyzeDispute } from './services/geminiService';
import { LegalVerdict, AppStatus, FileData } from './types';
import PrivacyPolicy from './components/PrivacyPolicy';

const App: React.FC = () => {
  const [dispute, setDispute] = useState('');
  const [status, setStatus] = useState<AppStatus>('IDLE');
  const [result, setResult] = useState<LegalVerdict[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<FileData[]>([]);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Uygulamanın tam ekran (PWA) modunda olup olmadığını kontrol et
    const checkStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                          (window.navigator as any).standalone === true;
    setIsStandalone(checkStandalone);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    (Array.from(files) as File[]).forEach(file => {
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf';

      if (!isImage && !isPdf) {
        alert("Lütfen sadece resim veya PDF formatında belgeler yükleyin.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedFiles(prev => [...prev, {
          data: reader.result as string,
          mimeType: file.type
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispute.trim() && uploadedFiles.length === 0) {
      setError("Lütfen bir uyuşmazlık özeti yazın veya en az bir belge yükleyin.");
      return;
    }

    setStatus('ANALYZING');
    setError(null);

    try {
      const data = await analyzeDispute(dispute, uploadedFiles);
      setResult(data);
      setStatus('RESULT');
    } catch (err: any) {
      console.error("Analysis Error:", err);
      setError(err.message || "Analiz sırasında bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.");
      setStatus('ERROR');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9]">
      {/* Header */}
      <header className="legal-gradient text-white pt-12 pb-6 px-4 shadow-lg border-b-4 border-amber-600 relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500/20 p-2 rounded-xl backdrop-blur-sm">
                <i className="fas fa-balance-scale text-3xl text-amber-500"></i>
            </div>
            <div>
              <h1 className="serif-font text-2xl font-bold tracking-tight uppercase">Dijital Hakim</h1>
              <p className="text-slate-400 text-[9px] font-bold italic uppercase tracking-[0.2em]">Adli Karar Destek Sistemi</p>
            </div>
          </div>
          
          {/* Mobil Test/Yükleme İpucu - Sadece tarayıcıda gözükür */}
          {!isStandalone && (
            <button 
              onClick={() => setShowInstallGuide(true)}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all border border-white/20"
            >
              <i className="fas fa-mobile-alt text-amber-400"></i>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow max-w-4xl w-full mx-auto p-4 md:p-8 pb-24">
        {status !== 'RESULT' && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden transition-all">
            <div className="p-6 md:p-10 space-y-8">
              {/* Metin Girişi */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <i className="fas fa-paragraph text-amber-700 text-xs"></i>
                  </div>
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Olayın Detayları</h2>
                </div>
                <textarea
                  value={dispute}
                  onChange={(e) => setDispute(e.target.value)}
                  placeholder="Uyuşmazlık konusunu buraya yazabilir veya ilgili belgeleri aşağıdan yükleyebilirsiniz..."
                  className="w-full h-40 p-5 bg-slate-50 border border-slate-100 rounded-3xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none text-slate-800 transition-all shadow-inner text-sm leading-relaxed"
                ></textarea>
              </section>

              {/* Belge Yükleme */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <i className="fas fa-file-invoice text-amber-700 text-xs"></i>
                  </div>
                  <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kanıt & Dava Dosyaları</h2>
                </div>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center hover:border-amber-500 hover:bg-amber-50/50 cursor-pointer transition-all group"
                >
                  <input 
                    type="file" 
                    hidden 
                    ref={fileInputRef} 
                    multiple 
                    accept="image/*,application/pdf" 
                    onChange={handleFileUpload}
                  />
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-slate-50 rounded-full mx-auto flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                        <i className="fas fa-cloud-upload-alt text-2xl text-slate-300 group-hover:text-amber-600"></i>
                    </div>
                    <div>
                        <p className="text-slate-600 font-bold text-sm">Belgeleri Seçin</p>
                        <p className="text-slate-400 text-[10px] mt-1 font-medium">PDF veya Fotoğraf Havuzu</p>
                    </div>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {uploadedFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl border border-slate-100 overflow-hidden group shadow-sm bg-slate-50">
                        {file.mimeType === 'application/pdf' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 text-red-600 p-2">
                             <i className="fas fa-file-pdf text-3xl mb-1"></i>
                             <span className="text-[9px] font-bold uppercase">PDF</span>
                          </div>
                        ) : (
                          <img src={file.data} className="w-full h-full object-cover" />
                        )}
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                          className="absolute top-2 right-2 bg-white/95 text-red-600 w-7 h-7 rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-all"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-2xl flex items-start gap-4 animate-shake">
                  <i className="fas fa-circle-exclamation text-red-500 mt-1"></i>
                  <div>
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-tight">İşlem Başarısız</h4>
                    <p className="text-red-700 text-[11px] mt-1">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleConsult}
                disabled={status === 'ANALYZING'}
                className="btn-active w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl disabled:opacity-50 flex items-center justify-center gap-4 group transition-all"
              >
                {status === 'ANALYZING' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Hukuki Analiz Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-gavel text-amber-500 group-hover:rotate-[-20deg] transition-transform"></i>
                    <span className="text-sm">Analizi Başlat</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {status === 'ANALYZING' && (
          <div className="mt-16 text-center space-y-8 animate-pulse">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-[6px] border-amber-500/10 rounded-full"></div>
              <div className="absolute inset-0 border-[6px] border-amber-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-landmark text-3xl text-slate-300"></i>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="serif-font text-xl font-bold text-slate-700">Yapay Zeka Hakim Devrede</h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Kanun maddeleri ve deliller eşleştiriliyor</p>
            </div>
          </div>
        )}

        {status === 'RESULT' && result && (
          <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
            {/* Rapor Kartı */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border-t-[12px] border-amber-700 p-10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <i className="fas fa-balance-scale text-9xl"></i>
                </div>
                <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <i className="fas fa-scroll text-2xl text-amber-600"></i>
                </div>
                <h2 className="serif-font text-3xl font-black text-slate-900 leading-tight">HUKUKİ ANALİZ RAPORU</h2>
                <div className="inline-block px-6 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] mt-4 shadow-lg">
                    {result.length} Madde Tespit Edildi
                </div>
            </div>

            {/* Maddeler */}
            {result.map((item, index) => (
              <div key={index} className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200 transition-all hover:shadow-2xl">
                <div className="bg-slate-50/80 px-8 py-5 border-b border-slate-100 flex items-center justify-between backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black shadow-lg">
                        {index + 1}
                    </span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Gerekçeli Karar</span>
                  </div>
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-4 py-1.5 rounded-full font-black uppercase tracking-tighter">
                    {item.hukukiNiteleme}
                  </span>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="bg-amber-50/30 border-l-[6px] border-amber-500 p-6 rounded-r-3xl relative">
                    <i className="fas fa-quote-left absolute top-4 left-4 text-amber-100 text-4xl -z-10"></i>
                    <p className="text-slate-800 text-base serif-font leading-relaxed font-medium">
                      {item.basitAciklama}
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100">
                      <h4 className="font-black text-slate-400 mb-4 uppercase text-[9px] tracking-[0.2em] flex items-center gap-2">
                        <i className="fas fa-book-bookmark text-amber-600"></i> Mevzuat Dayanağı
                      </h4>
                      <div className="space-y-4">
                        {item.ilgiliMaddeler.map((m, idx) => (
                          <div key={idx} className="group">
                            <div className="text-[11px] font-black text-slate-900 mb-1 group-hover:text-amber-700 transition-colors uppercase tracking-tight">
                                {m.kanun} — Madde {m.madde}
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal italic">
                                {m.icerik}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                        <div className="flex-grow p-6 bg-slate-900 rounded-[1.5rem] text-center shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">Nihai Hüküm / Tavsiye</h4>
                            <p className="serif-font text-lg font-bold text-white uppercase leading-tight">
                                {item.hukum}
                            </p>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Aksiyonlar */}
            <div className="grid grid-cols-2 gap-4 pt-6 no-print">
              <button 
                onClick={() => { setStatus('IDLE'); setUploadedFiles([]); setResult(null); }}
                className="btn-active bg-white border-2 border-slate-100 text-slate-700 py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest hover:shadow-lg transition-all"
              >
                Yeni Oturum Aç
              </button>
              <button 
                onClick={() => window.print()}
                className="btn-active bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all"
              >
                Raporu Yazdır (PDF)
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Yükleme Rehberi Modalı */}
      {showInstallGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/60 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl">
                <div className="legal-gradient p-8 text-white text-center">
                    <i className="fas fa-mobile-screen-button text-5xl mb-4 text-amber-500"></i>
                    <h3 className="serif-font text-2xl font-bold uppercase tracking-tight">Uygulamayı Yükle</h3>
                    <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Tam Ekran Deneyimi İçin</p>
                </div>
                <div className="p-8 space-y-6">
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                            <i className="fab fa-apple text-slate-800 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">iOS (Safari)</p>
                            <p className="text-[10px] text-slate-500">Paylaş Butonu → Ana Ekrana Ekle</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
                            <i className="fab fa-android text-green-600 text-xl"></i>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-900">Android (Chrome)</p>
                            <p className="text-[10px] text-slate-500">Üç Nokta → Uygulamayı Yükle</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setShowInstallGuide(false)}
                        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
                    >
                        Anladım
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Gizlilik Politikası Modalı */}
      {showPrivacy && <PrivacyPolicy onClose={() => setShowPrivacy(false)} />}

      <footer className="py-16 bg-slate-950 text-slate-600 text-[9px] text-center px-10">
        <div className="max-w-xs mx-auto space-y-4 opacity-40">
            <p className="leading-relaxed uppercase tracking-[0.2em]">
                Dijital Hakim © 2024 • Yapay Zeka Destekli Türk Hukuk Çözümleri
            </p>
            <p className="italic">
                Analizler yapay zeka tarafından üretilmiştir, kesin hukuki bağlayıcılığı yoktur.
            </p>
            <button onClick={() => setShowPrivacy(true)} className="underline hover:text-white transition-colors">Gizlilik Politikası</button>
        </div>
      </footer>

      <style>{`
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
        .animate-shake { animation: shake 0.4s ease-in-out infinite; animation-iteration-count: 2; }
        @media print { .no-print { display: none; } body { background: white; padding: 0; } main { padding: 0; } }
      `}</style>
    </div>
  );
};

export default App;