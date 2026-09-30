import React from 'react';
import {
  School,
  BookOpen,
  FileCheck2,
  HelpCircle,
  CalendarCheck,
  Award,
  MoreHorizontal,
  FolderKanban,
  Bell,
  Settings,
  Users,
} from 'lucide-react';
import { UserRole } from '../../types/lms';

interface BottomNavProps {
  userRole: UserRole;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenMoreMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  userRole,
  activeTab,
  onTabChange,
  onOpenMoreMenu,
}) => {
  // Mobile Quick Tabs
  const guruQuickTabs = [
    { id: 'dashboard', label: 'Beranda', icon: School },
    { id: 'materi', label: 'Materi', icon: BookOpen },
    { id: 'tugas', label: 'Tugas', icon: FileCheck2 },
    { id: 'absensi', label: 'Absensi', icon: CalendarCheck },
    { id: 'nilai', label: 'Nilai', icon: Award },
  ];

  const siswaQuickTabs = [
    { id: 'dashboard', label: 'Beranda', icon: School },
    { id: 'materi', label: 'Materi', icon: BookOpen },
    { id: 'tugas', label: 'Tugas', icon: FileCheck2 },
    { id: 'kuis', label: 'Kuis CBT', icon: HelpCircle },
    { id: 'nilai', label: 'Rapor', icon: Award },
  ];

  const quickTabs = userRole === 'guru' ? guruQuickTabs : siswaQuickTabs;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 py-1.5 safe-area-bottom">
      <div className="flex items-center justify-around">
        {quickTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
                isActive
                  ? userRole === 'guru'
                    ? 'text-emerald-700 font-bold'
                    : 'text-amber-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-lg transition-colors ${
                  isActive
                    ? userRole === 'guru'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                    : 'bg-transparent'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[58px]">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Menu Lainnya Button */}
        <button
          onClick={onOpenMoreMenu}
          className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-slate-500 hover:text-slate-800 transition-all"
        >
          <div className="p-1 rounded-lg bg-slate-100 text-slate-700">
            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Lainnya</span>
        </button>
      </div>
    </nav>
  );
};
