import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Farmer, 
  ProcurementCentre, 
  Booking, 
  ProcurementRecord, 
  PaymentRecord, 
  NotificationItem, 
  BookingStatus, 
  QualityGrade,
  PaymentStatus,
  MspRate
} from '../types';
import { 
  INITIAL_CENTRES, 
  INITIAL_FARMERS, 
  INITIAL_BOOKINGS, 
  INITIAL_PROCUREMENT_RECORDS, 
  INITIAL_PAYMENTS, 
  INITIAL_NOTIFICATIONS,
  INITIAL_MSP_RATES,
  getTodayString 
} from '../data/initialData';
import { getStateCode, getStateForDistrict } from '../data/statesAndDistricts';
import { translations } from '../i18n/translations';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  currentRole: 'farmer' | 'admin' | 'public';
  setCurrentRole: (role: 'farmer' | 'admin' | 'public') => void;
  currentFarmer: Farmer | null;
  setCurrentFarmer: (farmer: Farmer | null) => void;
  farmers: Farmer[];
  centres: ProcurementCentre[];
  bookings: Booking[];
  procurementRecords: ProcurementRecord[];
  payments: PaymentRecord[];
  notifications: NotificationItem[];
  mspRates: MspRate[];
  selectedAdminCentreId: string;
  setSelectedAdminCentreId: (id: string) => void;
  smsModalItem: NotificationItem | null;
  setSmsModalItem: (item: NotificationItem | null) => void;
  audioAnnounceEnabled: boolean;
  setAudioAnnounceEnabled: (enabled: boolean) => void;
  
  // Actions
  bookSlot: (params: {
    farmerId: string;
    centreId: string;
    slotDate: string;
    slotTime: string;
    cropType: string;
    estimatedQuantityQuintals: number;
  }) => { success: boolean; message: string; booking?: Booking };
  
  updateBookingStatus: (
    bookingId: string, 
    newStatus: BookingStatus, 
    options?: { counterNumber?: number; remarks?: string }
  ) => void;
  
  recordProcurement: (params: {
    bookingId: string;
    actualQuantityQuintals: number;
    bagsCount: number;
    qualityGrade: QualityGrade;
    moisturePercentage: number;
    officerInCharge: string;
  }) => { success: boolean; record?: ProcurementRecord };

  updatePaymentStatus: (paymentId: string, status: PaymentStatus, transactionRef?: string) => void;
  
  updateCentre: (centreId: string, updates: Partial<ProcurementCentre>) => void;
  addCentre: (newCentre: Omit<ProcurementCentre, 'id' | 'currentActiveToken'>) => void;
  registerFarmer: (farmerData: Omit<Farmer, 'id' | 'farmerId' | 'registeredDate'>) => Farmer;
  loginFarmerByMobile: (mobile: string) => { success: boolean; farmer?: Farmer; message?: string };
  logout: () => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  playTokenCallSound: (tokenNumber: number, centreName: string, counterNumber?: number) => void;
  resetAllDataToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('smartprocure_lang') as Language) || 'en';
  });

  const [currentRole, setCurrentRole] = useState<'farmer' | 'admin' | 'public'>('farmer');

  const [farmers, setFarmers] = useState<Farmer[]>(() => {
    const saved = localStorage.getItem('smartprocure_farmers');
    return saved ? JSON.parse(saved) : INITIAL_FARMERS;
  });

  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(() => {
    const savedId = localStorage.getItem('smartprocure_active_farmer_id');
    if (savedId) {
      const found = INITIAL_FARMERS.find(f => f.id === savedId);
      if (found) return found;
    }
    return INITIAL_FARMERS[0]; // Ramesh Rao by default
  });

  const [centres, setCentres] = useState<ProcurementCentre[]>(() => {
    const saved = localStorage.getItem('smartprocure_centres');
    if (saved) {
      try {
        const parsed: ProcurementCentre[] = JSON.parse(saved);
        const updated = parsed.map(c => ({
          ...c,
          state: c.state || getStateForDistrict(c.district) || 'Telangana'
        }));
        const existingIds = new Set(updated.map(c => c.id));
        const missingInitial = INITIAL_CENTRES.filter(c => !existingIds.has(c.id));
        return [...updated, ...missingInitial];
      } catch {
        return INITIAL_CENTRES;
      }
    }
    return INITIAL_CENTRES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('smartprocure_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [procurementRecords, setProcurementRecords] = useState<ProcurementRecord[]>(() => {
    const saved = localStorage.getItem('smartprocure_procurements');
    return saved ? JSON.parse(saved) : INITIAL_PROCUREMENT_RECORDS;
  });

  const [payments, setPayments] = useState<PaymentRecord[]>(() => {
    const saved = localStorage.getItem('smartprocure_payments');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('smartprocure_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [selectedAdminCentreId, setSelectedAdminCentreId] = useState<string>(() => {
    return INITIAL_CENTRES[0].id;
  });

  const [smsModalItem, setSmsModalItem] = useState<NotificationItem | null>(null);
  const [audioAnnounceEnabled, setAudioAnnounceEnabled] = useState<boolean>(true);

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('smartprocure_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('smartprocure_farmers', JSON.stringify(farmers));
  }, [farmers]);

  useEffect(() => {
    if (currentFarmer) {
      localStorage.setItem('smartprocure_active_farmer_id', currentFarmer.id);
    } else {
      localStorage.removeItem('smartprocure_active_farmer_id');
    }
  }, [currentFarmer]);

  useEffect(() => {
    localStorage.setItem('smartprocure_centres', JSON.stringify(centres));
  }, [centres]);

  useEffect(() => {
    localStorage.setItem('smartprocure_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('smartprocure_procurements', JSON.stringify(procurementRecords));
  }, [procurementRecords]);

  useEffect(() => {
    localStorage.setItem('smartprocure_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('smartprocure_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const t = translations[language];

  // Helper for sound and voice synthesis
  const playTokenCallSound = (tokenNumber: number, centreName: string, counterNumber?: number) => {
    try {
      // Audio Chime using Web Audio API
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }

    // Voice announcement if enabled
    if (audioAnnounceEnabled && 'speechSynthesis' in window) {
      setTimeout(() => {
        try {
          const counterText = counterNumber ? `Counter ${counterNumber}` : 'Counter';
          const msg = new SpeechSynthesisUtterance(`Attention please. Token Number ${tokenNumber}, please proceed to ${counterText}.`);
          msg.rate = 0.95;
          window.speechSynthesis.speak(msg);
        } catch {
          // ignore error
        }
      }, 700);
    }
  };

  // Trigger Notification and simulated SMS alert
  const dispatchNotification = (
    farmerId: string, 
    farmerPhone: string, 
    title: string, 
    titleTelugu: string, 
    message: string, 
    messageTelugu: string, 
    type: 'booking' | 'queue' | 'procurement' | 'payment' | 'system'
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      farmerId,
      farmerPhone,
      title,
      titleTelugu,
      message,
      messageTelugu,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      smsSent: true
    };

    setNotifications(prev => [newNotif, ...prev]);
    // Display simulated SMS popover for 5 seconds
    setSmsModalItem(newNotif);
  };

  // Slot Booking with double-booking prevention
  const bookSlot = (params: {
    farmerId: string;
    centreId: string;
    slotDate: string;
    slotTime: string;
    cropType: string;
    estimatedQuantityQuintals: number;
  }) => {
    const farmer = farmers.find(f => f.id === params.farmerId) || currentFarmer;
    const centre = centres.find(c => c.id === params.centreId);

    if (!farmer) {
      return { success: false, message: 'Farmer profile not found. Please log in.' };
    }
    if (!centre) {
      return { success: false, message: 'Invalid procurement centre selected.' };
    }

    // Check double booking for the same farmer, same date and crop
    const existing = bookings.find(b => 
      b.farmerId === farmer.id && 
      b.slotDate === params.slotDate && 
      b.cropType === params.cropType &&
      b.status !== 'Cancelled'
    );

    if (existing) {
      return { 
        success: false, 
        message: language === 'te' 
          ? `ఈ తేదీన (${params.slotDate}) మీకు ఇప్పటికే ${params.cropType} కొనుగోలుకు బుకింగ్ (టోకెన్ #${existing.queueNumber}) ఉంది.`
          : `You already have an active booking on ${params.slotDate} for ${params.cropType} with Token #${existing.queueNumber}.` 
      };
    }

    // Generate Token Number for the centre on that date
    const centreBookingsOnDate = bookings.filter(b => b.centreId === params.centreId && b.slotDate === params.slotDate);
    const nextQueueNumber = centreBookingsOnDate.length > 0 
      ? Math.max(...centreBookingsOnDate.map(b => b.queueNumber)) + 1
      : (parseInt(centre.code.replace(/\D/g, '')) || 1) * 100 + 1;

    const bookingNum = `SP-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // Find MSP Rate and calculate total price accessed
    const mspMatch = INITIAL_MSP_RATES.find(m => m.crop.toLowerCase() === params.cropType.toLowerCase()) || INITIAL_MSP_RATES[0];
    const rate = mspMatch ? mspMatch.ratePerQuintal : 2320;
    const estAmount = Math.round(params.estimatedQuantityQuintals * rate);

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      bookingNumber: bookingNum,
      queueNumber: nextQueueNumber,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmerPhone: farmer.mobile,
      farmerDistrict: farmer.district,
      farmerState: farmer.state,
      centreId: centre.id,
      centreName: centre.name,
      slotDate: params.slotDate,
      slotTime: params.slotTime,
      cropType: params.cropType,
      estimatedQuantityQuintals: params.estimatedQuantityQuintals,
      mspRatePerQuintal: rate,
      estimatedAmount: estAmount,
      status: 'Booked',
      bookedAt: `${getTodayString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      counterNumber: 1,
      estimatedWaitMinutes: (centreBookingsOnDate.length % 5) * 15 + 10,
      remarks: 'Slot allocated. Please arrive with Aadhaar & Passbook.'
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send SMS & In-app alert
    dispatchNotification(
      farmer.id,
      farmer.mobile,
      `Slot Booked: Token #${nextQueueNumber} (₹${estAmount.toLocaleString('en-IN')})`,
      `స్లాట్ ఖరారైంది: టోకెన్ #${nextQueueNumber} (₹${estAmount.toLocaleString('en-IN')})`,
      `Your booking ${bookingNum} at ${centre.name} is confirmed for ${params.slotDate} (${params.slotTime}). Rate: ₹${rate}/Qtl, Estimated DBT: ₹${estAmount.toLocaleString('en-IN')}. Queue Token #${nextQueueNumber}.`,
      `${centre.teluguName} వద్ద ${params.slotDate} (${params.slotTime}) కు మీ స్లాట్ ${bookingNum} ఖరారైంది. ప్రభుత్వ MSP ధర: ₹${rate}/క్వింటా, మొత్తం: ₹${estAmount.toLocaleString('en-IN')}. టోకెన్ #${nextQueueNumber}.`,
      'booking'
    );

    return { success: true, message: 'Slot booked successfully!', booking: newBooking };
  };

  // Update Booking Status
  const updateBookingStatus = (
    bookingId: string, 
    newStatus: BookingStatus, 
    options?: { counterNumber?: number; remarks?: string }
  ) => {
    setBookings(prev => prev.map(b => {
      if (b.id !== bookingId) return b;

      const updated: Booking = {
        ...b,
        status: newStatus,
        counterNumber: options?.counterNumber || b.counterNumber || 1,
        remarks: options?.remarks || b.remarks
      };

      if (newStatus === 'Waiting' && !b.checkInTime) {
        updated.checkInTime = `${getTodayString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      if (newStatus === 'Called') {
        updated.calledTime = `${getTodayString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        updated.estimatedWaitMinutes = 0;
        
        // Update centre's active token
        setCentres(centresPrev => centresPrev.map(c => 
          c.id === b.centreId ? { ...c, currentActiveToken: b.queueNumber } : c
        ));

        // Sound + Voice Announcement
        playTokenCallSound(b.queueNumber, b.centreName, updated.counterNumber);

        // Notify farmer
        dispatchNotification(
          b.farmerId,
          b.farmerPhone,
          `Token #${b.queueNumber} Called to Counter ${updated.counterNumber}!`,
          `టోకెన్ #${b.queueNumber} కౌంటర్ ${updated.counterNumber} వద్దకు పిలువబడింది!`,
          `Attention ${b.farmerName}: Please proceed with your vehicle & grain to Counter ${updated.counterNumber} at ${b.centreName} immediately.`,
          `గమనిక ${b.farmerName}: దయచేసి వెంటనే మీ ధాన్యంతో ${b.centreName} కౌంటర్ ${updated.counterNumber} వద్దకు రండి.`,
          'queue'
        );
      }
      if (newStatus === 'Completed') {
        updated.completedTime = `${getTodayString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }

      return updated;
    }));
  };

  // Record Procurement after weighing and quality check
  const recordProcurement = (params: {
    bookingId: string;
    actualQuantityQuintals: number;
    bagsCount: number;
    qualityGrade: QualityGrade;
    moisturePercentage: number;
    officerInCharge: string;
  }) => {
    const booking = bookings.find(b => b.id === params.bookingId);
    if (!booking) return { success: false };

    const centre = centres.find(c => c.id === booking.centreId);
    const msp = INITIAL_MSP_RATES.find(m => m.crop === booking.cropType) || INITIAL_MSP_RATES[0];
    const rate = msp.ratePerQuintal;

    const grossAmount = Math.round(params.actualQuantityQuintals * rate);
    const deductions = params.qualityGrade === 'Re-cleaning Required' ? Math.round(grossAmount * 0.02) : 0;
    const netPayable = grossAmount - deductions;

    const slipNumber = `WS-${(centre?.code || 'PPC').substring(0, 3)}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProcurement: ProcurementRecord = {
      id: `proc-${Date.now()}`,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      farmerPhone: booking.farmerPhone,
      centreId: booking.centreId,
      centreName: booking.centreName,
      cropType: booking.cropType,
      actualQuantityQuintals: params.actualQuantityQuintals,
      bagsCount: params.bagsCount,
      qualityGrade: params.qualityGrade,
      moisturePercentage: params.moisturePercentage,
      mspRatePerQuintal: rate,
      grossAmount,
      deductions,
      netPayableAmount: netPayable,
      procurementDate: getTodayString(),
      currentStage: 'Completed & Slip Generated',
      weighingSlipNumber: slipNumber,
      officerInCharge: params.officerInCharge,
      status: 'Completed'
    };

    setProcurementRecords(prev => [newProcurement, ...prev]);

    // Create Payment Record (Pending/Processing)
    const farmer = farmers.find(f => f.id === booking.farmerId);
    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      procurementId: newProcurement.id,
      bookingId: booking.id,
      bookingNumber: booking.bookingNumber,
      farmerId: booking.farmerId,
      farmerName: booking.farmerName,
      farmerPhone: booking.farmerPhone,
      cropType: booking.cropType,
      quantityQuintals: params.actualQuantityQuintals,
      amount: netPayable,
      status: 'Processing',
      initiatedDate: getTodayString(),
      transactionRefNumber: `PFMS-GEN-${Math.floor(10000 + Math.random() * 90000)}`,
      bankAccountLast4: farmer?.bankDetails.accountNo.slice(-4) || '9999',
      bankName: farmer?.bankDetails.bankName || 'State Bank of India',
      paymentMode: 'DBT (Direct Benefit Transfer - PFMS)'
    };

    setPayments(prev => [newPayment, ...prev]);

    // Mark booking as completed
    updateBookingStatus(booking.id, 'Completed', {
      remarks: `Procured ${params.actualQuantityQuintals} Qtl @ ₹${rate}/Qtl. Slip: ${slipNumber}`
    });

    // Notify farmer
    dispatchNotification(
      booking.farmerId,
      booking.farmerPhone,
      `Procurement Complete: ₹${netPayable.toLocaleString('en-IN')}`,
      `ధాన్యం కొనుగోలు పూర్తయింది: ₹${netPayable.toLocaleString('en-IN')}`,
      `Procurement completed for ${params.actualQuantityQuintals} Qtl of ${booking.cropType}. Slip: ${slipNumber}. Payment of ₹${netPayable.toLocaleString('en-IN')} sent to PFMS Treasury for direct bank transfer.`,
      `${params.actualQuantityQuintals} క్వింటాళ్ల ${booking.cropType} కొనుగోలు పూర్తయింది. రసీదు: ${slipNumber}. మొత్తం ₹${netPayable.toLocaleString('en-IN')} బ్యాంకు ఖాతాకు జమ చేయడానికి పంపబడింది.`,
      'procurement'
    );

    return { success: true, record: newProcurement };
  };

  // Update Payment Status (e.g. mark as Paid by treasury admin)
  const updatePaymentStatus = (paymentId: string, status: PaymentStatus, transactionRef?: string) => {
    setPayments(prev => prev.map(p => {
      if (p.id !== paymentId) return p;
      const ref = transactionRef || p.transactionRefNumber || `PFMS-DBT-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const updated: PaymentRecord = {
        ...p,
        status,
        paidDate: status === 'Paid' ? getTodayString() : p.paidDate,
        transactionRefNumber: ref
      };

      if (status === 'Paid') {
        dispatchNotification(
          p.farmerId,
          p.farmerPhone,
          `DBT Payment Credited ₹${p.amount.toLocaleString('en-IN')}!`,
          `బ్యాంకులో నగదు జమ అయింది ₹${p.amount.toLocaleString('en-IN')}!`,
          `Government procurement payment of ₹${p.amount.toLocaleString('en-IN')} credited to A/C ending in ${p.bankAccountLast4} via ${ref}.`,
          `ప్రభుత్వ కొనుగోలు సొమ్ము ₹${p.amount.toLocaleString('en-IN')} మీ ఖాతా (${p.bankAccountLast4}) లో UTR: ${ref} ద్వారా జమ చేయబడింది.`,
          'payment'
        );
      }
      return updated;
    }));
  };

  const updateCentre = (centreId: string, updates: Partial<ProcurementCentre>) => {
    setCentres(prev => prev.map(c => c.id === centreId ? { ...c, ...updates } : c));
  };

  const addCentre = (newCentreData: Omit<ProcurementCentre, 'id' | 'currentActiveToken'>) => {
    const newCentre: ProcurementCentre = {
      ...newCentreData,
      id: `centre-${Date.now()}`,
      currentActiveToken: 100,
    };
    setCentres(prev => [...prev, newCentre]);
  };

  const registerFarmer = (farmerData: Omit<Farmer, 'id' | 'farmerId' | 'registeredDate'>) => {
    const code = getStateCode(farmerData.state);
    const cleanDist = farmerData.district.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'DST';
    const newId = `${code}-${cleanDist}-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newFarmer: Farmer = {
      ...farmerData,
      id: `fmr-${Date.now()}`,
      farmerId: newId,
      registeredDate: getTodayString()
    };

    setFarmers(prev => [newFarmer, ...prev]);
    setCurrentFarmer(newFarmer);
    setCurrentRole('farmer');

    dispatchNotification(
      newFarmer.id,
      newFarmer.mobile,
      'Welcome to SmartProcure!',
      'స్మార్ట్ ప్రొక్యూర్ కు స్వాగతం!',
      `Registration complete. Your Farmer ID is ${newId}. You can now book slots for grain procurement.`,
      `మీ నమోదు పూర్తయింది. మీ రైతు ఐడి: ${newId}. మీరు ధాన్యం విక్రయానికి స్లాట్ బుక్ చేసుకోవచ్చు.`,
      'system'
    );

    return newFarmer;
  };

  const loginFarmerByMobile = (mobile: string) => {
    const clean = mobile.trim().replace(/\D/g, '');
    const found = farmers.find(f => f.mobile.includes(clean) || clean.includes(f.mobile));
    if (found) {
      setCurrentFarmer(found);
      setCurrentRole('farmer');
      return { success: true, farmer: found };
    }
    return { success: false, message: 'Mobile number not registered. Please register as a new farmer.' };
  };

  const logout = () => {
    setCurrentFarmer(null);
    setCurrentRole('public');
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetAllDataToDefault = () => {
    localStorage.clear();
    setCentres(INITIAL_CENTRES);
    setFarmers(INITIAL_FARMERS);
    setCurrentFarmer(INITIAL_FARMERS[0]);
    setBookings(INITIAL_BOOKINGS);
    setProcurementRecords(INITIAL_PROCUREMENT_RECORDS);
    setPayments(INITIAL_PAYMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      t,
      currentRole,
      setCurrentRole,
      currentFarmer,
      setCurrentFarmer,
      farmers,
      centres,
      bookings,
      procurementRecords,
      payments,
      notifications,
      mspRates: INITIAL_MSP_RATES,
      selectedAdminCentreId,
      setSelectedAdminCentreId,
      smsModalItem,
      setSmsModalItem,
      audioAnnounceEnabled,
      setAudioAnnounceEnabled,
      bookSlot,
      updateBookingStatus,
      recordProcurement,
      updatePaymentStatus,
      updateCentre,
      addCentre,
      registerFarmer,
      loginFarmerByMobile,
      logout,
      markNotificationRead,
      clearAllNotifications,
      playTokenCallSound,
      resetAllDataToDefault
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
