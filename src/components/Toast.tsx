import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

/**
 * Renders the message set by showToast(). Without this mounted, every
 * showToast() call in the app is silent and users get no feedback at all.
 */
export const Toast: React.FC = () => {
  const { toastMessage } = useApp();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(Boolean(toastMessage));
  }, [toastMessage]);

  if (!toastMessage || !visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] max-w-[calc(100vw-2rem)] sm:max-w-md"
    >
      <div className="flex items-start gap-3 bg-[#0B1D3F] text-white px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-200">
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs flex-1 min-w-0">{toastMessage}</p>
        <button
          onClick={() => setVisible(false)}
          aria-label="Yopish"
          className="text-slate-400 hover:text-white transition-colors shrink-0 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
