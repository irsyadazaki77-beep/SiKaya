import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, Compass, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SEARCH_INDEX, SearchItem } from '../../data/searchIndex';

interface SearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (path: string, state?: Record<string, unknown>) => void;
}

export function SearchPalette({ isOpen, onClose, onNavigateTo }: SearchPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedResult, setSelectedResult] = useState<SearchItem | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setSearchResults([]);
      setSelectedResult(null);
    }
  }, [isOpen]);

  // Handle global ⌘K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open search triggered externally if handled
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Query filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(SEARCH_INDEX.slice(0, 8));
      return;
    }

    const q = searchQuery.toLowerCase();
    const filtered = SEARCH_INDEX.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch = item.desc.toLowerCase().includes(q);
      const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(q));
      return titleMatch || descMatch || tagMatch;
    });

    setSearchResults(filtered);
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-md transition-opacity">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden"
      >
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari materi, rumus, istilah, kuis, atau fitur..."
            className="w-full bg-transparent border-none text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-3 divide-y divide-slate-100 dark:divide-slate-850">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center">
              <Compass className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">Tidak ada hasil ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan kata kunci lain seperti "Saham", "Budgeting", atau "Inflasi".</p>
            </div>
          ) : (
            searchResults.map((item) => (
              <div 
                key={item.id}
                onClick={() => {
                  if (item.details) {
                    setSelectedResult(item);
                  } else {
                    onNavigateTo(item.url, item.state);
                    onClose();
                  }
                }}
                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-850/60 rounded-2xl transition-all cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400">
                      {item.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.desc}</p>
                </div>
                <div className="flex items-center gap-1 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 shrink-0 mt-1">
                  <span className="text-[10px] font-bold hidden sm:inline">Buka</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Result Quick Modal Preview */}
        <AnimatePresence>
          {selectedResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border-t border-teal-100 dark:border-teal-900/30"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-wider">{selectedResult.category}</span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{selectedResult.title}</h4>
                </div>
                <button
                  onClick={() => setSelectedResult(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                {selectedResult.details || selectedResult.desc}
              </p>
              {selectedResult.tip && (
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30 rounded-xl mb-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-tight">
                    <strong className="font-bold">Tips Cerdas: </strong>{selectedResult.tip}
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    onNavigateTo(selectedResult.url, selectedResult.state);
                    onClose();
                  }}
                  className="px-3.5 py-1.5 bg-teal-600 text-white text-xs font-extrabold rounded-xl hover:bg-teal-500 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Buka Modul Pembahasan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
