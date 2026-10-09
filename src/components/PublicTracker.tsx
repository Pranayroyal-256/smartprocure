import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  X, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  ArrowRight,
  TrendingUp,
  Scale
} from 'lucide-react';
import { Booking } from '../types';

interface PublicTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBooking?: (booking: Booking) => void;
}

export const PublicTracker: React.FC<PublicTrackerProps> = ({ 
  isOpen, 
  onClose,
  onNavigateToBooking 
}) => {
  const { bookings, centres, t, language } = useApp();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    const cleanQuery = query.trim().toUpperCase();
    const found = bookings.find(b => 
      b.bookingNumber.toUpperCase().includes(cleanQuery) ||
      b.queueNumber.toString() === cleanQuery ||
      b.farmerPhone.includes(cleanQuery) ||
      b.farmerName.toUpperCase().includes(cleanQuery) ||
      (b.farmerDistrict && b.farmerDistrict.toUpperCase().includes(cleanQuery)) ||
      (b.farmerState && b.farmerState.toUpperCase().includes(cleanQuery))
    );

    setResult(found || null);
    setSearched(true);
  };

  const getStatusBadge = (status: Booking['status']) => {
    switch (status) {
      case 'Called':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center"><TrendingUp className="w-3 h-3 mr-1 text-amber-600 animate-pulse" /> {t.statusCalled}</span>;
      case 'Procurement in Progress':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center"><Scale className="w-3 h-3 mr-1 text-blue-600" /> {t.statusInProgress}</span>;
      case 'Completed':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center"><CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> {t.statusCompleted}</span>;
      case 'Waiting':
        return <span className="bg-amber-50 text-amber-800 border border-amber-200 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center"><Clock className="w-3 h-3 mr-1 text-amber-600" /> {t.statusWaiting}</span>;
      case 'Cancelled':
        return <span className="bg-rose-100 text-rose-800 border border-rose-300 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center"><AlertCircle className="w-3 h-3 mr-1 text-rose-600" /> {t.statusCancelled}</span>;
      default:
        return <span className="bg-stone-100 text-stone-800 border border-stone-200 font-bold px-2.5 py-0.5 rounded-full text-xs flex items-center"><Calendar className="w-3 h-3 mr-1 text-stone-600" /> {t.statusBooked}</span>;
    }
  };

  const centre = result ? centres.find(c => c.id === result.centreId) : null;
  const currentActiveToken = centre?.currentActiveToken || 100;
  const aheadCount = result && result.queueNumber > currentActiveToken ? result.queueNumber - currentActiveToken : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        id="public-tracker-modal"
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 border border-stone-200 relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {t.quickTrack}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'te' 
                  ? 'మీ బుకింగ్ నంబర్ లేదా టోకెన్ లేదా మొబైల్ నంబర్ ద్వారా వెతకండి' 
                  : 'Track queue token, counter call, or procurement status'}
              </p>
            </div>
          </div>
          <button
            id="close-public-tracker-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} className="space-y-3 mb-4">
          <div className="relative">
            <input
              id="tracker-query-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'te' ? "ఉదా: SP-2024-94821 లేదా 104 లేదా 9849012345" : "e.g. SP-2024-94821, Token 104, or 9849012345"}
              className="w-full pl-10 pr-24 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-medium placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white text-sm"
              autoFocus
            />
            <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            <button
              id="submit-tracker-search-btn"
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors"
            >
              {t.trackBtn}
            </button>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-stone-500">
            <span>Try sample tokens:</span>
            <button 
              type="button" 
              onClick={() => { setQuery('104'); handleSearch(); }}
              className="font-mono underline text-emerald-700 hover:text-emerald-900"
            >
              104
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => { setQuery('105'); handleSearch(); }}
              className="font-mono underline text-emerald-700 hover:text-emerald-900"
            >
              105
            </button>
            <span>•</span>
            <button 
              type="button" 
              onClick={() => { setQuery('208'); handleSearch(); }}
              className="font-mono underline text-emerald-700 hover:text-emerald-900"
            >
              208
            </button>
          </div>
        </form>

        {/* Result Area */}
        {searched && (
          <div className="mt-4 pt-3 border-t border-stone-100 animate-in fade-in">
            {result ? (
              <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 space-y-4">
                {/* Status bar */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-stone-500 uppercase tracking-wider font-semibold">
                      {t.bookingRef}: <strong className="text-stone-900 font-mono">{result.bookingNumber}</strong>
                    </span>
                    <h4 className="text-base font-extrabold text-stone-900 mt-0.5">
                      {result.farmerName}
                    </h4>
                  </div>
                  {getStatusBadge(result.status)}
                </div>

                {/* Big Token card */}
                <div className="bg-white rounded-xl p-4 border border-stone-200 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="text-xs text-stone-500 font-medium">{t.tokenNumber}</p>
                    <p className="text-3xl font-black text-emerald-800 font-mono">
                      #{result.queueNumber}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-stone-500 font-medium">
                      {result.status === 'Called' ? 'Proceed to Counter' : t.currentlyServing}
                    </p>
                    <p className="text-2xl font-black text-stone-900 font-mono">
                      {result.status === 'Called' 
                        ? `Counter #${result.counterNumber || 2}` 
                        : `#${currentActiveToken}`}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <p className="text-stone-500">{t.selectCrop}</p>
                    <p className="font-bold text-stone-800 truncate">{result.cropType}</p>
                    <p className="text-[11px] text-stone-500">{result.estimatedQuantityQuintals} Quintals</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200">
                    <p className="text-stone-500">{t.step3Slot}</p>
                    <p className="font-bold text-stone-800">{result.slotDate}</p>
                    <p className="text-[11px] text-stone-500 truncate">{result.slotTime}</p>
                  </div>
                  <div className="bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 col-span-2 sm:col-span-1">
                    <p className="text-emerald-800 font-semibold text-[11px]">MSP Price & DBT</p>
                    <p className="font-bold text-stone-900 font-mono">₹{result.mspRatePerQuintal || 2320}/Qtl</p>
                    <p className="text-[11px] font-bold text-emerald-800 font-mono">
                      ₹{(result.estimatedAmount || (result.estimatedQuantityQuintals * (result.mspRatePerQuintal || 2320))).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-950 p-2.5 rounded-lg text-xs flex items-start space-x-2 border border-emerald-200">
                  <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">{result.centreName}</p>
                    <p className="text-emerald-800 text-[11px] mt-0.5">
                      Farmer District: {result.farmerDistrict}{result.farmerState ? `, ${result.farmerState}` : ''}
                    </p>
                    {result.remarks && (
                      <p className="text-emerald-800 text-[11px] mt-0.5">{result.remarks}</p>
                    )}
                  </div>
                </div>

                {/* Queue context banner */}
                {result.status === 'Waiting' && (
                  <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold">{aheadCount} {language === 'te' ? 'రైతులు మీకంటే ముందున్నారు' : 'farmers ahead of you'}</p>
                      <p className="text-[11px] text-amber-700">Estimated wait: ~{aheadCount * 15} minutes</p>
                    </div>
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-stone-50 rounded-xl border border-stone-200">
                <AlertCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-stone-800">
                  {language === 'te' ? 'బుకింగ్ వివరాలు కనుగొనబడలేదు' : 'No Booking Found'}
                </p>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  {language === 'te' 
                    ? 'దయచేసి సరైన బుకింగ్ నంబర్ లేదా టోకెన్ లేదా మొబైల్ నంబర్ నమోదు చేశారో లేదో సరిచూసుకోండి.' 
                    : 'Please check the reference number or mobile number. Ensure there are no typos.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
