/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  MadrasahSettings,
  PesertaDidik,
  MateriPembelajaran,
  Tugas,
  PengumpulanTugas,
  KuisInteraktif,
  HasilKuis,
  AbsensiRecord,
  NilaiSiswa,
  PortofolioKarya,
  Pengumuman,
  UserRole,
} from './types/lms';
import { StorageService } from './services/storage';
import { ToastProvider } from './components/common/Toast';
import { Header, GURU_TABS, SISWA_TABS } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Modal } from './components/common/Modal';

// Mode Guru Components
import { GuruDashboard } from './components/guru/GuruDashboard';
import { SiswaManager } from './components/guru/SiswaManager';
import { MateriManager } from './components/guru/MateriManager';
import { TugasManager } from './components/guru/TugasManager';
import { KuisManager } from './components/guru/KuisManager';
import { AbsensiManager } from './components/guru/AbsensiManager';
import { NilaiManager } from './components/guru/NilaiManager';
import { PortofolioManager } from './components/guru/PortofolioManager';
import { PengumumanManager } from './components/guru/PengumumanManager';
import { PengaturanManager } from './components/guru/PengaturanManager';

// Mode Siswa Components
import { SiswaDashboard } from './components/siswa/SiswaDashboard';
import { SiswaMateri } from './components/siswa/SiswaMateri';
import { SiswaTugas } from './components/siswa/SiswaTugas';
import { SiswaKuis } from './components/siswa/SiswaKuis';
import { SiswaNilai } from './components/siswa/SiswaNilai';
import { SiswaPortofolio } from './components/siswa/SiswaPortofolio';

