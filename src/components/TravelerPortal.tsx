import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, SlidersHorizontal, MapPin, Calendar, Users, Star, 
  ChevronRight, X, ArrowRight, ShieldCheck, 
  Check, Compass, Ticket, User, LogOut, CheckCircle2, ChevronDown,
  Sun, Moon
} from 'lucide-react';
import { Listing, DestinationName, ListingCategory, Booking, UserProfile } from '../types';
import { DESTINATIONS, INITIAL_LISTINGS, REVIEWS } from '../data';

interface TravelerPortalProps {
  user: UserProfile;
  onLogout: () => void;
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  notifications: any[];
  addNotification: (title: string, message: string) => void;
  darkMode?: boolean;
  toggleDarkMode?: () => void;
}

export default function TravelerPortal({
  user,
  onLogout,
  listings,
  setListings,
  bookings,
  addBooking,
  notifications,
  addNotification,
  darkMode = false,
  toggleDarkMode = () => {}
}: TravelerPortalProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'home' | 'destinations' | 'planner' | 'bookings' | 'profile'>('home');
  
  // States of search
  const [searchDestination, setSearchDestination] = useState<string>('');
  const [searchBudget, setSearchBudget] = useState<number>(15000);
  const [searchDate, setSearchDate] = useState<string>('');

  // States of Filter system
  const [selectedDestFilter, setSelectedDestFilter] = useState<string>('All');
  const [selectedCatFilter, setSelectedCatFilter] = useState<string>('All');
  const [selectedPriceMax, setSelectedPriceMax] = useState<number>(20000);
  const [selectedRatingMin, setSelectedRatingMin] = useState<number>(0);
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  // States of Destination Page view
  const [selectedDestinationPage, setSelectedDestinationPage] = useState<DestinationName | null>(null);
  const [destPageTab, setDestPageTab] = useState<ListingCategory | 'all'>('all');

  // Travel Planner States
  const [plannerDest, setPlannerDest] = useState<DestinationName>('Cox_s Bazar');
  const [plannerBudget, setPlannerBudget] = useState<number>(10000);
  const [plannerGroup, setPlannerGroup] = useState<number>(2);
  const [plannerDays, setPlannerDays] = useState<number>(3);
  const [plannerResults, setPlannerResults] = useState<Listing[] | null>(null);

  // Booking Flow States
  const [selectedListingForBooking, setSelectedListingForBooking] = useState<Listing | null>(null);
  const [bookingGroupSize, setBookingGroupSize] = useState<number>(2);
  const [bookingDays, setBookingDays] = useState<number>(2);
  const [bookingDateFrom, setBookingDateFrom] = useState<string>('2026-06-15');
  const [bookingStep, setBookingStep] = useState<'summary' | 'payment' | 'success'>('summary');
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'card'>('bKash');
  
  // Payment Sim States
  const [bkashNumber, setBkashNumber] = useState('01800000000');
  const [bkashPIN, setBkashPIN] = useState('');
  const [bkashOTP, setBkashOTP] = useState('');
  const [bkashStep, setBkashStep] = useState<'number' | 'otp' | 'pin'>('number');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardHolder, setCardHolder] = useState('Mahatir Mohammad');

  // Multi-language support toggles (Bonus Feature - English default with Bengali support!)
  const [useBengali, setUseBengali] = useState(false);

  // Filter bookings to ONLY current traveler's email to separate profiles correctly
  const myBookings = useMemo(() => {
    return bookings.filter(bk => bk.travelerEmail.toLowerCase() === user.email.toLowerCase());
  }, [bookings, user.email]);

  // Search execution from hero
  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedDestFilter(searchDestination || 'All');
    setSelectedPriceMax(searchBudget || 20000);
    setActiveTab('home');
    // Scroll down or indicate change
    addNotification('Search applied', `Filtered results for ${searchDestination || 'All destinations'}`);
  };

  // Run Planner Match Algorithm
  const handleRunPlanner = () => {
    const matched = listings.filter(item => {
      // Must be matching destination
      const matchDest = item.destination === plannerDest;
      // Fits budget constraint
      const fitsBudget = item.price * plannerDays <= plannerBudget;
      return matchDest && fitsBudget;
    });
    setPlannerResults(matched);
    addNotification('Travel Planner Ran', `Found ${matched.length} packages for your standard budget.`);
  };

  // Handle active Booking logic
  const handleSelectBooking = (listing: Listing) => {
    setSelectedListingForBooking(listing);
    setBookingStep('summary');
    setBkashStep('number');
    setBkashPIN('');
    setBkashOTP('');
  };

  const handleConfirmAndProceedPayment = () => {
    setBookingStep('payment');
  };

  // Final confirmation
  const handleCompletePayment = () => {
    if (!selectedListingForBooking) return;
    const pricePerNight = selectedListingForBooking.price;
    const baseP = pricePerNight * bookingDays;
    const sFee = Math.round(baseP * 0.05);
    const totalP = baseP + sFee;

    const txId = paymentMethod === 'bKash' 
      ? 'TXN-BKASH-' + Math.floor(Math.random() * 899999 + 100000)
      : 'TXN-STRIPE-' + Math.floor(Math.random() * 899999 + 100000);

    const newBk: Booking = {
      id: 'bk_' + Math.floor(Math.random() * 100000),
      listingId: selectedListingForBooking.id,
      travelerName: user.name,
      travelerEmail: user.email,
      listingTitle: selectedListingForBooking.title,
      listingCategory: selectedListingForBooking.category,
      destination: selectedListingForBooking.destination,
      dateFrom: bookingDateFrom,
      dateTo: new Date(new Date(bookingDateFrom).getTime() + bookingDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalPrice: totalP,
      status: 'confirmed',
      paymentMethod: paymentMethod,
      paymentTxId: txId,
      createdAt: new Date().toISOString(),
      groupSize: bookingGroupSize
    };

    addBooking(newBk);
    setBookingStep('success');
    addNotification(
      'Payment Confirmed!', 
      `Successfully booked ${selectedListingForBooking.title} in ${selectedListingForBooking.destination}. TxId: ${txId}`
    );
  };

  // Apply filters
  const processedListings = useMemo(() => {
    return listings.filter(item => {
      const matchDest = selectedDestFilter === 'All' || item.destination === selectedDestFilter;
      const matchCat = selectedCatFilter === 'All' || item.category === selectedCatFilter;
      const matchPrice = item.price <= selectedPriceMax;
      const matchRating = item.rating >= selectedRatingMin;
      return matchDest && matchCat && matchPrice && matchRating;
    });
  }, [listings, selectedDestFilter, selectedCatFilter, selectedPriceMax, selectedRatingMin]);

  // Dictionary for translations
  const dict = {
    heroTitle: useBengali ? 'অনন্য বাংলাদেশ এক্সপ্লোর করুন' : 'Your Gateway to Timeless Bangladesh',
    heroSubtitle: useBengali ? 'উদ্যোক্তাদের সাথে যুক্ত হোন এবং রাজকীয় ভ্রমণ উপভোগ করুন' : 'Connect with trusted local entrepreneurs for hotels, guides, restaurants & boutique yachts.',
    searchPlaceholder: useBengali ? 'কোথায় যেতে চান?' : 'Where would you like to explore?',
    budget: useBengali ? 'বাজেট' : 'Budget (৳)',
    date: useBengali ? 'তারিখ' : 'Travel Dates',
    quickDestinations: useBengali ? 'প্রধান পর্যটন গন্তব্যসমূহ' : 'Top Travel Destinations',
    curatedResorts: useBengali ? 'সেরা হোটেল ও রিসোর্ট সমূহ' : 'Featured Premium Stays',
    plannerTitle: useBengali ? 'স্মার্ট ট্রাভেল প্ল্যানার' : 'Intelligent Travel Planner',
    plannerSubtitle: useBengali ? 'আপনার বাজেট এবং তারিখ অনুযায়ী আকর্ষণীয় স্থানগুলো খুঁজুন' : 'Input your limits to match custom hotels, guides or transport',
    noBookings: useBengali ? 'আপনার কোনো বুকিং নেই' : 'You have no registered bookings yet.'
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-[#041421] text-ocean dark:text-cream/90 pb-28 relative overflow-hidden transition-colors duration-300">
      {/* Traveler Header */}
      <header className="sticky top-0 z-40 bg-cream/65 dark:bg-[#041421]/65 backdrop-blur-2xl border-b border-white/40 dark:border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="serif font-bold text-2xl tracking-widest text-ocean dark:text-cream">GHURBO.</span>
            <div className="h-4 w-[1px] bg-ocean/20 dark:bg-ocean/45 mx-1"></div>
            <div>
              <span className="block text-[9px] uppercase tracking-widest text-[#8a6f43] dark:text-accent font-extrabold pb-0.5">Explorer</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button 
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100/80 dark:bg-[#0c2438] text-gray-600 dark:text-accent hover:bg-gray-200 dark:hover:bg-[#12314b] transition-all cursor-pointer flex items-center justify-center shadow-inner"
              title={darkMode ? "Switch to Gold Light" : "Switch to Midnight Dark"}
            >
              {darkMode ? <Sun size={14} className="text-[#e2bf84]" /> : <Moon size={14} />}
            </button>

            {/* Bengali/English toggle */}
            <button 
              type="button"
              onClick={() => setUseBengali(!useBengali)}
              className="text-[10px] font-extrabold tracking-wider uppercase px-3 py-1.5 bg-gray-100/80 dark:bg-[#0c2438] rounded-full text-gray-600 dark:text-cream hover:bg-gray-200 dark:hover:bg-[#12314b] transition-colors cursor-pointer border border-ocean/5 dark:border-ocean/10"
            >
              {useBengali ? 'English' : 'বাংলা'}
            </button>

            {/* Profile pill */}
            <div className="flex items-center gap-2 bg-gray-50/50 dark:bg-[#0a2337]/50 hover:bg-gray-100/70 dark:hover:bg-[#0c2438]/80 border border-gray-150 dark:border-ocean/20 rounded-full pl-1.5 pr-3 py-1 transition-colors cursor-pointer" onClick={() => setActiveTab('profile')}>
              <img 
                src={user.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                alt="Profile" 
                className="w-7 h-7 rounded-full object-cover border border-white dark:border-ocean/30"
              />
              <span className="text-xs font-bold text-gray-700 dark:text-cream hidden sm:inline">{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: HOME */}
          {activeTab === 'home' && !selectedDestinationPage && (
            <motion.div 
              key="tab-home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
              className="space-y-10 focus:outline-none"
            >
              {/* Hero & Search Row */}
              <div className="rounded-3xl relative overflow-hidden text-white p-8 md:p-14 shadow-[0_20px_50px_rgba(10,49,77,0.06)] bg-gradient-to-br from-[#0A314D] to-[#041E30]">
                <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')] bg-cover bg-center"></div>
                {/* Back backdrop title watermark */}
                <div className="absolute bottom-4 right-10 select-none pointer-events-none serif uppercase text-white/[0.02] tracking-widest text-8xl font-black">
                  GHURBO
                </div>
                <div className="relative z-10 max-w-2xl space-y-4">
                  <span className="px-3 py-1 rounded-md bg-accent/20 border border-accent/20 text-[10px] font-bold tracking-[0.2em] uppercase text-accent inline-block">
                    PREMIUM QUALITY RECREATION
                  </span>
                  <h1 className="serif text-3xl md:text-5xl font-light italic leading-tight text-cream">
                    {dict.heroTitle}
                  </h1>
                  <p className="text-sm text-cream/75 leading-relaxed max-w-lg font-light">
                    {dict.heroSubtitle}
                  </p>
  
                  {/* Integrated Search Bar */}
                  <form onSubmit={handleHeroSearch} className="bg-cream/95 backdrop-blur-md rounded-2xl md:rounded-full p-2 text-ocean flex flex-col md:flex-row gap-2 shadow-xl border border-white/20 mt-8">
                    <div className="flex-grow flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-ocean/10">
                      <MapPin className="text-ocean flex-shrink-0" size={18} />
                      <select 
                        value={searchDestination} 
                        onChange={(e) => setSearchDestination(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold focus:outline-none w-full appearance-none pr-4 text-ocean select-arrow-custom"
                      >
                        <option value="" className="text-ocean">{useBengali ? 'গন্তব্য নির্বাচন' : 'Which destination?'}</option>
                        {DESTINATIONS.map(d => (
                          <option key={d.id} value={d.name} className="text-ocean">{d.name}</option>
                        ))}
                      </select>
                    </div>
  
                    <div className="flex-grow flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-ocean/10">
                      <span className="text-ocean font-extrabold text-lg select-none flex-shrink-0 w-4 text-center leading-none">৳</span>
                      <input 
                        type="number"
                        placeholder={useBengali ? 'সর্বোচ্চ বাজেট (৳)' : 'Max budget ৳'}
                        value={searchBudget}
                        onChange={(e) => setSearchBudget(parseInt(e.target.value) || 20000)}
                        className="bg-transparent border-none text-xs font-bold focus:outline-none w-full text-ocean"
                      />
                    </div>
  
                    <div className="flex-grow flex items-center gap-2.5 px-4 py-2 md:pr-4">
                      <Calendar className="text-ocean flex-shrink-0" size={18} />
                      <input 
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="bg-transparent border-none text-xs font-bold focus:outline-none w-full text-ocean"
                      />
                    </div>
  
                    <button 
                      type="submit"
                      className="bg-ocean hover:bg-ocean/90 text-white font-bold text-xs py-3.5 px-8 rounded-full shadow-md shadow-ocean/10 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer uppercase tracking-wider"
                    >
                      <Search size={16} />
                      {useBengali ? 'খুঁজুন' : 'Search'}
                    </button>
                  </form>
                </div>
              </div>
  
              {/* Destination Quick links (Horizontal cards) */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <div>
                    <h2 className="serif text-xl font-bold tracking-tight text-ocean">{dict.quickDestinations}</h2>
                    <p className="text-[10px] sm:text-xs text-[#8a6f43] dark:text-[#D9C5A3] font-extrabold uppercase tracking-widest mt-0.5">Explore iconic wonders of Bangladesh</p>
                  </div>
                  <button onClick={() => setActiveTab('destinations')} className="text-[10px] uppercase tracking-wider font-extrabold text-ocean hover:underline flex items-center gap-1">
                    {useBengali ? 'সবগুলো গন্তব্য' : 'All Destinations'}
                    <ChevronRight size={14} />
                  </button>
                </div>
  
                {/* Horizontal scroll container with Unsplash custom imagery */}
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
                  {DESTINATIONS.map((d, index) => (
                    <motion.button
                      key={d.id}
                      onClick={() => setSelectedDestinationPage(d.name)}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-15px" }}
                      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
                      className="flex-shrink-0 w-40 h-52 rounded-2xl relative overflow-hidden group shadow-sm hover:shadow-md transition-all text-left snap-start border border-ocean/5 cursor-pointer bg-cream"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <img 
                        src={d.imageUrl} 
                        alt={d.name} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean/90 via-ocean/15 to-transparent"></div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <span className="block serif font-bold text-sm text-cream">{d.name}</span>
                        <span className="block text-[9px] uppercase tracking-widest text-[#D9C5A3] font-bold truncate mt-1">{d.tagline}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
  
              {/* Filter Pill Row */}
              <div className="flex items-center justify-between mt-8 border-b border-ocean/10 pb-4">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  <button 
                    onClick={() => { setSelectedCatFilter('All'); }}
                    className={`px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-colors ${selectedCatFilter === 'All' ? 'bg-ocean text-cream font-bold' : 'bg-sand text-ocean hover:bg-[#eae5dc]'}`}
                  >
                    All Services
                  </button>
                  {['hotel', 'transport', 'restaurant', 'guide', 'package'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCatFilter(cat); }}
                      className={`px-4 py-1.5 rounded-full text-xs font-extrabold capitalize whitespace-nowrap transition-all ${selectedCatFilter === cat ? 'bg-ocean text-cream' : 'bg-sand text-ocean hover:bg-[#eae5dc]'}`}
                    >
                      {cat}s
                    </button>
                  ))}
                </div>
  
                <button 
                  onClick={() => setShowFiltersModal(true)}
                  className="flex items-center gap-1.5 border border-ocean/10 bg-white/50 hover:bg-sand/30 font-bold text-xs px-3.5 py-1.5 rounded-xl text-ocean transition-all cursor-pointer"
                >
                  <SlidersHorizontal size={14} />
                  Filters
                  {(selectedDestFilter !== 'All' || selectedPriceMax < 20000 || selectedRatingMin > 0) && (
                    <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                  )}
                </button>
              </div>
  
              {/* Dynamic Curated Suggestions listings list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="serif text-xl font-bold tracking-tight text-ocean">
                    {selectedCatFilter === 'All' ? dict.curatedResorts : 
                     selectedCatFilter === 'hotel' ? (useBengali ? 'সেরা হোটেল ও রিসোর্ট সমূহ' : 'Premium Hotels & Stays') :
                     selectedCatFilter === 'transport' ? (useBengali ? 'পরিবহন ও স্থানান্তর অপশন' : 'Local Transportation & Rides') :
                     selectedCatFilter === 'restaurant' ? (useBengali ? 'সেরা রেস্টুরেন্ট ও খাবার সমূহ' : 'Local Food Houses & Restaurants') :
                     selectedCatFilter === 'guide' ? (useBengali ? 'অনুমোদিত ট্যুর গাইড সেবা' : 'Verified Local Tour Guides') :
                     (useBengali ? 'বিশেষ ট্রাভেল প্যাকেজ সমূহ' : 'All-Inclusive Tour Packages')}
                  </h2>
                  <span className="text-xs text-ocean/55 font-bold uppercase tracking-wider">{processedListings.length} results</span>
                </div>
  
                {processedListings.length === 0 ? (
                  <div className="bg-sand/20 rounded-2xl p-12 text-center text-ocean/60 border border-ocean/5">
                    <p className="serif font-medium text-sm italic">No listings found matching your exact filter parameters.</p>
                    <button 
                      onClick={() => { setSelectedDestFilter('All'); setSelectedCatFilter('All'); setSelectedPriceMax(20000); setSelectedRatingMin(0); }}
                      className="text-xs text-ocean mt-2 font-bold hover:underline"
                    >
                      Reset all filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {processedListings.map((listing, index) => (
                      <motion.div 
                        key={listing.id}
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-10px" }}
                        transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.3) }}
                        className="bg-white/95 card-glass rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-ocean/5 group"
                      >
                        <div className="relative h-44 bg-cream overflow-hidden">
                          <img 
                            src={listing.imageUrl} 
                            alt={listing.title} 
                            className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3 bg-cream/95 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-bold text-ocean shadow-sm uppercase tracking-widest flex items-center gap-1 border border-ocean/5">
                            <MapPin size={10} />
                            {listing.destination}
                          </div>
                          <div className="absolute top-3 right-3 bg-ocean text-cream px-3 py-1 rounded-md text-xs font-bold shadow-sm">
                            ৳ {listing.price}
                          </div>
                        </div>
                        <div className="p-5 space-y-3.5">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-xs text-ocean/60">
                              <span className="capitalize font-semibold text-ocean bg-sand px-2.5 py-0.5 rounded-md text-[10px] tracking-wide">{listing.category}</span>
                              <span className="flex items-center gap-0.5 font-bold text-amber-900 bg-sand px-2 py-0.5 rounded-md text-[10px]">
                                <Star size={11} fill="currentColor" />
                                {listing.rating} ({listing.ratingCount})
                              </span>
                            </div>
                            <h3 className="serif font-bold text-ocean text-base line-clamp-1 group-hover:text-amber-800 transition-colors mt-2">{listing.title}</h3>
                            <p className="text-xs text-ocean/70 line-clamp-2 leading-relaxed font-light">{listing.description}</p>
                          </div>
  
                          {/* Specifications list */}
                          <div className="grid grid-cols-2 gap-2 text-[10px] bg-cream/80 p-2.5 rounded-xl border border-ocean/5">
                            {listing.specifications.slice(0, 2).map((s, idx) => (
                              <div key={idx} className="truncate">
                                <span className="text-ocean/60 font-medium">{s.label}: </span>
                                <span className="text-ocean font-semibold">{s.value}</span>
                              </div>
                            ))}
                          </div>
  
                          <button 
                            onClick={() => handleSelectBooking(listing)}
                            className="w-full bg-ocean hover:bg-ocean/90 text-cream font-bold text-[10px] py-3.5 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 active:scale-98 cursor-pointer uppercase tracking-widest"
                          >
                            Book Now
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

        {/* TAB 2: DESTINATIONS LIST (Or detailed individual page) */}
        {activeTab === 'destinations' && !selectedDestinationPage && (
          <motion.div 
            key="tab-destinations"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8 focus:outline-none"
          >
            <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
              <h1 className="serif text-3xl font-medium tracking-tight text-ocean">Iconic Destinations of Bangladesh</h1>
              <p className="text-sm text-ocean/80 leading-relaxed font-light">
                Connect directly with micro-entrepreneurs running authentic stays and transport lines. Choose your location to start booking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DESTINATIONS.map((d) => (
                <div 
                  key={d.id}
                  onClick={() => {
                    setSelectedDestinationPage(d.name);
                    setDestPageTab('all');
                  }}
                  className="bg-white/80 card-glass rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-ocean/10 cursor-pointer group"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={d.imageUrl} 
                      alt={d.name} 
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ocean/90 via-ocean/10 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-cream/95 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold text-ocean shadow-sm uppercase tracking-widest border border-ocean/5">
                      Popular Local Hub
                    </div>
                  </div>
                  <div className="p-6 space-y-2">
                    <h2 className="serif text-lg font-bold text-ocean group-hover:text-[#8a6f43] dark:group-hover:text-accent transition-colors">{d.name}</h2>
                    <p className="text-[10px] uppercase tracking-wider text-[#8a6f43] dark:text-[#D9C5A3] font-extrabold">{d.tagline}</p>
                    <p className="text-xs text-ocean/80 line-clamp-3 leading-relaxed mt-1 font-light">{d.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* INDIVIDUAL DESTINATION PAGE OVERLAY (If selected) */}
        {selectedDestinationPage && (
          <motion.div 
            key={`destination-${selectedDestinationPage}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8 focus:outline-none"
          >
            {/* Back button */}
            <button 
              onClick={() => setSelectedDestinationPage(null)}
              className="flex items-center gap-1.5 text-xs text-ocean/50 hover:text-ocean font-bold cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 text-ocean/60" />
              Back to Overview
            </button>

            {/* Destination Hero card */}
            {(() => {
              const dInfo = DESTINATIONS.find(d => d.name === selectedDestinationPage);
              if (!dInfo) return null;
              return (
                <div className="rounded-3xl relative overflow-hidden text-white p-8 md:p-12 shadow-lg" style={{ background: "linear-gradient(135deg, #0A314D 0%, #051A29 100%)" }}>
                  <div className="absolute inset-0 opacity-30 bg-cover bg-center" style={{ backgroundImage: `url(${dInfo.imageUrl})` }}></div>
                  <div className="relative z-10 max-w-2xl space-y-3">
                    <span className="bg-accent/20 text-[#D9C5A3] border border-accent/10 text-[10px] font-bold px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                      {dInfo.tagline}
                    </span>
                    <h1 className="serif text-3xl md:text-5xl font-light italic select-none text-cream">{dInfo.name}</h1>
                    <p className="text-sm text-cream/80 leading-relaxed max-w-xl font-light">{dInfo.description}</p>
                  </div>
                </div>
              );
            })()}

            {/* Tab selection */}
            <div className="flex border-b border-ocean/10 pb-3 gap-2 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setDestPageTab('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${destPageTab === 'all' ? 'bg-ocean text-cream' : 'text-ocean/60 hover:bg-sand'}`}
              >
                All Listings
              </button>
              <button 
                onClick={() => setDestPageTab('hotel')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${destPageTab === 'hotel' ? 'bg-ocean text-cream' : 'text-ocean/60 hover:bg-sand'}`}
              >
                Hotels &amp; Resorts
              </button>
              <button 
                onClick={() => setDestPageTab('package')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${destPageTab === 'package' ? 'bg-ocean text-cream' : 'text-ocean/60 hover:bg-sand'}`}
              >
                Tour Packages
              </button>
              <button 
                onClick={() => setDestPageTab('transport')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${destPageTab === 'transport' ? 'bg-ocean text-cream' : 'text-ocean/60 hover:bg-sand'}`}
              >
                Transport options
              </button>
              <button 
                onClick={() => setDestPageTab('restaurant')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${destPageTab === 'restaurant' ? 'bg-ocean text-cream' : 'text-ocean/60 hover:bg-sand'}`}
              >
                Restaurants
              </button>
              <button 
                onClick={() => setDestPageTab('guide')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${destPageTab === 'guide' ? 'bg-ocean text-cream' : 'text-ocean/60 hover:bg-sand'}`}
              >
                Local Guides
              </button>
            </div>

            {/* List of cards */}
            {(() => {
              const matchedListings = listings.filter(item => {
                const matchDest = item.destination === selectedDestinationPage;
                const matchTab = destPageTab === 'all' || item.category === destPageTab;
                return matchDest && matchTab;
              });

              if (matchedListings.length === 0) {
                return (
                  <div className="bg-gray-50 rounded-2xl p-12 text-center text-gray-400 font-medium text-sm">
                    No active listings registered for this specific category in {selectedDestinationPage}.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedListings.map(listing => (
                    <div 
                      key={listing.id}
                      className="bg-white/90 card-glass rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all border border-ocean/10 group"
                    >
                      <div className="relative h-44 bg-cream overflow-hidden">
                        <img src={listing.imageUrl} alt={listing.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-ocean text-cream px-3 py-1 rounded-md text-xs font-bold">
                          ৳ {listing.price}
                        </div>
                      </div>
                      <div className="p-5 space-y-3.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="capitalize font-bold text-ocean bg-sand px-2.5 py-0.5 rounded-md text-[10px] tracking-wide">{listing.category}</span>
                          <span className="flex items-center gap-0.5 font-bold text-amber-900 bg-sand px-2 py-0.5 rounded-md text-[10px]">
                            <Star size={11} fill="currentColor" />
                            {listing.rating} ({listing.ratingCount})
                          </span>
                        </div>
                        <h3 className="serif font-bold text-ocean text-base line-clamp-1 group-hover:text-[#8a6f43] dark:group-hover:text-accent transition-colors mt-2">{listing.title}</h3>
                        <p className="text-xs text-ocean/80 line-clamp-2 leading-relaxed font-light">{listing.description}</p>

                        <button 
                          onClick={() => handleSelectBooking(listing)}
                          className="w-full bg-ocean hover:bg-ocean/90 text-cream font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-sm cursor-pointer uppercase tracking-widest text-[11px]"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* TAB 3: TRAVEL PLANNER INTEGRATOR */}
        {activeTab === 'planner' && (
          <motion.div 
            key="tab-planner"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-8 focus:outline-none"
          >
            <div className="bg-white/90 card-glass rounded-2xl p-6 md:p-8 shadow-sm border border-ocean/15 max-w-2xl mx-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-ocean/10 rounded-xl flex items-center justify-center text-ocean">
                  <Compass size={22} />
                </div>
                <div>
                  <h1 className="serif text-xl font-bold text-ocean">{dict.plannerTitle}</h1>
                  <p className="text-xs text-ocean/70 font-light mt-0.5">Avoid guesswork. Search packages inside your parameters</p>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-[10px] font-bold text-ocean/80 mb-1.5 uppercase tracking-widest">Select Hub</label>
                  <select 
                    value={plannerDest}
                    onChange={(e) => setPlannerDest(e.target.value as DestinationName)}
                    className="w-full bg-cream border border-ocean/10 rounded-xl py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-accent text-xs font-bold text-ocean"
                  >
                    {DESTINATIONS.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-ocean/80 mb-1.5 uppercase tracking-widest">Max Budget (৳)</label>
                    <input 
                      type="number"
                      value={plannerBudget}
                      onChange={(e) => setPlannerBudget(parseInt(e.target.value) || 5000)}
                      className="w-full bg-cream border border-ocean/10 rounded-xl py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-accent text-xs font-bold text-ocean"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ocean/80 mb-1.5 uppercase tracking-widest">Group Size</label>
                    <input 
                      type="number"
                      min={1}
                      value={plannerGroup}
                      onChange={(e) => setPlannerGroup(parseInt(e.target.value) || 1)}
                      className="w-full bg-cream border border-ocean/10 rounded-xl py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-accent text-xs font-bold text-ocean"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-ocean/80 mb-1.5 uppercase tracking-widest">Days of Tour</label>
                    <input 
                      type="number"
                      min={1}
                      value={plannerDays}
                      onChange={(e) => setPlannerDays(parseInt(e.target.value) || 1)}
                      className="w-full bg-cream border border-ocean/10 rounded-xl py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-accent text-xs font-bold text-ocean"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleRunPlanner}
                    className="w-full bg-ocean hover:bg-ocean/90 text-cream font-bold py-3.5 px-4 rounded-xl transition-all shadow-md active:scale-98 cursor-pointer uppercase tracking-widest text-[11px]"
                  >
                    Match Travel Plan
                  </button>
                </div>
              </div>
            </div>

            {/* Res Planner Results */}
            {plannerResults !== null && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="serif text-lg font-bold text-ocean border-b border-ocean/10 pb-2">Matching Stays &amp; Options ({plannerResults.length})</h2>
                {plannerResults.length === 0 ? (
                  <div className="bg-sand/30 rounded-2xl p-8 text-center text-ocean/65 font-medium text-xs border border-ocean/5 italic">
                    No individual packages fell in this budget brackets. Try elevating budget caps.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {plannerResults.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white/90 card-glass rounded-xl p-4 border border-ocean/10 shadow-sm flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                      >
                        <div className="flex gap-3 items-center">
                          <img 
                            src={item.imageUrl} 
                            alt={item.title}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div>
                            <h3 className="serif font-bold text-ocean text-sm">{item.title}</h3>
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-ocean bg-sand px-2 py-0.5 rounded mt-1 inline-block">{item.category}</span>
                            <p className="text-xs text-ocean/70 mt-1 font-light">Cost for {plannerDays} days: <span className="font-bold text-ocean">৳ {item.price * plannerDays}</span></p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleSelectBooking(item)}
                          className="bg-ocean text-cream font-bold text-[10px] uppercase tracking-widest py-2.5 px-5 rounded-md shadow-sm hover:bg-ocean/90 active:scale-95 transition-all text-center self-stretch sm:self-auto cursor-pointer"
                        >
                          Book Instantly
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 4: MY BOOKINGS DOCK */}
        {activeTab === 'bookings' && (
          <motion.div 
            key="tab-bookings"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="space-y-6 max-w-3xl mx-auto focus:outline-none"
          >
            <div className="flex justify-between items-center pb-4 border-b border-ocean/10">
              <div>
                <h1 className="serif text-xl font-bold tracking-tight text-ocean">Your Registered Itinerary</h1>
                <p className="text-xs text-ocean/60 font-light">Live booking status and transaction references</p>
              </div>
              <span className="bg-ocean/15 text-ocean text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">
                {myBookings.length} Bookings
              </span>
            </div>

            {myBookings.length === 0 ? (
              <div className="bg-white/90 card-glass rounded-2xl p-12 text-center text-ocean/60 border border-ocean/10 shadow-sm space-y-4">
                <Ticket className="mx-auto text-ocean/40" size={32} />
                <p className="serif font-medium text-sm italic">{dict.noBookings}</p>
                <button 
                  onClick={() => setActiveTab('home')}
                  className="bg-ocean text-cream text-[10px] uppercase tracking-widest font-bold px-6 py-2.5 rounded-md shadow-sm hover:bg-ocean/90 cursor-pointer"
                >
                  Explore Destinations
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((bk) => (
                  <div 
                    key={bk.id}
                    className="bg-white/95 card-glass rounded-2xl p-6 border border-ocean/15 shadow-sm relative overflow-hidden"
                  >
                    {/* Corner ribbon */}
                    <div className="absolute top-0 right-0 bg-forest text-cream text-[10px] font-bold uppercase py-1 px-4 rounded-bl-md tracking-wider select-none">
                      {bk.status}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider bg-sand text-ocean font-extrabold px-2.5 py-1 rounded-md">{bk.listingCategory}</span>
                        <h2 className="serif font-bold text-ocean text-lg mt-1">{bk.listingTitle}</h2>
                        
                        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-ocean/70 font-light mt-1">
                          <span className="flex items-center gap-1"><MapPin size={13} className="text-ocean/45" /> {bk.destination}</span>
                          <span className="flex items-center gap-1"><Calendar size={13} className="text-ocean/45" /> {bk.dateFrom} to {bk.dateTo}</span>
                          {bk.groupSize && <span className="flex items-center gap-1"><Users size={13} className="text-ocean/45" /> {bk.groupSize} Travelers</span>}
                        </div>
                      </div>

                      <div className="bg-cream/90 border border-ocean/5 p-4 rounded-xl md:text-right flex justify-between md:flex-col gap-2">
                        <div>
                          <p className="text-[10px] text-ocean/50 uppercase font-bold tracking-wider">Total Paid out</p>
                          <p className="font-extrabold text-ocean text-lg leading-none mt-1">৳ {bk.totalPrice}</p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider bg-sand text-ocean/80 px-2 py-0.5 rounded-md font-mono">{bk.paymentMethod} Verified</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dotted border-ocean/15 flex flex-wrap justify-between items-center text-[10px] text-ocean/50 font-medium">
                      <span>REF: {bk.paymentTxId}</span>
                      <span>Booked on: {new Date(bk.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* TAB 5: TRAVELER PROFILE & LOGOUT */}
        {activeTab === 'profile' && (
          <motion.div 
            key="tab-profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.25, 1, 0.5, 1] }}
            className="max-w-md mx-auto space-y-6 focus:outline-none"
          >
            <div className="bg-white/95 card-glass rounded-2xl p-6 border border-ocean/15 shadow-sm text-center space-y-4">
              <div className="relative inline-block">
                <img 
                  src={user.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2"} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-ocean/10"
                />
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-forest border-2 border-cream rounded-full"></span>
              </div>

              <div>
                <h2 className="serif text-xl font-bold text-ocean">{user.name}</h2>
                <p className="text-xs text-ocean/60 font-light">{user.email}</p>
                <span className="inline-block px-3.5 py-1 rounded-md bg-sand text-ocean text-[9px] font-bold uppercase tracking-widest mt-3 border border-ocean/5">
                  Verified Traveler
                </span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-2">
              <button 
                onClick={() => setUseBengali(!useBengali)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-left text-sm font-medium text-gray-700 transition-colors"
              >
                <span>Language / ভাষা</span>
                <span className="text-xs font-bold text-gray-400">{useBengali ? 'বাংলা' : 'English'}</span>
              </button>
              
              <button 
                onClick={() => setActiveTab('bookings')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 text-left text-sm font-medium text-gray-700 transition-colors"
              >
                <span>My Active Bookings</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{myBookings.length}</span>
              </button>

              <div className="h-px bg-gray-100 my-2"></div>

              <button 
                onClick={onLogout}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 text-left text-sm font-bold text-red-600 transition-colors group"
              >
                <span>Disconnect Account</span>
                <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>

      {/* DETAILED BOOKING MODAL (DOCK DRAWER OVERLAY) */}
      <AnimatePresence>
        {selectedListingForBooking && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ocean/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ y: 200, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 200, scale: 0.95 }}
              className="w-full max-w-lg bg-cream rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 space-y-6 max-h-[90vh] sm:max-h-[85vh] overflow-y-auto border-t sm:border border-ocean/15"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="bg-sand text-ocean text-[9px] font-bold tracking-widest px-2.5 py-1 rounded-md uppercase border border-ocean/5">
                    Checkout Summary
                  </span>
                  <h3 className="serif text-xl font-bold text-ocean mt-2">
                    Book {selectedListingForBooking.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedListingForBooking(null)}
                  className="p-1.5 hover:bg-sand rounded-full text-ocean/50 hover:text-ocean transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Step 1: Summary Form and Days calculation */}
              {bookingStep === 'summary' && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-center bg-white/70 p-3 rounded-xl border border-ocean/5">
                    <img 
                      src={selectedListingForBooking.imageUrl} 
                      alt="Thumbnail" 
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="serif font-bold text-ocean text-sm">{selectedListingForBooking.title}</h4>
                      <p className="text-xs text-ocean/65 font-light flex items-center gap-0.5 mt-0.5"><MapPin size={11} /> {selectedListingForBooking.destination}</p>
                      <p className="text-xs text-ocean font-bold mt-1">৳ {selectedListingForBooking.price} per night</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-ocean">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-ocean/70 mb-1">Check-in Date</label>
                      <input 
                        type="date"
                        value={bookingDateFrom}
                        onChange={(e) => setBookingDateFrom(e.target.value)}
                        className="w-full bg-white border border-ocean/15 rounded-xl py-2.5 px-3 text-xs focus:ring-accent font-bold text-ocean"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider font-extrabold text-ocean/70 mb-1">Days of Stay</label>
                      <input 
                        type="number"
                        min={1}
                        value={bookingDays}
                        onChange={(e) => setBookingDays(parseInt(e.target.value) || 1)}
                        className="w-full bg-white border border-ocean/15 rounded-xl py-2.5 px-3 text-xs focus:ring-accent font-bold text-ocean"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-extrabold text-ocean/70 mb-1">Group Size (People)</label>
                    <input 
                      type="number"
                      min={1}
                      max={12}
                      value={bookingGroupSize}
                      onChange={(e) => setBookingGroupSize(parseInt(e.target.value) || 1)}
                      className="w-full bg-white border border-ocean/15 rounded-xl py-2.5 px-3 text-xs focus:ring-accent font-bold text-ocean"
                    />
                  </div>

                  {/* Calculations breakdown */}
                  <div className="bg-cream/60 p-4 rounded-xl border border-ocean/5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-ocean/60 font-medium">Base Charge ({bookingDays} Days)</span>
                      <span className="text-ocean font-bold">৳ {selectedListingForBooking.price * bookingDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-ocean/60 font-medium">Ghurbo Platform Fee (5%)</span>
                      <span className="text-ocean font-bold">৳ {Math.round(selectedListingForBooking.price * bookingDays * 0.05)}</span>
                    </div>
                    <div className="h-px bg-ocean/10 my-2"></div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ocean font-bold">Total (All Inclusive)</span>
                      <span className="text-ocean font-extrabold">৳ {selectedListingForBooking.price * bookingDays + Math.round(selectedListingForBooking.price * bookingDays * 0.05)}</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleConfirmAndProceedPayment}
                    className="w-full bg-ocean hover:bg-ocean/90 text-cream font-bold py-3.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1 hover:gap-2 active:scale-98 cursor-pointer uppercase tracking-widest text-[11px]"
                  >
                    Confirm &amp; Pay Instantly
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* Step 2: Payment Selector and Simulation */}
              {bookingStep === 'payment' && (
                <div className="space-y-4">
                  <div className="flex bg-sand p-1 rounded-xl">
                    <button 
                      onClick={() => setPaymentMethod('bKash')}
                      className={`w-1/2 text-center py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer ${paymentMethod === 'bKash' ? 'bg-[#e2125f] text-[#FFFFFF] font-bold' : 'text-ocean/60'}`}
                    >
                      bKash
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('card')}
                      className={`w-1/2 text-center py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${paymentMethod === 'card' ? 'bg-ocean text-cream font-bold' : 'text-ocean/60'}`}
                    >
                      Stripe Card
                    </button>
                  </div>

                  {/* BKASH FLOW */}
                  {paymentMethod === 'bKash' && (
                    <div className="space-y-4 p-4 rounded-xl bg-white border border-pink-100 text-xs">
                      <div className="flex justify-center mb-2">
                        <span className="bg-[#e2125f] text-white font-extrabold px-4 py-2 rounded-md text-[10px] uppercase tracking-widest">bKash Checkout</span>
                      </div>

                      {bkashStep === 'number' && (
                        <div className="space-y-3">
                          <p className="text-gray-500">Enter your registered bKash wallet number to request secure token simulation</p>
                          <input 
                            type="text"
                            value={bkashNumber}
                            onChange={(e) => setBkashNumber(e.target.value)}
                            placeholder="e.g. 018XXXXXXXX"
                            className="w-full border-pink-300 border bg-white rounded-xl py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-[#e2125f] text-center font-bold text-gray-800 text-sm tracking-wider"
                          />
                          <button 
                            onClick={() => setBkashStep('otp')}
                            className="w-full bg-[#e2125f] hover:bg-[#c00f50] text-white font-bold py-3 px-4 rounded-xl text-center shadow-lg active:scale-98 transition-all cursor-pointer text-[11px] uppercase tracking-wider"
                          >
                            Send Verification Code
                          </button>
                        </div>
                      )}

                      {bkashStep === 'otp' && (
                        <div className="space-y-3">
                          <p className="text-gray-500 text-center">Ghurbo has simulated verification SMS to <span className="font-bold text-gray-700">{bkashNumber}</span>. Enter code:</p>
                          <input 
                            type="text"
                            value={bkashOTP}
                            onChange={(e) => setBkashOTP(e.target.value)}
                            placeholder="OTP Preset: 6284"
                            className="w-full border-pink-300 border bg-white rounded-xl py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-[#e2125f] text-center font-mono font-bold text-sm tracking-widest text-gray-800"
                          />
                          <button 
                            onClick={() => setBkashStep('pin')}
                            className="w-full bg-[#e2125f] hover:bg-[#c00f50] text-[#FFFFFF] font-bold py-3 px-4 rounded-xl text-center active:scale-98 transition-all cursor-pointer text-[11px] uppercase tracking-wider"
                          >
                            Verify OTP Code
                          </button>
                        </div>
                      )}

                      {bkashStep === 'pin' && (
                        <div className="space-y-3">
                          <div className="text-center p-3.5 bg-pink-50 rounded-xl border border-pink-150">
                            <span className="text-pink-800 font-extrabold block">Payment Amount: ৳ {selectedListingForBooking.price * bookingDays + Math.round(selectedListingForBooking.price * bookingDays * 0.05)}</span>
                          </div>
                          <p className="text-gray-500 text-center">Wallet connection verified! Enter secure PIN to charge:</p>
                          <input 
                            type="password"
                            maxLength={5}
                            value={bkashPIN}
                            onChange={(e) => setBkashPIN(e.target.value)}
                            placeholder="•••••"
                            className="w-full border-pink-300 border bg-white rounded-xl py-3 px-3.5 focus:outline-none focus:ring-2 focus:ring-[#e2125f] text-center font-bold text-gray-800 text-sm tracking-widest"
                          />
                          <button 
                            onClick={handleCompletePayment}
                            className="w-full bg-[#e2125f] hover:bg-[#c00f50] text-white font-bold py-3 px-4 rounded-xl text-center active:scale-98 transition-all shadow-md cursor-pointer text-[11px] uppercase tracking-widest"
                          >
                            Proceed to Complete Payment
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* STRIPE CARD FLOW */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4 p-4 rounded-2xl bg-white border border-ocean/10 text-xs text-ocean/80">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-ocean text-[11px] uppercase tracking-wider">Secure Stripe Payment</span>
                        <div className="flex gap-1.5 grayscale opacity-70">
                          <span className="bg-sand font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">Visa</span>
                          <span className="bg-sand font-bold px-1.5 py-0.5 rounded text-[9px] uppercase">MC</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-[9px] font-bold text-ocean/50 uppercase mb-1">Card Number</label>
                          <input 
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                            className="w-full border border-ocean/15 bg-cream rounded-xl py-2.5 px-3 text-xs focus:ring-accent text-ocean font-bold"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9px] font-bold text-ocean/50 uppercase mb-1">Expiration</label>
                            <input 
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full border border-ocean/15 bg-cream rounded-xl py-2.5 px-3 text-xs focus:ring-accent text-center text-ocean font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] font-bold text-ocean/50 uppercase mb-1">CVV Code</label>
                            <input 
                              type="password"
                              maxLength={3}
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                              placeholder="•••"
                              className="w-full border border-ocean/15 bg-cream rounded-xl py-2.5 px-3 text-xs focus:ring-accent text-center text-ocean font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-ocean/50 uppercase mb-1">Cardholder Name</label>
                          <input 
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="Mahatir Mohammad"
                            className="w-full border border-ocean/15 bg-cream rounded-xl py-2.5 px-3 text-xs focus:ring-accent text-ocean font-bold"
                          />
                        </div>

                        <div className="bg-sand/30 p-3 rounded-xl border border-ocean/5 flex items-center gap-2">
                          <ShieldCheck className="text-ocean/70 flex-shrink-0" size={16} />
                          <p className="text-[10px] text-ocean/70 leading-relaxed font-light">Secure 128-bit SSL encrypted connection verified.</p>
                        </div>

                        <button 
                          onClick={handleCompletePayment}
                          className="w-full bg-ocean hover:bg-ocean/90 text-cream font-bold py-3.5 px-4 rounded-xl text-center active:scale-98 transition-all cursor-pointer uppercase tracking-widest text-[11px]"
                        >
                          Charge Card: ৳ {selectedListingForBooking.price * bookingDays + Math.round(selectedListingForBooking.price * bookingDays * 0.05)}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment Success Landing */}
              {bookingStep === 'success' && (
                <div className="text-center p-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-forest/10 text-forest flex items-center justify-center mx-auto">
                    <CheckCircle2 size={38} />
                  </div>
                  <h3 className="serif text-xl font-bold text-ocean">Booking Confirmed!</h3>
                  <p className="text-xs text-ocean/65 leading-relaxed max-w-sm mx-auto font-light">
                    Excellent! Your payment was charged successfully. Both you and the local entrepreneur got instantaneous confirmations. Gaze upon details in itinerary.
                  </p>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => {
                        setSelectedListingForBooking(null);
                        setActiveTab('bookings');
                      }}
                      className="w-1/2 bg-sand hover:bg-accent/20 text-ocean font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
                    >
                      View Itinerary
                    </button>
                    <button 
                     onClick={() => {
                        setSelectedListingForBooking(null);
                        setActiveTab('home');
                      }}
                      className="w-1/2 bg-ocean hover:bg-ocean/90 text-cream font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider text-[10px]"
                    >
                      Explore More
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER SYSTEM DIALOG MODAL */}
      <AnimatePresence>
        {showFiltersModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ocean/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="w-full max-w-sm bg-cream rounded-2xl shadow-2xl p-6 space-y-6 border border-ocean/15"
            >
              <div className="flex justify-between items-center pb-2 border-b border-ocean/10">
                <h3 className="serif font-bold text-ocean text-lg">Filter Services</h3>
                <button onClick={() => setShowFiltersModal(false)} className="text-ocean/55 hover:text-ocean cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Price range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-ocean/80">
                  <span>Max Price Per Day</span>
                  <span>৳ {selectedPriceMax}</span>
                </div>
                <input 
                  type="range"
                  min={500}
                  max={20000}
                  step={500}
                  value={selectedPriceMax}
                  onChange={(e) => setSelectedPriceMax(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-sand rounded-lg appearance-none cursor-pointer accent-ocean"
                />
              </div>

              {/* Destination selector */}
              <div className="space-y-2 text-xs">
                <span className="block font-bold text-ocean/80 uppercase tracking-wider text-[10px]">Travel Destination</span>
                <select 
                  value={selectedDestFilter}
                  onChange={(e) => setSelectedDestFilter(e.target.value)}
                  className="w-full bg-white border border-ocean/15 rounded-xl py-2 px-3 focus:ring-accent text-ocean font-bold text-xs"
                >
                  <option value="All">All Hubs (Bangladesh)</option>
                  {DESTINATIONS.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              {/* Rating selection */}
              <div className="space-y-2 text-xs">
                <span className="block font-bold text-ocean/80 uppercase tracking-wider text-[10px]">Minimum Rating</span>
                <div className="flex gap-2">
                  {[0, 4.5, 4.7, 4.9].map((val) => (
                    <button
                      key={val}
                      onClick={() => setSelectedRatingMin(val)}
                      className={`flex-grow py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${selectedRatingMin === val ? 'bg-ocean border-ocean text-cream' : 'bg-white border-ocean/15 text-ocean/60 hover:bg-sand'}`}
                    >
                      {val === 0 ? 'Any' : `${val} ✨`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button 
                  onClick={() => {
                    setSelectedDestFilter('All');
                    setSelectedPriceMax(20000);
                    setSelectedRatingMin(0);
                    setShowFiltersModal(false);
                  }}
                  className="w-1/2 bg-sand hover:bg-[#EAE5DC] font-bold text-xs py-2.5 rounded-xl text-ocean transition-all cursor-pointer uppercase tracking-wider text-[10px]"
                >
                  Clear All
                </button>
                <button 
                  onClick={() => setShowFiltersModal(false)}
                  className="w-1/2 bg-ocean hover:bg-ocean/90 text-cream font-bold text-xs py-2.5 rounded-xl shadow-sm cursor-pointer uppercase tracking-wider text-[10px]"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING GLASS BAR NAVIGATION DOCK */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[95%] z-45 bg-cream/70 dark:bg-[#071d2c]/70 backdrop-blur-2xl shadow-[0_12px_32px_-4px_rgba(0,102,135,0.12),_inset_0_1px_1px_rgba(255,255,255,0.85)] dark:shadow-[0_16px_40px_-4px_rgba(0,0,0,0.65),_inset_0_1px_1px_rgba(255,255,255,0.15)] border border-white/50 dark:border-white/10 rounded-full p-1 flex justify-between items-center max-w-sm transition-all duration-300">
        {/* Home */}
        <button 
          onClick={() => { setActiveTab('home'); setSelectedDestinationPage(null); }}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'home' && (
            <motion.div
              layoutId="activeTabTravelerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-ocean rounded-full -z-10"
            />
          )}
          <Compass size={17} className={activeTab === 'home' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'home' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'}`}>
            {useBengali ? 'হোম' : 'Home'}
          </span>
        </button>

        {/* Destinations */}
        <button 
          onClick={() => { setActiveTab('destinations'); setSelectedDestinationPage(null); }}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'destinations' && (
            <motion.div
              layoutId="activeTabTravelerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-ocean rounded-full -z-10"
            />
          )}
          <MapPin size={17} className={activeTab === 'destinations' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'destinations' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'}`}>
            {useBengali ? 'গন্তব্য' : 'Hubs'}
          </span>
        </button>

        {/* Planner */}
        <button 
          onClick={() => { setActiveTab('planner'); setSelectedDestinationPage(null); }}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'planner' && (
            <motion.div
              layoutId="activeTabTravelerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-ocean rounded-full -z-10"
            />
          )}
          <Search size={17} className={activeTab === 'planner' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'planner' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'}`}>
            {useBengali ? 'প্ল্যানার' : 'Planner'}
          </span>
        </button>

        {/* Bookings */}
        <button 
          onClick={() => { setActiveTab('bookings'); setSelectedDestinationPage(null); }}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'bookings' && (
            <motion.div
              layoutId="activeTabTravelerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-ocean rounded-full -z-10"
            />
          )}
          <div className="relative">
            <Ticket size={17} className={activeTab === 'bookings' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'} />
            {myBookings.length > 0 && (
              <span className={`absolute -top-1 -right-1.5 w-2 h-2 rounded-full ${activeTab === 'bookings' ? 'bg-[#e2125f] border border-ocean shadow-sm' : 'bg-[#e2125f]'}`}></span>
            )}
          </div>
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'bookings' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'}`}>
            {useBengali ? 'বুকিং' : 'Bookings'}
          </span>
        </button>

        {/* Profile */}
        <button 
          onClick={() => { setActiveTab('profile'); setSelectedDestinationPage(null); }}
          className="flex-grow flex-1 relative flex flex-col items-center justify-center py-2 px-1 rounded-full cursor-pointer transition-colors"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {activeTab === 'profile' && (
            <motion.div
              layoutId="activeTabTravelerPill"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="absolute inset-0 bg-ocean rounded-full -z-10"
            />
          )}
          <User size={17} className={activeTab === 'profile' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'} />
          <span className={`text-[9px] font-bold mt-0.5 leading-none ${activeTab === 'profile' ? 'text-cream' : 'text-ocean/55 dark:text-cream/50'}`}>
            {useBengali ? 'প্রোফাইল' : 'Profile'}
          </span>
        </button>
      </nav>
    </div>
  );
}

// Simple Helper Component for Back navigation chevron
function ChevronLeft(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
