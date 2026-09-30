import React, { useState } from 'react';
import {
  GraduationCap,
  UserCheck,
  Users,
  BookOpen,
  FileCheck2,
  HelpCircle,
  CalendarCheck,
  Award,
  FolderKanban,
  Bell,
  Settings,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  School,
} from 'lucide-react';
import { MadrasahSettings, PesertaDidik, UserRole } from '../../types/lms';

interface HeaderProps {
  settings: MadrasahSettings;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedSiswa: PesertaDidik | null;
  allSiswa: PesertaDidik[];
  onSelectSiswa: (siswa: PesertaDidik) => void;
  unreadCount?: number;
}

export const GURU_TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: School },
  { id: 'siswa', label: 'Peserta Didik', icon: Users },
  { id: 'materi', label: 'Materi', icon: BookOpen },
  { id: 'tugas', label: 'Tugas', icon: FileCheck2 },
  { id: 'kuis', label: 'Kuis', icon: HelpCircle },
  { id: 'absensi', label: 'Absensi', icon: CalendarCheck },
  { id: 'nilai', label: 'Daftar Nilai', icon: Award },
  { id: 'portofolio', label: 'Portofolio', icon: FolderKanban },
  { id: 'pengumuman', label: 'Pengumuman', icon: Bell },
  { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
];

export const SISWA_TABS = [
  { id: 'dashboard', label: 'Beranda Siswa', icon: School },
  { id: 'materi', label: 'Materi Belajar', icon: BookOpen },
  { id: 'tugas', label: 'Tugas Saya', icon: FileCheck2 },
  { id: 'kuis', label: 'Kuis Interaktif', icon: HelpCircle },
  { id: 'nilai', label: 'Rapor Nilai', icon: Award },
  { id: 'portofolio', label: 'Karya Saya', icon: FolderKanban },
  { id: 'pengumuman', label: 'Pengumuman', icon: Bell },
];

export const Header: React.FC<HeaderProps> = ({
  settings,
  userRole,
  onRoleChange,
  activeTab,
  onTabChange,
  selectedSiswa,
  allSiswa,
  onSelectSiswa,
  unreadCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siswaDropdownOpen, setSiswaDropdownOpen] = useState(false);

  const tabs = userRole === 'guru' ? GURU_TABS : SISWA_TABS;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Identity */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-3 py-1.5 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-emerald-600/70 text-emerald-100 px-2 py-0.5 rounded font-semibold text-[11px] tracking-wide">
              KEMENAG RI
            </span>
            <span className="font-semibold tracking-wide truncate">
              {settings.namaMadrasah} ({settings.kabupaten})
            </span>
            <span className="hidden md:inline text-emerald-300">•</span>
            <span className="hidden md:inline text-emerald-100">
              TP {settings.tahunAjaran} ({settings.semester})
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Quick Mode Switcher */}
            <div className="flex items-center bg-emerald-950/60 p-0.5 rounded-lg border border-emerald-700/50">
              <button
                type="button"
                onClick={() => onRoleChange('guru')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  userRole === 'guru'
                    ? 'bg-emerald-500 text-white shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mode Guru (Admin)</span>
                <span className="sm:hidden">Guru</span>
              </button>

              <button
                type="button"
                onClick={() => onRoleChange('siswa')}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  userRole === 'siswa'
                    ? 'bg-amber-400 text-slate-900 shadow-xs font-bold'
                    : 'text-emerald-200 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Mode Siswa</span>
                <span className="sm:hidden">Siswa</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Logo & Super Admin Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-xs shrink-0 ring-2 ring-emerald-500/20">
              <School className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight truncate">
                  LMS {settings.namaMadrasah}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                  MI • KELAS 6
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                {userRole === 'guru' ? (
                  <>
                    <span className="font-medium text-emerald-700">{settings.namaGuru}</span>
                    <span>(Admin Super)</span>
                  </>
                ) : (
                  <>
                    <span>Peserta Didik:</span>
                    <span className="font-semibold text-slate-700">{selectedSiswa?.nama || 'Pilih Siswa'}</span>
                    <span className="text-emerald-600 font-bold">Kelas {selectedSiswa?.kelas}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Student Profile Selector if in Siswa Mode */}
          {userRole === 'siswa' && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setSiswaDropdownOpen(!siswaDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-xs font-semibold text-amber-900 transition-colors shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Ganti Akun Siswa:</span>
                <span className="font-bold underline decoration-amber-400">
                  {selectedSiswa ? `${selectedSiswa.nama} (Kls ${selectedSiswa.kelas})` : 'Pilih Siswa'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-amber-700" />
              </button>

              {siswaDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Profil Siswa Kelas 6
                  </div>
                  {allSiswa.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        onSelectSiswa(s);
                        setSiswaDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        selectedSiswa?.id === s.id ? 'bg-emerald-100/60 font-bold text-emerald-900' : 'text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-slate-800">{s.nama}</div>
                        <div className="text-[11px] text-slate-500">
                          Kelas {s.kelas} • {s.fase} • Absen #{s.noAbsen}
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        Kls {s.kelas}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? userRole === 'guru'
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg animate-in slide-in-from-top-2">
          <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              {userRole === 'guru' ? 'Menu Guru (10 Modul)' : 'Menu Siswa'}
            </div>
            <div className="text-xs font-semibold text-emerald-700">
              {settings.tahunAjaran} ({settings.semester})
            </div>
          </div>
          <div className="grid grid-cols-2 gap-1 p-2 max-h-[70vh] overflow-y-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onTabChange(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-medium transition-all ${
                    isActive
                      ? userRole === 'guru'
                        ? 'bg-emerald-700 text-white font-bold shadow-xs'
                        : 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
