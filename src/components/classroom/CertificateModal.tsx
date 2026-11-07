import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Download, Award, CheckCircle2, X, Sparkles, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { exportElementToPdf } from '../../utils/exportUtils';
import { useToast } from '../../context/ToastContext';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  courseTitle: string;
  levelSubtitle: string;
  totalXp: number;
  issueDate?: string;
  certificateId?: string;
}

export function CertificateModal({
  isOpen,
  onClose,
  recipientName,
  courseTitle,
  levelSubtitle,
  totalXp,
  issueDate = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
  certificateId = `SKYA-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}: CertificateModalProps) {
  const { toast } = useToast();
  const certRef = useRef<HTMLDivElement>(null);
  const [customName, setCustomName] = useState(recipientName);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    if (!certRef.current) return;
    setIsDownloading(true);
    try {
      await exportElementToPdf(certRef.current, `Sertifikat-SiKaya-${customName.replace(/\s+/g, '_')}.pdf`);
      toast.success('Sertifikat kelulusan berhasil diunduh dalam format PDF!');
      confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh sertifikat, silakan coba lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Tautan sertifikat berhasil disalin!');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl relative space-y-6 my-auto"
        >
          {/* Header Controls */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Sertifikat Kelulusan Resmi
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Name Customization input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              Nama Tertera pada Sertifikat:
            </label>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Masukkan nama lengkap Anda"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Certificate Viewable & Printable Container */}
          <div 
            ref={certRef}
            className="relative bg-gradient-to-br from-amber-50/50 via-white to-teal-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/20 border-8 border-double border-teal-600/30 dark:border-teal-500/40 rounded-2xl p-6 sm:p-10 text-center shadow-lg overflow-hidden"
          >
            {/* Watermark Crest */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between text-[9px] font-mono uppercase tracking-widest text-slate-400">
                <span>SiKaya Financial Academy</span>
                <span>ID: {certificateId}</span>
              </div>

              <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider font-display">
                  Sertifikat Kompetensi
                </h2>
                <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest mt-0.5">
                  {courseTitle}
                </p>
              </div>

              <div className="py-2">
                <p className="text-[11px] text-slate-400 italic">Diberikan secara terhormat kepada:</p>
                <p className="text-xl sm:text-2xl font-serif font-black italic text-slate-900 dark:text-white uppercase tracking-wider border-b-2 border-dashed border-teal-500/40 max-w-sm mx-auto pb-1 mt-1">
                  {customName || recipientName || 'Pengguna SiKaya'}
                </p>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Telah dinyatakan <strong>LULUS</strong> dalam menyelesaikan seluruh modul kurikulum pembelajaran tingkat <span className="text-teal-600 dark:text-teal-400 font-bold">{levelSubtitle}</span> dengan pencapaian akumulatif <span className="font-mono font-bold text-slate-900 dark:text-white">{totalXp} XP</span> pada platform literasi finansial SiKaya.
              </p>

              {/* Signatures & Verified Badge */}
              <div className="pt-6 grid grid-cols-2 gap-4 border-t border-slate-200/80 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
                <div className="text-left">
                  <p className="font-bold text-slate-800 dark:text-slate-200 italic underline">Robo SiKaya Academic Board</p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Kurikulum Literasi Finansial Terakreditasi</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-800 dark:text-slate-200 font-mono">{issueDate}</p>
                  <p className="text-[9px] uppercase tracking-wider text-slate-400">Tanggal Penerbitan Resmi</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Tersalin' : 'Bagikan Sertifikat'}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Memproses PDF...' : 'Unduh Sertifikat PDF'}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
