import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Phone, 
  ShieldCheck, 
  MapPin, 
  Building2, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  FileText,
  RefreshCw,
  Lock
} from 'lucide-react';
import { ALL_STATES, getDistrictsForState } from '../data/statesAndDistricts';
import { OtpVerificationModal } from '../components/OtpVerificationModal';

interface FarmerAuthProps {
  setCurrentPage: (page: string) => void;
}

export const FarmerAuth: React.FC<FarmerAuthProps> = ({ setCurrentPage }) => {
  const { 
    t, 
    language, 
    loginFarmerByMobile, 
    registerFarmer, 
    farmers, 
    setCurrentFarmer, 
    setCurrentRole,
    setSmsModalItem
  } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Login states
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginTimer, setLoginTimer] = useState(30);
  const [canResendLoginOtp, setCanResendLoginOtp] = useState(false);

  // Register states
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regAadhar, setRegAadhar] = useState('');
  const [regVillage, setRegVillage] = useState('');
  const [regMandal, setRegMandal] = useState('');
  const [regDistrict, setRegDistrict] = useState('Khammam');
  const [regState, setRegState] = useState('Telangana');
  const [regCropName, setRegCropName] = useState('Paddy (Grade A / Fine)');
  const [regAcreAge, setRegAcreAge] = useState(3.5);
  const [regYield, setRegYield] = useState(85);
  const [regBankName, setRegBankName] = useState('State Bank of India');
  const [regAccountNo, setRegAccountNo] = useState('');
  const [regIfsc, setRegIfsc] = useState('SBIN0001234');
  const [regError, setRegError] = useState('');
  const [isRegOtpOpen, setIsRegOtpOpen] = useState(false);

  const availableDistricts = getDistrictsForState(regState);

  // Countdown timer for login OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && loginTimer > 0) {
      interval = setInterval(() => {
        setLoginTimer(prev => {
          if (prev <= 1) {
            setCanResendLoginOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, loginTimer]);

  const handleStateChange = (newState: string) => {
    setRegState(newState);
    const dists = getDistrictsForState(newState);
    if (dists.length > 0) {
      setRegDistrict(dists[0]);
    } else {
      setRegDistrict('');
    }
  };

  // Trigger simulated OTP
  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');

    if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 10) {
      setLoginError(language === 'te' ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    setEnteredOtp(code); // Pre-fill for friction-free demo testing
    setLoginTimer(30);
    setCanResendLoginOtp(false);

    // Trigger SMS notification popup
    setSmsModalItem({
      id: `login-otp-${Date.now()}`,
      farmerId: 'temp',
      farmerPhone: `+91 ${mobileNumber}`,
      title: 'SmartProcure Login OTP',
      titleTelugu: 'స్మార్ట్‌ప్రొక్యూర్ లాగిన్ OTP',
      message: `Your login OTP is ${code}. Valid for 10 minutes. Do not share. - Govt APMC`,
      messageTelugu: `మీ లాగిన్ OTP: ${code}. 10 నిమిషాల వరకు చెల్లుబాటు అవుతుంది. ఎవరితోనూ పంచుకోవద్దు.`,
      type: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      smsSent: true
    });
  };

  // Verify OTP & Login
  const handleVerifyLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (enteredOtp !== generatedOtp) {
      setLoginError(language === 'te' ? 'తప్పుడు OTP. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Invalid OTP entered. Please retry.');
      return;
    }

    const res = loginFarmerByMobile(mobileNumber);
    if (res.success) {
      setCurrentPage('farmer-dashboard');
    } else {
      setLoginError(res.message || 'Farmer not found.');
    }
  };

  // Initiates OTP verification for registration
  const handleProceedToRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regMobile.trim() || !regVillage.trim() || !regAccountNo.trim()) {
      setRegError(language === 'te' ? 'దయచేసి అన్ని వివరాలను నమోదు చేయండి' : 'Please fill all required registration fields.');
      return;
    }

    if (regMobile.replace(/\D/g, '').length < 10) {
      setRegError(language === 'te' ? 'దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ నమోదు చేయండి' : 'Please enter a valid 10-digit mobile number for OTP verification.');
      return;
    }

    // Open OTP Verification Modal
    setIsRegOtpOpen(true);
  };

  // Finalize Registration after OTP Verification
  const finalizeRegistration = () => {
    const newFarmer = registerFarmer({
      name: regName.trim(),
      mobile: regMobile.trim(),
      aadharLast4: regAadhar.slice(-4) || '8832',
      village: regVillage.trim(),
      mandal: regMandal.trim() || 'Rural',
      district: regDistrict,
      state: regState,
      crops: [
        {
          name: regCropName,
          teluguName: regCropName,
          variety: 'High Yield Hybrid',
          acreAge: Number(regAcreAge) || 2.0,
          estYieldQuintals: Number(regYield) || 50
        }
      ],
      bankDetails: {
        accountNo: regAccountNo.trim(),
        ifsc: regIfsc.trim() || 'SBIN0001234',
        bankName: regBankName,
        accountHolderName: regName.trim()
      }
    });

    if (newFarmer) {
      setCurrentPage('farmer-dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Tab Selector */}
      <div className="flex bg-stone-200 p-1 rounded-2xl max-w-md mx-auto mb-8">
        <button
          id="auth-tab-login"
          onClick={() => { setMode('login'); setLoginError(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            mode === 'login' 
              ? 'bg-white text-stone-900 shadow-sm' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.login}
        </button>
        <button
          id="auth-tab-register"
          onClick={() => { setMode('register'); setRegError(''); }}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            mode === 'register' 
              ? 'bg-white text-stone-900 shadow-sm' 
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          {t.register}
        </button>
      </div>

      {mode === 'login' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Login Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200">
            <div className="flex items-center space-x-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-900">{t.loginWithOtp}</h2>
                <p className="text-xs text-stone-500">
                  {language === 'te' ? 'మీ నమోదిత మొబైల్ నంబర్ ద్వారా లాగిన్ అవ్వండి' : 'Secure passwordless OTP login for farmers'}
                </p>
              </div>
            </div>

            {loginError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.mobileNumber}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-3.5 text-xs font-bold text-stone-500 font-mono">
                      +91
                    </span>
                    <input
                      id="farmer-login-mobile-input"
                      type="tel"
                      maxLength={10}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="98490 12345"
                      className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 font-mono font-bold text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                      required
                    />
                  </div>
                  <p className="text-[11px] text-stone-400 mt-1">
                    Enter the phone number registered on your Rythu Bandhu / Pattadar Passbook.
                  </p>
                </div>

                <button
                  id="farmer-send-otp-btn"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>{t.sendOtp}</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyLogin} className="space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                  <div className="flex items-center justify-between font-bold">
                    <span>Simulated OTP Dispatched:</span>
                    <span className="text-sm font-mono bg-emerald-700 text-white px-2 py-0.5 rounded">
                      {generatedOtp}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    Auto-filled below for instant testing convenience.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.enterOtp}
                  </label>
                  <input
                    id="farmer-enter-otp-input"
                    type="text"
                    maxLength={4}
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value)}
                    className="w-full py-3 text-center tracking-widest text-2xl font-mono font-black bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                    required
                  />
                </div>

                <button
                  id="farmer-verify-otp-btn"
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.verifyLogin}</span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => { setOtpSent(false); setEnteredOtp(''); }}
                    className="text-xs text-stone-500 hover:text-emerald-700 underline"
                  >
                    Change Mobile Number
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Demo Pre-filled Farmer Accounts */}
          <div className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-600 mb-3">
              {t.demoCredentials}
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              {language === 'te' 
                ? 'పరీక్షించడానికి క్రింది డెమో రైతుల ఖాతాలపై క్లిక్ చేయండి:' 
                : 'Click any sample farmer profile to immediately log in with realistic bookings and queue status:'}
            </p>

            <div className="space-y-3">
              {farmers.map(f => (
                <div 
                  key={f.id}
                  onClick={() => {
                    setCurrentFarmer(f);
                    setCurrentRole('farmer');
                    setCurrentPage('farmer-dashboard');
                  }}
                  className="bg-white hover:bg-emerald-50/60 p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {f.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm group-hover:text-emerald-900">
                          {f.name}
                        </h4>
                        <p className="text-xs text-stone-500">
                          {f.village}, {f.district}, {f.state} • ID: <span className="font-mono">{f.farmerId}</span>
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-700 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200 max-w-2xl mx-auto">
          <div className="flex items-center space-x-2.5 mb-6 border-b border-stone-100 pb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900">{t.register}</h2>
              <p className="text-xs text-stone-500">
                {language === 'te' 
                  ? 'ప్రభుత్వ ధాన్యం కొనుగోలుకు మీ వివరాలు నమోదు చేయండి' 
                  : 'Register for MSP procurement and digital queue tokens'}
              </p>
            </div>
          </div>

          {regError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{regError}</span>
            </div>
          )}

          <form onSubmit={handleProceedToRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.farmerName} *
                </label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Kondala Rao"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.mobileNumber} *
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98490 00000"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.state} *
                </label>
                <select
                  value={regState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                >
                  {ALL_STATES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.district} *
                </label>
                <select
                  value={regDistrict}
                  onChange={(e) => setRegDistrict(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                >
                  {availableDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.mandal}
                </label>
                <input
                  type="text"
                  value={regMandal}
                  onChange={(e) => setRegMandal(e.target.value)}
                  placeholder="e.g. Kusumanchi / Block"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t.village} *
                </label>
                <input
                  type="text"
                  value={regVillage}
                  onChange={(e) => setRegVillage(e.target.value)}
                  placeholder="e.g. Pallegudem"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  required
                />
              </div>
            </div>

            {/* Crop Info */}
            <div className="border-t border-stone-200 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                {t.cropDetails}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Primary Crop</label>
                  <select
                    value={regCropName}
                    onChange={(e) => setRegCropName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  >
                    <option value="Paddy (Grade A / Fine)">Paddy (Grade A / Fine)</option>
                    <option value="Paddy (Common)">Paddy (Common)</option>
                    <option value="Cotton (Long Staple)">Cotton (Long Staple)</option>
                    <option value="Maize (Corn)">Maize (Corn)</option>
                    <option value="Red Gram (Tur / Arhar)">Red Gram (Tur)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Land Cultivated (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={regAcreAge}
                    onChange={(e) => setRegAcreAge(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Expected Yield (Quintals)</label>
                  <input
                    type="number"
                    value={regYield}
                    onChange={(e) => setRegYield(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bank details for DBT */}
            <div className="border-t border-stone-200 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3">
                Direct Benefit Transfer (DBT) Bank Account
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">{t.bankName}</label>
                  <input
                    type="text"
                    value={regBankName}
                    onChange={(e) => setRegBankName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">{t.accountNumber} *</label>
                  <input
                    type="text"
                    value={regAccountNo}
                    onChange={(e) => setRegAccountNo(e.target.value)}
                    placeholder="309810100xxxx"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">{t.ifscCode}</label>
                  <input
                    type="text"
                    value={regIfsc}
                    onChange={(e) => setRegIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              id="submit-register-farmer-btn"
              type="submit"
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2 mt-4 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>
                {language === 'te' 
                  ? 'OTP ద్వారా ధృవీకరించి నమోదు పూర్తి చేయండి' 
                  : 'Verify Mobile via OTP & Complete Registration'}
              </span>
            </button>
          </form>
        </div>
      )}

      {/* Registration OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={isRegOtpOpen}
        onClose={() => setIsRegOtpOpen(false)}
        phone={regMobile}
        farmerName={regName}
        purpose="registration"
        onVerified={() => {
          setIsRegOtpOpen(false);
          finalizeRegistration();
        }}
        title="Verify Farmer Mobile via OTP"
        subtitle="Government verification: Enter the 4-digit code dispatched via SMS to activate your digital procurement account."
      />
    </div>
  );
};
