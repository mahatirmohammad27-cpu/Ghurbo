import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, LayoutDashboard, Plus, Trash2, Edit2, Check, X, 
  MapPin, DollarSign, Calendar, TrendingUp, ShoppingBag, Eye, 
  BadgeHelp, CheckCircle, Smartphone, AlertCircle, FileText, User, LogOut, Star,
  Sun, Moon, Upload
} from 'lucide-react';
import { Listing, DestinationName, ListingCategory, Booking, UserProfile } from '../types';
import { DESTINATIONS } from '../data';

interface EntrepreneurPortalProps {
  user: UserProfile;
  onLogout: () => void;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
  addNotification: (title: string, message: string) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

interface PhysicalProduct {
  id: string;
  name: string;
  price: number;
  category: 'vehicle' | 'gear' | 'souvenir';
  stock: number;
  imageUrl: string;
}

export default function EntrepreneurPortal({
  user,
  onLogout,
  listings,
  setListings,
  bookings,
  setBookings,
  addNotification,
  darkMode = false,
  toggleDarkMode = () => {}
}: EntrepreneurPortalProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'listings' | 'bookings' | 'store' | 'profile'>('dashboard');

  // New Listing State/Forms
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  // Form Fields
  const [lTitle, setLTitle] = useState('');
  const [lDesc, setLDesc] = useState('');
  const [lPrice, setLPrice] = useState<number>(3000);
  const [lCategory, setLCategory] = useState<ListingCategory>('hotel');
  const [lDestination, setLDestination] = useState<DestinationName>('Cox_s Bazar');
  const [lContact, setLContact] = useState('');
  const [lImageUrl, setLImageUrl] = useState('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80');

  // Form specifications
  const [spec1Val, setSpec1Val] = useState('AC Bedroom Suites');
  const [spec2Val, setSpec2Val] = useState('2 King Beds');
  const [spec3Val, setSpec3Val] = useState('Free Beach Umbrellas');

  // Rental Store/Physical Products States
  const [products, setProducts] = useState<PhysicalProduct[]>([
    { id: 'p1', name: 'Deluxe Neoprene Life Vest', price: 1500, category: 'gear', stock: 12, imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80' },
    { id: 'p2', name: 'Floating Dry Waterproof Bag 20L', price: 850, category: 'gear', stock: 24, imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=150&q=80' },
    { id: 'p3', name: 'Heavy Duty Coleman Camp Tent', price: 4500, category: 'gear', stock: 4, imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=150&q=80' }
  ]);
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(1000);
  const [prodCat, setProdCat] = useState<'vehicle' | 'gear' | 'souvenir'>('gear');
  const [prodStock, setProdStock] = useState<number>(10);
  const [isDraggingListing, setIsDraggingListing] = useState(false);
  const [isDraggingProduct, setIsDraggingProduct] = useState(false);
  const [prodImageUrl, setProdImageUrl] = useState('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80');

  // Filter listings managed by this single entrepreneur
  const managedListings = useMemo(() => {
    return listings.filter(l => l.entrepreneurId === user.id || l.entrepreneurId === 'ent_1');
  }, [listings, user.id]);

  // Filter bookings on listings belonging to this entrepreneur
  const managedBookings = useMemo(() => {
    const listingIds = new Set(managedListings.map(l => l.id));
    return bookings.filter(b => listingIds.has(b.listingId));
  }, [bookings, managedListings]);

  // Stats calculation
  const totalRevenue = useMemo(() => {
    return managedBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  }, [managedBookings]);

  const activeBookingsCount = useMemo(() => {
    return managedBookings.filter(b => b.status === 'confirmed').length;
  }, [managedBookings]);

  const pendingRequestsCount = useMemo(() => {
    return managedBookings.filter(b => b.status === 'pending').length;
  }, [managedBookings]);

  // Handle Listing Form submission
  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lTitle || !lDesc) return;

    const specs = [
      { label: 'Feature 1', value: spec1Val || 'Premium quality' },
      { label: 'Feature 2', value: spec2Val || 'Verified host' },
      { label: 'Bonus', value: spec3Val || 'Sajek view' }
    ];

    if (editingListing) {
      // Edit mode
      setListings(prev => prev.map(item => {
        if (item.id === editingListing.id) {
          return {
            ...item,
            title: lTitle,
            description: lDesc,
            price: lPrice,
            category: lCategory,
            destination: lDestination,
            contactNumber: lContact,
            imageUrl: lImageUrl,
            specifications: specs
          };
        }
        return item;
      }));
      addNotification('Listing Updated', `Successfully saved changes for ${lTitle}`);
    } else {
      // Add mode
      const newListing: Listing = {
        id: 'l_ent_' + Math.floor(Math.random() * 10000),
        entrepreneurId: user.id,
        title: lTitle,
        description: lDesc,
        price: lPrice,
        category: lCategory,
        destination: lDestination,
        imageUrl: lImageUrl,
        rating: 5.0,
        ratingCount: 1,
        availability: true,
        contactNumber: lContact,
        specifications: specs
      };
      setListings(prev => [newListing, ...prev]);
      addNotification('New Listing Added', `${lTitle} is now active and search-eligible.`);
    }

    // Reset fields
    setShowAddListingModal(false);
    setEditingListing(null);
  };

  const startEditListing = (listing: Listing) => {
    setEditingListing(listing);
    setLTitle(listing.title);
    setLDesc(listing.description);
    setLPrice(listing.price);
    setLCategory(listing.category);
    setLDestination(listing.destination);
    setLContact(listing.contactNumber || '');
    setLImageUrl(listing.imageUrl);
    setSpec1Val(listing.specifications[0]?.value || '');
    setSpec2Val(listing.specifications[1]?.value || '');
    setSpec3Val(listing.specifications[2]?.value || '');
    setShowAddListingModal(true);
  };

  const handleDeleteListing = (id: string, name: string) => {
    if (confirm(`Do you wish to delete listing: ${name}?`)) {
      setListings(prev => prev.filter(item => item.id !== id));
      addNotification('Listing Removed', `Removed ${name} from your managed portal.`);
    }
  };

  // Booking Inbox Status manager
  const handleUpdateBookingStatus = (bookingId: string, action: 'confirmed' | 'cancelled') => {
    setBookings(prev => prev.map(bk => {
      if (bk.id === bookingId) {
        return { ...bk, status: action };
      }
      return bk;
    }));
    addNotification('Booking Updated', `Status changed to ${action} for reference ${bookingId}.`);
  };

  // Add store accessory
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName) return;

    const newProd: PhysicalProduct = {
      id: 'p_ent_' + Math.floor(Math.random() * 10000),
      name: prodName,
      price: prodPrice,
      category: prodCat,
      stock: prodStock,
      imageUrl: prodImageUrl
    };

    setProducts(prev => [newProd, ...prev]);
    setShowNewProductModal(false);
    addNotification('Product Stocked', `Added ${prodName} into your accessory store.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f9fb] via-[#e6f4fc] to-white dark:from-[#041421] dark:via-[#051a2a] dark:to-[#041421] pb-28 text-gray-800 dark:text-cream/90 transition-colors duration-300">
      {/* Partner Header */}
      <header className="sticky top-0 z-40 bg-white/65 dark:bg-[#041421]/65 backdrop-blur-2xl border-b border-gray-100/40 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-600 text-white font-bold rounded-2xl flex items-center justify-center text-lg shadow-md shadow-teal-600/20">
              G
            </div>
            <div>
              <span className="block text-[10px] text-teal-600 dark:text-teal-400 font-extrabold uppercase tracking-wider">Business Suite</span>
              <span className="block font-bold text-gray-950 dark:text-cream leading-none">Ghurbo Ventures</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick business status */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-950/45 rounded-full text-green-700 dark:text-green-300 border border-green-100 dark:border-green-905/30 font-bold text-[10px] uppercase">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live &amp; Verified
            </div>

            {/* Dark mode toggle */}
            <button 
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100/80 dark:bg-[#0c2438] text-gray-600 dark:text-accent hover:bg-gray-200 dark:hover:bg-[#12314b] transition-all cursor-pointer flex items-center justify-center shadow-inner"
              title={darkMode ? "Switch to Gold Light" : "Switch to Midnight Dark"}
            >
              {darkMode ? <Sun size={14} className="text-[#e2bf84]" /> : <Moon size={14} />}
            </button>

            <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0a2337]/50 border border-gray-150 dark:border-ocean/20 rounded-full pl-1.5 pr-3 py-1 cursor-pointer" onClick={() => setActiveTab('profile')}>
              <img 
                src={user.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&q=80"} 
                alt="Partner Avatar" 
                className="w-7 h-7 rounded-full object-cover border border-white dark:border-ocean/30"
              />
              <span className="text-xs font-bold text-gray-700 dark:text-cream">{user.onboardingData?.businessName ? user.onboardingData.businessName.split(' ')[0] : 'Mike'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Suite Canvas */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        <AnimatePresence mode="wait">

        {/* TAB 1: DASHBOARD DECK */}
        {activeTab === 'dashboard' && (
          <motion.div 
            key="partner-dashboard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8 focus:outline-none"
          >
            {/* Welcome banner */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Morning, {user.name || 'Mike George'} — {user.onboardingData?.businessName || 'Bengal Luxe Partner'}
                </h1>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed max-w-lg">
                  Local hospitality bookings in {user.onboardingData?.location || 'Sajek & Sylhet'} are performing 18% stronger than average tourism curves. Keep listings optimized!
                </p>
              </div>

              <button 
                onClick={() => {
                  setEditingListing(null);
                  setLTitle('');
                  setLDesc('');
                  setLPrice(4000);
                  setLCategory('hotel');
                  setLDestination('Sajek');
                  setLContact(user.onboardingData?.contactInfo || '');
                  setShowAddListingModal(true);
                }}
                className="bg-teal-650 hover:bg-teal-700 bg-teal-600 text-white font-bold text-xs py-3.5 px-6 rounded-2xl flex items-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                <Plus size={16} />
                Create Travel Listing
              </button>
            </div>

            {/* Quick Bento Stats grids */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Stat 1 */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Managed Revenue</span>
                <div className="space-y-1">
                  <span className="block font-extrabold text-gray-900 text-xl leading-none">৳ {totalRevenue}</span>
                  <span className="text-[9px] font-bold text-green-600 flex items-center gap-0.5 mt-1">
                    <TrendingUp size={11} /> +12.4% vs last week
                  </span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Active Stays</span>
                <div className="space-y-0.5">
                  <span className="block font-extrabold text-gray-900 text-2xl leading-none">{activeBookingsCount}</span>
                  <span className="text-[9px] font-semibold text-gray-400">Total verified checkins</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Listed Services</span>
                <div className="space-y-0.5">
                  <span className="block font-extrabold text-[#006687] text-2xl leading-none">{managedListings.length}</span>
                  <span className="text-[9px] font-semibold text-gray-400">Add, delete or disable</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-32">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Rating Profile</span>
                <div className="space-y-1">
                  <span className="block font-extrabold text-yellow-600 text-2xl leading-none flex items-center gap-1">
                    4.92 <Star size={18} fill="currentColor" className="text-yellow-500" />
                  </span>
                  <span className="text-[9px] font-semibold text-gray-400">Over 180 customer reviews</span>
                </div>
              </div>
            </div>

            {/* Revenue Area Graph & Inbox row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Monthly Revenue chart (SVG Graphic - Azure Horizon Specs) */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">Monthly Earnings Curve</h2>
                  <p className="text-[11px] text-gray-400">Real-time simulation of aggregate rental earnings</p>
                </div>

                <div className="relative h-56 w-full pt-4">
                  {/* Visual Area graph rendered inside responsive SVG */}
                  <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0d9488" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="180" x2="600" y2="180" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#f3f4f6" strokeWidth="1" />
                    <line x1="0" y1="60" x2="600" y2="60" stroke="#f3f4f6" strokeWidth="1" />
                    {/* Cubic bezier curve paths for high visual quality */}
                    <path 
                      d="M 0 160 Q 100 130 200 150 T 400 60 T 600 20 L 600 180 H 0 Z" 
                      fill="url(#areaGrad)"
                    />
                    <path 
                      d="M 0 160 Q 100 130 200 150 T 400 60 T 600 20" 
                      fill="none" 
                      stroke="#0d9488" 
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Data pulse nodes */}
                    <circle cx="400" cy="60" r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="600" cy="20" r="5" fill="#0d9488" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  
                  {/* Tooltip floating overlay on May */}
                  <div className="absolute top-4 right-4 sm:right-auto sm:left-[350px] bg-teal-650 bg-teal-600 text-white py-1 px-2.5 rounded-full text-[9px] font-bold shadow-md z-10 whitespace-nowrap">
                    May Earnings peak: ৳ 42,000
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-gray-400 font-bold px-2">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>June</span>
                </div>
              </div>

              {/* Booking Inbox Side deck */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">Inbox (Live)</h2>
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                </div>

                <div className="space-y-4 max-h-56 overflow-y-auto no-scrollbar">
                  {managedBookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-xs">
                      No customer alerts received yet today. Place traveler tests to populate.
                    </div>
                  ) : (
                    managedBookings.slice(0, 3).map((bk) => (
                      <div key={bk.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-gray-900">
                          <span>{bk.travelerName}</span>
                          <span className="text-[#0d9488] font-extrabold">৳ {bk.totalPrice}</span>
                        </div>
                        <p className="text-gray-500 text-[11px] truncate leading-none">Booked {bk.listingTitle}</p>
                        <span className="text-[9px] text-gray-400 block">Dates: {bk.dateFrom} to {bk.dateTo}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* TAB 2: LISTINGS MANAGER (CRUD) */}
        {activeTab === 'listings' && (
          <motion.div 
            key="partner-listings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-6 focus:outline-none"
          >
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h1 className="text-xl font-bold text-gray-900">My Managed Properties</h1>
                <p className="text-xs text-gray-500">Edit, activate or prune your listed travel options</p>
              </div>
              <button 
                onClick={() => {
                  setEditingListing(null);
                  setLTitle('');
                  setLDesc('');
                  setLPrice(3500);
                  setLCategory('hotel');
                  setLDestination('Cox_s Bazar');
                  setLContact('');
                  setShowAddListingModal(true);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Plus size={14} /> Add Listing
              </button>
            </div>

            {managedListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-100 shadow-sm space-y-3">
                <Building className="mx-auto text-gray-300" size={32} />
                <p className="font-semibold text-sm">No properties registered under your email credentials yet.</p>
                <button 
                  onClick={() => setShowAddListingModal(true)}
                  className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  Create First Listing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {managedListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
                    {/* Listing Image */}
                    <div className="h-44 bg-gray-100 overflow-hidden relative">
                      <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-teal-600 text-white rounded-xl text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5">
                        {listing.category}
                      </div>
                      <div className="absolute top-3 right-3 bg-white text-gray-800 font-extrabold px-2.5 py-0.5 rounded-xl text-xs">
                        ৳ {listing.price}
                      </div>
                    </div>

                    {/* Listing Details */}
                    <div className="p-5 space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                          <MapPin size={11} className="text-teal-600" />
                          {listing.destination}
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{listing.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{listing.description}</p>
                      </div>

                      {/* Control buttons */}
                      <div className="flex gap-2 pt-1 border-t border-dotted border-gray-150">
                        <button 
                          onClick={() => startEditListing(listing)}
                          className="w-1/2 bg-gray-100 hover:bg-teal-50 hover:text-teal-700 font-bold text-xs py-2 px-3 rounded-xl text-gray-600 transition-all flex items-center justify-center gap-1"
                        >
                          <Edit2 size={12} /> Edit Details
                        </button>
                        <button 
                          onClick={() => handleDeleteListing(listing.id, listing.title)}
                          className="w-1/2 bg-gray-50 hover:bg-red-50 hover:text-red-600 font-bold text-xs py-2 px-3 rounded-xl text-gray-500 transition-all flex items-center justify-center gap-1"
                        >
                          <Trash2 size={12} /> Delete Listing
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 3: BOOKING INBOX (STATUS UPDATER) */}
        {activeTab === 'bookings' && (
          <motion.div 
            key="partner-bookings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-6 max-w-4xl mx-auto focus:outline-none"
          >
            <div>
              <h1 className="text-xl font-bold text-gray-900">Customer Booking Inbox</h1>
              <p className="text-xs text-gray-500">Analyze itinerary requests, accept check-ins, or cancel options</p>
            </div>

            {managedBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-gray-150 shadow-sm space-y-2">
                <p className="font-semibold text-sm">No transaction tickets booked under your properties yet.</p>
                <p className="text-xs text-gray-400">Place book tests under Traveler Home tab to see alerts propagate here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {managedBookings.map((bk) => (
                  <div key={bk.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                    
                    {/* Status ribbon */}
                    <div className={`absolute top-0 right-0 text-[9px] font-bold uppercase tracking-wider py-1 px-4.5 rounded-bl-xl ${bk.status === 'confirmed' ? 'bg-[#34a853] text-white' : bk.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-gray-800'}`}>
                      {bk.status}
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] bg-teal-50 text-teal-800 font-bold px-2 py-0.5 rounded-full capitalize">{bk.listingCategory}</span>
                      <h3 className="font-bold text-gray-950 text-sm">{bk.listingTitle}</h3>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-gray-700">Client Checkunder: <span className="font-extrabold">{bk.travelerName}</span> ({bk.travelerEmail})</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-gray-400 font-medium">
                          <span>Dates: {bk.dateFrom} to {bk.dateTo}</span>
                          {bk.groupSize && <span>Group: {bk.groupSize} PAX</span>}
                          <span>TX: {bk.paymentTxId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 self-stretch sm:self-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-dashed border-gray-200">
                      {bk.status !== 'confirmed' && (
                        <button 
                          onClick={() => handleUpdateBookingStatus(bk.id, 'confirmed')}
                          className="flex-grow sm:flex-none bg-[#34a853] hover:bg-green-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                        >
                          <Check size={14} /> Confirm Checkin
                        </button>
                      )}
                      {bk.status !== 'cancelled' && (
                        <button 
                          onClick={() => handleUpdateBookingStatus(bk.id, 'cancelled')}
                          className="flex-grow sm:flex-none bg-red-50 hover:bg-red-100 text-red-650 font-bold text-xs px-3.5 py-2 rounded-xl text-red-600 flex items-center justify-center gap-1 active:scale-95 transition-all font-semibold"
                        >
                          <X size={14} /> Cancel Booking
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: STORE & PRODUCT LISTING */}
        {activeTab === 'store' && (
          <motion.div 
            key="partner-store"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-6 focus:outline-none"
          >
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rental Accessories &amp; Vehicle Store</h1>
                <p className="text-xs text-gray-500">Provide travelers with floating gears, mountain vehicles or indigenous souvenirs</p>
              </div>
              <button 
                onClick={() => {
                  setProdName('');
                  setProdPrice(1200);
                  setProdCat('gear');
                  setProdStock(8);
                  setProdImageUrl('https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=150&q=80');
                  setShowNewProductModal(true);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 shadow-sm"
              >
                <Plus size={14} /> Stock Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl border border-gray-150 p-4 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow space-y-1">
                    <span className="text-[9px] bg-teal-50 text-teal-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight">{item.category}</span>
                    <h3 className="font-bold text-gray-950 text-xs truncate leading-snug">{item.name}</h3>
                    <p className="font-extrabold text-[#0d9488] text-xs">৳ {item.price}</p>
                    <p className="text-[10px] text-gray-450">Stock capacity check: <span className="font-bold text-teal-700">{item.stock} left</span></p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 5: PARTNER PROFILE */}
        {activeTab === 'profile' && (
          <motion.div 
            key="partner-profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-md mx-auto space-y-6 focus:outline-none"
          >
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center space-y-4">
              <div className="relative inline-block">
                <img 
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80"} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-teal-600/10"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-teal-500 border-2 border-white rounded-full"></span>
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                <p className="text-xs text-gray-500">{user.email}</p>
                <span className="inline-block px-3.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-100 text-[10px] font-bold uppercase tracking-wider mt-2">
                  Operating Partner
                </span>
              </div>
            </div>

            {/* Configured onboarding background */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-gray-900 text-sm border-b border-gray-100 pb-2">Business Background</h3>
              
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Registered Company</span>
                  <span className="text-gray-700 font-bold">{user.onboardingData?.businessName || 'Ghurbo Partner'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Core Destination</span>
                  <span className="text-gray-700 font-bold">{user.onboardingData?.location || 'Cox_s Bazar'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Years in Travel Markets</span>
                  <span className="text-gray-700 font-bold">{user.onboardingData?.yearsOperating || '2'} Years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 font-semibold">Contact Mobile</span>
                  <span className="text-gray-700 font-bold">{user.onboardingData?.contactInfo || '+8801700000000'}</span>
                </div>
              </div>

              <div className="bg-teal-50/70 p-3.5 rounded-2xl border border-teal-100/50 flex items-start gap-2 text-[11px] text-teal-855">
                <CheckCircle className="text-teal-600 mt-0.5 shrink-0" size={14} />
                <p className="leading-relaxed">Answered Onboarding FAQ: Operating with {user.onboardingData?.faqServiceType || 'Premium and verified services'}</p>
              </div>
            </div>

            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-red-50 text-left text-sm font-bold text-red-600 transition-colors border border-gray-100 rounded-3xl shadow-sm group"
            >
              <span>Logout Partner Session</span>
              <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </motion.div>
        )}

        </AnimatePresence>
      </main>

      {/* CREATE/EDIT LISTING FORM MODAL */}
      <AnimatePresence>
        {showAddListingModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.form 
              onSubmit={handleSubmitListing}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-900 text-base">
                  {editingListing ? `Edit ${editingListing.title}` : 'List Travel Service'}
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowAddListingModal(false)} 
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3.5 text-xs text-gray-600">
                
                <div>
                  <label className="block font-semibold mb-1">Service Title / Property Name</label>
                  <input 
                    type="text"
                    required
                    value={lTitle}
                    onChange={(e) => setLTitle(e.target.value)}
                    placeholder="e.g. Inani Beach Side Grand Cottage"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-gray-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Service Description</label>
                  <textarea 
                    rows={2.5}
                    required
                    value={lDesc}
                    onChange={(e) => setLDesc(e.target.value)}
                    placeholder="Describe rooms, views, package plans or tour safety guide specifics..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Price Per Day (৳)</label>
                    <input 
                      type="number"
                      required
                      value={lPrice}
                      onChange={(e) => setLPrice(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-gray-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Service Category</label>
                    <select 
                      value={lCategory}
                      onChange={(e) => setLCategory(e.target.value as ListingCategory)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-gray-800 font-semibold"
                    >
                      <option value="hotel">Hotel / Cottage</option>
                      <option value="transport">Transportation line</option>
                      <option value="restaurant">Food &amp; Dining</option>
                      <option value="guide">Private Guide</option>
                      <option value="package">Special Tour Bundle</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Destination Tag</label>
                    <select 
                      value={lDestination}
                      onChange={(e) => setLDestination(e.target.value as DestinationName)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-gray-800"
                    >
                      <option value="Cox_s Bazar">Cox's Bazar</option>
                      <option value="St. Martin">St. Martin</option>
                      <option value="Bandarban">Bandarban</option>
                      <option value="Sajek">Sajek</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Haor">Haor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Public Mobile Contact No</label>
                    <input 
                      type="text"
                      value={lContact}
                      onChange={(e) => setLContact(e.target.value)}
                      placeholder="+88017XXXXXXXX"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Service Image Selection &amp; Upload</label>
                  
                  {/* File Upload Drag & Drop Box */}
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingListing(true);
                    }}
                    onDragLeave={() => setIsDraggingListing(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingListing(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setLImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all duration-200 mb-3 flex flex-col items-center justify-center space-y-1.5 ${
                      isDraggingListing 
                        ? 'border-teal-500 bg-teal-50/50' 
                        : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'
                    }`}
                    onClick={() => document.getElementById('listing-image-file')?.click()}
                  >
                    <input 
                      id="listing-image-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setLImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    
                    {lImageUrl ? (
                      <div className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                        <img 
                          src={lImageUrl} 
                          alt="Uploaded service preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                          Click / Drop to Change
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-gray-400" size={20} />
                        <p className="text-[11px] font-bold text-gray-700">Drag &amp; drop service image here</p>
                        <p className="text-[10px] text-gray-400">or <span className="text-teal-600 underline">browse computer</span></p>
                      </>
                    )}
                  </div>

                  {/* Manual URL entry field */}
                  <div className="space-y-2">
                    <label className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Or paste image web link manually</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        required
                        value={lImageUrl}
                        onChange={(e) => setLImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
                      />
                      <button 
                        type="button"
                        onClick={() => setLImageUrl('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80')}
                        className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl hover:bg-gray-200 text-xs font-bold transition-all"
                      >
                        Preset
                      </button>
                    </div>
                  </div>
                </div>

                {/* Listing Specifications helper slots */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  <span className="block font-bold text-gray-700">Specifications / Special Features (Bonus specs)</span>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <label className="block text-[10px] text-gray-400">Spec 1 (e.g. AC/Beds)</label>
                      <input type="text" value={spec1Val} onChange={(e) => setSpec1Val(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400">Spec 2 (e.g. Capacity)</label>
                      <input type="text" value={spec2Val} onChange={(e) => setSpec2Val(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5" />
                    </div>
                    <div>
                      <label className="block text-[10px] text-gray-400">Spec 3 (e.g. Balcony)</label>
                      <input type="text" value={spec3Val} onChange={(e) => setSpec3Val(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5" />
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddListingModal(false)}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 font-bold text-xs py-2.5 rounded-xl text-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-all text-center"
                >
                  Save Listing Option
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NEW PRODUCT DIALOG MODAL */}
      <AnimatePresence>
        {showNewProductModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.form 
              onSubmit={handleAddProduct}
              className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 space-y-4"
            >
              <h3 className="font-bold text-gray-950 text-base border-b border-gray-100 pb-2">Add Rental Product</h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Item Name</label>
                  <input 
                    type="text" 
                    required 
                    value={prodName} 
                    onChange={(e) => setProdName(e.target.value)} 
                    placeholder="e.g. Advanced Waterproof Diving goggles" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Price (৳)</label>
                    <input 
                      type="number" 
                      required 
                      value={prodPrice} 
                      onChange={(e) => setProdPrice(parseInt(e.target.value) || 0)} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-teal-550 focus:ring-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Category</label>
                    <select 
                      value={prodCat} 
                      onChange={(e) => setProdCat(e.target.value as any)} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-teal-500"
                    >
                      <option value="gear">Gears or Equipments</option>
                      <option value="vehicle">Vehicles for rent</option>
                      <option value="souvenir">Bengali Souvenir</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Initial Stock Count</label>
                  <input 
                    type="number" 
                    required 
                    value={prodStock} 
                    onChange={(e) => setProdStock(parseInt(e.target.value) || 1)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 px-3 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Product Image Selection &amp; Upload</label>
                  
                  {/* File Upload Drag & Drop Box */}
                  <div 
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDraggingProduct(true);
                    }}
                    onDragLeave={() => setIsDraggingProduct(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingProduct(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setProdImageUrl(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className={`border-2 border-dashed rounded-2xl p-3 text-center cursor-pointer transition-all duration-200 mb-2 flex flex-col items-center justify-center space-y-1.5 ${
                      isDraggingProduct 
                        ? 'border-teal-500 bg-teal-50/50' 
                        : 'border-gray-200 hover:border-teal-400 hover:bg-gray-50'
                    }`}
                    onClick={() => document.getElementById('product-image-file')?.click()}
                  >
                    <input 
                      id="product-image-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProdImageUrl(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    
                    {prodImageUrl ? (
                      <div className="relative w-full h-20 rounded-lg overflow-hidden border border-gray-100 flex items-center justify-center">
                        <img 
                          src={prodImageUrl} 
                          alt="Uploaded product preview" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                          Click / Drop to Change
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="text-gray-400" size={18} />
                        <p className="text-[10px] font-bold text-gray-700">Drag &amp; drop product image here</p>
                        <p className="text-[9px] text-gray-400">or <span className="text-teal-600 underline">browse</span></p>
                      </>
                    )}
                  </div>

                  {/* Manual URL entry field */}
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        required
                        value={prodImageUrl}
                        onChange={(e) => setProdImageUrl(e.target.value)}
                        placeholder="Paste image web link manually"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-1.5 px-3 text-xs text-gray-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowNewProductModal(false)}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 font-bold text-xs py-2.5 rounded-xl text-gray-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="w-1/2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm"
                >
                  Record Stock
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING GLASS NAVIGATION DOCK */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] z-45 bg-white/70 dark:bg-[#071d2c]/70 backdrop-blur-2xl shadow-[0_12px_32px_-4px_rgba(0,0,0,0.1),_inset_0_1px_1px_rgba(255,255,255,0.85)] dark:shadow-[0_16px_40px_-4px_rgba(0,0,0,0.65),_inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white/50 dark:border-white/10 rounded-full p-1 flex justify-between items-center max-w-sm transition-all duration-300">
        {/* Dashboard */}
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'dashboard' && (
            <motion.div
              layoutId="activeTabPartnerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-teal-600 rounded-full -z-10 shadow-sm shadow-teal-650/20"
            />
          )}
          <LayoutDashboard size={17} className={activeTab === 'dashboard' ? 'text-white' : 'text-gray-500 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'dashboard' ? 'text-white' : 'text-gray-500 dark:text-cream/50'}`}>
            Metrics
          </span>
        </button>

        {/* Listings */}
        <button 
          onClick={() => setActiveTab('listings')}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'listings' && (
            <motion.div
              layoutId="activeTabPartnerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-teal-600 rounded-full -z-10 shadow-sm shadow-teal-650/20"
            />
          )}
          <Building size={17} className={activeTab === 'listings' ? 'text-white' : 'text-gray-500 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'listings' ? 'text-white' : 'text-gray-500 dark:text-cream/50'}`}>
            Services
          </span>
        </button>

        {/* Bookings */}
        <button 
          onClick={() => setActiveTab('bookings')}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'bookings' && (
            <motion.div
              layoutId="activeTabPartnerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-teal-600 rounded-full -z-10 shadow-sm shadow-teal-650/20"
            />
          )}
          <div className="relative">
            <Calendar size={17} className={activeTab === 'bookings' ? 'text-white' : 'text-gray-500 dark:text-cream/50'} />
            {pendingRequestsCount > 0 && (
              <span className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full ${activeTab === 'bookings' ? 'bg-red-500 border border-teal-600 shadow-sm' : 'bg-red-500'}`}></span>
            )}
          </div>
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'bookings' ? 'text-white' : 'text-gray-500 dark:text-cream/50'}`}>
            Inbox
          </span>
        </button>

        {/* Store */}
        <button 
          onClick={() => setActiveTab('store')}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'store' && (
            <motion.div
              layoutId="activeTabPartnerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-teal-600 rounded-full -z-10 shadow-sm shadow-teal-650/20"
            />
          )}
          <ShoppingBag size={17} className={activeTab === 'store' ? 'text-white' : 'text-gray-500 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'store' ? 'text-white' : 'text-gray-500 dark:text-cream/50'}`}>
            Store
          </span>
        </button>

        {/* Profile */}
        <button 
          onClick={() => setActiveTab('profile')}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'profile' && (
            <motion.div
              layoutId="activeTabPartnerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-teal-600 rounded-full -z-10 shadow-sm shadow-teal-650/20"
            />
          )}
          <User size={17} className={activeTab === 'profile' ? 'text-white' : 'text-gray-500 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'profile' ? 'text-white' : 'text-gray-500 dark:text-cream/50'}`}>
            Partner
          </span>
        </button>
      </nav>
    </div>
  );
}
