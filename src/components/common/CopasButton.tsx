import React, { useState } from 'react';
import { Copy, Check, Download, Printer, Eye, Share2 } from 'lucide-react';
import { copyTextToClipboard, downloadTextFile, printContent } from '../../utils/copas';
import { useToast } from './Toast';
import { Modal } from './Modal';

interface CopasButtonProps {
  textToCopy: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  filename?: string;
  title?: string;
  showPreview?: boolean;
  showDownload?: boolean;
  showPrint?: boolean;
  className?: string;
}

export const CopasButton: React.FC<CopasButtonProps> = ({
  textToCopy,
  label = 'COPAS Teks',
  size = 'md',
  variant = 'primary',
  filename = 'dokumen-lms-min1paser.txt',
  title = 'Pratinjau Teks COPAS',
  showPreview = true,
  showDownload = true,
  showPrint = true,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { showToast } = useToast();

  const handleCopy = async () => {
    const ok = await copyTextToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      showToast('Berhasil disalin! Format bersih siap kirim ke WhatsApp / Word.', 'success');
      setTimeout(() => setCopied(false), 2200);
    } else {
      showToast('Gagal menyalin otomatis. Silakan salin manual dari menu Pratinjau.', 'error');
    }
  };

  const handleDownload = () => {
    downloadTextFile(filename, textToCopy);
    showToast(`File ${filename} berhasil diunduh.`, 'info');
  };

  const handlePrint = () => {
    const formattedHtml = `<pre style="white-space: pre-wrap; font-family: monospace; font-size: 13px;">${textToCopy
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')}</pre>`;
    printContent(title, formattedHtml);
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3 py-1.5 text-xs sm:text-sm gap-2',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2',
  }[size];

  const variantClasses = {
    primary:
      'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold shadow-xs hover:shadow-sm border border-emerald-600',
    secondary:
      'bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-800 font-semibold border border-emerald-200',
    outline:
      'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 font-medium',
  }[variant];

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {/* Primary COPAS Action */}
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 select-none ${sizeClasses} ${variantClasses}`}
        title="Salin teks rapi ke clipboard (siap kirim WhatsApp / Word)"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-emerald-300 shrink-0 stroke-[2.5]" />
            <span className="font-bold">Berhasil Disalin!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4 shrink-0" />
            <span className="truncate">{label}</span>
          </>
        )}
      </button>

      {/* Auxiliary Actions for Teachers */}
      {(showPreview || showDownload || showPrint) && (
        <div className="flex items-center gap-0.5">
          {showPreview && (
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="Pratinjau Teks Bersih WhatsApp / Word"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {showDownload && (
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="Unduh Teks (.txt)"
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {showPrint && (
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              title="Cetak Lembar Pembelajaran (Print / PDF)"
            >
              <Printer className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {isPreviewOpen && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={title}
          subtitle="Teks sudah diformat bersih dengan tanda bintang (*) agar terbaca tebal di WhatsApp & rapi di Word."
          maxWidth="2xl"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-200">
              <span className="text-xs text-slate-600 font-medium">
                💡 Format teks siap dibagikan ke WhatsApp Group Wali Murid / Guru MIN 1 Paser
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Salin Semua
                </button>
                <button
                  onClick={handleDownload}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak
                </button>
              </div>
            </div>

            <textarea
              readOnly
              value={textToCopy}
              rows={14}
              className="w-full font-mono text-xs sm:text-sm p-3.5 bg-slate-900 text-emerald-300 rounded-xl border border-slate-800 focus:outline-hidden selection:bg-emerald-600 selection:text-white leading-relaxed resize-y"
              onClick={(e) => (e.target as HTMLTextAreaElement).select()}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" />
                Salin Sekarang
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
