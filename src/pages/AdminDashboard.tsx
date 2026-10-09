import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  CalendarDays, 
  Clock, 
  Scale, 
  IndianRupee, 
  Volume2, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  X, 
  Edit3, 
  BarChart3, 
  FileText,
  Sliders,
  Settings,
  Printer
} from 'lucide-react';
import { Booking, ProcurementCentre, QualityGrade, PaymentStatus } from '../types';
import { ALL_STATES, getDistrictsForState, getStateCode } from '../data/statesAndDistricts';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

interface AdminDashboardProps {
  setCurrentPage: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentPage }) => {
  const { 
    centres, 
    bookings, 
    farmers, 
    procurementRecords, 
    payments, 
    selectedAdminCentreId, 
    setSelectedAdminCentreId,
    updateBookingStatus,
    recordProcurement,
    updatePaymentStatus,
    updateCentre,
    addCentre,
    playTokenCallSound,
    t, 
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'queue' | 'procurement' | 'slots' | 'farmers' | 'payments' | 'analytics'>('queue');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [recordProcurementBooking, setRecordProcurementBooking] = useState<Booking | null>(null);
  const [weightInput, setWeightInput] = useState<number>(75);
  const [bagsInput, setBagsInput] = useState<number>(150);
  const [moistureInput, setMoistureInput] = useState<number>(15.2);
  const [gradeInput, setGradeInput] = useState<QualityGrade>('Grade-A (FAQ)');
  const [officerName, setOfficerName] = useState<string>('K. Venkateshwar Rao');

  // Create centre modal
  const [isAddCentreOpen, setIsAddCentreOpen] = useState(false);
  const [newCentreName, setNewCentreName] = useState('');
  const [newCentreState, setNewCentreState] = useState('Telangana');
  const [newCentreDistrict, setNewCentreDistrict] = useState('Khammam');
  const [newCentreCode, setNewCentreCode] = useState('TS-KMM-PPC-05');
  const [newCentreCapacity, setNewCentreCapacity] = useState(3000);

  const availableDistrictsForNewCentre = getDistrictsForState(newCentreState);

  const handleNewCentreStateChange = (newState: string) => {
    setNewCentreState(newState);
    const dists = getDistrictsForState(newState);
    const dist = dists[0] || '';
    setNewCentreDistrict(dist);
    const stateCd = getStateCode(newState);
    const distCd = dist.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'PPC';
    setNewCentreCode(`${stateCd}-${distCd}-01`);
  };

  const selectedCentre = centres.find(c => c.id === selectedAdminCentreId) || centres[0];
  const centreBookings = bookings.filter(b => b.centreId === selectedCentre.id);

  // Stats
  const totalFarmers = farmers.length + 18450;
  const todayBookings = centreBookings.length;
  const waitingCount = centreBookings.filter(b => b.status === 'Waiting').length;
  const activeWeighing = centreBookings.filter(b => b.status === 'Called' || b.status === 'Procurement in Progress').length;
  const completedToday = centreBookings.filter(b => b.status === 'Completed').length;
  const pendingPayments = payments.filter(p => p.status === 'Processing' || p.status === 'Pending').length;

  // Search filter across farmers and bookings
  const filteredBookings = centreBookings.filter(b => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toUpperCase();
    return (
      b.bookingNumber.toUpperCase().includes(q) ||
      b.farmerName.toUpperCase().includes(q) ||
      b.farmerPhone.includes(q) ||
      b.queueNumber.toString() === q ||
      b.cropType.toUpperCase().includes(q)
    );
  });

  // Call Next Token in Queue
  const handleCallNext = () => {
    const nextWaiting = centreBookings
      .filter(b => b.status === 'Waiting')
      .sort((a, b) => a.queueNumber - b.queueNumber)[0];

    if (nextWaiting) {
      updateBookingStatus(nextWaiting.id, 'Called', { counterNumber: 2 });
    } else {
      // Advance token counter
      const nextTokenNum = selectedCentre.currentActiveToken + 1;
      updateCentre(selectedCentre.id, { currentActiveToken: nextTokenNum });
      playTokenCallSound(nextTokenNum, selectedCentre.name, 2);
    }
  };

  // Submit Procurement Entry
  const handleSubmitProcurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordProcurementBooking) return;

    recordProcurement({
      bookingId: recordProcurementBooking.id,
      actualQuantityQuintals: Number(weightInput),
      bagsCount: Number(bagsInput),
      qualityGrade: gradeInput,
      moisturePercentage: Number(moistureInput),
      officerInCharge: officerName
    });

    setRecordProcurementBooking(null);
  };

  // Create new centre handler
  const handleCreateCentre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCentreName.trim()) return;

    const stateCd = getStateCode(newCentreState);
    const distCd = newCentreDistrict.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'PPC';
    const finalCode = newCentreCode.trim() || `${stateCd}-${distCd}-01`;

    addCentre({
      name: newCentreName.trim(),
      teluguName: newCentreName.trim(),
      code: finalCode,
      state: newCentreState,
      district: newCentreDistrict,
      mandal: `${newCentreDistrict} APMC Headquarters`,
      address: `Main APMC Yard Campus, ${newCentreDistrict}, ${newCentreState}`,
      contactPerson: 'Mandi Secretary & Procurement Manager',
      contactPhone: '+91 94400 00000',
      activeCrops: ['Paddy (Grade A / Fine)', 'Cotton (Long Staple)', 'Maize (Corn)', 'Paddy (Common)'],
      dailyCapacityQuintals: Number(newCentreCapacity),
      totalSlotsPerDay: 4,
      maxFarmersPerSlot: 15,
      status: 'Active',
      operatingHours: '08:30 AM - 05:30 PM',
      countersCount: 3,
    });

    setIsAddCentreOpen(false);
    setNewCentreName('');
  };

  // Chart data
  const cropAnalyticsData = [
    { name: 'Paddy Grade A', quintals: 1850, amountLakh: 42.9 },
    { name: 'Paddy Common', quintals: 1420, amountLakh: 32.6 },
    { name: 'Cotton Staple', quintals: 860, amountLakh: 64.6 },
    { name: 'Maize', quintals: 950, amountLakh: 21.1 },
    { name: 'Red Gram', quintals: 420, amountLakh: 31.7 },
  ];

  const hourlyQueueData = [
    { time: '08:00 AM', vehicles: 12 },
    { time: '10:00 AM', vehicles: 28 },
    { time: '12:00 PM', vehicles: 35 },
    { time: '02:00 PM', vehicles: 22 },
    { time: '04:00 PM', vehicles: 18 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner with Centre Switcher */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold bg-amber-500 text-stone-950 px-2.5 py-0.5 rounded uppercase tracking-wider">
              Procurement Officer Console
            </span>
            <span className="text-xs text-stone-400">Authenticated Staff Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {t.adminConsole}
          </h1>
          <p className="text-xs text-stone-400">
            Real-time queue sequencing, weighing recording, and DBT treasury clearance
          </p>
        </div>

        {/* Managing Centre Selector */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="space-y-1">
            <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
              {t.switchCentre}:
            </span>
            <select
              value={selectedAdminCentreId}
              onChange={(e) => setSelectedAdminCentreId(e.target.value)}
              className="px-3.5 py-2 bg-stone-800 border border-stone-700 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500"
            >
              {centres.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.district}{c.state ? `, ${c.state}` : ''})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsAddCentreOpen(true)}
            className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors self-end sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Centre</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold block">{t.statsFarmersServed}</span>
          <p className="text-xl font-black text-stone-900 font-mono mt-1">{totalFarmers.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold block">{t.todayAppointments}</span>
          <p className="text-xl font-black text-stone-900 font-mono mt-1">{todayBookings}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold block">{t.activeInQueue}</span>
          <p className="text-xl font-black text-amber-700 font-mono mt-1">{waitingCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold block">{t.inProcurement}</span>
          <p className="text-xl font-black text-blue-700 font-mono mt-1">{activeWeighing}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold block">{t.completedToday}</span>
          <p className="text-xl font-black text-emerald-800 font-mono mt-1">{completedToday}</p>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] text-stone-500 uppercase font-semibold block">{t.pendingPayouts}</span>
          <p className="text-xl font-black text-purple-800 font-mono mt-1">{pendingPayments}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex bg-stone-200 p-1 rounded-2xl max-w-2xl overflow-x-auto">
        {[
          { id: 'queue', label: 'Live Queue Manager' },
          { id: 'procurement', label: 'Procurement Records' },
          { id: 'slots', label: 'Centre & Slots' },
          { id: 'payments', label: 'DBT Approvals' },
          { id: 'analytics', label: 'Analytics' },
          { id: 'farmers', label: 'Farmer Search' },
        ].map(tb => (
          <button
            key={tb.id}
            onClick={() => setActiveTab(tb.id as typeof activeTab)}
            className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
              activeTab === tb.id 
                ? 'bg-white text-stone-900 shadow-xs' 
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LIVE QUEUE CONTROLLER */}
      {activeTab === 'queue' && (
        <div className="space-y-6">
          {/* Action controller bar */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="bg-stone-900 text-white px-5 py-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase tracking-widest text-stone-400 block font-bold">{t.currentlyServing}</span>
                <span className="text-3xl font-black font-mono text-amber-400">
                  #{selectedCentre.currentActiveToken}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base">{selectedCentre.name}</h3>
                <p className="text-xs text-stone-500">
                  Counters Active: {selectedCentre.countersCount} • Capacity: {selectedCentre.dailyCapacityQuintals} Qtl/Day
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                id="admin-call-next-btn"
                onClick={handleCallNext}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl font-extrabold text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.callNextToken}</span>
              </button>

              <button
                onClick={() => playTokenCallSound(selectedCentre.currentActiveToken, selectedCentre.name, 2)}
                className="p-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl border border-stone-300"
                title="Play Audio Chime"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by farmer name, token #, phone, booking ID..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-stone-300 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-emerald-600 shadow-xs"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          </div>

          {/* Queue Bookings Table */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 uppercase font-semibold text-[10px]">
                    <th className="py-3 px-3">Token #</th>
                    <th className="py-3 px-3">Booking Ref</th>
                    <th className="py-3 px-3">Farmer Details</th>
                    <th className="py-3 px-3">Crop & Quantity</th>
                    <th className="py-3 px-3">Slot Time</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-stone-50 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="font-mono text-sm font-black text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-lg">
                          #{b.queueNumber}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-stone-800">
                        {b.bookingNumber}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-stone-900">{b.farmerName}</span>
                        <p className="text-[10px] text-stone-500">{b.farmerPhone}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-stone-800">{b.cropType}</span>
                        <p className="text-[10px] text-stone-500">{b.estimatedQuantityQuintals} Qtl</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="text-stone-700">{b.slotTime}</span>
                        <p className="text-[10px] text-stone-400">{b.slotDate}</p>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                          b.status === 'Called' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                            : b.status === 'Procurement in Progress' 
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : b.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : b.status === 'Waiting'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right space-x-1 whitespace-nowrap">
                        {b.status === 'Booked' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Waiting')}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-[11px] font-bold"
                          >
                            Mark Waiting
                          </button>
                        )}

                        {b.status === 'Waiting' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Called', { counterNumber: 2 })}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg text-[11px] font-bold"
                          >
                            Call Token
                          </button>
                        )}

                        {b.status === 'Called' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'Procurement in Progress')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold"
                          >
                            Start Weighing
                          </button>
                        )}

                        {(b.status === 'Procurement in Progress' || b.status === 'Called') && (
                          <button
                            onClick={() => {
                              setRecordProcurementBooking(b);
                              setWeightInput(b.estimatedQuantityQuintals);
                              setBagsInput(Math.round(b.estimatedQuantityQuintals * 2));
                            }}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold"
                          >
                            Record Slip
                          </button>
                        )}

                        {b.status !== 'Completed' && b.status !== 'Cancelled' && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Cancel booking ${b.bookingNumber}?`)) {
                                updateBookingStatus(b.id, 'Cancelled');
                              }
                            }}
                            className="px-2 py-1 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-medium"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROCUREMENT RECORDS */}
      {activeTab === 'procurement' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900">Official Procurement Slips</h2>
            <span className="text-xs font-mono text-stone-500">{procurementRecords.length} Slips Generated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                  <th className="py-3 px-3">Slip #</th>
                  <th className="py-3 px-3">Farmer</th>
                  <th className="py-3 px-3">Crop</th>
                  <th className="py-3 px-3">Weight (Qtl)</th>
                  <th className="py-3 px-3">Moisture</th>
                  <th className="py-3 px-3">Grade</th>
                  <th className="py-3 px-3">Net Payout (₹)</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Print</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {procurementRecords.map(pr => (
                  <tr key={pr.id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-900">{pr.weighingSlipNumber}</td>
                    <td className="py-3.5 px-3 font-bold text-stone-800">{pr.farmerName}</td>
                    <td className="py-3.5 px-3">{pr.cropType}</td>
                    <td className="py-3.5 px-3 font-mono font-bold">{pr.actualQuantityQuintals} Qtl</td>
                    <td className="py-3.5 px-3 font-mono">{pr.moisturePercentage}%</td>
                    <td className="py-3.5 px-3">
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {pr.qualityGrade}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-black text-emerald-900">
                      ₹{pr.netPayableAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-3 text-stone-500">{pr.procurementDate}</td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => window.print()}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                        title="Print Slip"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CENTRE & SLOTS CONFIGURATION */}
      {activeTab === 'slots' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-bold text-stone-900">Centre Operating Capacity & Slot Rules</h2>
                <p className="text-xs text-stone-500">Configure daily limits, slot batch size, and temporary closures</p>
              </div>
              <span className="font-mono text-xs font-bold bg-stone-100 text-stone-800 px-3 py-1 rounded-lg">
                Code: {selectedCentre.code}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Max Farmers Per Slot
                </label>
                <input
                  type="number"
                  min={5}
                  max={50}
                  value={selectedCentre.maxFarmersPerSlot}
                  onChange={(e) => updateCentre(selectedCentre.id, { maxFarmersPerSlot: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-stone-500">Prevents yard congestion during peak hours.</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Daily Capacity (Quintals)
                </label>
                <input
                  type="number"
                  min={500}
                  max={10000}
                  step={100}
                  value={selectedCentre.dailyCapacityQuintals}
                  onChange={(e) => updateCentre(selectedCentre.id, { dailyCapacityQuintals: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-sm font-mono font-bold"
                />
                <p className="text-[11px] text-stone-500">Maximum grain acceptance per business day.</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Centre Status
                </label>
                <select
                  value={selectedCentre.status}
                  onChange={(e) => updateCentre(selectedCentre.id, { status: e.target.value as typeof selectedCentre.status })}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                >
                  <option value="Active">Active (Open for Booking)</option>
                  <option value="Temporarily Closed">Temporarily Closed</option>
                  <option value="Maintenance">Maintenance / Holiday</option>
                </select>
                <p className="text-[11px] text-stone-500">Close centre for rain or godown full situations.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DBT PAYMENTS APPROVAL */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <h2 className="text-xl font-bold text-stone-900">Direct Benefit Transfer (DBT) Approvals</h2>
              <p className="text-xs text-stone-500">Authorize payments to farmer bank accounts via PFMS Treasury</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                  <th className="py-3 px-3">Booking Ref</th>
                  <th className="py-3 px-3">Farmer Name</th>
                  <th className="py-3 px-3">Amount (₹)</th>
                  <th className="py-3 px-3">Bank Details</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Ref #</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {payments.map(pay => (
                  <tr key={pay.id} className="hover:bg-stone-50">
                    <td className="py-3.5 px-3 font-mono font-bold text-stone-900">{pay.bookingNumber}</td>
                    <td className="py-3.5 px-3 font-bold text-stone-800">{pay.farmerName}</td>
                    <td className="py-3.5 px-3 font-mono font-black text-sm">₹{pay.amount.toLocaleString('en-IN')}</td>
                    <td className="py-3.5 px-3 font-mono text-stone-600">{pay.bankName} (Ending {pay.bankAccountLast4})</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        pay.status === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-stone-500 text-[11px]">{pay.transactionRefNumber || 'Pending'}</td>
                    <td className="py-3.5 px-3 text-right">
                      {pay.status !== 'Paid' ? (
                        <button
                          onClick={() => updatePaymentStatus(pay.id, 'Paid')}
                          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs"
                        >
                          Approve DBT Payout
                        </button>
                      ) : (
                        <span className="text-emerald-700 font-bold text-xs">Cleared</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ANALYTICS & VISUAL REPORTS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Volume by Crop */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200">
              <h3 className="font-bold text-stone-900 text-base mb-4 flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>Procurement Volume by Crop (Quintals)</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={cropAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="quintals" fill="#047857" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Hourly Queue Load */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-200">
              <h3 className="font-bold text-stone-900 text-base mb-4 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Peak Queue Arrival Curve (Vehicles Checked-In)</span>
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={hourlyQueueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="vehicles" stroke="#d97706" fill="#fef3c7" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: FARMER DIRECTORY & SEARCH */}
      {activeTab === 'farmers' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-xl font-bold text-stone-900">Registered Farmers Directory</h2>
            <span className="text-xs text-stone-500 font-mono">{farmers.length} Registered</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {farmers.map(f => (
              <div key={f.id} className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-white text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                    {f.farmerId}
                  </span>
                  <span className="text-xs text-stone-500">Reg: {f.registeredDate}</span>
                </div>
                <h4 className="font-bold text-stone-900 text-sm">{f.name}</h4>
                <p className="text-xs text-stone-500">
                  {f.village}, {f.mandal}, {f.district} • Mobile: <strong>{f.mobile}</strong>
                </p>
                <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-600">
                  <span>Bank: {f.bankDetails.bankName} (A/C: *{f.bankDetails.accountNo.slice(-4)})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: RECORD PROCUREMENT & WEIGHING SLIP */}
      {recordProcurementBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-black text-stone-900">Electronic Weighbridge Entry</h3>
                <p className="text-xs text-stone-500">Booking: {recordProcurementBooking.bookingNumber} • Token #{recordProcurementBooking.queueNumber}</p>
              </div>
              <button
                onClick={() => setRecordProcurementBooking(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProcurement} className="space-y-4">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
                <p className="text-stone-500">Farmer: <strong className="text-stone-900">{recordProcurementBooking.farmerName}</strong></p>
                <p className="text-stone-500">Crop: <strong className="text-stone-900">{recordProcurementBooking.cropType}</strong></p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Actual Weight (Qtl) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightInput}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setWeightInput(val);
                      setBagsInput(Math.round(val * 2));
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-mono font-bold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Bag Count (50kg)
                  </label>
                  <input
                    type="number"
                    value={bagsInput}
                    onChange={(e) => setBagsInput(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Moisture % (Sensor)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moistureInput}
                    onChange={(e) => setMoistureInput(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Quality Grade
                  </label>
                  <select
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value as QualityGrade)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs font-bold"
                  >
                    <option value="Grade-A (FAQ)">Grade-A (FAQ Standard)</option>
                    <option value="Grade-B">Grade-B</option>
                    <option value="Re-cleaning Required">Re-cleaning Required</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Procurement Inspector Name
                </label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-xs"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setRecordProcurementBooking(null)}
                  className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Issue Slip & Authorize DBT</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW PROCUREMENT CENTRE */}
      {isAddCentreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="text-lg font-black text-stone-900">Add Procurement Centre</h3>
              <button onClick={() => setIsAddCentreOpen(false)} className="p-1 text-stone-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCentre} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Centre Name *</label>
                <input
                  type="text"
                  value={newCentreName}
                  onChange={(e) => setNewCentreName(e.target.value)}
                  placeholder="e.g. Madhira PACS Purchase Centre"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">State / UT *</label>
                  <select
                    value={newCentreState}
                    onChange={(e) => handleNewCentreStateChange(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
                  >
                    {ALL_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">District *</label>
                  <select
                    value={newCentreDistrict}
                    onChange={(e) => {
                      setNewCentreDistrict(e.target.value);
                      const stateCd = getStateCode(newCentreState);
                      const distCd = e.target.value.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'PPC';
                      setNewCentreCode(`${stateCd}-${distCd}-01`);
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium"
                  >
                    {availableDistrictsForNewCentre.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Centre Code</label>
                  <input
                    type="text"
                    value={newCentreCode}
                    onChange={(e) => setNewCentreCode(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">Daily Capacity (Quintals)</label>
                  <input
                    type="number"
                    value={newCentreCapacity}
                    onChange={(e) => setNewCentreCapacity(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddCentreOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Create Centre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
