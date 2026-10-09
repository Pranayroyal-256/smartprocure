import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Building2, 
  Calculator, 
  ArrowRight, 
  ShieldCheck,
  FileCheck2,
  HelpCircle
} from 'lucide-react';
import { PaymentRecord } from '../types';

interface PaymentTrackingPageProps {
  setCurrentPage: (page: string) => void;
}

export const PaymentTrackingPage: React.FC<PaymentTrackingPageProps> = ({ setCurrentPage }) => {
  const { 
    currentFarmer, 
    payments, 
    mspRates, 
    t, 
    language 
  } = useApp();

  // Calculator states
  const [calcCrop, setCalcCrop] = useState<string>(mspRates[0].crop);
  const [calcQuintals, setCalcQuintals] = useState<number>(60);

  // My payments
  const myPayments = currentFarmer 
    ? payments.filter(p => p.farmerId === currentFarmer.id)
    : payments;

  const totalPaid = myPayments
    .filter(p => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalProcessing = myPayments
    .filter(p => p.status === 'Processing' || p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);

  // Calculate estimated MSP amount
  const selectedMsp = mspRates.find(m => m.crop === calcCrop) || mspRates[0];
  const calculatedEstimate = Math.round(calcQuintals * selectedMsp.ratePerQuintal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Direct Benefit Transfer (DBT) • PFMS Gateway
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              {language === 'te' ? 'రైతు బ్యాంక్ ఖాతా చెల్లింపుల ట్రాకర్' : 'Farmer Payment & DBT Disbursement Tracker'}
            </h1>
            <p className="text-xs text-stone-500">
              {language === 'te' 
                ? 'ప్రభుత్వ మద్దతు ధర సొమ్ము మరియు ట్రెజరీ ప్రాసెసింగ్ స్థితి' 
                : 'Transparent Aadhaar-linked direct bank transfer tracking with official UTR numbers'}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2.5 rounded-2xl text-right">
              <span className="text-[10px] uppercase font-bold text-emerald-700">Total DBT Received</span>
              <p className="text-xl font-black text-emerald-950 font-mono">
                ₹{totalPaid.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs text-stone-500 font-semibold uppercase">{t.paid}</span>
          <p className="text-2xl font-black text-emerald-800 font-mono">
            ₹{totalPaid.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Credited to Aadhaar Bank A/C
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs text-stone-500 font-semibold uppercase">{t.processing}</span>
          <p className="text-2xl font-black text-amber-700 font-mono">
            ₹{totalProcessing.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-amber-600 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Treasury / PFMS Verification
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-1">
          <span className="text-xs text-stone-500 font-semibold uppercase">Payment Gateway SLA</span>
          <p className="text-2xl font-black text-stone-900 font-mono">
            48-72 Hours
          </p>
          <p className="text-[11px] text-stone-500">
            Post electronic weighbridge approval
          </p>
        </div>
      </div>

      {/* Interactive MSP Calculator */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200">
        <div className="flex items-center space-x-2 pb-3 border-b border-stone-100 mb-4">
          <Calculator className="w-5 h-5 text-emerald-700" />
          <h2 className="text-lg font-black text-stone-900">
            {language === 'te' ? 'కనీస మద్దతు ధర (MSP) అంచనా కాలిక్యులేటర్' : 'Interactive MSP Earnings Calculator'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              {t.selectCrop}
            </label>
            <select
              value={calcCrop}
              onChange={(e) => setCalcCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600"
            >
              {mspRates.map(m => (
                <option key={m.crop} value={m.crop}>
                  {m.crop} (₹{m.ratePerQuintal}/Qtl)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Expected Grain Quantity (Quintals)
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={calcQuintals}
              onChange={(e) => setCalcQuintals(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 font-mono focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-center">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Estimated Government Payout
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-950 font-mono">
              ₹{calculatedEstimate.toLocaleString('en-IN')}
            </span>
            <p className="text-[10px] text-emerald-700 mt-0.5">
              Based on official MSP @ ₹{selectedMsp.ratePerQuintal}/Qtl
            </p>
          </div>
        </div>
      </div>

      {/* Payment Records Ledger Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-5 h-5 text-emerald-700" />
            <h2 className="text-xl font-bold text-stone-900">
              {language === 'te' ? 'చెల్లింపుల చరిత్ర & లావాదేవీల రికార్డు' : 'DBT Transaction Ledger'}
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-mono">PFMS-Linked</span>
        </div>

        {myPayments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px]">
                  <th className="py-3 px-3">Procurement Ref</th>
                  <th className="py-3 px-3">Crop & Quantity</th>
                  <th className="py-3 px-3">Amount (₹)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Bank A/C</th>
                  <th className="py-3 px-3">Bank Ref / UTR</th>
                  <th className="py-3 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {myPayments.map(pay => (
                  <tr key={pay.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-900">
                      {pay.bookingNumber}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-stone-800">{pay.cropType}</span>
                      <p className="text-[10px] text-stone-500">{pay.quantityQuintals} Quintals</p>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-extrabold text-stone-900 text-sm">
                      ₹{pay.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        pay.status === 'Paid' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pay.status === 'Paid' ? (
                          <><CheckCircle2 className="w-3 h-3 mr-1" /> {t.paid}</>
                        ) : (
                          <><Clock className="w-3 h-3 mr-1" /> {t.processing}</>
                        )}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-stone-600">
                      {pay.bankName} (Ending {pay.bankAccountLast4})
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-emerald-800">
                      {pay.transactionRefNumber || 'Generating...'}
                    </td>
                    <td className="py-3.5 px-3 text-stone-500">
                      {pay.paidDate || pay.initiatedDate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-stone-400 text-xs">
            No payment records available.
          </div>
        )}

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start space-x-2">
          <HelpCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p>
            {t.dbtNotice} For payment status inquiries or incorrect bank account issues, contact your mandal agricultural officer or call 1800-425-0000.
          </p>
        </div>
      </div>
    </div>
  );
};
