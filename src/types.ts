export type Language = 'en' | 'te';

export type BookingStatus = 
  | 'Booked' 
  | 'Waiting' 
  | 'Called' 
  | 'Procurement in Progress' 
  | 'Completed' 
  | 'Cancelled';

export type QualityGrade = 
  | 'Grade-A (FAQ)' 
  | 'Grade-B' 
  | 'Re-cleaning Required';

export type ProcurementStage = 
  | 'Slot Confirmed'
  | 'Gate Entry & Waiting'
  | 'Moisture & Quality Inspection' 
  | 'Weighbridge Measurement' 
  | 'Procurement Inward Entry' 
  | 'Completed & Slip Generated';

export type PaymentStatus = 'Pending' | 'Processing' | 'Paid';

export interface CropInfo {
  name: string;
  teluguName: string;
  variety: string;
  acreAge: number;
  estYieldQuintals: number;
}

export interface BankDetails {
  accountNo: string;
  ifsc: string;
  bankName: string;
  accountHolderName: string;
}

export interface Farmer {
  id: string;
  name: string;
  teluguName?: string;
  mobile: string;
  farmerId: string; // e.g. AP-FMR-2024-8831
  aadharLast4: string;
  village: string;
  mandal: string;
  district: string;
  state: string;
  crops: CropInfo[];
  bankDetails: BankDetails;
  registeredDate: string;
}

export interface ProcurementCentre {
  id: string;
  name: string;
  teluguName: string;
  code: string;
  state: string;
  district: string;
  mandal: string;
  address: string;
  contactPerson: string;
  contactPhone: string;
  activeCrops: string[];
  dailyCapacityQuintals: number;
  totalSlotsPerDay: number;
  maxFarmersPerSlot: number;
  status: 'Active' | 'Temporarily Closed' | 'Maintenance';
  currentActiveToken: number;
  operatingHours: string;
  countersCount: number;
}

export interface TimeSlot {
  id: string;
  timeRange: string;
}

export interface Booking {
  id: string;
  bookingNumber: string; // e.g. SP-2024-94821
  queueNumber: number; // e.g. 104
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerDistrict: string;
  farmerState?: string;
  centreId: string;
  centreName: string;
  slotDate: string; // YYYY-MM-DD
  slotTime: string; // e.g. 09:00 AM - 11:00 AM
  cropType: string;
  estimatedQuantityQuintals: number;
  mspRatePerQuintal?: number;
  estimatedAmount?: number;
  status: BookingStatus;
  bookedAt: string;
  checkInTime?: string;
  calledTime?: string;
  completedTime?: string;
  counterNumber?: number;
  estimatedWaitMinutes?: number;
  remarks?: string;
}

export interface ProcurementRecord {
  id: string;
  bookingId: string;
  bookingNumber: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  centreId: string;
  centreName: string;
  cropType: string;
  actualQuantityQuintals: number;
  bagsCount: number;
  qualityGrade: QualityGrade;
  moisturePercentage: number;
  mspRatePerQuintal: number;
  grossAmount: number;
  deductions: number;
  netPayableAmount: number;
  procurementDate: string;
  currentStage: ProcurementStage;
  weighingSlipNumber: string;
  officerInCharge: string;
  status: 'In Progress' | 'Completed' | 'Rejected';
}

export interface PaymentRecord {
  id: string;
  procurementId: string;
  bookingId: string;
  bookingNumber: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  cropType: string;
  quantityQuintals: number;
  amount: number;
  status: PaymentStatus;
  initiatedDate: string;
  paidDate?: string;
  transactionRefNumber?: string;
  bankAccountLast4: string;
  bankName: string;
  paymentMode: string;
}

export interface NotificationItem {
  id: string;
  farmerId?: string; // or 'all'
  farmerPhone?: string;
  title: string;
  titleTelugu?: string;
  message: string;
  messageTelugu?: string;
  type: 'booking' | 'queue' | 'procurement' | 'payment' | 'system';
  timestamp: string;
  isRead: boolean;
  smsSent: boolean;
  actionUrl?: string;
}

export interface MspRate {
  crop: string;
  cropTelugu: string;
  ratePerQuintal: number;
  season: string;
  faqMoistureLimit: number;
  category?: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Commercial' | 'Millets';
  marketModalPrice?: number;
  marketMinPrice?: number;
  marketMaxPrice?: number;
  previousYearRate?: number;
  stateBonus?: string;
  description?: string;
}
