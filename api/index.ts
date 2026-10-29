import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini client server-side using GEMINI_API_KEY from environment
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Al-Arabiya Puzzle API is active',
    timestamp: new Date().toISOString()
  });
});

// Admin login verification endpoint
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'admin' && password === 'Razanpintar') {
    return res.json({
      success: true,
      message: 'Login admin berhasil',
      user: {
        uid: 'admin-super-id',
        displayName: 'Super Admin Razan',
        email: 'admin@clarabiya.internal',
        role: 'admin',
        photoURL: null
      },
      token: 'admin-token-' + Date.now()
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau password admin salah!'
  });
});

// Generate Arabic puzzle using Gemini AI
app.post('/api/gemini/generate-puzzle', async (req: Request, res: Response) => {
  try {
    const { category = 'Kehidupan Sehari-hari', difficulty = 'pemula', type = 'scramble' } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback pre-calculated high quality Arabic puzzle if API key not available
      return res.json({
        success: true,
        source: 'curated-fallback',
        puzzle: getCuratedPuzzle(category, difficulty, type)
      });
    }

    const prompt = `Anda adalah guru ahli Bahasa Arab (Nahwu, Shorof, dan Mufrodat) untuk penutur bahasa Indonesia.
Buat 1 teka-teki pembelajaran bahasa Arab bertema "${category}" dengan tingkat kesulitan "${difficulty}" dan tipe permainan "${type}".
Tipe permainan yang didukung:
1. 'scramble': Menyusun kata-kata acak menjadi kalimat bahasa Arab yang benar.
2. 'guess': Menebak kosakata bahasa Arab dari petunjuk bahasa Indonesia.
3. 'riddle': Teka-teki logika / tebak-tebakan bahasa Arab (Lughz/Fawazir).

Berikan respon HANYA dalam format JSON valid tanpa tanda markdown (tanpa \`\`\`json):
{
  "title": "Judul Teka-teki singkat",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "type": "${type}",
  "arabicText": "Kalimat / kata Arab lengkap dengan HARAKAT/SYAKAL yang benar",
  "transliteration": "Transliterasi latin dengan pelafalan jelas",
  "translation": "Arti kalimat/kata dalam bahasa Indonesia yang fasih",
  "scrambledWords": ["kata1", "kata2", "kata3"], // untuk scramble: pisahkan per kata acak (dengan harakat). untuk tipe lain bisa opsi jawaban
  "options": ["pilihan1", "pilihan2", "pilihan3", "pilihan4"], // 4 opsi jika tipe guess atau riddle, salah satunya adalah jawaban benar
  "correctAnswer": "jawaban yang tepat",
  "hint": "Petunjuk membantu dalam bahasa Indonesia",
  "explanation": "Penjelasan kaidah Nahwu/Shorof atau arti kata agar pemain mendapat wawasan ilmu baru"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      }
    });

    const text = response.text?.trim() || '{}';
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Gagal mengurai output JSON Gemini');
      }
    }

    return res.json({
      success: true,
      source: 'gemini',
      puzzle: parsed
    });
  } catch (error: any) {
    console.error('Error generating puzzle via Gemini:', error);
    // Graceful fallback to rich curated puzzle
    const { category = 'Umum', difficulty = 'pemula', type = 'scramble' } = req.body;
    return res.json({
      success: true,
      source: 'curated-fallback',
      puzzle: getCuratedPuzzle(category, difficulty, type),
      note: 'Menampilkan teka-teki kurasi berkualitas tinggi.'
    });
  }
});

// Explain Arabic grammar (Nahwu/Shorof) for a given phrase
app.post('/api/gemini/explain', async (req: Request, res: Response) => {
  try {
    const { arabicText } = req.body;
    if (!arabicText) {
      return res.status(400).json({ error: 'Teks arab diperlukan' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        explanation: `Kalimat: "${arabicText}". Tersusun dari unsur kalimat Arab yang memiliki i'rob dan struktur teratur (Fi'il / Isim / Harf).`
      });
    }

    const prompt = `Jelaskan secara ringkas, menarik, dan mudah dipahami susunan tata bahasa Arab (I'rob / Nahwu & Shorof) dari teks berikut untuk pelajar pemula/menengah:
"${arabicText}"
Jawab dalam 2-3 paragraf ramah dan mendidik dalam bahasa Indonesia.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.json({
      success: true,
      explanation: response.text || 'Penjelasan tidak tersedia saat ini.'
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Gagal memproses penjelasan' });
  }
});

// Helper for curated fallback puzzles
function getCuratedPuzzle(category: string, difficulty: string, type: string) {
  const curated = [
    {
      title: 'Pergi ke Sekolah',
      category: 'Sekolah',
      difficulty: 'pemula',
      type: 'scramble',
      arabicText: 'يَذْهَبُ التِّلْمِيذُ إِلَى الْمَدْرَسَةِ',
      transliteration: "Yadzhabu at-tilmiidzu ilaa al-madrasati",
      translation: 'Murid itu pergi ke sekolah',
      scrambledWords: ['إِلَى', 'الْمَدْرَسَةِ', 'يَذْهَبُ', 'التِّلْمِيذُ'],
      options: ['التِّلْمِيذُ', 'الْمَدْرَسَةِ', 'يَذْهَبُ', 'إِلَى'],
      correctAnswer: 'يَذْهَبُ التِّلْمِيذُ إِلَى الْمَدْرَسَةِ',
      hint: 'Mulai dengan kata kerja (Fi\'il mudhari\') di awal kalimat.',
      explanation: 'Susunan Jumlah Fi\'liyyah: يَذْهَبُ (Fi\'il), التِّلْمِيذُ (Fa\'il marfu\' dengan dhommah), إِلَى (Harf jar), الْمَدْرَسَةِ (Isim majrur dengan kasrah).'
    },
    {
      title: 'Teka-teki Kosakata Rumah',
      category: 'Rumah',
      difficulty: 'pemula',
      type: 'guess',
      arabicText: 'بَيْتٌ جَمِيلٌ',
      transliteration: 'Baytun jamiilun',
      translation: 'Rumah yang indah',
      scrambledWords: ['بَيْتٌ', 'جَمِيلٌ'],
      options: ['بَيْتٌ', 'مَسْجِدٌ', 'مَدْرَسَةٌ', 'مَكْتَبٌ'],
      correctAnswer: 'بَيْتٌ',
      hint: 'Tempat berteduh dan berkumpul bersama keluarga.',
      explanation: 'Kata "Baytun" (بَيْتٌ) berarti rumah. Bentuk jamaknya adalah Buyuut (بُيُوتٌ).'
    },
    {
      title: 'Teka-Teki Logika: Benda yang Berbicara',
      category: 'Logika & Fawazir',
      difficulty: 'menengah',
      type: 'riddle',
      arabicText: 'أَنَا لَا أَتَكَلَّمُ، وَلَكِنِّي أُخْبِرُكَ بِكُلِّ شَيْءٍ',
      transliteration: 'Ana laa atakallamu, wa laakinni ukhbiruka bikulli syai-in',
      translation: 'Aku tidak dapat berbicara, tetapi aku memberitahumu segala sesuatu. Siapakah aku?',
      scrambledWords: ['الْكِتَابُ', 'الْقَلَمُ', 'الْبَابُ', 'السَّاعَةُ'],
      options: ['الْكِتَابُ (Buku)', 'الْقَلَمُ (Pena)', 'السَّاعَةُ (Jam)', 'الْمِرْآةُ (Cermin)'],
      correctAnswer: 'الْكِتَابُ (Buku)',
      hint: 'Sahabat terbaik bagi para penuntut ilmu.',
      explanation: 'Jawaban teka-teki adalah Al-Kitaab (الْكِتَابُ - Buku). Ada pepatah Arab: خَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابٌ (Sebaik-baik teman duduk sepanjang waktu adalah buku).'
    }
  ];

  const matched = curated.find(p => p.type === type) || curated[0];
  return { ...matched, category, difficulty };
}

export default app;
