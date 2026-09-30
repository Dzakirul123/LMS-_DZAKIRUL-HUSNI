import React from 'react';
import {
  Award,
  CalendarCheck,
  Star,
  Printer,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  PesertaDidik,
  NilaiSiswa,
  AbsensiRecord,
  MadrasahSettings,
  DAFTAR_MAPEL,
} from '../../types/lms';
import { CopasButton } from '../common/CopasButton';
import { printContent } from '../../utils/copas';

interface SiswaNilaiProps {
  settings: MadrasahSettings;
  siswa: PesertaDidik;
  nilaiList: NilaiSiswa[];
  absensiList: AbsensiRecord[];
}

export const SiswaNilai: React.FC<SiswaNilaiProps> = ({
  settings,
  siswa,
  nilaiList,
  absensiList,
}) => {
  // Student grades
  const myGrades = nilaiList.filter((n) => n.siswaId === siswa.id);

  // Student attendance
  const myAbsensi = absensiList.filter((a) => a.siswaId === siswa.id);
  const totalHadir = myAbsensi.filter((a) => a.status === 'Hadir').length || 1;
  const totalSakit = myAbsensi.filter((a) => a.status === 'Sakit').length;
  const totalIzin = myAbsensi.filter((a) => a.status === 'Izin').length;
  const totalAlpa = myAbsensi.filter((a) => a.status === 'Alpa').length;
  const totalHari = totalHadir + totalSakit + totalIzin + totalAlpa;
  const persenKehadiran = Math.round((totalHadir / totalHari) * 100);

  const calculateScore = (g: NilaiSiswa) => {
    const b = settings.bobotNilai;
    const totalBobot = b.tugas + b.kuis + b.praktik + b.proyek + b.ujian || 100;
    const score = Math.round(
      (g.nilaiTugas * b.tugas +
        g.nilaiKuis * b.kuis +
        g.nilaiPraktik * b.praktik +
        g.nilaiProyek * b.proyek +
        g.nilaiUjian * b.ujian) /
        totalBobot
    );

    let predikat = 'D';
    if (score >= 90) predikat = 'A (Sangat Baik)';
    else if (score >= 80) predikat = 'B (Baik)';
    else if (score >= 70) predikat = 'C (Cukup)';
    else predikat = 'D (Perlu Bimbingan)';

    return { score, predikat };
  };

  // Format COPAS text for student report card to parents
  const copasRapor = `📜 *LAPORAN PERKEMBANGAN BELAJAR PESERTA DIDIK*
========================================
*Nama Madrasah:* ${settings.namaMadrasah}
*Nama Siswa:* ${siswa.nama}
*NISN / No. Absen:* ${siswa.nisn} / #${siswa.noAbsen}
*Kelas / Fase:* Kelas ${siswa.kelas} (${siswa.fase})
*Tahun Ajaran:* ${settings.tahunAjaran} (Semester ${settings.semester})

📊 *DAFTAR CAPAIAN NILAI MATA PELAJARAN:*
${
  myGrades.length === 0
    ? '- Nilai sedang dalam proses penginputan oleh guru.'
    : myGrades
        .map((g, idx) => {
          const { score, predikat } = calculateScore(g);
          return `${idx + 1}. *${g.mapel}*
   • Tugas: ${g.nilaiTugas} | Kuis: ${g.nilaiKuis} | Praktik: ${g.nilaiPraktik} | Proyek: ${g.nilaiProyek} | Ujian: ${g.nilaiUjian}
   • *Nilai Akhir: ${score}* [${predikat}]
   • Catatan: "${g.catatanGuru || 'Terus pertahankan semangat belajar!'}"`;
        })
        .join('\n\n')
}

🗓️ *REKAP KEHADIRAN:*
• Hadir: ${totalHadir} Hari (${persenKehadiran}%)
• Sakit: ${totalSakit} Hari | Izin: ${totalIzin} Hari | Alpa: ${totalAlpa} Hari

_Guru Pengampu: ${settings.namaGuru} - ${settings.namaMadrasah}_`;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-700" />
            <span>Rapor Nilai & Capaian Belajar Siswa</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan asesmen formatif dan sumatif Kurikulum Merdeka MIN 1 Paser
          </p>
        </div>

        <CopasButton
          textToCopy={copasRapor}
          label="COPAS Rapor Siswa"
          size="md"
          variant="primary"
          filename={`rapor-${siswa.nama.toLowerCase().replace(/\s+/g, '-')}.txt`}
          title={`Rapor Nilai: ${siswa.nama}`}
        />
      </div>

      {/* Attendance & Performance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
            <CalendarCheck className="w-4 h-4" />
            <span>Tingkat Kehadiran Madrasah</span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{persenKehadiran}%</div>
          <div className="text-xs text-slate-500 mt-1">
            Hadir: {totalHadir} | Sakit: {totalSakit} | Izin: {totalIzin} | Alpa: {totalAlpa}
          </div>
        </div>

        {/* Subjects Graded */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
            <Award className="w-4 h-4" />
            <span>Mapel yang Telah Dinilai</span>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{myGrades.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            Semester {settings.semester} • TP {settings.tahunAjaran}
          </div>
        </div>

        {/* Character remark */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 rounded-2xl border border-emerald-100 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Catatan Karakter Siswa</span>
          </div>
          <div className="text-sm font-bold text-emerald-950 mt-2">{siswa.keterangan}</div>
          <div className="text-[11px] text-emerald-700 mt-1">
            Wali Kelas: {settings.namaGuru}
          </div>
        </div>
      </div>

      {/* Grades List Cards */}
      <div className="space-y-3.5">
        <h3 className="font-bold text-sm text-slate-900">Rincian Nilai per Mata Pelajaran</h3>

        {myGrades.length === 0 ? (
          <div className="p-10 bg-white rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
            Guru belum menginput nilai pada semester ini. Silakan periksa kembali nanti.
          </div>
        ) : (
          myGrades.map((grade) => {
            const { score, predikat } = calculateScore(grade);
            return (
              <div
                key={grade.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">{grade.mapel}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                      Semester {grade.semester}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-700 font-mono">
                        {score}
                      </div>
                      <div className="text-[10px] text-slate-400">Nilai Akhir</div>
                    </div>

                    <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold">
                      {predikat}
                    </span>
                  </div>
                </div>

                {/* Score Breakdown pills */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <div className="text-slate-400 text-[10px]">Tugas</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{grade.nilaiTugas}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <div className="text-slate-400 text-[10px]">Kuis</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{grade.nilaiKuis}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <div className="text-slate-400 text-[10px]">Praktik</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{grade.nilaiPraktik}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center">
                    <div className="text-slate-400 text-[10px]">Proyek</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{grade.nilaiProyek}</div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-center col-span-2 sm:col-span-1">
                    <div className="text-slate-400 text-[10px]">Ujian</div>
                    <div className="font-bold text-slate-800 text-sm mt-0.5">{grade.nilaiUjian}</div>
                  </div>
                </div>

                {grade.catatanGuru && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-800 italic">
                    <span className="font-bold not-italic">Catatan Guru: </span>
                    "{grade.catatanGuru}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
