import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sprout, 
  CalendarDays, 
  Clock, 
  Scale, 
  IndianRupee, 
  Bell, 
  ShieldCheck, 
  User, 
  Menu, 
  X, 
  Volume2, 
  VolumeX, 
  Globe, 
  Search,
  LogOut,
  LayoutDashboard,
  Tag
} from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  onOpenQuickSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  setCurrentPage, 
  onOpenQuickSearch 
}) => {
  const { 
    language, 
    setLanguage, 
    t, 
    currentRole, 
    setCurrentRole, 
    currentFarmer, 
    logout, 
    notifications,
    audioAnnounceEnabled,
    setAudioAnnounceEnabled
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead && (currentRole !== 'farmer' || !currentFarmer || n.farmerId === currentFarmer.id)).length;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'te' : 'en');
  };

  const navItems = [
    { id: 'landing', label: t.navHome, icon: Sprout },
    { id: 'prices', label: t.navPrices, icon: Tag },
    { id: 'book-slot', label: t.navBookSlot, icon: CalendarDays },
    { id: 'live-queue', label: t.navLiveQueue, icon: Clock },
    { id: 'procurement', label: t.navProcurement, icon: Scale },
    { id: 'payments', label: t.navPayments, icon: IndianRupee },
    { id: 'notifications', label: t.navNotifications, icon: Bell, badge: unreadCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Ministry Banner */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium tracking-wide truncate">
              {t.govBadge}
            </span>
          </div>
          <div className="flex items-center space-x-3 shrink-0 text-[11px]">
            <span className="hidden md:inline text-emerald-200">
              Toll-Free Kisan Call Centre: <strong className="text-white">1800-425-0000</strong>
            </span>
            <button
              id="header-lang-toggle-btn"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-0.5 rounded font-medium transition-colors border border-emerald-700"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <div 
            id="brand-logo-btn"
            onClick={() => setCurrentPage('landing')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-emerald-950">
                  SmartProcure
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                  Gov Portal
                </span>
              </div>
              <p className="text-[11px] text-stone-700 font-medium line-clamp-1">
                {language === 'te' ? 'రైతు ధాన్యం కొనుగోలు & క్యూ నిర్వహణ' : 'Farmer Procurement & Queue System'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-800 shadow-xs' 
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Access Crop Price Button */}
            <button
              id="open-prices-nav-btn"
              onClick={() => setCurrentPage('prices')}
              className={`flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer shadow-2xs ${
                currentPage === 'prices'
                  ? 'bg-emerald-700 text-white border-emerald-800'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
              }`}
              title="Access Official MSP & Mandi Rates"
            >
              <IndianRupee className={`w-3.5 h-3.5 ${currentPage === 'prices' ? 'text-amber-300' : 'text-amber-700'}`} />
              <span>{language === 'te' ? 'ధరల పరిశీలన' : 'Access Price'}</span>
            </button>

            {/* Quick Track Search Button */}
            <button
              id="open-quick-search-nav-btn"
              onClick={onOpenQuickSearch}
              className="flex items-center space-x-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1.5 rounded-lg border border-stone-200 transition-colors cursor-pointer"
              title="Track Token or Booking"
            >
              <Search className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">{t.quickTrack}</span>
            </button>

            {/* Audio announcement speaker toggle */}
            <button
              id="toggle-audio-announce-btn"
              onClick={() => setAudioAnnounceEnabled(!audioAnnounceEnabled)}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                audioAnnounceEnabled 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                  : 'bg-stone-100 border-stone-200 text-stone-400'
              }`}
              title={audioAnnounceEnabled ? 'Voice Queue Announcements: ON' : 'Voice Queue Announcements: MUTED'}
            >
              {audioAnnounceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Role switch / Admin button */}
            {currentRole === 'admin' ? (
              <button
                id="active-admin-badge-btn"
                onClick={() => setCurrentPage('admin')}
                className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Staff</span>
              </button>
            ) : (
              <button
                id="switch-to-admin-portal-btn"
                onClick={() => {
                  setCurrentRole('admin');
                  setCurrentPage('admin');
                }}
                className="hidden sm:flex items-center space-x-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-300 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>{t.navAdmin}</span>
              </button>
            )}

            {/* Farmer Profile / Login */}
            {currentFarmer ? (
              <div className="relative">
                <button
                  id="farmer-profile-menu-btn"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
                    {currentFarmer.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-bold leading-tight truncate max-w-[110px]">
                      {currentFarmer.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-emerald-700 font-mono">
                      {currentFarmer.farmerId.split('-').slice(0, 2).join('-')}
                    </p>
                  </div>
                </button>

                {/* Profile dropdown */}
                {isProfileMenuOpen && (
                  <div 
                    id="farmer-profile-dropdown"
                    className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in"
                  >
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs text-stone-500">{t.farmerName}</p>
                      <p className="text-sm font-bold text-stone-900">{currentFarmer.name}</p>
                      <p className="text-xs text-emerald-700 font-mono mt-0.5">{currentFarmer.farmerId}</p>
                      <p className="text-xs text-stone-500">{currentFarmer.village}, {currentFarmer.district}</p>
                    </div>

                    <div className="py-1">
                      <button
                        id="dropdown-farmer-dashboard-btn"
                        onClick={() => {
                          setCurrentPage('farmer-dashboard');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center space-x-2"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5 text-stone-500" />
                        <span>{t.navDashboard}</span>
                      </button>

                      <button
                        id="dropdown-farmer-book-slot-btn"
                        onClick={() => {
                          setCurrentPage('book-slot');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center space-x-2"
                      >
                        <CalendarDays className="w-3.5 h-3.5 text-stone-500" />
                        <span>{t.navBookSlot}</span>
                      </button>

                      <button
                        id="dropdown-switch-admin-btn"
                        onClick={() => {
                          setCurrentRole('admin');
                          setCurrentPage('admin');
                          setIsProfileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center space-x-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>{t.navAdmin}</span>
                      </button>
                    </div>

                    <div className="border-t border-stone-100 pt-1">
                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          logout();
                          setIsProfileMenuOpen(false);
                          setCurrentPage('landing');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t.logout}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="login-register-nav-btn"
                onClick={() => setCurrentPage('farmer-auth')}
                className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </button>
            )}

            {/* Mobile hamburger menu toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg"
        >
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-800' 
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="border-t border-stone-200 pt-2 mt-2">
            <button
              id="mobile-admin-switch-btn"
              onClick={() => {
                setCurrentRole('admin');
                setCurrentPage('admin');
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-bold text-amber-700 hover:bg-amber-50"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <span>{t.navAdmin}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
