import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Scale, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Printer, 
  Sparkles, 
  MapPin, 
  ChevronRight,
  TrendingUp,
  Download
} from 'lucide-react';
import { ProcurementRecord } from '../types';

interface ProcurementTrackingPageProps {
  setCurrentPage: (page: string) => void;
}

export const ProcurementTrackingPage: React.FC<ProcurementTrackingPageProps> = ({ setCurrentPage }) => {
  const { 
    currentFarmer, 
    procurementRecords, 
    bookings, 
    t, 
    language 
  } = useApp();

  const [selectedRecord, setSelectedRecord] = useState<ProcurementRecord | null>(null);

  // My procurements
  const myProcurements = currentFarmer 
    ? procurementRecords.filter(p => p.farmerId === currentFarmer.id)
    : procurementRecords;

  // Active in-progress booking
  const activeBooking = currentFarmer 
    ? bookings.find(b => b.farmerId === currentFarmer.id && (b.status === 'Procurement in Progress' || b.status === 'Called'))
    : null;

  const stages = [
    { title: 'Slot Confirmed', desc: 'Arrived at Mandi Gate' },
    { title: 'Moisture Testing', desc: 'FAQ Sensor Analysis' },
    { title: 'Weighbridge Net Weight', desc: 'Gross minus Tare' },
    { title: 'Quality Grading', desc: 'Official FAQ Grade-A' },
    { title: 'Procurement Slip Issued', desc: 'Sent to Treasury' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Electronic Mandi Inspection
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              {language === 'te' ? 'ధాన్యం కొనుగోలు & తూకం స్థితి' : 'Procurement & Weighbridge Tracking'}
            </h1>
            <p className="text-xs text-stone-500">
              {language === 'te' 
                ? 'తేమ శాతం, తూకం బరువు, నాణ్యత గ్రేడ్ మరియు ప్రభుత్వ రసీదుల వివరాలు' 
                : 'Monitor real-time laboratory moisture testing, weighbridge slips, and official MSP records'}
            </p>
          </div>

          {currentFarmer && (
            <div className="bg-stone-50 border border-stone-200 px-4 py-3 rounded-2xl text-xs">
              <p className="text-stone-500">{t.farmerName}:</p>
              <p className="font-bold text-stone-900 text-sm">{currentFarmer.name}</p>
              <p className="font-mono text-emerald-800 text-[11px]">{currentFarmer.farmerId}</p>
            </div>
          )}
        </div>
      </div>

      {/* ACTIVE STAGE TRACKER (If active weighing is ongoing) */}
      {activeBooking && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-emerald-500/40 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded">
                Active Booking: {activeBooking.bookingNumber} • Token #{activeBooking.queueNumber}
              </span>
              <h2 className="text-xl font-bold text-stone-900 mt-1">
                {activeBooking.cropType} ({activeBooking.estimatedQuantityQuintals} Quintals)
              </h2>
              <p className="text-xs text-stone-500 flex items-center mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 mr-1" />
                {activeBooking.centreName}
              </p>
              <div className="flex items-center space-x-2 mt-1.5 text-xs">
                <span className="font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  MSP: ₹{activeBooking.mspRatePerQuintal || 2320}/Qtl
                </span>
                <span className="font-mono text-stone-600">
                  Est. DBT Payout: <strong className="text-emerald-900">₹{(activeBooking.estimatedAmount || activeBooking.estimatedQuantityQuintals * (activeBooking.mspRatePerQuintal || 2320)).toLocaleString('en-IN')}</strong>
                </span>
              </div>
            </div>

            <span className="text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 px-3 py-1 rounded-full animate-pulse">
              Current Stage: {activeBooking.status === 'Called' ? 'Gate Entry & Calling' : 'Weighbridge Gross Weighing'}
            </span>
          </div>

          {/* Stepper Progress Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {stages.map((st, idx) => {
              const isCompleted = activeBooking.status === 'Completed' || (activeBooking.status === 'Procurement in Progress' && idx <= 2) || (activeBooking.status === 'Called' && idx === 0);
              const isCurrent = (activeBooking.status === 'Called' && idx === 1) || (activeBooking.status === 'Procurement in Progress' && idx === 3);

              return (
                <div 
                  key={idx}
                  className={`p-3.5 rounded-2xl border-2 transition-all ${
                    isCurrent 
                      ? 'border-amber-500 bg-amber-50/70 shadow-xs' 
                      : isCompleted 
                      ? 'border-emerald-500 bg-emerald-50/50' 
                      : 'border-stone-200 bg-stone-50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted ? 'bg-emerald-600 text-white' : isCurrent ? 'bg-amber-500 text-stone-950 font-black' : 'bg-stone-200 text-stone-600'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-800 uppercase animate-pulse">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs mt-2">{st.title}</h4>
                  <p className="text-[10px] text-stone-500 mt-0.5">{st.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* HISTORICAL PROCUREMENT RECORDS */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-900">
              {language === 'te' ? 'పూర్తయిన కొనుగోలు రికార్డులు' : 'Completed Procurement Slips'}
            </h2>
          </div>
          <span className="text-xs font-bold text-stone-500">
            {myProcurements.length} Records Found
          </span>
        </div>

        {myProcurements.length > 0 ? (
          <div className="space-y-4">
            {myProcurements.map(proc => (
              <div 
                key={proc.id}
                className="bg-stone-50 hover:bg-stone-100/80 p-5 rounded-2xl border border-stone-200 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold bg-white text-stone-900 px-2.5 py-1 rounded border border-stone-200">
                      Slip: {proc.weighingSlipNumber}
                    </span>
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      {proc.qualityGrade}
                    </span>
                    <span className="text-xs text-stone-500">
                      {proc.procurementDate}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-stone-600">
                    Officer: {proc.officerInCharge}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-stone-500 text-[11px] block">{t.selectCrop}</span>
                    <span className="font-bold text-stone-900">{proc.cropType}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px] block">Net Quantity</span>
                    <span className="font-bold text-stone-900">{proc.actualQuantityQuintals} Qtl ({proc.bagsCount} Bags)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px] block">Moisture Test</span>
                    <span className="font-bold text-emerald-800">{proc.moisturePercentage}% (FAQ Pass)</span>
                  </div>
                  <div>
                    <span className="text-stone-500 text-[11px] block">MSP Rate</span>
                    <span className="font-mono font-bold text-stone-900">₹{proc.mspRatePerQuintal}/Qtl</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div>
                    <span className="text-[11px] text-stone-500">Net Payable Government Amount:</span>
                    <span className="text-xl font-black text-emerald-900 font-mono ml-2">
                      ₹{proc.netPayableAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedRecord(proc)}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-xs"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{language === 'te' ? 'పూర్తి రసీదు చూడండి' : 'View Full Slip'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-stone-400 text-xs">
            No procurement records found. Complete a slot booking and mandi inspection first.
          </div>
        )}
      </div>

      {/* Slip Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="text-center pb-3 border-b border-stone-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                Department of Agricultural Marketing & Civil Supplies
              </span>
              <h3 className="text-lg font-black text-stone-900 mt-0.5">
                Official Electronic Weighing Slip
              </h3>
              <p className="text-xs font-mono text-stone-500">
                Number: {selectedRecord.weighingSlipNumber}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Farmer:</span>
                <span className="font-bold text-stone-900">{selectedRecord.farmerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Centre:</span>
                <span className="font-bold text-stone-900 truncate max-w-[240px]">{selectedRecord.centreName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Crop & Variety:</span>
                <span className="font-bold text-stone-900">{selectedRecord.cropType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Actual Weight:</span>
                <span className="font-bold text-stone-900">{selectedRecord.actualQuantityQuintals} Quintals ({selectedRecord.bagsCount} Bags)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Moisture Content:</span>
                <span className="font-bold text-stone-900">{selectedRecord.moisturePercentage}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Quality Grade:</span>
                <span className="font-bold text-emerald-800">{selectedRecord.qualityGrade}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Government MSP:</span>
                <span className="font-bold text-stone-900">₹{selectedRecord.mspRatePerQuintal}/Quintal</span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200 text-sm font-black bg-emerald-50 px-3 rounded-lg text-emerald-950">
                <span>Net Payable Amount:</span>
                <span>₹{selectedRecord.netPayableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 text-[11px] text-stone-500">
                <span>Certified By:</span>
                <span className="font-bold text-stone-800">{selectedRecord.officerInCharge} (Procurement Inspector)</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
              >
                {t.close}
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs"
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
