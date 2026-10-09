import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, X, Smartphone, BellRing, CheckCircle2 } from 'lucide-react';

export const SmsModal: React.FC = () => {
  const { smsModalItem, setSmsModalItem, language } = useApp();

  useEffect(() => {
    if (smsModalItem) {
      const timer = setTimeout(() => {
        setSmsModalItem(null);
      }, 7500);
      return () => clearTimeout(timer);
    }
  }, [smsModalItem, setSmsModalItem]);

  if (!smsModalItem) return null;

  const isTelugu = language === 'te';
  const title = isTelugu && smsModalItem.titleTelugu ? smsModalItem.titleTelugu : smsModalItem.title;
  const message = isTelugu && smsModalItem.messageTelugu ? smsModalItem.messageTelugu : smsModalItem.message;

  return (
    <aside aria-label="SMS Notification Preview" className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-full px-4 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <div 
        id="simulated-sms-card"
        className="bg-stone-900 text-stone-100 rounded-2xl p-4 shadow-2xl border border-stone-700/80 backdrop-blur-md relative overflow-hidden"
      >
        {/* Top bar simulating SMS Gateway */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 rounded-full bg-emerald-600/30 text-emerald-400 items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-semibold text-emerald-400 tracking-wider uppercase">
                  SMS Gateway: GOV-AGRI-SP
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-stone-400">
                To: {smsModalItem.farmerPhone || '+91 98490 12345'} • {smsModalItem.timestamp}
              </p>
            </div>
          </div>
          <button
            id="close-sms-modal-btn"
            onClick={() => setSmsModalItem(null)}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
            title="Dismiss SMS Preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SMS message body */}
        <div className="bg-stone-800/80 rounded-xl p-3 border border-stone-700/50 mb-2">
          <div className="flex items-start space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5 shrink-0">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-stone-100 mb-1 leading-snug">
                {title}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed font-sans">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
          <span className="flex items-center text-emerald-400">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Delivered via Telecom Gateway
          </span>
          <span className="font-mono text-stone-400">Department of Agriculture</span>
        </div>
      </div>
    </aside>
  );
};
