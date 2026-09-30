import {
  MateriPembelajaran,
  Tugas,
  KuisInteraktif,
  Pengumuman,
  MadrasahSettings,
  PesertaDidik,
  AbsensiRecord,
  NilaiSiswa,
  HasilKuis,
} from '../types/lms';

/**
 * Robust copy to clipboard with fallback
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy: ', err);
    return false;
  }
}

/**
 * Download text content as a file
 */
export function downloadTextFile(filename: string, content: string, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger browser print
 */
export function printContent(title: string, htmlContent: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    window.print();
    return;
  }
  printWindow.document.write(`
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; line-height: 1.6; padding: 24px; color: #1e293b; }
          h1, h2, h3 { color: #047857; margin-bottom: 8px; }
          .header { border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 20px; }
          .meta { font-size: 13px; color: #64748b; margin-bottom: 16px; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-left: 4px solid #059669; padding: 12px 16px; margin: 16px 0; border-radius: 4px; }
          .bold { font-weight: bold; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
          th { background: #f1f5f9; }
          @media print {
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>MIN 1 PASER - SISTEM PEMBELAJARAN INTERAKTIF</h2>
          <div class="meta">Madrasah Ibtidaiyah Negeri 1 Paser • Dzakirul Husni (Super Admin)</div>
        </div>
        ${htmlContent}
        <div style="margin-top: 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px;">
          Dicetak melalui LMS MIN 1 Paser pada ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);
}

/**
 * Format Materi Pembelajaran untuk WhatsApp / Google Docs / Word
 * Sesuai instruksi WAJIB:
 * format JUDUL, TUJUAN PEMBELAJARAN, MATERI, INSTRUKSI, TUGAS
 */
export function formatMateriCopas(materi: MateriPembelajaran, settings: MadrasahSettings, tugasTerkait?: Tugas): string {
  let text = `========================================\n`;
  text += `*${settings.namaMadrasah.toUpperCase()}*\n`;
  text += `*LEMBAR MATERI PEMBELAJARAN SISWA*\n`;
  text += `========================================\n\n`;
  text += `📌 *Mata Pelajaran:* ${materi.mapel}\n`;
  text += `🏫 *Kelas / Fase:* Kelas ${materi.kelas} (${materi.fase})\n`;
  text += `📚 *Bab / Topik:* ${materi.babTopik}\n`;
  text += `🗓️ *Tahun Ajaran:* ${settings.tahunAjaran} (Semester ${settings.semester})\n\n`;

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*JUDUL:* ${materi.judul.toUpperCase()}\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  text += `🎯 *TUJUAN PEMBELAJARAN:*\n`;
  text += `${materi.tujuanPembelajaran}\n\n`;

  text += `📖 *MATERI PEMBELAJARAN:*\n`;
  text += `${materi.materi}\n\n`;

  text += `📝 *INSTRUKSI SISWA:*\n`;
  text += `${materi.instruksi}\n\n`;

  if (tugasTerkait) {
    text += `📋 *TUGAS / LATIHAN:*\n`;
    text += `*Judul Tugas:* ${tugasTerkait.judul}\n`;
    text += `*Jenis:* ${tugasTerkait.jenis} (Bobot: ${tugasTerkait.bobotNilai} Poin)\n`;
    text += `*Batas Pengumpulan:* ${new Date(tugasTerkait.batasWaktu).toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`;
    text += `*Instruksi Pengerjaan:* ${tugasTerkait.instruksi}\n\n`;
  } else {
    text += `📋 *TUGAS / LATIHAN:*\n`;
    text += `Kerjakan latihan atau rangkuman sesuai arahan guru pada buku catatan madrasah.\n\n`;
  }

  if (materi.linkReferensi || materi.videoUrl) {
    text += `🔗 *LINK REFERENSI & MEDIA:*\n`;
    if (materi.videoUrl) text += `• Video Belajar: ${materi.videoUrl}\n`;
    if (materi.linkReferensi) text += `• Sumber Referensi: ${materi.linkReferensi}\n`;
    text += `\n`;
  }

  text += `----------------------------------------\n`;
  text += `_Pengampu: ${settings.namaGuru} - ${settings.jabatanGuru}_\n`;
  text += `_Madrasah Ibtidaiyah Negeri 1 Paser_\n`;

  return text;
}

/**
 * Format Tugas untuk WhatsApp / Word
 */
export function formatTugasCopas(tugas: Tugas, settings: MadrasahSettings): string {
  let text = `========================================\n`;
  text += `*${settings.namaMadrasah.toUpperCase()}*\n`;
  text += `*INFORMASI TUGAS MADRASAH*\n`;
  text += `========================================\n\n`;

  text += `*JUDUL TUGAS:* ${tugas.judul}\n`;
  text += `*Mata Pelajaran:* ${tugas.mapel}\n`;
  text += `*Kelas / Fase:* Kelas ${tugas.kelas} (${tugas.fase})\n`;
  text += `*Materi Terkait:* ${tugas.materiTerkait}\n`;
  text += `*Jenis Tugas:* ${tugas.jenis}\n`;
  text += `*Bobot Nilai:* ${tugas.bobotNilai} Poin\n`;
  text += `*Batas Waktu:* ${new Date(tugas.batasWaktu).toLocaleDateString('id-ID', { dateStyle: 'full' })}\n\n`;

  text += `📝 *INSTRUKSI PENGERJAAN:*\n`;
  text += `${tugas.instruksi}\n\n`;

  text += `Silakan dikerjakan dengan jujur, rapi, dan penuh tanggung jawab. Kirim hasil melalui LMS MIN 1 Paser atau serahkan kepada guru saat jam tatap muka.\n\n`;
  text += `_Guru Pengampu: ${settings.namaGuru} (${settings.namaMadrasah})_\n`;

  return text;
}

/**
 * Format Kuis / Bank Soal untuk Copas WhatsApp / Word
 */
export function formatKuisCopas(kuis: KuisInteraktif, settings: MadrasahSettings, sertakanKunci = true): string {
  let text = `========================================\n`;
  text += `*${settings.namaMadrasah.toUpperCase()}*\n`;
  text += `*SOAL KUIS INTERAKTIF SISWA*\n`;
  text += `========================================\n\n`;

  text += `*Judul Kuis:* ${kuis.judul}\n`;
  text += `*Mata Pelajaran:* ${kuis.mapel}\n`;
  text += `*Kelas / Fase:* Kelas ${kuis.kelas} (${kuis.fase})\n`;
  text += `*Bab / Topik:* ${kuis.babTopik}\n`;
  text += `*Durasi Pengerjaan:* ${kuis.durasiMenit} Menit\n`;
  text += `*Jumlah Soal:* ${kuis.soal.length} Butir Pilihan Ganda\n\n`;

  text += `🎯 *TUJUAN PEMBELAJARAN:*\n${kuis.tujuanPembelajaran}\n\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*DAFTAR BUTIR SOAL*\n`;
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  kuis.soal.forEach((s, idx) => {
    text += `${idx + 1}. ${s.pertanyaan}\n`;
    text += `   A. ${s.opsiA}\n`;
    text += `   B. ${s.opsiB}\n`;
    text += `   C. ${s.opsiC}\n`;
    text += `   D. ${s.opsiD}\n`;

    if (sertakanKunci) {
      text += `   *Kunci Jawaban:* ${s.kunciJawaban} (Bobot: ${s.bobot} Poin)\n`;
      text += `   *Pembahasan:* ${s.pembahasan}\n`;
    }
    text += `\n`;
  });

  text += `----------------------------------------\n`;
  text += `_Disusun oleh: ${settings.namaGuru} - ${settings.namaMadrasah}_\n`;
  return text;
}

/**
 * Format Pengumuman untuk WhatsApp Broadcast
 */
export function formatPengumumanCopas(pengumuman: Pengumuman, settings: MadrasahSettings): string {
  let text = `📢 *PENGUMUMAN RESMI ${settings.namaMadrasah.toUpperCase()}*\n`;
  text += `========================================\n\n`;
  text += `*Topik:* ${pengumuman.judul}\n`;
  text += `*Kategori:* ${pengumuman.kategori}\n`;
  text += `*Sasaran:* ${pengumuman.targetKelas === 'Semua' ? 'Seluruh Kelas 1 - 6' : `Kelas ${pengumuman.targetKelas}`}\n`;
  text += `*Tanggal:* ${new Date(pengumuman.tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })}\n\n`;
  text += `*Isi Pengumuman:*\n`;
  text += `${pengumuman.konten}\n\n`;
  text += `Demikian pengumuman ini disampaikan agar menjadi perhatian bagi bapak/ibu wali murid dan peserta didik.\n\n`;
  text += `Wassalamu'alaikum Wr. Wb.\n`;
  text += `_${settings.namaGuru} - Admin Super ${settings.namaMadrasah}_\n`;

  return text;
}

/**
 * Format Rekap Presensi Harian untuk WhatsApp
 */
export function formatPresensiCopas(
  tanggal: string,
  kelas: number,
  siswaList: PesertaDidik[],
  absensiList: AbsensiRecord[],
  settings: MadrasahSettings
): string {
  const hadir = absensiList.filter(a => a.status === 'Hadir').length;
  const sakit = absensiList.filter(a => a.status === 'Sakit');
  const izin = absensiList.filter(a => a.status === 'Izin');
  const alpa = absensiList.filter(a => a.status === 'Alpa');
  const total = siswaList.length;
  const persentase = total > 0 ? Math.round((hadir / total) * 100) : 0;

  let text = `📊 *REKAP PRESENSI KELAS ${kelas} ${settings.namaMadrasah.toUpperCase()}*\n`;
  text += `========================================\n`;
  text += `*Hari / Tanggal:* ${new Date(tanggal).toLocaleDateString('id-ID', { dateStyle: 'full' })}\n`;
  text += `*Kelas:* Kelas ${kelas} (Tahun Ajaran ${settings.tahunAjaran})\n\n`;

  text += `📈 *RINGKASAN KEHADIRAN:*\n`;
  text += `• Total Siswa: ${total} Anak\n`;
  text += `• Hadir: ${hadir} Anak (${persentase}%)\n`;
  text += `• Sakit: ${sakit.length} Anak\n`;
  text += `• Izin: ${izin.length} Anak\n`;
  text += `• Alpa: ${alpa.length} Anak\n\n`;

  if (sakit.length > 0) {
    text += `🏥 *Siswa Sakit:*\n`;
    sakit.forEach(a => {
      const s = siswaList.find(x => x.id === a.siswaId);
      text += `  - ${s?.nama || 'Siswa'} (${a.catatan || 'Keterangan izin sakit'})\n`;
    });
    text += `\n`;
  }

  if (izin.length > 0) {
    text += `📩 *Siswa Izin:*\n`;
    izin.forEach(a => {
      const s = siswaList.find(x => x.id === a.siswaId);
      text += `  - ${s?.nama || 'Siswa'} (${a.catatan || 'Ada urusan keluarga'})\n`;
    });
    text += `\n`;
  }

  if (alpa.length > 0) {
    text += `⚠️ *Siswa Alpa / Tanpa Keterangan:*\n`;
    alpa.forEach(a => {
      const s = siswaList.find(x => x.id === a.siswaId);
      text += `  - ${s?.nama || 'Siswa'}\n`;
    });
    text += `\n`;
  }

  text += `_Wali Kelas / Guru Pengampu: ${settings.namaGuru}_\n`;
  text += `_MIN 1 Paser, Membentuk Generasi Cerdas & Berakhlak Mulia_`;

  return text;
}

/**
 * Format Rekap Nilai untuk Copas
 */
export function formatNilaiCopas(
  kelas: number,
  mapel: string,
  siswaList: PesertaDidik[],
  nilaiList: NilaiSiswa[],
  settings: MadrasahSettings
): string {
  let text = `📋 *REKAP BUKU NILAI ${settings.namaMadrasah.toUpperCase()}*\n`;
  text += `========================================\n`;
  text += `*Mata Pelajaran:* ${mapel}\n`;
  text += `*Kelas:* Kelas ${kelas} | *Semester:* ${settings.semester}\n`;
  text += `*Tahun Ajaran:* ${settings.tahunAjaran}\n`;
  text += `*Bobot Nilai:* Tugas (${settings.bobotNilai.tugas}%), Kuis (${settings.bobotNilai.kuis}%), Praktik (${settings.bobotNilai.praktik}%), Proyek (${settings.bobotNilai.proyek}%), Ujian (${settings.bobotNilai.ujian}%)\n\n`;

  text += `No | Nama Siswa | Tgs | Kuis | Prk | Pry | Ujn | Rata2 | Pred\n`;
  text += `---|------------|-----|------|-----|-----|-----|-------|-----\n`;

  siswaList.forEach((s, idx) => {
    const val = nilaiList.find(n => n.siswaId === s.id);
    const tgs = val?.nilaiTugas || 0;
    const kui = val?.nilaiKuis || 0;
    const prk = val?.nilaiPraktik || 0;
    const pry = val?.nilaiProyek || 0;
    const ujn = val?.nilaiUjian || 0;

    const b = settings.bobotNilai;
    const totalBobot = b.tugas + b.kuis + b.praktik + b.proyek + b.ujian || 100;
    const finalScore = Math.round(
      (tgs * b.tugas + kui * b.kuis + prk * b.praktik + pry * b.proyek + ujn * b.ujian) / totalBobot
    );

    let predikat = 'D';
    if (finalScore >= 90) predikat = 'A';
    else if (finalScore >= 80) predikat = 'B';
    else if (finalScore >= 70) predikat = 'C';

    text += `${idx + 1}. ${s.nama.padEnd(20, ' ')} | ${tgs} | ${kui} | ${prk} | ${pry} | ${ujn} | *${finalScore}* | *${predikat}*\n`;
  });

  text += `\n_Dicetak & Diverifikasi oleh: ${settings.namaGuru} - ${settings.namaMadrasah}_\n`;
  return text;
}

/**
 * Format Hasil Pengerjaan Kuis Siswa (Termasuk Status Gugur jika 3x Salah)
 */
export function formatHasilKuisSiswaCopas(
  kuis: KuisInteraktif,
  hasil: HasilKuis,
  siswa: PesertaDidik,
  settings: MadrasahSettings
): string {
  let text = `========================================\n`;
  text += `*${settings.namaMadrasah.toUpperCase()}*\n`;
  text += `*LAPORAN HASIL KUIS CBT INTERAKTIF*\n`;
  text += `========================================\n\n`;

  text += `👤 *Peserta Didik:* ${siswa.nama} (Absen #${siswa.noAbsen})\n`;
  text += `🏫 *Kelas / Fase:* Kelas ${siswa.kelas} (${kuis.fase})\n`;
  text += `📖 *Mata Pelajaran:* ${kuis.mapel}\n`;
  text += `🎯 *Judul Kuis:* ${kuis.judul}\n`;
  text += `📅 *Waktu Pengerjaan:* ${new Date(hasil.tanggalSelesai).toLocaleString('id-ID')}\n\n`;

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*STATUS AKHIR:*\n`;
  if (hasil.isGugur) {
    text += `❌ *GUGUR (TIDAK LOLOS PERMAINAN)*\n`;
    text += `⚠️ *Alasan:* Menjawab salah 3 kali (Batas aturan 3 kesalahan tercapai)\n`;
  } else {
    text += `✅ *BERHASIL LOLOS & SELESAI!*\n`;
  }
  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  text += `📊 *RINGKASAN SKOR & EVALUASI:*\n`;
  text += `• Nilai Akhir: *${hasil.nilaiAkhir}* / 100\n`;
  text += `• Jumlah Benar: ${hasil.jumlahBenar} Soal\n`;
  text += `• Jumlah Salah: ${hasil.jumlahSalah} Soal ${hasil.isGugur ? '(Maksimal 3 Kesalahan)' : ''}\n`;
  text += `• Total Soal: ${kuis.soal.length} Butir Soal\n\n`;

  text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `*CATATAN SOAL YANG DIKERJAKAN:*\n`;
  kuis.soal.forEach((s, idx) => {
    const ans = hasil.jawabanSiswa[s.id];
    if (ans) {
      const isCorrect = ans === s.kunciJawaban;
      text += `${idx + 1}. ${s.pertanyaan}\n`;
      text += `   • Jawaban Siswa: ${ans} (${isCorrect ? '✅ Benar' : '❌ Salah'})\n`;
      text += `   • Kunci Jawaban: ${s.kunciJawaban}\n`;
      if (s.pembahasan) text += `   • Pembahasan: ${s.pembahasan}\n`;
      text += `\n`;
    }
  });

  text += `----------------------------------------\n`;
  text += `_Sistem LMS MIN 1 Paser • Guru: ${settings.namaGuru}_\n`;
  return text;
}
