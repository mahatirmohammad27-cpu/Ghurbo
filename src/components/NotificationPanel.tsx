import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationPanelProps {
  notifications: Notification[];
  dismissNotification: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationPanel({
  notifications,
  dismissNotification,
  isOpen,
  onClose
}: NotificationPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-49 bg-black/10" onClick={onClose} />
          
          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 w-80 bg-cream/95 backdrop-blur-xl rounded-2xl shadow-xl border border-ocean/15 p-4 max-h-[400px] overflow-y-auto"
          >
            <div className="flex justify-between items-center pb-2 border-b border-ocean/10 mb-3">
              <span className="serif font-bold text-xs text-ocean flex items-center gap-1.5">
                <Bell size={14} className="text-ocean" />
                Live Notification Log
              </span>
              <button onClick={onClose} className="text-ocean/55 hover:text-ocean cursor-pointer">
                <X size={15} />
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="text-center py-8 text-ocean/50 text-xs font-medium space-y-1">
                <p className="serif italic">Logs are peaceful.</p>
                <p className="text-[10px] text-ocean/50 font-light">Notifications will trigger during traveler stays.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-white/70 border border-ocean/5 relative group text-xs text-ocean/80"
                  >
                    <button
                      onClick={() => dismissNotification(item.id)}
                      className="absolute top-2 right-2 text-ocean/30 hover:text-ocean opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                    <p className="font-bold text-ocean pr-4">{item.title}</p>
                    <p className="text-ocean/70 mt-1 leading-relaxed font-light">{item.message}</p>
                    <span className="text-[9px] text-ocean/45 block mt-1.5 font-mono">{item.timestamp}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
