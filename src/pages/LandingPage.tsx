import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  CalendarDays, 
  Clock, 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  Users, 
  Scale, 
  IndianRupee, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  PhoneCall, 
  Layers,
  Sparkles
} from 'lucide-react';
import { INITIAL_MSP_RATES } from '../data/initialData';

interface LandingPageProps {
  setCurrentPage: (page: string) => void;
  onOpenQuickSearch: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  setCurrentPage, 
  onOpenQuickSearch 
}) => {
  const { t, language, centres, bookings, currentFarmer, setCurrentFarmer, farmers, setCurrentRole } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'rates' | 'centres'>('all');

  const totalRegistered = 18450 + farmers.length;
  const todayBookingsCount = bookings.length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle decorative background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 bg-emerald-700/60 border border-emerald-500/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Digital Mandi Queue & Procurement Modernization Platform</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            {t.heroTitle}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-emerald-100/90 max-w-3xl mx-auto leading-relaxed font-sans">
            {t.heroSubtitle}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              id="hero-book-slot-btn"
              onClick={() => {
                if (currentFarmer) {
                  setCurrentPage('book-slot');
                } else {
                  setCurrentPage('farmer-auth');
                }
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <CalendarDays className="w-5 h-5 text-stone-950" />
              <span>{t.bookSlotBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-check-queue-btn"
              onClick={() => setCurrentPage('live-queue')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600/90 text-white font-bold text-sm sm:text-base border border-emerald-500/50 shadow-md backdrop-blur-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Clock className="w-5 h-5 text-emerald-300" />
              <span>{t.checkQueueBtn}</span>
            </button>
          </div>

          {/* Quick Search Card inside Hero */}
          <div className="pt-6 max-w-xl mx-auto">
            <div 
              onClick={onOpenQuickSearch}
              className="bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-md rounded-2xl p-2.5 flex items-center justify-between cursor-pointer transition-colors shadow-xl text-left"
            >
              <div className="flex items-center space-x-3 px-3">
                <Search className="w-5 h-5 text-amber-300" />
                <div>
                  <p className="text-xs text-emerald-200 font-semibold">{t.quickTrack}</p>
                  <p className="text-xs text-white/70">
                    {language === 'te' ? 'బుకింగ్ నంబర్, టోకెన్ లేదా మొబైల్ నంబర్ టైప్ చేయండి...' : 'Enter Booking ID, Token #, or Mobile Number...'}
                  </p>
                </div>
              </div>
              <span className="bg-amber-400 text-stone-950 text-xs font-bold px-3 py-2 rounded-xl shrink-0">
                {t.trackBtn}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metric Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-stone-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                {totalRegistered.toLocaleString('en-IN')}+
              </p>
              <p className="text-xs text-stone-500 font-semibold">{t.statsFarmersServed}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-stone-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                {centres.length} Centres
              </p>
              <p className="text-xs text-stone-500 font-semibold">{t.statsCentresActive}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-stone-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                4.25 Lakh
              </p>
              <p className="text-xs text-stone-500 font-semibold">{t.statsProcuredQuintals}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-stone-200 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <IndianRupee className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-stone-900 font-mono">
                ₹98.6 Cr
              </p>
              <p className="text-xs text-stone-500 font-semibold">{t.statsPaymentsDisbursed}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Testing Demo Persona Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 border border-stone-300 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-emerald-800 text-white text-[11px] font-bold uppercase tracking-wider">
                  Interactive Demo Profiles
                </span>
                <span className="text-xs text-stone-600">Click any profile below to instantly test their live bookings:</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {farmers.map(f => {
                const isActive = currentFarmer?.id === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setCurrentFarmer(f);
                      setCurrentRole('farmer');
                      setCurrentPage('farmer-dashboard');
                    }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                      isActive 
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs' 
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span>{f.name.split(' ')[0]} ({f.district})</span>
                    {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setCurrentRole('admin');
                  setCurrentPage('admin');
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live MSP Rates Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-stone-100 pb-4">
            <div>
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-emerald-700" />
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  {t.mspTitle}
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                {t.mspSubtitle}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                id="landing-view-all-prices-btn"
                onClick={() => setCurrentPage('prices')}
                className="text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center space-x-1"
              >
                <span>{language === 'te' ? 'అన్ని పంటల ధరలు చూడండి' : 'Check All Crop & Mandi Prices'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <span className="hidden sm:inline-block text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-3 py-1.5 rounded-xl">
                Season 2024-25
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {INITIAL_MSP_RATES.map((msp, idx) => (
              <div 
                key={idx}
                className="bg-stone-50 hover:bg-emerald-50/50 rounded-2xl p-4 border border-stone-200 hover:border-emerald-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {msp.season}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {t.faqMoisture}: {msp.faqMoistureLimit}%
                    </span>
                  </div>
                  <h3 className="font-bold text-stone-900 mt-2 text-base">
                    {language === 'te' ? msp.cropTelugu : msp.crop}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">
                    {language === 'te' ? msp.crop : msp.cropTelugu}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-200/80 flex items-baseline justify-between">
                  <span className="text-xs text-stone-500">{t.perQuintal}</span>
                  <span className="text-2xl font-black text-emerald-900 font-mono">
                    ₹{msp.ratePerQuintal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Centres Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6 border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {language === 'te' ? 'క్రియాశీల కొనుగోలు కేంద్రాలు & లైవ్ క్యూ సమాచారం' : 'Active Procurement Centres & Live Queue Counters'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'te' 
                  ? 'ప్రస్తుతం పని చేస్తున్న కేంద్రాలు మరియు ప్రతి కేంద్రం వద్ద పిలుస్తున్న టోకెన్ సంఖ్య' 
                  : 'Real-time monitoring of active tokens being served across all district mandi yards'}
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('live-queue')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
            >
              <span>{language === 'te' ? 'పూర్తి క్యూ బోర్డు' : 'Full Digital Queue Board'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {centres.map(c => {
              const centreBookings = bookings.filter(b => b.centreId === c.id);
              const waitingCount = centreBookings.filter(b => b.status === 'Waiting').length;
              return (
                <div 
                  key={c.id}
                  className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                        {c.code}
                      </span>
                      <span className="flex items-center text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse mr-1.5"></span>
                        {c.status}
                      </span>
                    </div>

                    <h3 className="font-bold text-stone-900 text-base leading-snug">
                      {language === 'te' ? c.teluguName : c.name}
                    </h3>
                    <p className="text-xs text-stone-500 flex items-center">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 mr-1 shrink-0" />
                      {c.district}{c.state ? `, ${c.state}` : ''} • {c.mandal}
                    </p>
                  </div>

                  {/* Centre live metrics */}
                  <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-stone-500 uppercase">{t.currentlyServing}</p>
                      <p className="text-xl font-black text-emerald-800 font-mono">
                        #{c.currentActiveToken}
                      </p>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-stone-500 uppercase">{t.activeInQueue}</p>
                      <p className="text-xl font-black text-amber-700 font-mono">
                        {waitingCount}
                      </p>
                    </div>

                    <div className="bg-white p-2 rounded-xl border border-stone-200">
                      <p className="text-[10px] text-stone-500 uppercase">{t.dailyCapacity}</p>
                      <p className="text-sm font-bold text-stone-800 mt-1">
                        {c.dailyCapacityQuintals} Qtl
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-1">
                    <span className="text-stone-500 text-[11px]">
                      Hours: {c.operatingHours} • {c.countersCount} Counters
                    </span>
                    <button
                      onClick={() => {
                        if (currentFarmer) {
                          setCurrentPage('book-slot');
                        } else {
                          setCurrentPage('farmer-auth');
                        }
                      }}
                      className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center space-x-1 text-xs"
                    >
                      <span>{t.bookSlotBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works 4-step process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-extrabold text-stone-900">
            {language === 'te' ? 'ధాన్యం విక్రయ సరళ ప్రక్రియ - 4 సులభ దశలు' : 'How SmartProcure Eliminates Mandi Congestion'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'te' 
              ? 'స్లాట్ బుకింగ్ నుండి మీ బ్యాంక్ ఖాతాలో నగదు జమ అయ్యే వరకు అంతా పారదర్శకం' 
              : 'End-to-end digital lifecycle: from smartphone slot booking to automated DBT treasury transfer'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-lg mb-3">
              1
            </div>
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'te' ? 'ఆన్‌లైన్ స్లాట్ బుకింగ్' : '1. Digital Slot Booking'}
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {language === 'te' 
                ? 'మీ పంట, పరిమాణం, సమీప కేంద్రం మరియు అనువైన తేదీని ఎంచుకోండి. ప్రత్యేక క్యూ టోకెన్ పొందండి.' 
                : 'Choose your crop, estimated quintals, centre, and convenient time slot. Receive unique Token #.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-lg mb-3">
              2
            </div>
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'te' ? 'లైవ్ క్యూ & ఎస్ఎంఎస్ అలర్ట్' : '2. Real-Time Queue & SMS'}
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {language === 'te' 
                ? 'కేంద్రంలో వేచి ఉండకుండా మీ మొబైల్‌లో లైవ్ క్యూ చూడండి. మీ టోకెన్ దగ్గరకు రాగానే SMS వస్తుంది.' 
                : 'Monitor current serving token from home. Receive instant SMS alerts when your vehicle is called.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-black flex items-center justify-center text-lg mb-3">
              3
            </div>
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'te' ? 'డిజిటల్ తూకం & నాణ్యత రసీదు' : '3. Precision Weighing & Slip'}
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {language === 'te' 
                ? 'ఎలక్ట్రానిక్ వేబ్రిడ్జ్ ద్వారా నికర తూకం. అధికారిక డిజిటల్ రసీదు తక్షణమే మొబైల్ లో జారీ చేయబడుతుంది.' 
                : 'Automated weighbridge gross-tare measurement, moisture check, and tamper-proof procurement slip.'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-black flex items-center justify-center text-lg mb-3">
              4
            </div>
            <h3 className="font-bold text-stone-900 text-sm">
              {language === 'te' ? 'నేరుగా DBT బ్యాంక్ బదిలీ' : '4. Direct Bank Transfer (DBT)'}
            </h3>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              {language === 'te' 
                ? 'మధ్యవర్తులు లేకుండా ప్రభుత్వ మద్దతు ధర సొమ్ము 48 గంటల్లో మీ ఆధార్ లింక్డ్ బ్యాంక్ ఖాతాలో జమ.' 
                : 'Guaranteed MSP rate transferred directly into your Aadhaar-linked bank account within 48 hours.'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
