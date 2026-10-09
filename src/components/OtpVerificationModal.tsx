import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  X, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Smartphone, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface OtpVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  farmerName?: string;
  purpose: 'registration' | 'booking' | 'payment' | 'login';
  onVerified: () => void;
  title?: string;
  subtitle?: string;
}

export const OtpVerificationModal: React.FC<OtpVerificationModalProps> = ({
  isOpen,
  onClose,
  phone,
  farmerName,
  purpose,
  onVerified,
  title,
  subtitle
}) => {
  const { setSmsModalItem, language, t } = useApp();
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Generate and send simulated OTP whenever modal opens
  const generateAndDispatchOtp = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '']);
    setError('');
    setIsSuccess(false);
    setTimer(30);
    setCanResend(false);

    // Format phone
    const cleanPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;

    // Create realistic SMS simulation
    let smsTitle = 'SmartProcure OTP';
    let smsTitleTe = 'స్మార్ట్‌ప్రొక్యూర్ OTP';
    let smsMessage = `Your SmartProcure verification code is ${code}. Valid for 10 minutes. Do NOT share this OTP with anyone. - Govt of India / APMC`;
    let smsMessageTe = `మీ స్మార్ట్‌ప్రొక్యూర్ ధృవీకరణ కోడ్: ${code}. 10 నిమిషాల వరకు చెల్లుబాటు అవుతుంది. ఎవరితోనూ పంచుకోవద్దు. - భారత ప్రభుత్వం / APMC`;

    if (purpose === 'registration') {
      smsTitle = 'Farmer Registration OTP';
      smsTitleTe = 'రైతు నమోదు OTP';
      smsMessage = `Dear ${farmerName || 'Farmer'}, your OTP to complete SmartProcure registration is ${code}. Authorized under Ministry of Agriculture.`;
      smsMessageTe = `రైతు గారు, మీ నమోదును ధృవీకరించడానికి OTP: ${code}. వ్యవసాయ శాఖ ద్వారా అధికారం ఇవ్వబడింది.`;
    } else if (purpose === 'booking') {
      smsTitle = 'Slot Booking Confirmation OTP';
      smsTitleTe = 'స్లాట్ బుకింగ్ OTP';
      smsMessage = `OTP ${code} to confirm your mandi procurement slot & generate Queue Token. Do not share.`;
      smsMessageTe = `కొనుగోలు స్లాట్ మరియు క్యూ టోకెన్ జారీ కోసం OTP: ${code}. ఎవరికీ చెప్పవద్దు.`;
    }

    setSmsModalItem({
      id: `otp-sms-${Date.now()}`,
      farmerId: 'temp',
      farmerPhone: cleanPhone,
      title: smsTitle,
      titleTelugu: smsTitleTe,
      message: smsMessage,
      messageTelugu: smsMessageTe,
      type: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      smsSent: true
    });
  };

  useEffect(() => {
    if (isOpen) {
      generateAndDispatchOtp();
      // Auto focus first digit
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 150);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setError('');

    if (cleanVal && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // If all digits filled, auto verify
    if (newDigits.every(d => d !== '') && cleanVal) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      if (pasted.length === 4) {
        verifyCode(pasted);
      } else {
        inputRefs.current[Math.min(pasted.length, 3)]?.focus();
      }
    }
  };

  const handleAutoFill = () => {
    const chars = generatedOtp.split('');
    setOtpDigits(chars);
    verifyCode(generatedOtp);
  };

  const verifyCode = (enteredCode: string) => {
    setIsVerifying(true);
    setError('');

    setTimeout(() => {
      setIsVerifying(false);
      if (enteredCode === generatedOtp) {
        setIsSuccess(true);
        setTimeout(() => {
          onVerified();
          onClose();
        }, 600);
      } else {
        setError(language === 'te' 
          ? 'తప్పుడు OTP. దయచేసి సరైన 4 అంకెల కోడ్‌ను నమోదు చేయండి.' 
          : 'Invalid verification code. Please check and retry.');
        setOtpDigits(['', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    }, 450);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 4) {
      setError(language === 'te' ? 'దయచేసి 4 అంకెల OTP నమోదు చేయండి' : 'Please enter all 4 digits of OTP.');
      return;
    }
    verifyCode(entered);
  };

  const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone}`;

  return (
    <div 
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div 
        id="otp-verification-dialog"
        className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-stone-200 text-stone-900 relative animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isVerifying || isSuccess}
          className="absolute right-4 top-4 text-stone-400 hover:text-stone-700 p-2 rounded-full hover:bg-stone-100 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Shield Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            {isSuccess ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-in zoom-in" />
            ) : (
              <ShieldCheck className="w-8 h-8 text-emerald-700" />
            )}
          </div>

          <h3 className="text-xl font-black text-stone-900">
            {title || (language === 'te' ? 'OTP మొబైల్ ధృవీకరణ' : 'Two-Factor OTP Verification')}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            {subtitle || (
              <>
                {language === 'te' ? 'రక్షిత కోడ్ SMS ద్వారా పంపబడింది:' : 'A secure 4-digit verification code was sent to'}{' '}
                <strong className="font-mono text-stone-800">{formattedPhone}</strong>
              </>
            )}
          </p>
        </div>

        {/* Simulated Gateway Notification Banner */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-3.5 mb-5 text-xs text-emerald-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <Smartphone className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="font-bold text-[11px] uppercase tracking-wider text-emerald-800">
                Simulated SMS Gateway:
              </span>
            </div>
            <span className="font-mono font-black text-sm bg-emerald-700 text-white px-2.5 py-0.5 rounded-lg shadow-xs">
              {generatedOtp}
            </span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200/60 text-[11px]">
            <span className="text-emerald-700">Test code generated & dispatched</span>
            <button
              type="button"
              id="otp-autofill-btn"
              onClick={handleAutoFill}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center space-x-1 cursor-pointer"
            >
              <span>Auto-fill code</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium flex items-center space-x-2 animate-in shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Alert */}
        {isSuccess && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center justify-center space-x-2 animate-in zoom-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'te' ? 'OTP విజయవంతంగా ధృవీకరించబడింది!' : 'OTP Verified Successfully!'}</span>
          </div>
        )}

        {/* OTP Input Form */}
        <form onSubmit={handleManualSubmit} className="space-y-5">
          <div>
            <label className="block text-center text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              {language === 'te' ? '4 అంకెల OTP నమోదు చేయండి' : 'Enter 4-Digit Verification Code'}
            </label>

            <div className="flex justify-center space-x-3" onPaste={handlePaste}>
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={otpDigits[index]}
                  onChange={(e) => handleDigitChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isVerifying || isSuccess}
                  className={`w-14 h-14 text-center text-2xl font-mono font-black rounded-2xl border-2 transition-all outline-hidden ${
                    otpDigits[index]
                      ? 'border-emerald-600 bg-emerald-50/40 text-stone-900 shadow-xs'
                      : 'border-stone-300 bg-stone-50 text-stone-800 focus:border-emerald-600 focus:bg-white'
                  } ${error ? 'border-rose-400 bg-rose-50/30' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <button
            id="submit-verify-otp-btn"
            type="submit"
            disabled={isVerifying || isSuccess || otpDigits.join('').length < 4}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            {isVerifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Verifying Code...</span>
              </>
            ) : isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified!</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>{language === 'te' ? 'ధృవీకరించి కొనసాగండి' : 'Verify & Proceed'}</span>
              </>
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="text-center pt-1">
            {canResend ? (
              <button
                type="button"
                id="resend-otp-btn"
                onClick={generateAndDispatchOtp}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-center space-x-1.5 mx-auto"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{language === 'te' ? 'మళ్లీ OTP పంపండి' : 'Resend Verification Code'}</span>
              </button>
            ) : (
              <p className="text-xs text-stone-400 flex items-center justify-center space-x-1">
                <span>{language === 'te' ? 'మళ్లీ పంపే సమయం:' : 'Resend code in'}</span>
                <span className="font-mono font-bold text-stone-600">{timer}s</span>
              </p>
            )}
          </div>
        </form>

        {/* Official Security Footer */}
        <div className="mt-5 pt-3 border-t border-stone-200/80 text-[11px] text-stone-400 text-center flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Government Mandi Direct Procurement Security Standard</span>
        </div>
      </div>
    </div>
  );
};
