import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  IndianRupee, 
  TrendingUp, 
  Droplet, 
  Search, 
  CalendarDays, 
  Scale, 
  CheckCircle2, 
  HelpCircle, 
  ShieldCheck, 
  ArrowUpRight,
  Filter,
  Sparkles,
  Calculator,
  Building2,
  ChevronRight,
  Tag
} from 'lucide-react';
import { MspRate } from '../types';

interface CropPricesPageProps {
  setCurrentPage: (page: string) => void;
}

export const CropPricesPage: React.FC<CropPricesPageProps> = ({ setCurrentPage }) => {
  const { mspRates, language, t } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedCropForCalc, setSelectedCropForCalc] = useState<MspRate>(mspRates[0]);
  const [calcQuintals, setCalcQuintals] = useState<number>(50);

  // Filter crops
  const categories = ['All', 'Cereals', 'Pulses', 'Oilseeds', 'Commercial', 'Millets'];

  const filteredCrops = mspRates.filter(crop => {
    const matchesSearch = 
      crop.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crop.cropTelugu.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Payout calculation
  const mspEarnings = Math.round(calcQuintals * selectedCropForCalc.ratePerQuintal);
  const openMarketEarnings = Math.round(calcQuintals * (selectedCropForCalc.marketModalPrice || (selectedCropForCalc.ratePerQuintal * 0.9)));
  const savingsAdvantage = mspEarnings - openMarketEarnings;

  const handleBookWithCrop = (cropName: string) => {
    // Navigate to book-slot
    setCurrentPage('book-slot');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-emerald-800">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-emerald-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-emerald-800/90 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-emerald-700">
            <Tag className="w-3.5 h-3.5" />
            <span>Official Government Mandi Price Portal • Season 2024-25</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            {language === 'te' 
              ? 'కనీస మద్దతు ధరలు (MSP) & మార్కెట్ ధరల వివరాలు' 
              : 'Official MSP & Mandi Crop Procurement Rates'}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 font-medium leading-relaxed">
            {language === 'te'
              ? 'ప్రభుత్వ కొనుగోలు కేంద్రాలలో క్వింటాలుకు కల్పించిన గ్యారెంటీ మద్దతు ధరలను తెలుసుకోండి. ప్రైవేట్ దళారులకు తక్కువ ధరకు ధాన్యం అమ్మకుండా పూర్తి లాభం పొందండి.'
              : 'Directly access guaranteed Government Minimum Support Prices (MSP), daily APMC mandi modal rates, and state procurement bonuses. Calculate your assured bank payout before booking your slot.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-emerald-200">
            <span className="flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1 text-emerald-300" />
              100% Direct DBT to Aadhaar Bank
            </span>
            <span className="flex items-center">
              <Scale className="w-4 h-4 mr-1 text-emerald-300" />
              Electronic Mandi Weighment
            </span>
            <span className="flex items-center">
              <Building2 className="w-4 h-4 mr-1 text-emerald-300" />
              Direct Purchase at APMC / PACS
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Price Payout Estimator Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4" />
              <span>Instant Price Calculator</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900">
              {language === 'te' ? 'మీ పంట రాబడి అంచనా కాలిక్యులేటర్' : 'Calculate Your Guaranteed MSP Revenue'}
            </h2>
            <p className="text-xs text-stone-500">
              Select your crop variety and enter expected quintals to verify your direct payment.
            </p>
          </div>

          <button
            id="book-slot-from-prices-btn"
            onClick={() => setCurrentPage('book-slot')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md transition-all inline-flex items-center justify-center space-x-2 self-start md:self-auto cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>{language === 'te' ? 'ఈ ధరకు స్లాట్ బుక్ చేయండి' : 'Book Mandi Slot Now'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Controls */}
          <div className="md:col-span-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {language === 'te' ? 'పంట రకాన్ని ఎంచుకోండి:' : 'Select Crop Variety:'}
              </label>
              <select
                id="price-calc-crop-select"
                value={selectedCropForCalc.crop}
                onChange={(e) => {
                  const found = mspRates.find(m => m.crop === e.target.value);
                  if (found) setSelectedCropForCalc(found);
                }}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              >
                {mspRates.map(c => (
                  <option key={c.crop} value={c.crop}>
                    {language === 'te' ? c.cropTelugu : c.crop} — ₹{c.ratePerQuintal}/Qtl ({c.season})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-stone-700">
                  {language === 'te' ? 'అంచనా దిగుబడి (క్వింటాళ్లలో):' : 'Expected Harvest (Quintals):'}
                </label>
                <span className="text-xs text-stone-500 font-mono">
                  ~{(calcQuintals * 2.5).toFixed(0)} standard bags (40 kg each)
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  id="price-calc-quintals-input"
                  type="number"
                  min={1}
                  max={2000}
                  value={calcQuintals}
                  onChange={(e) => setCalcQuintals(Math.max(1, Number(e.target.value)))}
                  className="w-32 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono font-bold text-stone-900 focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
                <input
                  type="range"
                  min={5}
                  max={300}
                  step={5}
                  value={calcQuintals}
                  onChange={(e) => setCalcQuintals(Number(e.target.value))}
                  className="flex-1 accent-emerald-700"
                />
              </div>
            </div>

            <div className="text-xs text-stone-500 space-y-1 pt-1">
              <p className="flex items-center">
                <Droplet className="w-3.5 h-3.5 text-blue-500 mr-1.5" />
                Permissible FAQ moisture standard for this crop:{' '}
                <strong className="text-stone-700 ml-1">{selectedCropForCalc.faqMoistureLimit}%</strong>
              </p>
              {selectedCropForCalc.stateBonus && (
                <p className="text-emerald-700 font-semibold flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  {selectedCropForCalc.stateBonus}
                </p>
              )}
            </div>
          </div>

          {/* Result Card */}
          <div className="md:col-span-6 bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Assured Mandi Direct Benefit Transfer
              </span>
              <span className="text-[11px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                Rate: ₹{selectedCropForCalc.ratePerQuintal}/Qtl
              </span>
            </div>

            <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-950">
              ₹{mspEarnings.toLocaleString('en-IN')}
            </div>

            <div className="pt-2 border-t border-emerald-200/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-stone-500 block">Open Trader Mandi Price:</span>
                <span className="font-mono font-bold text-stone-700">
                  ₹{openMarketEarnings.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  (@ ₹{selectedCropForCalc.marketModalPrice || Math.round(selectedCropForCalc.ratePerQuintal * 0.9)}/Qtl)
                </span>
              </div>

              <div>
                <span className="text-emerald-700 font-bold block">Government MSP Bonus:</span>
                <span className="font-mono font-bold text-emerald-700">
                  +₹{savingsAdvantage.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-600 block">
                  Extra earnings saved from middlemen
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="crop-price-search-input"
            type="text"
            placeholder={language === 'te' ? 'పంట పేరు నమోదు చేయండి (వరి, పత్తి...)' : 'Search crop or variety...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs font-medium text-stone-800 placeholder-stone-400 focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-stone-400 mr-1 hidden sm:inline" />
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCrops.map(crop => {
          const isSelected = selectedCropForCalc.crop === crop.crop;
          const diffFromLastYear = crop.previousYearRate ? crop.ratePerQuintal - crop.previousYearRate : 0;
          const mktDiff = crop.marketModalPrice ? crop.ratePerQuintal - crop.marketModalPrice : 0;

          return (
            <div
              key={crop.crop}
              className={`bg-white rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between shadow-xs ${
                isSelected ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-stone-200 hover:border-emerald-400'
              }`}
            >
              <div>
                {/* Badges */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {crop.season}
                  </span>
                  {crop.category && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      {crop.category}
                    </span>
                  )}
                </div>

                {/* Crop Titles */}
                <h3 className="text-base font-black text-stone-900 leading-snug">
                  {language === 'te' ? crop.cropTelugu : crop.crop}
                </h3>
                <p className="text-xs text-stone-500 mb-4">
                  {language === 'te' ? crop.crop : crop.cropTelugu}
                </p>

                {/* Primary MSP Rate Box */}
                <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 mb-3 space-y-1">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-500 font-medium">Government MSP:</span>
                    <span className="text-xl font-black font-mono text-emerald-700">
                      ₹{crop.ratePerQuintal.toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-stone-500"> /Qtl</span>
                    </span>
                  </div>

                  {diffFromLastYear > 0 && (
                    <div className="flex items-center justify-end text-[11px] text-emerald-600 font-semibold space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>+₹{diffFromLastYear}/Qtl increase over 2023-24</span>
                    </div>
                  )}
                </div>

                {/* Open Market Modal Price comparison */}
                {crop.marketModalPrice && (
                  <div className="text-xs text-stone-600 space-y-1.5 mb-3 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-stone-500">Private Mandi Modal Rate:</span>
                      <span className="font-mono font-bold text-stone-800">₹{crop.marketModalPrice}/Qtl</span>
                    </div>
                    {mktDiff > 0 && (
                      <div className="flex justify-between items-center text-[11px] text-emerald-700 font-bold">
                        <span>Government Advantage:</span>
                        <span>+₹{mktDiff}/Qtl higher</span>
                      </div>
                    )}
                  </div>
                )}

                {/* FAQ Moisture & Specs */}
                <div className="text-xs text-stone-500 space-y-1 pt-1 border-t border-stone-100">
                  <p className="flex items-center text-[11px]">
                    <Droplet className="w-3 h-3 text-blue-500 mr-1 shrink-0" />
                    Max FAQ Moisture:{' '}
                    <strong className="text-stone-800 ml-1">{crop.faqMoistureLimit}%</strong>
                  </p>
                  {crop.description && (
                    <p className="text-[11px] text-stone-400 line-clamp-2">
                      {crop.description}
                    </p>
                  )}
                  {crop.stateBonus && (
                    <p className="text-[11px] text-emerald-700 font-semibold pt-0.5">
                      ⭐ {crop.stateBonus}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-stone-100 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedCropForCalc(crop)}
                  className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Calculate Payout
                </button>

                <button
                  type="button"
                  onClick={() => handleBookWithCrop(crop.crop)}
                  className="flex-1 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs inline-flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <span>Book Slot</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Information Quality & Testing Notice */}
      <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200 space-y-4 text-xs text-stone-600">
        <h4 className="text-sm font-bold text-stone-900 flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          <span>Fair Average Quality (FAQ) Procurement Norms & Moisture Deductions</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-stone-600 leading-relaxed">
          <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-1">
            <strong className="text-stone-800 block">Moisture Standards</strong>
            <p>
              Paddy FAQ standard limit is 17%. Moisture below 17% is procured at full MSP rate without deduction. Laboratory moisture meters are calibrated daily at each mandi.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-1">
            <strong className="text-stone-800 block">Direct Bank Transfer</strong>
            <p>
              Procurement receipts (J-Form / Gunny Slips) are generated instantly upon weighment. Payouts are transferred directly into your Aadhaar-linked bank account within 24 to 48 hours.
            </p>
          </div>

          <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 space-y-1">
            <strong className="text-stone-800 block">No Commission Fee</strong>
            <p>
              Government procurement yards charge 0% commission, market fee, or brokerage from farmers. Weighment and gunny handling charges are fully borne by the state procurement agencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
