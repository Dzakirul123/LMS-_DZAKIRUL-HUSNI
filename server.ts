import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { GoogleGenAI, Type, Schema } from '@google/genai';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy init of GoogleGenAI using environment variable
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY tidak ditemukan di environment variable server.');
  }
  return new GoogleGenAI({ apiKey });
};

// API Endpoint to generate quiz questions using Gemini
app.post('/api/generate-soal', async (req: Request, res: Response) => {
  try {
    const {
      mapel,
      kelas = 6,
      babTopik,
      tujuanPembelajaran,
      jumlahSoal = 10,
      tingkatKesulitan = 'Sedang',
      catatanTambahan = '',
    } = req.body;

    const count = Math.min(Math.max(parseInt(jumlahSoal) || 5, 1), 100);

    const prompt = `Anda adalah pakar pendidik dan pembuat soal profesional Kurikulum Merdeka Madrasah Ibtidaiyah (MI) khususnya untuk Kelas ${kelas} (Fase C) di Kementerian Agama Republik Indonesia (Kemenag RI).

Buatkan tepat ${count} butir soal pilihan ganda berkualitas tinggi dengan kriteria berikut:
- Mata Pelajaran: ${mapel}
- Jenjang & Kelas: Madrasah Ibtidaiyah (MI) Kelas ${kelas} (Fase C)
- Bab / Topik: ${babTopik || 'Sesuai silabus Kurikulum Merdeka'}
- Tujuan Pembelajaran: ${tujuanPembelajaran || 'Menguji pemahaman konsep siswa'}
- Tingkat Kesulitan: ${tingkatKesulitan} (Variasi Mudah, Sedang, HOTS)
${catatanTambahan ? `- Catatan Khusus Guru: ${catatanTambahan}` : ''}

Ketentuan Format Soal:
1. Pilihan jawaban ada 4 opsi (A, B, C, D).
2. Kunci jawaban HARUS tepat salah satu dari: "A", "B", "C", atau "D".
3. Setiap soal wajib disertai pembahasan edukatif yang jelas dan mudah dipahami siswa MI Kelas ${kelas}.
4. Bobot nilai per soal adalah integer bulat (misal: 10 atau 20).
5. Bahasa Indonesia yang baik, santun, baku, dan bernuansa edukatif madrasah.

Kembalikan jawaban HANYA dalam format JSON array yang valid sesuai schema berikut:
[
  {
    "pertanyaan": "Teks pertanyaan lengkap...",
    "opsiA": "Pilihan A",
    "opsiB": "Pilihan B",
    "opsiC": "Pilihan C",
    "opsiD": "Pilihan D",
    "kunciJawaban": "A",
    "bobot": 10,
    "pembahasan": "Penjelasan mengapa jawaban tersebut benar..."
  }
]`;

    let generatedSoal: any[] = [];
    let usedAI = false;

    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            systemInstruction: 'Anda adalah asisten guru madrasah pembuat bank soal ujian CBT resmi. Selalu keluarkan JSON array berisi butir soal pilihan ganda.',
          },
        });

        const text = response.text?.trim() || '[]';
        // Parse JSON
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          generatedSoal = parsed.map((item, idx) => ({
            id: `soal-ai-${Date.now()}-${idx + 1}`,
            pertanyaan: item.pertanyaan || `Pertanyaan ${idx + 1}`,
            opsiA: item.opsiA || 'Opsi A',
            opsiB: item.opsiB || 'Opsi B',
            opsiC: item.opsiC || 'Opsi C',
            opsiD: item.opsiD || 'Opsi D',
            kunciJawaban: ['A', 'B', 'C', 'D'].includes(item.kunciJawaban?.toUpperCase())
              ? item.kunciJawaban.toUpperCase()
              : 'A',
            bobot: parseInt(item.bobot) || 10,
            pembahasan: item.pembahasan || 'Pembahasan kunci jawaban.',
          }));
          usedAI = true;
        }
      } catch (aiErr) {
        console.warn('Gemini API call failed, fallback generator will be used:', aiErr);
      }
    }

    // High quality offline fallback generator if Gemini Key is not set or network fails
    if (generatedSoal.length === 0) {
      generatedSoal = generateFallbackQuestions(mapel, kelas, babTopik, count);
    }

    return res.json({
      success: true,
      usedAI,
      totalGenerated: generatedSoal.length,
      soal: generatedSoal,
    });
  } catch (error: any) {
    console.error('Error generating soal:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal membuat soal dengan AI.',
    });
  }
});

