import React from 'react';
import {
  Sparkles,
  BookOpen,
  FileCheck2,
  HelpCircle,
  Award,
  Bell,
  CheckCircle2,
  Clock,
  ArrowRight,
  Star,
  Trophy,
} from 'lucide-react';
import {
  PesertaDidik,
  MateriPembelajaran,
  Tugas,
  KuisInteraktif,
  Pengumuman,
  PengumpulanTugas,
  HasilKuis,
  NilaiSiswa,
  MadrasahSettings,
} from '../../types/lms';

interface SiswaDashboardProps {
  settings: MadrasahSettings;
  siswa: PesertaDidik;
  materiList: MateriPembelajaran[];
  tugasList: Tugas[];
  kuisList: KuisInteraktif[];
  pengumumanList: Pengumuman[];
  pengumpulanList: PengumpulanTugas[];
  hasilKuisList: HasilKuis[];
  nilaiList: NilaiSiswa[];
  onNavigateTab: (tab: string) => void;
  onTakeQuiz: (kuis: KuisInteraktif) => void;
}

export const SiswaDashboard: React.FC<SiswaDashboardProps> = ({
  settings,
  siswa,
  materiList,
  tugasList,
  kuisList,
  pengumumanList,
  pengumpulanList,
  hasilKuisList,
  nilaiList,
  onNavigateTab,
  onTakeQuiz,
}) => {
  // Filter for this student's grade
  const classMateri = materiList.filter((m) => m.kelas === siswa.kelas);
  const classTugas = tugasList.filter((t) => t.kelas === siswa.kelas);
  const classKuis = kuisList.filter((k) => k.kelas === siswa.kelas && k.aktif);

  const mySubmissions = pengumpulanList.filter((p) => p.siswaId === siswa.id);
  const myCompletedQuizzes = hasilKuisList.filter((h) => h.siswaId === siswa.id);

  // Progress metrics
  const completedTaskCount = mySubmissions.length;
  const totalTaskCount = classTugas.length || 1;
  const taskProgressPct = Math.min(100, Math.round((completedTaskCount / totalTaskCount) * 100));

  const completedQuizCount = myCompletedQuizzes.length;
  const totalQuizCount = classKuis.length || 1;
  const quizProgressPct = Math.min(100, Math.round((completedQuizCount / totalQuizCount) * 100));

  // Kid friendly motivational quotes
  const quotes = [
    '"Menuntut ilmu adalah kewajiban bagi setiap muslim." (HR. Ibnu Majah)',
    '"Sebaik-baik kalian adalah orang yang belajar Al-Qur\'an dan mengajarkannya." (HR. Bukhari)',
    '"Barang siapa menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga."',
  ];
  const todayQuote = quotes[siswa.noAbsen % quotes.length];

  return (
    <div className="space-y-6">
      {/* Student Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white p-5 sm:p-7 shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-400/30 text-amber-300 text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>Siswa MIN 1 Paser • {siswa.fase}</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Assalamu'alaikum, {siswa.nama}! 👋
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
              Semangat belajar hari ini di Kelas {siswa.kelas} MIN 1 Paser. Terus raih prestasi terbaik dan amalkan ilmu dengan akhlak mulia!
            </p>

            <div className="mt-3 text-[11px] text-emerald-200/90 italic bg-emerald-900/40 px-3 py-1.5 rounded-xl border border-emerald-700/50 inline-block">
              {todayQuote}
            </div>
          </div>

          {/* Student Badge Card */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center shadow-md">
              {siswa.kelas}
            </div>
            <div>
              <div className="text-xs font-bold text-amber-200">Peserta Didik</div>
              <div className="font-extrabold text-sm">{siswa.nama}</div>
              <div className="text-[11px] text-emerald-200">
                Absen #{siswa.noAbsen} • NISN: {siswa.nisn}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Materi Progress */}
        <div
          onClick={() => onNavigateTab('materi')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
              Buka Materi <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{classMateri.length}</div>
            <div className="text-xs font-bold text-slate-700">Materi Belajar Kelas {siswa.kelas}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Mapel Agama dan Umum lengkap</p>
          </div>
        </div>

        {/* Tugas Progress */}
        <div
          onClick={() => onNavigateTab('tugas')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-700">
              {completedTaskCount} / {classTugas.length} Selesai
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{taskProgressPct}%</div>
            <div className="text-xs font-bold text-slate-700">Progres Tugas Siswa</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${taskProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* Kuis Progress */}
        <div
          onClick={() => onNavigateTab('kuis')}
          className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-700">
              {completedQuizCount} / {classKuis.length} Kuis Selesai
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{quizProgressPct}%</div>
            <div className="text-xs font-bold text-slate-700">Progres Kuis CBT</div>
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${quizProgressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks to do & Quizzes ready */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Quizzes */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-emerald-700" />
                  <span>Kuis CBT Siap Dikerjakan</span>
                </h3>
                <p className="text-xs text-slate-500">Uji kemampuan dan raih nilai terbaikmu</p>
              </div>

              <button
                onClick={() => onNavigateTab('kuis')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              {classKuis.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                  Belum ada kuis yang dibuka untuk kelasmu saat ini.
                </div>
              ) : (
                classKuis.slice(0, 3).map((kuis) => {
                  const completed = myCompletedQuizzes.find((h) => h.kuisId === kuis.id);
                  return (
                    <div
                      key={kuis.id}
                      className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                            {kuis.mapel}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {kuis.durasiMenit} Menit • {kuis.soal.length} Soal
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">{kuis.judul}</h4>
                        <div className="text-xs text-slate-500 mt-0.5">{kuis.babTopik}</div>
                      </div>

                      <div className="shrink-0">
                        {completed ? (
                          <div className="flex items-center gap-2">
                            {completed.isGugur ? (
                              <span className="px-3 py-1.5 bg-rose-100 text-rose-900 border border-rose-200 rounded-xl text-xs font-bold flex items-center gap-1">
                                💀 Gugur • Nilai: {completed.nilaiAkhir}
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Nilai: {completed.nilaiAkhir}
                              </span>
                            )}
                            <button
                              onClick={() => onTakeQuiz(kuis)}
                              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700"
                            >
                              {completed.isGugur ? 'Coba Lagi' : 'Ulangi'}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onTakeQuiz(kuis)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                          >
                            <span>Kerjakan Sekarang</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-emerald-700" />
                  <span>Daftar Tugas & Latihan Kelas {siswa.kelas}</span>
                </h3>
                <p className="text-xs text-slate-500">Kumpulkan tugas tepat waktu ya!</p>
              </div>

              <button
                onClick={() => onNavigateTab('tugas')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Lihat Semua ({classTugas.length})
              </button>
            </div>

            <div className="space-y-3">
              {classTugas.slice(0, 3).map((tugas) => {
                const sub = mySubmissions.find((s) => s.tugasId === tugas.id);
                return (
                  <div
                    key={tugas.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                          {tugas.mapel}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {tugas.jenis}
                        </span>
                        <span className="text-[11px] text-rose-600 flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3" />
                          {new Date(tugas.batasWaktu).toLocaleDateString('id-ID')}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">{tugas.judul}</h4>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {tugas.instruksi}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {sub ? (
                        <div className="text-right">
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-900 rounded-lg text-xs font-bold inline-block">
                            {sub.status === 'Sudah Dinilai'
                              ? `Nilai: ${sub.nilai}`
                              : 'Sudah Dikumpulkan'}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => onNavigateTab('tugas')}
                          className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold"
                        >
                          Kumpulkan Tugas
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Pinned Announcements */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2 mb-3">
              <Bell className="w-4 h-4 text-emerald-700" />
              <span>Pengumuman Madrasah</span>
            </h3>

            <div className="space-y-3">
              {pengumumanList
                .filter((p) => p.aktif && (p.targetKelas === 'Semua' || p.targetKelas === siswa.kelas))
                .slice(0, 3)
                .map((ann) => (
                  <div
                    key={ann.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100/70 transition-colors"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-800">{ann.kategori}</span>
                      <span className="text-slate-400">
                        {new Date(ann.tanggal).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs text-slate-900 mt-1">{ann.judul}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ann.konten}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Teacher Contact Card */}
          <div className="bg-gradient-to-br from-emerald-900 to-teal-950 text-white p-5 rounded-2xl shadow-md border border-emerald-800">
            <div className="text-xs font-bold text-amber-300">Guru Pengampu & Wali Kelas</div>
            <div className="text-base font-extrabold mt-1">{settings.namaGuru}</div>
            <p className="text-xs text-emerald-200 mt-1 leading-relaxed">
              Jika ada materi atau soal yang belum kamu pahami, tanyakan langsung kepada guru pada jam pelajaran madrasah ya!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
