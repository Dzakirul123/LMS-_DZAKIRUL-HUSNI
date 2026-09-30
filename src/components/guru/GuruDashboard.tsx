import React from 'react';
import {
  Users,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Bell,
  Award,
  CalendarCheck,
  PlusCircle,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  Share2,
  Sparkles,
  School,
  ArrowUpRight,
} from 'lucide-react';
import {
  MadrasahSettings,
  PesertaDidik,
  MateriPembelajaran,
  Tugas,
  KuisInteraktif,
  Pengumuman,
  AbsensiRecord,
  NilaiSiswa,
  PengumpulanTugas,
  HasilKuis,
} from '../../types/lms';
import { CopasButton } from '../common/CopasButton';

interface GuruDashboardProps {
  settings: MadrasahSettings;
  siswaList: PesertaDidik[];
  materiList: MateriPembelajaran[];
  tugasList: Tugas[];
  kuisList: KuisInteraktif[];
  pengumumanList: Pengumuman[];
  absensiList: AbsensiRecord[];
  nilaiList: NilaiSiswa[];
  pengumpulanList: PengumpulanTugas[];
  hasilKuisList: HasilKuis[];
  onNavigateTab: (tab: string) => void;
  onOpenNewMateri: () => void;
  onOpenNewTugas: () => void;
  onOpenNewKuis: () => void;
}