// Helper for high quality fallback bank questions
function generateFallbackQuestions(
  mapel: string,
  kelas: number,
  babTopik: string,
  count: number
): any[] {
  const result: any[] = [];
  const mapelLower = (mapel || '').toLowerCase();

  for (let i = 1; i <= count; i++) {
    let pertanyaan = '';
    let opsiA = '';
    let opsiB = '';
    let opsiC = '';
    let opsiD = '';
    let kunci: 'A' | 'B' | 'C' | 'D' = 'A';
    let pembahasan = '';

    if (mapelLower.includes('fikih')) {
      pertanyaan = `[Soal #${i}] Manakah di antara pernyataan berikut yang merupakan ketentuan makanan halal Li-dzatihi untuk siswa Kelas ${kelas}?`;
      opsiA = 'Makanan yang zat dasarnya suci, tidak najis, dan dibolehkan syariat';
      opsiB = 'Makanan yang dibeli menggunakan uang hasil pinjaman tanpa izin';
      opsiC = 'Daging hewan yang mati terjatuh sebelum sempat disembelih';
      opsiD = 'Makanan mewah impor yang tidak memiliki label registrasi';
      kunci = 'A';
      pembahasan = 'Halal Li-dzatihi berarti zat dasar makanannya halal dan suci sesuai syariat Islam.';
    } else if (mapelLower.includes('matematika')) {
      const a = (i % 7) + 3;
      const b = (i % 5) + 2;
      pertanyaan = `[Soal #${i}] Hitunglah hasil dari operasi hitung campuran bilangan bulat berikut: (-${a * 10}) + (${b * 5}) x 2 = ...`;
      const ans = -a * 10 + b * 5 * 2;
      opsiA = `${ans}`;
      opsiB = `${ans + 10}`;
      opsiC = `${ans - 10}`;
      opsiD = `${ans + 20}`;
      kunci = 'A';
      pembahasan = `Dahulukan operasi perkalian (${b * 5} x 2 = ${b * 10}), lalu jumlahkan dengan -${a * 10}, menghasilkan ${ans}.`;
    } else if (mapelLower.includes('ipas') || mapelLower.includes('ipa')) {
      pertanyaan = `[Soal #${i}] Pada sistem organ pernapasan manusia Kelas ${kelas}, bagian yang berfungsi menyaring udara kotor dan debu dengan rambut getar adalah ...`;
      opsiA = 'Trakea (batang tenggorokan)';
      opsiB = 'Lambung';
      opsiC = 'Jantung';
      opsiD = 'Kerongkongan';
      kunci = 'A';
      pembahasan = 'Silia dan selaput lendir pada trakea berfungsi menyaring debu halus sebelum udara masuk ke bronkus.';
    } else if (mapelLower.includes('qur') || mapelLower.includes('hadis')) {
      pertanyaan = `[Soal #${i}] Hukum bacaan Mad Lazim Mutsaqqal Kalimi dibaca panjang sebanyak ... harakat.`;
      opsiA = '6 harakat (3 alif)';
      opsiB = '2 harakat (1 alif)';
      opsiC = '4 harakat (2 alif)';
      opsiD = '1 harakat';
      kunci = 'A';
      pembahasan = 'Mad Lazim Mutsaqqal Kalimi wajib dibaca panjang sepanjang 6 harakat secara lazim (pasti).';
    } else {
      pertanyaan = `[Soal #${i}] Berdasarkan materi ${mapel} (${babTopik || 'Bab Kurikulum Merdeka'}), tindakan yang mencerminkan pemahaman yang tepat adalah ...`;
      opsiA = 'Menerapkan konsep dengan teliti, jujur, dan bertanggung jawab';
      opsiB = 'Menghindari diskusi kelompok bersama rekan sekelas';
      opsiC = 'Menyalin jawaban teman tanpa memeriksa kebenarannya';
      opsiD = 'Menunda-nunda pengerjaan tugas madrasah';
      kunci = 'A';
      pembahasan = 'Sikap yang mencerminkan profil pelajar Pancasila dan rahmatan lil alamin adalah bertanggung jawab dan jujur.';
    }

    // Variasikan kunci agar tidak selalu A
    const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
    const chosenKey = keys[(i - 1) % 4];
    let finalA = opsiA;
    let finalB = opsiB;
    let finalC = opsiC;
    let finalD = opsiD;

    if (chosenKey === 'B') {
      finalA = opsiB;
      finalB = opsiA;
    } else if (chosenKey === 'C') {
      finalA = opsiC;
      finalC = opsiA;
    } else if (chosenKey === 'D') {
      finalA = opsiD;
      finalD = opsiA;
    }

    result.push({
      id: `soal-gen-${Date.now()}-${i}`,
      pertanyaan,
      opsiA: finalA,
      opsiB: finalB,
      opsiC: finalC,
      opsiD: finalD,
      kunciJawaban: chosenKey,
      bobot: 10,
      pembahasan,
    });
  }

  return result;
}

// In development, integrate Vite middlewares
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static build in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`LMS MIN 1 Paser Server running on port ${PORT}`);
  });
}

startServer();
