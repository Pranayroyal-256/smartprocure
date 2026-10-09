import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bell, 
  CalendarDays, 
  Clock, 
  Scale, 
  IndianRupee, 
  CheckCircle2, 
  MessageSquare, 
  Trash2, 
  Smartphone,
  CheckCheck
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsPageProps {
  setCurrentPage: (page: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ setCurrentPage }) => {
  const { 
    notifications, 
    markNotificationRead, 
    clearAllNotifications, 
    setSmsModalItem,
    currentFarmer, 
    t, 
    language 
  } = useApp();

  const [filter, setFilter] = useState<'all' | 'queue' | 'booking' | 'payment' | 'procurement'>('all');

  // Filter notifications for this farmer
  const farmerNotifications = notifications.filter(n => 
    !currentFarmer || !n.farmerId || n.farmerId === currentFarmer.id
  );

  const filtered = farmerNotifications.filter(n => {
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'queue':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'booking':
        return <CalendarDays className="w-4 h-4 text-emerald-600" />;
      case 'payment':
        return <IndianRupee className="w-4 h-4 text-purple-600" />;
      case 'procurement':
        return <Scale className="w-4 h-4 text-blue-600" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              In-App & Telecom SMS Gateways
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
            {language === 'te' ? 'రైతు సందేశాలు & హెచ్చరికలు' : 'Notifications & SMS Alerts'}
          </h1>
          <p className="text-xs text-stone-500">
            {language === 'te' 
              ? 'టోకెన్ పిలుపులు, స్లాట్ ధృవీకరణలు మరియు బ్యాంక్ చెల్లింపు సందేశాలు' 
              : 'Real-time booking updates, queue alerts, and DBT payment confirmations'}
          </p>
        </div>

        {farmerNotifications.length > 0 && (
          <button
            onClick={clearAllNotifications}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5 text-stone-500" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'queue', 'booking', 'procurement', 'payment'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === tab 
                ? 'bg-emerald-800 text-white shadow-xs' 
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {tab === 'all' ? 'All Alerts' : tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(notif => {
            const title = language === 'te' && notif.titleTelugu ? notif.titleTelugu : notif.title;
            const message = language === 'te' && notif.messageTelugu ? notif.messageTelugu : notif.message;

            return (
              <div
                key={notif.id}
                onClick={() => markNotificationRead(notif.id)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                  notif.isRead 
                    ? 'bg-white border-stone-200 hover:bg-stone-50' 
                    : 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      notif.isRead ? 'bg-stone-100' : 'bg-emerald-100'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-stone-900 text-sm">{title}</h3>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">{message}</p>
                      
                      <div className="flex items-center space-x-3 mt-2 text-[11px] text-stone-400">
                        <span>{notif.timestamp}</span>
                        {notif.smsSent && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSmsModalItem(notif);
                            }}
                            className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center space-x-1"
                          >
                            <Smartphone className="w-3 h-3" />
                            <span>Preview SMS</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-stone-400 shrink-0">
                    {notif.type.toUpperCase()}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
            <Bell className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-700">No Notifications</p>
            <p className="text-xs text-stone-400 mt-1">
              You will receive automated updates for your booking, queue tokens, and payments here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
