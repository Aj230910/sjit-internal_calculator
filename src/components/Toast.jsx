import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl rounded-2xl px-5 py-4 border-l-4 border-l-sjit-blue-600 dark:border-l-sjit-gold-400 transition-all duration-300 transform translate-y-0 scale-100 max-w-sm animate-bounce-short">
      {type === 'success' ? (
        <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
      ) : (
        <AlertCircle className="text-rose-500 w-5 h-5 flex-shrink-0" />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
          {message}
        </p>
      </div>
      <button 
        onClick={onClose} 
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
