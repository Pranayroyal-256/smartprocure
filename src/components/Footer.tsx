import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  PhoneCall, 
  Mail, 
  HelpCircle, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Download
} from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { t, language, resetAllDataToDefault } = useApp();

  const handleResetData = () => {
    if (window.confirm('Reset all demo bookings, queue tokens, and payments to default state?')) {
      resetAllDataToDefault();
      alert('Demo data restored to initial state.');
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">SmartProcure</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              {language === 'te' 
                ? 'రైతులకు పారదర్శకమైన ధాన్యం కొనుగోలు, డిజిటల్ స్లాట్ బుకింగ్, లైవ్ క్యూ నిర్వహణ మరియు సత్వర DBT చెల్లింపుల పోర్టల్.'
                : 'Digital Agricultural Procurement & Real-Time Queue Management System to eliminate long waiting lines, ensure transparent weighing, and empower Indian farmers.'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Ministry of Agriculture Standard</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'te' ? 'ముఖ్యమైన లింకులు' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setCurrentPage('prices')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navPrices}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('book-slot')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navBookSlot}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('live-queue')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navLiveQueue}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('procurement')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navProcurement}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('payments')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navPayments}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setCurrentPage('farmer-dashboard')} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {t.navDashboard}
                </button>
              </li>
            </ul>
          </div>

          {/* Procurement Guidelines & FAQ */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'te' ? 'కేంద్ర మార్గదర్శకాలు' : 'Procurement Rules'}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400">•</span>
                <span>Paddy Fair Average Quality (FAQ) max moisture limit: 17%</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400">•</span>
                <span>Carry original Pattadar Passbook & Aadhaar for biometric authentication</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400">•</span>
                <span>Arrive 15 minutes prior to allocated slot to avoid queue re-sequencing</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400">•</span>
                <span>Direct DBT payments credited to PFMS verified accounts within 48 hrs</span>
              </li>
            </ul>
          </div>

          {/* Helplines & Demo controls */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              {language === 'te' ? 'సహాయ కేంద్రం' : 'Farmer Support'}
            </h4>
            <div className="space-y-2.5 text-xs text-stone-300">
              <div className="flex items-center space-x-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll-Free Kisan Call Centre: <strong>1800-425-0000</strong></span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support.procure@agri.gov.in</span>
              </div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Working Hours: Mon-Sat 08:00 AM - 06:00 PM</span>
              </div>

              {/* Download Codebase & Reset demo data button */}
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  id="download-source-zip-btn"
                  href="/smartprocure-codebase.zip"
                  download="smartprocure-codebase.zip"
                  className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-white" />
                  <span>Download Code (.ZIP)</span>
                </a>

                <button
                  id="reset-demo-data-btn"
                  onClick={handleResetData}
                  className="flex items-center space-x-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1.5 rounded-lg border border-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>Reset Data</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} SmartProcure. Government of India / Agricultural Marketing Board. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <span>Designed for rural accessibility & seamless queue efficiency</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