export default function App() {
  // App State with LocalStorage persistence
  const [settings, setSettings] = useState<MadrasahSettings>(() => StorageService.getSettings());
  const [siswaList, setSiswaList] = useState<PesertaDidik[]>(() => StorageService.getSiswa());
  const [materiList, setMateriList] = useState<MateriPembelajaran[]>(() =>
    StorageService.getMateri()
  );
  const [tugasList, setTugasList] = useState<Tugas[]>(() => StorageService.getTugas());
  const [pengumpulanList, setPengumpulanList] = useState<PengumpulanTugas[]>(() =>
    StorageService.getPengumpulan()
  );
  const [kuisList, setKuisList] = useState<KuisInteraktif[]>(() => StorageService.getKuis());
  const [hasilKuisList, setHasilKuisList] = useState<HasilKuis[]>(() =>
    StorageService.getHasilKuis()
  );
  const [absensiList, setAbsensiList] = useState<AbsensiRecord[]>(() =>
    StorageService.getAbsensi()
  );
  const [nilaiList, setNilaiList] = useState<NilaiSiswa[]>(() => StorageService.getNilai());
  const [portofolioList, setPortofolioList] = useState<PortofolioKarya[]>(() =>
    StorageService.getPortofolio()
  );
  const [pengumumanList, setPengumumanList] = useState<Pengumuman[]>(() =>
    StorageService.getPengumuman()
  );

  // Active Role and Navigation
  const [userRole, setUserRole] = useState<UserRole>('guru');
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Selected Student for Student Mode (defaults to Zahra Amelia Putri, Kelas 6)
  const [selectedSiswa, setSelectedSiswa] = useState<PesertaDidik>(
    () => siswaList.find((s) => s.kelas === 6) || siswaList[0]
  );

  // Modal State for Mobile "Lainnya" menu
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // State to trigger immediate quiz taking from student dashboard
  const [quizToTake, setQuizToTake] = useState<KuisInteraktif | null>(null);

  // Sync handlers that save to storage
  const handleUpdateSettings = (newSettings: MadrasahSettings) => {
    setSettings(newSettings);
    StorageService.saveSettings(newSettings);
  };

  const handleSaveSiswa = (newList: PesertaDidik[]) => {
    setSiswaList(newList);
    StorageService.saveSiswa(newList);
    if (!newList.some((s) => s.id === selectedSiswa?.id)) {
      setSelectedSiswa(newList[0]);
    }
  };

  const handleSaveMateri = (newList: MateriPembelajaran[]) => {
    setMateriList(newList);
    StorageService.saveMateri(newList);
  };

  const handleSaveTugas = (newList: Tugas[]) => {
    setTugasList(newList);
    StorageService.saveTugas(newList);
  };

  const handleSavePengumpulan = (newList: PengumpulanTugas[]) => {
    setPengumpulanList(newList);
    StorageService.savePengumpulan(newList);
  };

  const handleSaveKuis = (newList: KuisInteraktif[]) => {
    setKuisList(newList);
    StorageService.saveKuis(newList);
  };

  const handleSaveHasilKuis = (newList: HasilKuis[]) => {
    setHasilKuisList(newList);
    StorageService.saveHasilKuis(newList);
  };

  const handleSaveAbsensi = (newList: AbsensiRecord[]) => {
    setAbsensiList(newList);
    StorageService.saveAbsensi(newList);
  };

  const handleSaveNilai = (newList: NilaiSiswa[]) => {
    setNilaiList(newList);
    StorageService.saveNilai(newList);
  };

  const handleSavePortofolio = (newList: PortofolioKarya[]) => {
    setPortofolioList(newList);
    StorageService.savePortofolio(newList);
  };

  const handleSavePengumuman = (newList: Pengumuman[]) => {
    setPengumumanList(newList);
    StorageService.savePengumuman(newList);
  };

  const handleReloadAllData = () => {
    setSettings(StorageService.getSettings());
    setSiswaList(StorageService.getSiswa());
    setMateriList(StorageService.getMateri());
    setTugasList(StorageService.getTugas());
    setPengumpulanList(StorageService.getPengumpulan());
    setKuisList(StorageService.getKuis());
    setHasilKuisList(StorageService.getHasilKuis());
    setAbsensiList(StorageService.getAbsensi());
    setNilaiList(StorageService.getNilai());
    setPortofolioList(StorageService.getPortofolio());
    setPengumumanList(StorageService.getPengumuman());
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    setActiveTab('dashboard');
  };

  // Student triggered quiz
  const handleTakeQuizFromDashboard = (kuis: KuisInteraktif) => {
    setQuizToTake(kuis);
    setActiveTab('kuis');
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-slate-100/60 pb-20 lg:pb-8 text-slate-800">
        {/* Responsive Header */}
        <Header
          settings={settings}
          userRole={userRole}
          onRoleChange={handleRoleChange}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          selectedSiswa={selectedSiswa}
          allSiswa={siswaList}
          onSelectSiswa={(s) => setSelectedSiswa(s)}
          unreadCount={pengumumanList.filter((p) => p.aktif).length}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 lg:p-8">
          {/* ================= MODE GURU ================= */}
          {userRole === 'guru' && (
            <>
              {activeTab === 'dashboard' && (
                <GuruDashboard
                  settings={settings}
                  siswaList={siswaList}
                  materiList={materiList}
                  tugasList={tugasList}
                  kuisList={kuisList}
                  pengumumanList={pengumumanList}
                  absensiList={absensiList}
                  nilaiList={nilaiList}
                  pengumpulanList={pengumpulanList}
                  hasilKuisList={hasilKuisList}
                  onNavigateTab={setActiveTab}
                  onOpenNewMateri={() => setActiveTab('materi')}
                  onOpenNewTugas={() => setActiveTab('tugas')}
                  onOpenNewKuis={() => setActiveTab('kuis')}
                />
              )}

              {activeTab === 'siswa' && (
                <SiswaManager
                  settings={settings}
                  siswaList={siswaList}
                  onSaveSiswa={handleSaveSiswa}
                  absensiList={absensiList}
                  nilaiList={nilaiList}
                />
              )}

              {activeTab === 'materi' && (
                <MateriManager
                  settings={settings}
                  materiList={materiList}
                  onSaveMateri={handleSaveMateri}
                  tugasList={tugasList}
                />
              )}

              {activeTab === 'tugas' && (
                <TugasManager
                  settings={settings}
                  tugasList={tugasList}
                  onSaveTugas={handleSaveTugas}
                  pengumpulanList={pengumpulanList}
                  onSavePengumpulan={handleSavePengumpulan}
                  siswaList={siswaList}
                />
              )}

              {activeTab === 'kuis' && (
                <KuisManager
                  settings={settings}
                  kuisList={kuisList}
                  onSaveKuis={handleSaveKuis}
                  hasilKuisList={hasilKuisList}
                  siswaList={siswaList}
                />
              )}

              {activeTab === 'absensi' && (
                <AbsensiManager
                  settings={settings}
                  siswaList={siswaList}
                  absensiList={absensiList}
                  onSaveAbsensi={handleSaveAbsensi}
                />
              )}

              {activeTab === 'nilai' && (
                <NilaiManager
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  siswaList={siswaList}
                  nilaiList={nilaiList}
                  onSaveNilai={handleSaveNilai}
                />
              )}

              {activeTab === 'portofolio' && (
                <PortofolioManager
                  settings={settings}
                  portofolioList={portofolioList}
                  onSavePortofolio={handleSavePortofolio}
                  siswaList={siswaList}
                />
              )}

              {activeTab === 'pengumuman' && (
                <PengumumanManager
                  settings={settings}
                  pengumumanList={pengumumanList}
                  onSavePengumuman={handleSavePengumuman}
                />
              )}

              {activeTab === 'pengaturan' && (
                <PengaturanManager
                  settings={settings}
                  onUpdateSettings={handleUpdateSettings}
                  onDataReset={handleReloadAllData}
                />
              )}
            </>
          )}

          {/* ================= MODE PESERTA DIDIK ================= */}
          {userRole === 'siswa' && selectedSiswa && (
            <>
              {activeTab === 'dashboard' && (
                <SiswaDashboard
                  settings={settings}
                  siswa={selectedSiswa}
                  materiList={materiList}
                  tugasList={tugasList}
                  kuisList={kuisList}
                  pengumumanList={pengumumanList}
                  pengumpulanList={pengumpulanList}
                  hasilKuisList={hasilKuisList}
                  nilaiList={nilaiList}
                  onNavigateTab={setActiveTab}
                  onTakeQuiz={handleTakeQuizFromDashboard}
                />
              )}

              {activeTab === 'materi' && (
                <SiswaMateri
                  settings={settings}
                  siswa={selectedSiswa}
                  materiList={materiList}
                />
              )}

              {activeTab === 'tugas' && (
                <SiswaTugas
                  settings={settings}
                  siswa={selectedSiswa}
                  tugasList={tugasList}
                  pengumpulanList={pengumpulanList}
                  onSavePengumpulan={handleSavePengumpulan}
                />
              )}

              {activeTab === 'kuis' && (
                <SiswaKuis
                  settings={settings}
                  siswa={selectedSiswa}
                  kuisList={kuisList}
                  hasilKuisList={hasilKuisList}
                  onSaveHasilKuis={handleSaveHasilKuis}
                  initialSelectedKuis={quizToTake}
                />
              )}

              {activeTab === 'nilai' && (
                <SiswaNilai
                  settings={settings}
                  siswa={selectedSiswa}
                  nilaiList={nilaiList}
                  absensiList={absensiList}
                />
              )}

              {activeTab === 'portofolio' && (
                <SiswaPortofolio
                  settings={settings}
                  siswa={selectedSiswa}
                  portofolioList={portofolioList}
                  onSavePortofolio={handleSavePortofolio}
                />
              )}

              {activeTab === 'pengumuman' && (
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                    <h2 className="text-lg font-bold text-slate-900">
                      Pengumuman Resmi {settings.namaMadrasah}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Informasi kegiatan, libur, dan asesmen madrasah
                    </p>
                  </div>

                  <div className="space-y-3">
                    {pengumumanList
                      .filter(
                        (p) =>
                          p.aktif &&
                          (p.targetKelas === 'Semua' || p.targetKelas === selectedSiswa.kelas)
                      )
                      .map((ann) => (
                        <div
                          key={ann.id}
                          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2.5 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800">
                              {ann.kategori}
                            </span>
                            <span className="text-slate-400">
                              {new Date(ann.tanggal).toLocaleDateString('id-ID', {
                                dateStyle: 'long',
                              })}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-slate-900">{ann.judul}</h3>
                          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                            {ann.konten}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        {/* Mobile HP Bottom Navigation (Prioritas Penggunaan Melalui HP) */}
        <BottomNav
          userRole={userRole}
          activeTab={activeTab}
          onTabChange={(tab) => {
            if (tab !== activeTab) {
              setQuizToTake(null);
            }
            setActiveTab(tab);
          }}
          onOpenMoreMenu={() => setIsMobileMoreOpen(true)}
        />

        {/* Mobile "Lainnya" Full Menu Modal */}
        {isMobileMoreOpen && (
          <Modal
            isOpen={isMobileMoreOpen}
            onClose={() => setIsMobileMoreOpen(false)}
            title={userRole === 'guru' ? 'Seluruh Menu Guru (10 Modul)' : 'Seluruh Menu Siswa'}
            subtitle={`LMS ${settings.namaMadrasah} • TP ${settings.tahunAjaran}`}
            maxWidth="sm"
          >
            <div className="grid grid-cols-2 gap-2">
              {(userRole === 'guru' ? GURU_TABS : SISWA_TABS).map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsMobileMoreOpen(false);
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-left text-xs font-semibold transition-all ${
                      isActive
                        ? userRole === 'guru'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </Modal>
        )}
      </div>
    </ToastProvider>
  );
}
