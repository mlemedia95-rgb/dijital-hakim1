
import { GoogleGenAI, Type } from "@google/genai";
import { LegalVerdict, FileData } from "../types";

const SYSTEM_INSTRUCTION = `Sen son derece profesyonel, tarafsız ve uzman bir 'Dijital Hakim'sin. 
Görevin, kullanıcı tarafından sunulan metni ve BELGELERİ (Resim/PDF) satır satır inceleyerek içerisindeki TÜM farklı hukuki uyuşmazlıkları, soruları, talepleri veya maddeleri tek tek tespit etmektir.

Analiz kuralları:
1. Belgede birden fazla soru veya konu varsa, her birini AYRI birer analiz nesnesi olarak oluştur.
2. Hiçbir soruyu atlama.
3. Cevapların HER ZAMAN geçerli bir JSON ARRAY (liste) formatında olmalıdır.`;

export const analyzeDispute = async (dispute: string, files: FileData[]): Promise<LegalVerdict[]> => {
  const apiKey = (process.env as any).API_KEY;

  if (!apiKey || apiKey === "") {
    throw new Error("Sistem yapılandırması eksik: API_KEY bulunamadı. Lütfen Vercel ayarlarından anahtarı ekleyin.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const promptText = `Aşağıdaki uyuşmazlığı ve ekteki belgeleri Türk hukuk mevzuatı çerçevesinde analiz et: ${dispute || 'Belge analizi isteniyor.'}`;
  
  const parts: any[] = [{ text: promptText }];

  files.forEach(file => {
    parts.push({
      inlineData: {
        data: file.data.split(',')[1],
        mimeType: file.mimeType
      }
    });
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              vakaOzeti: { type: Type.STRING },
              hukukiNiteleme: { type: Type.STRING },
              ilgiliMaddeler: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    kanun: { type: Type.STRING },
                    madde: { type: Type.STRING },
                    icerik: { type: Type.STRING }
                  },
                  required: ["kanun", "madde", "icerik"]
                }
              },
              gerekce: { type: Type.STRING },
              basitAciklama: { type: Type.STRING },
              hukum: { type: Type.STRING }
            },
            required: ["vakaOzeti", "hukukiNiteleme", "ilgiliMaddeler", "gerekce", "basitAciklama", "hukum"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Yapay zeka analiz üretemedi.");
    
    return JSON.parse(text);
  } catch (err: any) {
    console.error("Gemini Error:", err);

    let userFriendlyMessage = "Analiz sırasında beklenmedik bir teknik hata oluştu. Lütfen daha sonra tekrar deneyin.";

    if (err.message) {
      const lowerCaseError = err.message.toLowerCase();
      if (lowerCaseError.includes('quota') || lowerCaseError.includes('429')) {
        userFriendlyMessage = "API kullanım limitinize ulaştınız. Lütfen Google Cloud konsolundan limitlerinizi kontrol edin veya bir süre bekleyip tekrar deneyin.";
      } else if (lowerCaseError.includes('billing')) {
        userFriendlyMessage = "API anahtarınızla ilişkili projede faturalandırma etkinleştirilmemiş. Lütfen Google Cloud projenizin faturalandırma durumunu kontrol edin.";
      } else if (lowerCaseError.includes('api key not valid') || lowerCaseError.includes('permission denied')) {
        userFriendlyMessage = "Sağlanan API anahtarı geçersiz veya gerekli yetkilere sahip değil. Lütfen Vercel ayarlarınızı kontrol edin.";
      } else if (lowerCaseError.includes('candidate was blocked')) {
        userFriendlyMessage = "Yapay zeka, güvenlik politikaları nedeniyle bir yanıt üretemedi. Lütfen talebinizi farklı bir şekilde ifade etmeyi deneyin.";
      }
    }
    
    throw new Error(userFriendlyMessage);
  }
};
