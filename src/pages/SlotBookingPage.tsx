import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CalendarDays, 
  MapPin, 
  Scale, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Printer, 
  Sparkles,
  QrCode,
  Building2,
  Plus,
  Lock,
  IndianRupee,
  Tag
} from 'lucide-react';
import { Booking } from '../types';
import { STANDARD_TIME_SLOTS, getTodayString } from '../data/initialData';
import { ALL_STATES, getDistrictsForState, getStateCode } from '../data/statesAndDistricts';
import { OtpVerificationModal } from '../components/OtpVerificationModal';

interface SlotBookingPageProps {
  setCurrentPage: (page: string) => void;
}

export const SlotBookingPage: React.FC<SlotBookingPageProps> = ({ setCurrentPage }) => {
  const { 
    currentFarmer, 
    centres, 
    bookings, 
    bookSlot, 
    mspRates, 
    addCentre,
    t, 
    language 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form selections
  const [selectedCrop, setSelectedCrop] = useState<string>('Paddy (Grade A / Fine)');
  const [quantityQuintals, setQuantityQuintals] = useState<number>(50);
  const [selectedState, setSelectedState] = useState<string>(currentFarmer?.state || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>(currentFarmer?.district || 'All');
  const [selectedCentreId, setSelectedCentreId] = useState<string>(centres[0].id);
  const [isBookingOtpOpen, setIsBookingOtpOpen] = useState(false);

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    if (newState === 'All') {
      setSelectedDistrict('All');
    } else {
      const dists = getDistrictsForState(newState);
      if (!dists.includes(selectedDistrict)) {
        setSelectedDistrict('All');
      }
    }
  };

  const availableDistricts = selectedState === 'All' ? [] : getDistrictsForState(selectedState);
  
  // Date options (today, tomorrow, +2 days, +3 days, etc.)
  const generateDates = () => {
    const dates: { dateStr: string; label: string }[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const label = `${dayName} (${day}/${month})`;
      dates.push({ dateStr, label });
    }
    return dates;
  };

  const dateOptions = generateDates();
  const [selectedDate, setSelectedDate] = useState<string>(dateOptions[0].dateStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(STANDARD_TIME_SLOTS[0]);

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!currentFarmer) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          {language === 'te' ? 'రైతు లాగిన్ అవసరం' : 'Farmer Registration Required'}
        </h2>
        <p className="text-xs text-stone-500 mb-6">
          {language === 'te' 
            ? 'స్లాట్ బుక్ చేసుకోవడానికి దయచేసి మీ మొబైల్ నంబర్ లేదా పట్టాదారు పాస్‌బుక్ వివరాలతో లాగిన్ అవ్వండి.' 
            : 'Please log in or register your farmer profile to book a procurement slot and receive a token number.'}
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

  // Filter centres by state and district
  const filteredCentres = centres.filter(c => {
    const matchesState = selectedState === 'All' || !c.state || c.state === selectedState;
    const matchesDistrict = selectedDistrict === 'All' || c.district === selectedDistrict;
    return matchesState && matchesDistrict;
  });
  const selectedCentre = filteredCentres.find(c => c.id === selectedCentreId) || filteredCentres[0] || centres[0];

  // Helper to calculate slot occupancy
  const getSlotOccupancy = (slotTime: string) => {
    const bookedForSlot = bookings.filter(b => 
      b.centreId === selectedCentre.id && 
      b.slotDate === selectedDate && 
      b.slotTime === slotTime &&
      b.status !== 'Cancelled'
    ).length;
    const maxCapacity = selectedCentre.maxFarmersPerSlot || 15;
    return {
      booked: bookedForSlot,
      max: maxCapacity,
      isFull: bookedForSlot >= maxCapacity
    };
  };

  const handleConfirmBooking = () => {
    setErrorMessage('');
    const res = bookSlot({
      farmerId: currentFarmer.id,
      centreId: selectedCentre.id,
      slotDate: selectedDate,
      slotTime: selectedTimeSlot,
      cropType: selectedCrop,
      estimatedQuantityQuintals: Number(quantityQuintals)
    });

    if (res.success && res.booking) {
      setConfirmedBooking(res.booking);
      setStep(4);
    } else {
      setErrorMessage(res.message);
    }
  };

  const bagsCount = Math.round((Number(quantityQuintals) * 100) / 50);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Step Stepper Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 text-center">
          {language === 'te' ? 'ధాన్యం కొనుగోలు స్లాట్ బుకింగ్' : 'Book Procurement Time Slot'}
        </h1>
        <p className="text-xs text-stone-500 text-center mt-1">
          {language === 'te' 
            ? 'మీకు నచ్చిన సమయాన్ని ఎంచుకోండి మరియు క్యూ టోకెన్ పొందండి' 
            : 'Select crop, choose nearby centre, pick time slot, and generate unique digital token'}
        </p>

        {/* Stepper bubbles */}
        <div className="flex items-center justify-between max-w-xl mx-auto mt-6 px-4">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-colors ${
                step === s 
                  ? 'bg-emerald-700 text-white shadow-md' 
                  : step > s 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-stone-200 text-stone-500'
              }`}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              <span className="hidden sm:inline text-xs font-bold text-stone-600">
                {s === 1 ? 'Crop' : s === 2 ? 'Centre' : s === 3 ? 'Date & Slot' : 'Confirm'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* STEP 1: Crop Selection */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-black text-stone-900 mb-1">{t.step1Crop}</h2>
            <p className="text-xs text-stone-500">Select the grain you are bringing to the procurement yard.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mspRates.map(msp => {
              const isSelected = selectedCrop === msp.crop;
              return (
                <div
                  key={msp.crop}
                  onClick={() => setSelectedCrop(msp.crop)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      ₹{msp.ratePerQuintal}/Qtl
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-700" />}
                  </div>
                  <h3 className="font-extrabold text-stone-900 mt-2 text-sm">
                    {language === 'te' ? msp.cropTelugu : msp.crop}
                  </h3>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Season: {msp.season} • Max FAQ Moisture: {msp.faqMoistureLimit}%
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t.estQuantity}
              </label>
              <span className="text-xs font-bold text-emerald-800 font-mono">
                {bagsCount} {t.bagsEstimated}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <input
                id="quantity-quintals-input"
                type="number"
                min={5}
                max={500}
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                className="w-36 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 font-mono font-bold text-sm focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-xs font-semibold text-stone-600">Quintals (100 kg each)</span>
            </div>
          </div>

          {/* Guaranteed Price & Estimated Payout Access */}
          {(() => {
            const currentMsp = mspRates.find(m => m.crop === selectedCrop) || mspRates[0];
            const estTotal = (quantityQuintals || 0) * currentMsp.ratePerQuintal;
            return (
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Government Guaranteed MSP Payout</span>
                  </div>
                  <p className="text-xs text-stone-700">
                    <strong>{quantityQuintals} Quintals</strong> @ ₹{currentMsp.ratePerQuintal}/Qtl
                    {currentMsp.faqMoistureLimit && (
                      <span className="text-stone-500 ml-1.5">(FAQ Moisture: max {currentMsp.faqMoistureLimit}%)</span>
                    )}
                  </p>
                  {currentMsp.stateBonus && (
                    <p className="text-[11px] text-emerald-700 font-semibold">
                      ⭐ {currentMsp.stateBonus}
                    </p>
                  )}
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-stone-500 block">Direct DBT Payout:</span>
                  <span className="text-2xl font-black font-mono text-emerald-900">
                    ₹{estTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setCurrentPage('prices')}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer inline-flex items-center space-x-1"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Compare with Open Mandi Rates</span>
            </button>

            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <span>{language === 'te' ? 'కేంద్రం ఎంచుకోండి' : 'Next: Select Centre'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Centre Selection */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200 space-y-6 animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-stone-900">{t.step2Centre}</h2>
              <p className="text-xs text-stone-500">Select the official government procurement centre in your state and district.</p>
            </div>

            {/* State and District filter */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-stone-500 font-medium">{t.state}:</span>
                <select
                  value={selectedState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="All">{t.allStates}</option>
                  {ALL_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-xs text-stone-500 font-medium">{t.district}:</span>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="px-2.5 py-1.5 bg-stone-50 border border-stone-300 rounded-lg text-xs font-bold text-stone-800 focus:ring-2 focus:ring-emerald-600"
                  disabled={selectedState === 'All'}
                >
                  <option value="All">{selectedState === 'All' ? 'Select state first' : t.allDistricts}</option>
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {filteredCentres.length === 0 ? (
              <div className="p-6 bg-stone-50 border border-dashed border-stone-300 rounded-2xl text-center space-y-3">
                <Building2 className="w-8 h-8 text-stone-400 mx-auto" />
                <h4 className="text-sm font-bold text-stone-800">
                  {selectedDistrict !== 'All' 
                    ? `No procurement centre listed yet in ${selectedDistrict}, ${selectedState}`
                    : `No procurement centres listed yet for ${selectedState}`}
                </h4>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  You can initialize an official Government APMC / PACS Purchase Yard for {selectedDistrict !== 'All' ? selectedDistrict : selectedState} to book your slot right now.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const stateToUse = selectedState !== 'All' ? selectedState : (currentFarmer?.state || 'Telangana');
                    const distToUse = selectedDistrict !== 'All' ? selectedDistrict : (currentFarmer?.district || 'District HQ');
                    const cleanDist = distToUse.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'DST';
                    const code = `${getStateCode(stateToUse)}-${cleanDist}-PPC-01`;
                    addCentre({
                      name: `${distToUse} Central APMC Market Yard & PPC`,
                      teluguName: `${distToUse} మార్కెట్ యార్డ్ కొనుగోలు కేంద్రం`,
                      code,
                      state: stateToUse,
                      district: distToUse,
                      mandal: `${distToUse} Headquarters`,
                      address: `Main APMC Mandi Campus, Collectorate Road, ${distToUse}, ${stateToUse}`,
                      contactPerson: 'District Procurement Officer & Mandi Secretary',
                      contactPhone: '+91 94400 11223',
                      activeCrops: ['Paddy (Grade A / Fine)', 'Paddy (Common)', 'Cotton (Long Staple)', 'Maize (Corn)', 'Red Gram (Tur / Arhar)', 'Bengal Gram (Chana)'],
                      dailyCapacityQuintals: 3500,
                      totalSlotsPerDay: 4,
                      maxFarmersPerSlot: 20,
                      status: 'Active',
                      operatingHours: '08:30 AM - 05:30 PM',
                      countersCount: 3,
                    });
                  }}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Initialize {selectedDistrict !== 'All' ? selectedDistrict : selectedState} APMC Yard</span>
                </button>
              </div>
            ) : (
              filteredCentres.map(c => {
                const isSelected = selectedCentreId === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCentreId(c.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/50 shadow-xs' 
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold bg-stone-200 text-stone-800 px-2 py-0.5 rounded">
                            {c.code}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {c.status}
                          </span>
                          {c.state && (
                            <span className="text-xs font-medium text-stone-600 bg-stone-200/70 px-2 py-0.5 rounded-full">
                              {c.district}, {c.state}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-stone-900 text-sm mt-1.5">
                          {language === 'te' ? c.teluguName : c.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1 flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-stone-400 shrink-0" />
                          {c.address}
                        </p>
                      </div>

                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />}
                    </div>

                    <div className="mt-3 pt-2 border-t border-stone-200/80 flex flex-wrap items-center justify-between text-[11px] text-stone-500 gap-2">
                      <span>Officer: <strong>{c.contactPerson}</strong></span>
                      <span>Daily Capacity: <strong>{c.dailyCapacityQuintals} Qtl</strong></span>
                      <span>Hours: <strong>{c.operatingHours}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>

            <button
              onClick={() => setStep(3)}
              disabled={filteredCentres.length === 0}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-2"
            >
              <span>{language === 'te' ? 'తేదీ & స్లాట్ ఎంచుకోండి' : 'Next: Date & Time'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Date & Slot Selection */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200 space-y-6 animate-in fade-in">
          <div>
            <h2 className="text-lg font-black text-stone-900">{t.step3Slot}</h2>
            <p className="text-xs text-stone-500">Pick a suitable date and available queue time window.</p>
          </div>

          {/* Date Picker Buttons */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              {t.selectDate}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dateOptions.map(d => {
                const isSelected = selectedDate === d.dateStr;
                return (
                  <button
                    key={d.dateStr}
                    type="button"
                    onClick={() => setSelectedDate(d.dateStr)}
                    className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected 
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md' 
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Slots with occupancy indicator */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              {t.availableSlots} ({selectedCentre.name})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STANDARD_TIME_SLOTS.map(slot => {
                const occupancy = getSlotOccupancy(slot);
                const isSelected = selectedTimeSlot === slot;
                return (
                  <div
                    key={slot}
                    onClick={() => {
                      if (!occupancy.isFull) setSelectedTimeSlot(slot);
                    }}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      occupancy.isFull 
                        ? 'bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed'
                        : isSelected 
                        ? 'border-emerald-600 bg-emerald-50/60 shadow-xs cursor-pointer' 
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-stone-500" />
                        <span className="font-extrabold text-stone-900 text-sm">{slot}</span>
                      </div>
                      {occupancy.isFull ? (
                        <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                          {t.slotFull}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {occupancy.max - occupancy.booked} {t.slotsRemaining}
                        </span>
                      )}
                    </div>

                    {/* Progress capacity bar */}
                    <div className="mt-3">
                      <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full rounded-full transition-all"
                          style={{ width: `${(occupancy.booked / occupancy.max) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1">
                        {occupancy.booked} of {occupancy.max} farmers scheduled
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Review & Price Verification Card */}
          {(() => {
            const currentMsp = mspRates.find(m => m.crop === selectedCrop) || mspRates[0];
            const estTotal = (quantityQuintals || 0) * currentMsp.ratePerQuintal;
            return (
              <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                    Booking & Government Price Summary
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Official MSP Guarantee
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-stone-500 block">Crop & Variety:</span>
                    <strong className="text-stone-900">{selectedCrop}</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Quantity / Bags:</span>
                    <strong className="text-stone-900">{quantityQuintals} Qtl (~{bagsCount} Bags)</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Official MSP Rate:</span>
                    <strong className="text-emerald-700 font-mono text-sm">₹{currentMsp.ratePerQuintal}/Qtl</strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Assured DBT Payout:</span>
                    <strong className="text-emerald-900 font-mono text-base">₹{estTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500 flex flex-wrap justify-between items-center gap-2">
                  <span>Centre: <strong>{language === 'te' ? selectedCentre.teluguName : selectedCentre.name}</strong></span>
                  <span>Date & Slot: <strong>{selectedDate} ({selectedTimeSlot})</strong></span>
                </div>
              </div>
            );
          })()}

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-xs flex items-center space-x-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.back}</span>
            </button>

            <button
              id="confirm-slot-booking-btn"
              onClick={() => setIsBookingOtpOpen(true)}
              className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center space-x-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                {language === 'te' 
                  ? 'OTP ధృవీకరణ & స్లాట్ ఖరారు చేయండి' 
                  : 'Verify Mobile via OTP & Confirm Slot'}
              </span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Success & Printable Confirmation */}
      {step === 4 && confirmedBooking && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-500/50 space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {t.bookingSuccess}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 mt-2">
              Queue Token Generated
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              SMS confirmation has been sent to your registered mobile number.
            </p>
          </div>

          {/* Big Token Display Box */}
          <div className="bg-emerald-900 text-white rounded-3xl p-6 max-w-md mx-auto shadow-xl space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-300 font-semibold">{t.tokenNumber}</p>
              <p className="text-5xl sm:text-6xl font-black tracking-tight font-mono text-amber-400 mt-1">
                #{confirmedBooking.queueNumber}
              </p>
            </div>

            <div className="border-t border-emerald-800 pt-3 space-y-1 text-xs">
              <p className="font-mono text-emerald-200">
                {t.bookingRef}: <strong>{confirmedBooking.bookingNumber}</strong>
              </p>
              <p className="text-emerald-100">
                Date: <strong>{confirmedBooking.slotDate}</strong> • Slot: <strong>{confirmedBooking.slotTime}</strong>
              </p>
              <p className="text-emerald-200">
                Centre: {confirmedBooking.centreName}
              </p>
              <div className="mt-2 pt-2 border-t border-emerald-800/80 grid grid-cols-2 gap-2 text-left bg-emerald-950/40 p-2.5 rounded-xl">
                <div>
                  <span className="text-[10px] text-emerald-300 block uppercase tracking-wider font-semibold">Government MSP</span>
                  <span className="text-xs font-bold text-white font-mono">
                    ₹{confirmedBooking.mspRatePerQuintal || 2320}/Qtl
                  </span>
                  <span className="text-[10px] text-emerald-300 block">
                    {confirmedBooking.cropType}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block uppercase tracking-wider font-semibold">Guaranteed DBT Payout</span>
                  <span className="text-sm font-black text-amber-300 font-mono">
                    ₹{(confirmedBooking.estimatedAmount || confirmedBooking.estimatedQuantityQuintals * (confirmedBooking.mspRatePerQuintal || 2320)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-emerald-300 block">
                    {confirmedBooking.estimatedQuantityQuintals} Qtl
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-800/80 rounded-xl p-2.5 text-[11px] text-emerald-100 flex items-center justify-center space-x-2">
              <QrCode className="w-5 h-5 text-amber-300 shrink-0" />
              <span>Digital Mandi Pass: Valid for vehicle entry & gate pass</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                window.print();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold text-xs flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4" />
              <span>Print Booking Slip</span>
            </button>

            <button
              onClick={() => setCurrentPage('live-queue')}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs shadow-md flex items-center justify-center space-x-2"
            >
              <span>{language === 'te' ? 'లైవ్ క్యూ చూడండి' : 'Track in Live Queue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentPage('farmer-dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-bold text-xs"
            >
              {t.navDashboard}
            </button>
          </div>
        </div>
      )}

      {/* Slot Booking OTP Verification Modal */}
      {currentFarmer && (
        <OtpVerificationModal
          isOpen={isBookingOtpOpen}
          onClose={() => setIsBookingOtpOpen(false)}
          phone={currentFarmer.mobile}
          farmerName={currentFarmer.name}
          purpose="booking"
          onVerified={() => {
            setIsBookingOtpOpen(false);
            handleConfirmBooking();
          }}
          title="Verify OTP to Confirm Slot"
          subtitle={`Dispatched to registered mobile +91 ${currentFarmer.mobile}. Enter the 4-digit code to generate your official queue token and passbook booking slip.`}
        />
      )}
    </div>
  );
};
