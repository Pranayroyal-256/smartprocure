import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Clock, 
  TrendingUp, 
  Volume2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  User, 
  Radio,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Booking } from '../types';

interface QueueStatusPageProps {
  setCurrentPage: (page: string) => void;
}

export const QueueStatusPage: React.FC<QueueStatusPageProps> = ({ setCurrentPage }) => {
  const { 
    centres, 
    bookings, 
    currentFarmer, 
    t, 
    language, 
    playTokenCallSound,
    audioAnnounceEnabled
  } = useApp();

  const [selectedCentreId, setSelectedCentreId] = useState<string>(centres[0].id);

  const selectedCentre = centres.find(c => c.id === selectedCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === selectedCentre.id && b.status !== 'Cancelled');

  // Currently called / in progress
  const currentlyCalled = centreBookings.find(b => b.status === 'Called') || centreBookings.find(b => b.status === 'Procurement in Progress');
  const waitingList = centreBookings.filter(b => b.status === 'Waiting').sort((a, b) => a.queueNumber - b.queueNumber);
  const completedList = centreBookings.filter(b => b.status === 'Completed').slice(0, 5);

  const myBookingInThisCentre = currentFarmer ? centreBookings.find(b => b.farmerId === currentFarmer.id) : null;
  const currentToken = selectedCentre.currentActiveToken || 100;
  const farmersAhead = myBookingInThisCentre && myBookingInThisCentre.queueNumber > currentToken 
    ? myBookingInThisCentre.queueNumber - currentToken 
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Centre Selector & Live Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 shadow-md border border-stone-200">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping mr-1.5"></span>
              Live Queue Telemetry
            </span>
            <span className="text-xs text-stone-500 font-mono">
              Auto-Synchronized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            {language === 'te' ? 'డిజిటల్ క్యూ డిస్ప్లే బోర్డు' : 'Digital Mandi Queue Display'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'te' 
              ? 'ప్రస్తుతం పిలుస్తున్న టోకెన్లు మరియు లైవ్ వేచి ఉండే సమయం' 
              : 'Real-time electronic token announcer and waiting status for mandi yards'}
          </p>
        </div>

        {/* Centre Picker */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-xs font-bold text-stone-600">Select Yard:</label>
          <select
            value={selectedCentreId}
            onChange={(e) => setSelectedCentreId(e.target.value)}
            className="px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600"
          >
            {centres.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.district}{c.state ? `, ${c.state}` : ''})
              </option>
            ))}
          </select>

          <button
            onClick={() => playTokenCallSound(selectedCentre.currentActiveToken, selectedCentre.name, 2)}
            className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-stone-300 transition-colors"
            title="Simulate token call chime and announcement"
          >
            <Volume2 className="w-4 h-4 text-emerald-700" />
            <span>Sound Chime</span>
          </button>
        </div>
      </div>

      {/* MY TOKEN STATUS BANNER (If logged-in farmer has booking in this centre) */}
      {myBookingInThisCentre && (
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 border-emerald-400/40">
          <div className="space-y-1">
            <span className="text-xs font-mono uppercase bg-emerald-700 text-emerald-200 px-2 py-0.5 rounded">
              Your Booking: {myBookingInThisCentre.bookingNumber}
            </span>
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <span>{myBookingInThisCentre.farmerName}</span>
              <span className="text-amber-400 font-mono text-2xl font-black">
                (Token #{myBookingInThisCentre.queueNumber})
              </span>
            </h2>
            <p className="text-xs text-emerald-200">
              {myBookingInThisCentre.cropType} • Slot: {myBookingInThisCentre.slotTime} ({myBookingInThisCentre.slotDate})
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20">
            <div className="text-center">
              <p className="text-[10px] uppercase text-emerald-200">{t.farmersAhead}</p>
              <p className="text-2xl font-black font-mono text-amber-300">
                {myBookingInThisCentre.status === 'Called' ? 0 : farmersAhead}
              </p>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-[10px] uppercase text-emerald-200">{t.estWaitTime}</p>
              <p className="text-2xl font-black font-mono text-white">
                ~{myBookingInThisCentre.status === 'Called' ? 0 : farmersAhead * 15}m
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL MANDI BOARD (Large LED Screen Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* BIG NOW SERVING TOKEN DISPLAY */}
        <div className="lg:col-span-2 bg-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border-4 border-stone-800 flex flex-col justify-between relative overflow-hidden">
          {/* LED header ticker */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-mono uppercase tracking-widest text-stone-300 font-bold">
                WEIGHBRIDGE & QUALITY GATE • {selectedCentre.code}
              </span>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-stone-800 px-3 py-1 rounded-full">
              {selectedCentre.operatingHours}
            </span>
          </div>

          {/* Big number calling */}
          <div className="py-8 text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
              {currentlyCalled ? (language === 'te' ? 'ప్రస్తుతం పిలుస్తున్న టోకెన్' : 'NOW CALLING TOKEN') : t.currentlyServing}
            </p>
            
            <div className="inline-block px-8 py-4 bg-stone-950 rounded-3xl border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
              <span className="text-6xl sm:text-8xl md:text-9xl font-black font-mono tracking-tight text-amber-400 drop-shadow-md">
                #{currentlyCalled ? currentlyCalled.queueNumber : currentToken}
              </span>
            </div>

            {currentlyCalled ? (
              <div className="space-y-1.5 animate-pulse">
                <p className="text-xl sm:text-2xl font-bold text-white">
                  Proceed to Counter #{currentlyCalled.counterNumber || 2}
                </p>
                <p className="text-xs text-stone-400">
                  Farmer: <strong className="text-emerald-300">{currentlyCalled.farmerName}</strong> • Crop: {currentlyCalled.cropType} ({currentlyCalled.estimatedQuantityQuintals} Qtl)
                  {currentlyCalled.mspRatePerQuintal && (
                    <span className="text-amber-300 ml-1 font-mono">
                      • ₹{currentlyCalled.mspRatePerQuintal}/Qtl (Est. ₹{(currentlyCalled.estimatedAmount || currentlyCalled.estimatedQuantityQuintals * currentlyCalled.mspRatePerQuintal).toLocaleString('en-IN')})
                    </span>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-xs text-stone-400">
                Awaiting next batch check-in at weighbridge gate.
              </p>
            )}
          </div>

          {/* Bottom LED counters row */}
          <div className="pt-4 border-t border-stone-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-stone-800/80 p-2.5 rounded-xl">
              <span className="text-stone-400 text-[10px] uppercase block">Counter 1</span>
              <span className="text-emerald-400 font-mono font-bold">Active (Paddy)</span>
            </div>
            <div className="bg-stone-800/80 p-2.5 rounded-xl">
              <span className="text-stone-400 text-[10px] uppercase block">Counter 2</span>
              <span className="text-emerald-400 font-mono font-bold">Active (Cotton/Maize)</span>
            </div>
            <div className="bg-stone-800/80 p-2.5 rounded-xl">
              <span className="text-stone-400 text-[10px] uppercase block">Weighbridge</span>
              <span className="text-amber-400 font-mono font-bold">Calibrated (FAQ)</span>
            </div>
          </div>
        </div>

        {/* UPCOMING TOKENS IN LINE (Waiting List) */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  {language === 'te' ? 'తదుపరి వరుసలో ఉన్నవి' : 'Next in Queue'}
                </h3>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                {waitingList.length} Waiting
              </span>
            </div>

            {waitingList.length > 0 ? (
              <div className="space-y-2.5">
                {waitingList.map((item, idx) => (
                  <div 
                    key={item.id}
                    className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-stone-200 text-stone-800 font-black font-mono flex items-center justify-center text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className="font-bold text-stone-900 text-xs">{item.farmerName}</span>
                          <span className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                            #{item.queueNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          {item.cropType} • {item.estimatedQuantityQuintals} Qtl
                          {item.mspRatePerQuintal && (
                            <span className="text-emerald-700 font-mono ml-1 font-semibold">
                              • ₹{item.mspRatePerQuintal}/Qtl
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        ~{(idx + 1) * 15} mins
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-stone-400 text-xs">
                No farmers currently waiting in line at this centre.
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100 bg-emerald-50 rounded-2xl p-3 text-xs text-emerald-950 flex items-center space-x-2">
            <Radio className="w-4 h-4 text-emerald-700 shrink-0 animate-pulse" />
            <span className="text-[11px]">
              Average weighing speed: <strong>12-15 mins per vehicle</strong>. Keep passbook ready.
            </span>
          </div>
        </div>

      </div>

      {/* RECENTLY COMPLETED TOKENS */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-stone-900 text-base">
              {language === 'te' ? 'ఇటీవల పూర్తయిన కొనుగోళ్లు' : 'Recently Completed Weighings'}
            </h3>
          </div>
          <span className="text-xs text-stone-500">Official Electronic Slips Issued</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {completedList.map(comp => (
            <div key={comp.id} className="p-3 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between text-xs">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-mono font-bold text-emerald-800">Token #{comp.queueNumber}</span>
                  <span className="font-bold text-stone-800">• {comp.farmerName}</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  {comp.cropType} ({comp.estimatedQuantityQuintals} Qtl) • {comp.completedTime || 'Completed'}
                </p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                Done
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
