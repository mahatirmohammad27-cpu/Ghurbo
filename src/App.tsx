import React, { useState, useEffect } from 'react';
import { UserProfile, Listing, Booking } from './types';
import { INITIAL_LISTINGS, MOCK_NOTIFICATIONS } from './data';
import AuthScreens from './components/AuthScreens';
import TravelerPortal from './components/TravelerPortal';
import EntrepreneurPortal from './components/EntrepreneurPortal';
import NotificationPanel from './components/NotificationPanel';
import { Bell, Eye, EyeOff, Info } from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
}

export default function App() {
  // Sync state with localstorage to guarantee seamless hot-rebuild preservation
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('ghurbo_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('ghurbo_dark_mode');
    return saved === 'true';
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('ghurbo_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('ghurbo_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('ghurbo_notifications');
    return saved ? JSON.parse(saved) : MOCK_NOTIFICATIONS;
  });

  const [notifOpen, setNotifOpen] = useState(false);
  const [showSandboxHelper, setShowSandboxHelper] = useState(true);

  // Sync to localstorage on change
  useEffect(() => {
    localStorage.setItem('ghurbo_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('ghurbo_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('ghurbo_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('ghurbo_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-register service helper when entrepreneur signs up or logs in
  const autoRegisterService = (user: UserProfile, currentListings: Listing[]) => {
    if (user.role === 'entrepreneur' && user.isOnboarded && user.onboardingData) {
      const alreadyHasListing = currentListings.some(l => l.entrepreneurId === user.id);
      if (!alreadyHasListing) {
        const images: Record<string, string> = {
          hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          transport: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
          restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
          guide: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
          package: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
        };

        const defaultListing: Listing = {
          id: 'l_ent_auto_' + Math.floor(Math.random() * 10000),
          entrepreneurId: user.id,
          title: user.onboardingData.businessName,
          description: user.onboardingData.businessDesc || `Premium authentic tourism services by ${user.onboardingData.businessName}. Get ready to explore.`,
          price: user.onboardingData.category === 'hotel' ? 7500 : user.onboardingData.category === 'restaurant' ? 750 : 2500,
          category: user.onboardingData.category,
          destination: (user.onboardingData.location || "Sajek") as any,
          imageUrl: images[user.onboardingData.category] || images.hotel,
          rating: 4.9,
          ratingCount: 8,
          availability: true,
          contactNumber: user.onboardingData.contactInfo || '+8801700100200',
          specifications: [
            { label: 'Business Type', value: user.onboardingData.category.toUpperCase() },
            { label: 'Service Style', value: user.onboardingData.faqServiceType || 'Premium Verified' },
            { label: 'Host Experience', value: `${user.onboardingData.yearsOperating || 2} Years` }
          ]
        };

        setListings(prev => {
          const updated = [defaultListing, ...prev];
          localStorage.setItem('ghurbo_listings', JSON.stringify(updated));
          return updated;
        });

        setTimeout(() => {
          addNotification(
            'Service Auto-Registered 🚀', 
            `Your business "${user.onboardingData?.businessName}" is automatically active in the ${user.onboardingData?.category}s section for travelers!`
          );
        }, 300);
      }
    }
  };

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem('ghurbo_user', JSON.stringify(user));
    addNotification('Authentication Successful', `Logged in as ${user.name} (${user.role === 'traveler' ? 'Explore Mode' : 'Partner Dashboard'})`);
    autoRegisterService(user, listings);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ghurbo_user');
  };

  // Helper to append dynamic toast feeds
  const addNotification = (title: string, message: string) => {
    const item: NotificationItem = {
      id: 'notif_' + Math.floor(Math.random() * 1000000),
      title,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [item, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simple sandbox simulation helper so reviewer can jump roles easily
  const forceSwitchRole = () => {
    if (!currentUser) return;
    const targetRole = currentUser.role === 'traveler' ? 'entrepreneur' : 'traveler';
    const updated: UserProfile = {
      ...currentUser,
      role: targetRole,
      name: targetRole === 'traveler' ? 'Mahatir Mohammad' : 'Mike George',
      email: targetRole === 'traveler' ? 'mahatirmohammad27@gmail.com' : 'partner@ghurbo.com',
      isOnboarded: true,
      onboardingData: targetRole === 'entrepreneur' ? {
        businessName: 'Bengal Luxe Retreats',
        businessDesc: 'Special boutique and luxury accommodation provider in Bangladesh.',
        category: 'hotel',
        yearsOperating: 4,
        contactInfo: '+8801824141511',
        location: 'Cox_s Bazar',
        faqServiceType: 'Beachfront cottages and private pools'
      } : undefined
    };
    setCurrentUser(updated);
    localStorage.setItem('ghurbo_user', JSON.stringify(updated));
    addNotification('Developer Sandbox Mode', `Quick role switched to ${targetRole}. Try booking items and checking logs!`);
    
    if (targetRole === 'entrepreneur') {
      autoRegisterService(updated, listings);
    }
  };

  return (
    <div className="font-sans antialiased min-h-screen bg-cream dark:bg-[#041421] text-ocean dark:text-[#f3efea] transition-colors duration-300">
      
      {/* Dynamic Sandbox Role switcher - Helps testing seamlessly */}
      {currentUser && showSandboxHelper && (
        <div className="fixed top-20 left-4 right-4 sm:right-auto z-50 bg-white/95 dark:bg-[#0a2337]/95 backdrop-blur-md p-2.5 sm:p-3.5 rounded-2xl shadow-xl border border-gray-150 dark:border-ocean/30 max-w-xs text-xs space-y-2 animate-in fade-in slide-in-from-top-4 sm:slide-in-from-left-4 transition-all">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-ocean/20 pb-1.5">
            <span className="font-extrabold text-gray-900 dark:text-cream flex items-center gap-1 text-[11px]">
              🛠️ Sandbox Tools
            </span>
            <button 
              onClick={() => setShowSandboxHelper(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-cream font-bold text-[10px] uppercase tracking-wider px-1"
            >
              Hide
            </button>
          </div>
          <p className="hidden sm:block text-[10px] text-gray-450 dark:text-cream/60 leading-relaxed">
            Switch positions to verify that dynamic entrepreneur services propagate directly straight to specific sections for travelers! Try adding a <b>Restaurant</b>; it instantly updates on the traveler side under the <b>Restaurants</b> section.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={forceSwitchRole}
              className="bg-gray-901 hover:bg-black bg-ocean hover:bg-ocean/90 dark:bg-ocean/60 dark:hover:bg-ocean text-white text-[10px] font-bold py-1.5 px-2.5 rounded-xl flex-grow transition-colors"
            >
              Switch to {currentUser.role === 'traveler' ? 'Entrepreneur' : 'Traveler'}
            </button>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="bg-gray-100 dark:bg-[#122e44] hover:bg-gray-200 dark:hover:bg-[#193d5a] text-gray-700 dark:text-cream font-bold px-2 py-1.5 rounded-xl text-[10px] flex items-center gap-1 relative"
            >
              <Bell size={11} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Re-opener for sandbox controls */}
      {currentUser && !showSandboxHelper && (
        <button
          onClick={() => setShowSandboxHelper(true)}
          className="fixed bottom-24 left-4 z-50 bg-gray-900/90 dark:bg-[#0a2337]/90 text-white p-2.5 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all w-9 h-9 flex items-center justify-center text-xs"
          title="Show Sandbox Tools"
        >
          ⚙️
        </button>
      )}

      {/* Render correct Portal layout */}
      {!currentUser ? (
        <AuthScreens onLoginSuccess={handleLoginSuccess} />
      ) : currentUser.role === 'traveler' ? (
        <TravelerPortal
          user={currentUser}
          onLogout={handleLogout}
          listings={listings}
          setListings={setListings}
          bookings={bookings}
          addBooking={(bk) => { setBookings(prev => [bk, ...prev]); }}
          notifications={notifications}
          addNotification={addNotification}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(prev => !prev)}
        />
      ) : (
        <EntrepreneurPortal
          user={currentUser}
          onLogout={handleLogout}
          listings={listings}
          setListings={setListings}
          bookings={bookings}
          setBookings={setBookings}
          addNotification={addNotification}
          darkMode={darkMode}
          toggleDarkMode={() => setDarkMode(prev => !prev)}
        />
      )}

      {/* Global logs drawer */}
      <NotificationPanel
        notifications={notifications}
        dismissNotification={dismissNotification}
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />

    </div>
  );
}
