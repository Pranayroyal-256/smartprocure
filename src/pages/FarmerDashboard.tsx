import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarDays, 
  Clock, 
  Scale, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  MapPin, 
  ArrowRight, 
  Bell, 
  FileText, 
  Printer, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Booking, ProcurementRecord } from '../types';
import { getTodayString } from '../data/initialData';

interface FarmerDashboardProps {
  setCurrentPage: (page: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ setCurrentPage }) => {
  const { 
    currentFarmer, 
    bookings, 
    procurementRecords, 
    payments, 
    notifications, 
    centres, 
    t, 
    language 
  } = useApp();

  const [selectedReceipt, setSelectedReceipt] = useState<ProcurementRecord | null>(null);

  if (!currentFarmer) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          {language === 'te' ? 'దయచేసి లాగిన్ అవ్వండి' : 'Farmer Login Required'}
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          {language === 'te' 
            ? 'మీ బుకింగ్‌లు, లైవ్ క్యూ మరియు చెల్లింపుల వివరాలను చూడటానికి లాగిన్ చేయండి.' 
            : 'Please log in with your mobile number to view your active bookings and queue tokens.'}
        </p>
        <button
          onClick={() => setCurrentPage('farmer-auth')}
          className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm"
        >
          {t.login}
        </button>
      </div>
    );
  }

  const today = getTodayString();

  // Find active booking for current farmer (today or future)
  const myBookings = bookings.filter(b => b.farmerId === currentFarmer.id);
  const activeBooking = myBookings.find(b => b.status !== 'Completed' && b.status !== 'Cancelled');
  const pastBookings = myBookings.filter(b => b.status === 'Completed');

  // Find centre of active booking
  const activeCentre = activeBooking ? centres.find(c => c.id === activeBooking.centreId) : null;
  const currentServingToken = activeCentre?.currentActiveToken || 100;
  const farmersAhead = activeBooking && activeBooking.queueNumber > currentServingToken 
    ? activeBooking.queueNumber - currentServingToken 
    : 0;
  const estWaitMins = activeBooking?.status === 'Called' ? 0 : farmersAhead * 15;

  // My Procurement Records & Payments
  const myProcurements = procurementRecords.filter(p => p.farmerId === currentFarmer.id);
  const myPayments = payments.filter(p => p.farmerId === currentFarmer.id);
  const myNotifications = notifications.filter(n => n.farmerId === currentFarmer.id || !n.farmerId).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Farmer Profile Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase tracking-wider font-mono bg-emerald-800/80 text-emerald-200 px-2.5 py-0.5 rounded-md border border-emerald-600/50">
              Passbook ID: {currentFarmer.farmerId}
            </span>
            <span className="text-xs bg-amber-400 text-stone-950 font-bold px-2 py-0.5 rounded-md">
              Aadhaar-Linked
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {currentFarmer.name}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 flex items-center">
            <MapPin className="w-4 h-4 mr-1 text-emerald-300" />
            {currentFarmer.village}, {currentFarmer.mandal} Mandal, {currentFarmer.district} Dist, {currentFarmer.state}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dashboard-book-slot-btn"
            onClick={() => setCurrentPage('book-slot')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>{t.bookSlotBtn}</span>
          </button>

          <button
            onClick={() => setCurrentPage('live-queue')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs sm:text-sm border border-emerald-500/60 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Clock className="w-4 h-4" />
            <span>{t.checkQueueBtn}</span>
          </button>
        </div>
      </div>

      {/* ACTIVE BOOKING CARD (The Crown Jewel of the dashboard) */}
      {activeBooking ? (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-500/40 relative overflow-hidden">
          {/* Active pulse tag */}
          <div className="absolute top-0 right-0 bg-emerald-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping"></span>
            <span>Active Live Booking</span>
          </div>

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-stone-500">
                Booking ID: <strong className="text-stone-900">{activeBooking.bookingNumber}</strong>
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {activeBooking.cropType} ({activeBooking.estimatedQuantityQuintals} Quintals)
              </h2>
              <p className="text-xs text-stone-500 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-emerald-700" />
                {activeBooking.centreName}
              </p>
            </div>

            {/* Status Pill */}
            <div className="flex items-center space-x-3">
              {activeBooking.status === 'Called' ? (
                <div className="bg-amber-100 border-2 border-amber-400 text-amber-950 px-4 py-2 rounded-2xl animate-pulse">
                  <p className="text-[10px] uppercase font-bold text-amber-800">Immediate Action Required</p>
                  <p className="text-sm font-black flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1 text-amber-700" />
                    Called to Counter #{activeBooking.counterNumber || 2}
                  </p>
                </div>
              ) : activeBooking.status === 'Procurement in Progress' ? (
                <div className="bg-blue-100 border-2 border-blue-400 text-blue-950 px-4 py-2 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-blue-800">Weighing Station</p>
                  <p className="text-sm font-black flex items-center">
                    <Scale className="w-4 h-4 mr-1 text-blue-700" />
                    Weighbridge Inspection In Progress
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-2 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-emerald-700">Status</p>
                  <p className="text-sm font-black flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-emerald-600" />
                    {activeBooking.status}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Queue Telemetry Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
              <p className="text-xs text-stone-500 font-semibold">{t.tokenNumber}</p>
              <p className="text-3xl sm:text-4xl font-black text-emerald-800 font-mono mt-1">
                #{activeBooking.queueNumber}
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
              <p className="text-xs text-stone-500 font-semibold">{t.currentlyServing}</p>
              <p className="text-3xl sm:text-4xl font-black text-stone-900 font-mono mt-1">
                #{currentServingToken}
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
              <p className="text-xs text-stone-500 font-semibold">{t.farmersAhead}</p>
              <p className="text-3xl sm:text-4xl font-black text-amber-700 font-mono mt-1">
                {farmersAhead}
              </p>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-center">
              <p className="text-xs text-stone-500 font-semibold">{t.estWaitTime}</p>
              <p className="text-3xl sm:text-4xl font-black text-stone-800 font-mono mt-1">
                ~{estWaitMins}m
              </p>
            </div>
          </div>

          {/* Government MSP Price & Guaranteed Payout strip */}
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                Official MSP Guarantee
              </span>
              <span className="text-stone-700">
                Rate: <strong className="font-mono text-emerald-900">₹{activeBooking.mspRatePerQuintal || 2320}/Qtl</strong> • Total Quantity: <strong>{activeBooking.estimatedQuantityQuintals} Qtl</strong>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-stone-500">Assured DBT Amount:</span>
              <span className="text-sm font-black font-mono text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                ₹{(activeBooking.estimatedAmount || activeBooking.estimatedQuantityQuintals * (activeBooking.mspRatePerQuintal || 2320)).toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => setCurrentPage('prices')}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline ml-1 cursor-pointer"
              >
                Access All Prices →
              </button>
            </div>
          </div>

          {/* Reminder Alert notice */}
          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-emerald-900">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>
                <strong>Slot Scheduled:</strong> {activeBooking.slotDate} ({activeBooking.slotTime}). {activeBooking.remarks || t.queueStatusNote}
              </span>
            </div>
            <button
              onClick={() => setCurrentPage('live-queue')}
              className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shrink-0 flex items-center space-x-1"
            >
              <span>{language === 'te' ? 'లైవ్ క్యూ తెరవండి' : 'Open Live Queue Display'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      ) : (
        <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CalendarDays className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              {language === 'te' ? 'నేడు మీకు క్రియాశీల బుకింగ్ లేదు' : 'No Active Booking Today'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'te' 
                ? 'మీరు మీ ధాన్యం విక్రయించడానికి సమీప కొనుగోలు కేంద్రంలో కొత్త స్లాట్ బుక్ చేసుకోవచ్చు.' 
                : 'Book a convenient procurement time slot to eliminate waiting time at the mandi yard.'}
            </p>
            <button
              onClick={() => setCurrentPage('book-slot')}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md"
            >
              {t.bookSlotBtn}
            </button>
          </div>
        </section>
      )}

      {/* Grid of Key Sections: History, Payments, Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Procurements & Weighing Slips */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-md border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center space-x-2">
              <Scale className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-stone-900 text-base">
                {language === 'te' ? 'కొనుగోలు చరిత్ర & తూకం రసీదులు' : 'Procurement History & Weighing Slips'}
              </h3>
            </div>
            <button
              onClick={() => setCurrentPage('procurement')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1"
            >
              <span>{t.viewDetails}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {myProcurements.length > 0 ? (
            <div className="space-y-3">
              {myProcurements.map(proc => (
                <div 
                  key={proc.id}
                  className="bg-stone-50 hover:bg-emerald-50/40 p-4 rounded-2xl border border-stone-200 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold bg-white text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                        {proc.weighingSlipNumber}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {proc.qualityGrade}
                      </span>
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">
                      {proc.cropType} • {proc.actualQuantityQuintals} Qtl ({proc.bagsCount} Bags)
                    </h4>
                    <p className="text-xs text-stone-500">
                      Procured on {proc.procurementDate} • Moisture: {proc.moisturePercentage}% • Rate: ₹{proc.mspRatePerQuintal}/Qtl
                    </p>
                  </div>

                  <div className="text-right flex items-center sm:flex-col justify-between w-full sm:w-auto">
                    <div>
                      <p className="text-[10px] text-stone-500 uppercase">{t.netPayable}</p>
                      <p className="text-lg font-black text-emerald-900 font-mono">
                        ₹{proc.netPayableAmount.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedReceipt(proc)}
                      className="mt-1 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 underline"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{language === 'te' ? 'రసీదు చూడండి' : 'View Slip'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-stone-400 text-xs">
              No completed procurement records yet.
            </div>
          )}
        </div>

        {/* DBT Payment Status & Notifications */}
        <div className="space-y-6">
          {/* Payment Card */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-stone-900 text-base">
                  {t.navPayments}
                </h3>
              </div>
              <button
                onClick={() => setCurrentPage('payments')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                {t.viewDetails}
              </button>
            </div>

            {myPayments.length > 0 ? (
              <div className="space-y-3">
                {myPayments.map(pay => (
                  <div key={pay.id} className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">{pay.cropType}</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        pay.status === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pay.status === 'Paid' ? t.paid : t.processing}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between">
                      <span className="text-lg font-black text-stone-900 font-mono">
                        ₹{pay.amount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-stone-500 font-mono">
                        A/C: *{pay.bankAccountLast4}
                      </span>
                    </div>

                    {pay.transactionRefNumber && (
                      <p className="text-[10px] text-stone-500 font-mono truncate">
                        UTR: {pay.transactionRefNumber}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-stone-400 text-xs">
                No payment transactions yet.
              </div>
            )}
          </div>

          {/* Quick Notifications Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  {t.navNotifications}
                </h3>
              </div>
              <button
                onClick={() => setCurrentPage('notifications')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
              >
                {t.all}
              </button>
            </div>

            <div className="space-y-2.5">
              {myNotifications.map(n => (
                <div key={n.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">
                      {language === 'te' && n.titleTelugu ? n.titleTelugu : n.title}
                    </span>
                    <span className="text-[10px] text-stone-400">{n.timestamp}</span>
                  </div>
                  <p className="text-stone-600 text-[11px] line-clamp-2">
                    {language === 'te' && n.messageTelugu ? n.messageTelugu : n.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="text-center pb-4 border-b border-stone-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                Government of Telangana & AP • Agricultural Marketing Dept
              </span>
              <h3 className="text-lg font-black text-stone-900 mt-1">
                Official Grain Procurement & Weighbridge Slip
              </h3>
              <p className="text-xs font-mono text-stone-500 mt-0.5">
                Slip Ref: {selectedReceipt.weighingSlipNumber}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Farmer Name:</span>
                <span className="font-bold text-stone-900">{selectedReceipt.farmerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Procurement Centre:</span>
                <span className="font-bold text-stone-900 truncate max-w-[240px]">{selectedReceipt.centreName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Crop Type:</span>
                <span className="font-bold text-stone-900">{selectedReceipt.cropType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Net Quantity:</span>
                <span className="font-bold text-stone-900">{selectedReceipt.actualQuantityQuintals} Qtl ({selectedReceipt.bagsCount} Bags)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Quality / Moisture:</span>
                <span className="font-bold text-stone-900">{selectedReceipt.qualityGrade} • {selectedReceipt.moisturePercentage}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">MSP Rate:</span>
                <span className="font-bold text-stone-900">₹{selectedReceipt.mspRatePerQuintal}/Quintal</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-200 text-sm font-black bg-emerald-50 px-2 rounded-lg text-emerald-950">
                <span>Net Payable Amount:</span>
                <span>₹{selectedReceipt.netPayableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Officer In-Charge:</span>
                <span className="font-mono text-stone-800">{selectedReceipt.officerInCharge}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{t.downloadSlip}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