export const GuruDashboard: React.FC<GuruDashboardProps> = ({
  settings,
  siswaList,
  materiList,
  tugasList,
  kuisList,
  pengumumanList,
  absensiList,
  nilaiList,
  pengumpulanList,
  hasilKuisList,
  onNavigateTab,
  onOpenNewMateri,
  onOpenNewTugas,
  onOpenNewKuis,
}) => {
  // Today's attendance calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAbsensi = absensiList.filter((a) => a.tanggal === todayStr);
  const totalHadir = todayAbsensi.filter((a) => a.status === 'Hadir').length;
  const totalSakit = todayAbsensi.filter((a) => a.status === 'Sakit').length;
  const totalIzin = todayAbsensi.filter((a) => a.status === 'Izin').length;
  const totalAlpa = todayAbsensi.filter((a) => a.status === 'Alpa').length;
  const persenHadir =
    todayAbsensi.length > 0 ? Math.round((totalHadir / todayAbsensi.length) * 100) : 100;

  // Average Score
  const allScores = nilaiList.map((n) => {
    const b = settings.bobotNilai;
    const totalBobot = b.tugas + b.kuis + b.praktik + b.proyek + b.ujian || 100;
    return (
      (n.nilaiTugas * b.tugas +
        n.nilaiKuis * b.kuis +
        n.nilaiPraktik * b.praktik +
        n.nilaiProyek * b.proyek +
        n.nilaiUjian * b.ujian) /
      totalBobot
    );
  });
  const avgScore =
    allScores.length > 0
      ? (allScores.reduce((acc, curr) => acc + curr, 0) / allScores.length).toFixed(1)
      : '88.5';

  // Format Dashboard summary for WhatsApp broadcast to Kepala Madrasah / Grup Guru
  const dashboardCopasSummary = `📊 *RINGKASAN LMS ${settings.namaMadrasah.toUpperCase()}*
========================================
*Hari/Tanggal:* ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
*Tahun Ajaran:* ${settings.tahunAjaran} (${settings.semester})
*Admin Super:* ${settings.namaGuru}

📈 *STATISTIK UTAMA:*
• Total Peserta Didik: ${siswaList.length} Siswa (Kelas 1 - 6)
• Materi Aktif: ${materiList.length} Bahan Ajar
• Tugas Berjalan: ${tugasList.length} Tugas
• Kuis Interaktif: ${kuisList.length} Bank Soal CBT
• Pengumuman: ${pengumumanList.filter((p) => p.aktif).length} Pengumuman Aktif
• Rata-rata Nilai Madrasah: ${avgScore} / 100

📋 *PRESENSI HARI INI:*
• Tingkat Kehadiran: ${persenHadir}%
• Hadir: ${totalHadir} | Sakit: ${totalSakit} | Izin: ${totalIzin} | Alpa: ${totalAlpa}

📌 *PENGUMUMAN TERBARU:*
${pengumumanList.slice(0, 2).map((p) => `• ${p.judul}`).join('\n')}

_Dikelola melalui Sistem LMS MIN 1 Paser_`;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-5 sm:p-7 shadow-md">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-6">
          <School className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Panel Guru & Super Admin • MIN 1 Paser</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-snug">
            Ahlan wa Sahlan, {settings.namaGuru}!
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-2 leading-relaxed">
            Selamat datang di Dashboard Pembelajaran Interaktif MIN 1 Paser khusus Kelas 6 (Fase C). Kelola peserta didik, materi Kurikulum Merdeka, tugas bertingkat, kuis CBT otomatis, dan rekapitulasi nilai dengan sekali klik.
          </p>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              onClick={onOpenNewMateri}
              className="px-3.5 py-2 rounded-xl bg-white text-emerald-900 text-xs sm:text-sm font-bold hover:bg-emerald-50 active:bg-slate-100 transition-all flex items-center gap-2 shadow-xs"
            >
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>Tambah Materi</span>
            </button>

            <button
              onClick={onOpenNewTugas}
              className="px-3.5 py-2 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold border border-emerald-400/40 transition-all flex items-center gap-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Beri Tugas</span>
            </button>

            <button
              onClick={onOpenNewKuis}
              className="px-3.5 py-2 rounded-xl bg-teal-600/90 hover:bg-teal-600 text-white text-xs sm:text-sm font-semibold border border-teal-400/40 transition-all flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Buat Kuis</span>
            </button>

            <CopasButton
              textToCopy={dashboardCopasSummary}
              label="COPAS Ringkasan ke WA"
              size="md"
              variant="secondary"
              filename="ringkasan-lms-min1paser.txt"
              title="Ringkasan LMS MIN 1 Paser untuk WhatsApp"
            />
          </div>
        </div>
      </div>

      {/* Primary KPI Grid (6 metrics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Siswa */}
        <div
          onClick={() => onNavigateTab('siswa')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Peserta Didik</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{siswaList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
            <span>Kelas 6 (Fase C)</span>
          </div>
        </div>

        {/* Materi */}
        <div
          onClick={() => onNavigateTab('materi')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Materi Ajar</span>
            <div className="p-2 rounded-lg bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{materiList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Mapel Umum & Agama</div>
        </div>

        {/* Tugas */}
        <div
          onClick={() => onNavigateTab('tugas')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tugas Aktif</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{tugasList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{pengumpulanList.length} Terkumpul</div>
        </div>

        {/* Kuis */}
        <div
          onClick={() => onNavigateTab('kuis')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Kuis CBT</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <HelpCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{kuisList.length}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{hasilKuisList.length} Selesai</div>
        </div>

        {/* Kehadiran */}
        <div
          onClick={() => onNavigateTab('absensi')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Presensi Hari Ini</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{persenHadir}%</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">
            {totalHadir} Hadir / {todayAbsensi.length} Data
          </div>
        </div>

        {/* Nilai */}
        <div
          onClick={() => onNavigateTab('nilai')}
          className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rata-rata Nilai</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 mt-2">{avgScore}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Predikat B (Baik)</div>
        </div>
      </div>

      {/* Two Column Layout for Actionable Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Submissions & Activities (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Task Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                  Pengumpulan Tugas Terbaru Siswa
                </h3>
                <p className="text-xs text-slate-500">Periksa hasil karya dan berikan penilaian</p>
              </div>
              <button
                onClick={() => onNavigateTab('tugas')}
                className="text-xs text-emerald-700 font-semibold hover:text-emerald-800 flex items-center gap-1"
              >
                Lihat Semua ({pengumpulanList.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pengumpulanList.slice(0, 4).map((sub) => {
                const siswa = siswaList.find((s) => s.id === sub.siswaId);
                const tugas = tugasList.find((t) => t.id === sub.tugasId);
                return (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs sm:text-sm">
                          {siswa?.nama || 'Siswa'}
                        </span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
                          Kelas {siswa?.kelas}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {new Date(sub.tanggalKumpul).toLocaleDateString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-1 truncate">
                        Tugas: {tugas?.judul || 'Latihan'}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                        "{sub.isiJawaban}"
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      {sub.status === 'Sudah Dinilai' ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Nilai: {sub.nilai}</span>
                        </div>
                      ) : (
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-bold">
                          Perlu Dinilai
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Class Breakdown (Fase A, B, C) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
              Distribusi Fase Kurikulum Merdeka MIN 1 Paser
            </h3>
            <p className="text-xs text-slate-500 mb-4">Pengelompokan jenjang sesuai kurikulum madrasah</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                <div className="text-xs font-bold text-emerald-900">FASE A (Kelas 1 - 2)</div>
                <div className="text-lg font-black text-emerald-800 mt-1">
                  {siswaList.filter((s) => s.fase === 'Fase A').length} Siswa
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Fokus: Karakter Islami, visual interaktif, bermain sambil belajar & membaca Iqra.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-100">
                <div className="text-xs font-bold text-teal-900">FASE B (Kelas 3 - 4)</div>
                <div className="text-lg font-black text-teal-800 mt-1">
                  {siswaList.filter((s) => s.fase === 'Fase B').length} Siswa
                </div>
                <p className="text-[11px] text-teal-700 mt-1">
                  Fokus: Penguasaan konsep dasar mapel agama, IPAS terintegrasi, dan kuis interaktif.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-50/70 border border-cyan-100">
                <div className="text-xs font-bold text-cyan-900">FASE C (Kelas 5 - 6)</div>
                <div className="text-lg font-black text-cyan-800 mt-1">
                  {siswaList.filter((s) => s.fase === 'Fase C').length} Siswa
                </div>
                <p className="text-[11px] text-cyan-700 mt-1">
                  Fokus: Proyek mandiri, keterampilan bernalar kritis, dan persiapan asesmen madrasah.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Announcements & Quick Broadcasts (1 col) */}
        <div className="space-y-6">
          {/* Active Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Pengumuman Aktif</h3>
              </div>
              <button
                onClick={() => onNavigateTab('pengumuman')}
                className="text-xs text-emerald-700 font-semibold hover:underline"
              >
                Kelola
              </button>
            </div>

            <div className="space-y-3">
              {pengumumanList
                .filter((p) => p.aktif)
                .slice(0, 3)
                .map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {ann.kategori}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ann.tanggal).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="font-bold text-xs text-slate-800 mt-1.5 line-clamp-1">
                      {ann.judul}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{ann.konten}</p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Madrasah Info Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white p-5 rounded-2xl shadow-md border border-slate-800">
            <h4 className="font-bold text-sm text-emerald-400">Identitas Madrasah</h4>
            <div className="text-base font-black text-white mt-1">{settings.namaMadrasah}</div>
            <div className="text-xs text-slate-300 mt-2 space-y-1">
              <div>📍 {settings.alamat}, {settings.kabupaten}</div>
              <div>👤 Super Admin: {settings.namaGuru}</div>
              <div>📅 Tahun Ajaran: {settings.tahunAjaran} ({settings.semester})</div>
            </div>

            <button
              onClick={() => onNavigateTab('pengaturan')}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Ubah Identitas & Bobot Nilai</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
