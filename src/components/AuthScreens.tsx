import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Mail, Lock, Sparkles, Building, ChevronLeft, 
  ShieldCheck, ArrowRight, Upload, Compass, Eye, EyeOff, CheckCircle2 
} from 'lucide-react';
import { UserProfile, ListingCategory } from '../types';

const ONBOARDING_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1000&q=80', // Beautiful Cox's Bazar Beach
    title: 'Lets explore',
    titleItalic: 'the world',
    subtitle: 'Because planning should never hold back your adventure.'
  },
  {
    image: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=1000&q=80', // Sajek Valley mountains
    title: 'Discover the',
    titleItalic: 'hill tracts',
    subtitle: 'Wander above the clouds in Sajek and taste authentic hill hospitality.'
  },
  {
    image: 'https://images.unsplash.com/photo-1590001155093-a3c66ab0c3ff?auto=format&fit=crop&w=1000&q=80', // Sylhet Tea Gardens
    title: 'Enjoy supreme',
    titleItalic: 'escapes',
    subtitle: 'Get tailored cottages, local expert guides, and traditional dining houses.'
  }
];

const DEFAULT_SAVED_ENTREPRENEURS: UserProfile[] = [
  {
    id: 'entrepreneur_default',
    name: 'Mike George',
    email: 'partner@ghurbo.com',
    role: 'entrepreneur',
    isOnboarded: true,
    avatarUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80',
    onboardingData: {
      businessName: 'Bengal Luxe Retreats',
      businessDesc: 'We offer exclusive luxury cottages and custom guided journeys in beautiful valleys.',
      category: 'hotel',
      yearsOperating: 4,
      contactInfo: '+8801824141511',
      location: 'Cox_s Bazar',
      faqServiceType: 'Beachfront cottages and private pools',
      logoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'
    }
  },
  {
    id: 'entrepreneur_rest',
    name: 'Al-Amin Khan',
    email: 'khan_eats@ghurbo.com',
    role: 'entrepreneur',
    isOnboarded: true,
    avatarUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80',
    onboardingData: {
      businessName: 'Spices of Haor Restaurant',
      businessDesc: 'Local authentic Sylheti cuisine and fresh fish dishes right by the water.',
      category: 'restaurant',
      yearsOperating: 3,
      contactInfo: '+8801711223344',
      location: 'Haor',
      faqServiceType: 'Local Bengali Traditional Food & Fresh Haor Fish Curries',
      logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'
    }
  }
];

interface AuthScreensProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthScreens({ onLoginSuccess }: AuthScreensProps) {
  const [authMode, setAuthMode] = useState<'selection' | 'entrepreneur_onboarding'>('selection');
  const [activeRole, setActiveRole] = useState<'traveler' | 'entrepreneur'>('traveler');
  
  const [slideIndex, setSlideIndex] = useState(0);
  const [isOnboardingDismissed, setIsOnboardingDismissed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [savedEntrepreneurs, setSavedEntrepreneurs] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ghurbo_saved_entrepreneurs');
    if (saved) {
      return JSON.parse(saved);
    } else {
      localStorage.setItem('ghurbo_saved_entrepreneurs', JSON.stringify(DEFAULT_SAVED_ENTREPRENEURS));
      return DEFAULT_SAVED_ENTREPRENEURS;
    }
  });

  const [savedTravelers, setSavedTravelers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('ghurbo_saved_travelers');
    return saved ? JSON.parse(saved) : [];
  });

  // Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessDesc, setBusinessDesc] = useState('');
  const [contactName, setContactName] = useState('');
  const [category, setCategory] = useState<ListingCategory>('hotel');
  const [yearsOperating, setYearsOperating] = useState<number>(1);
  const [location, setLocation] = useState('Cox_s Bazar');
  const [faqServiceType, setFaqServiceType] = useState('Premium Luxury Stays with ocean views');
  const [contactInfo, setContactInfo] = useState('+8801700000000');
  const [shackLogo, setShackLogo] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80');

  const [onboardingStep, setOnboardingStep] = useState(1);

  // Dynamic Simulated Google Sign In Suite
  interface GoogleAccount {
    name: string;
    email: string;
    avatarUrl: string;
  }

  const DEFAULT_GOOGLE_ACCOUNTS: GoogleAccount[] = [
    {
      name: 'Mahatir Mohammad',
      email: 'mahatirmohammad27@gmail.com',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcXEScGLlQKJMW8M9Ln32VhQ5JNM0DD_BxAOYFZgQ1LOIJDncyqBOU64smScjRLNQ781HCjoetRmYpRjceiphcelBpqGAArq2OVJYiviH8EeYVMUqZnYTk9HPouQhcarCCgW55osaQNfuixGE-7hArs9H0jTOp7E30qyAC3FrpK1DUS5B20BVjBdYWqSfc-6bGmNQnD2fOibJ6X8Nx6W3RKDZ-JhYI6z010kpEox_mJrmD3wKDXRffNtN3mAe_Q_tGk_SW7nnBo-s'
    },
    {
      name: 'Mike George',
      email: 'partner@ghurbo.com',
      avatarUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Al-Amin Khan',
      email: 'khan_eats@ghurbo.com',
      avatarUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Anika Kabir',
      email: 'anika.kabir@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Fahim Ahmed',
      email: 'fahim.ahmed@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
    }
  ];

  const PRESET_AVATAR_IMAGES = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  ];

  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [googleAccounts, setGoogleAccounts] = useState<GoogleAccount[]>(() => {
    const saved = localStorage.getItem('ghurbo_google_accounts');
    return saved ? JSON.parse(saved) : DEFAULT_GOOGLE_ACCOUNTS;
  });

  const [showNewGoogleForm, setShowNewGoogleForm] = useState(false);
  const [newGoogleEmail, setNewGoogleEmail] = useState('');
  const [newGoogleName, setNewGoogleName] = useState('');
  const [newGoogleAvatar, setNewGoogleAvatar] = useState(PRESET_AVATAR_IMAGES[0]);

  const handleSelectGoogleAccount = (acc: GoogleAccount) => {
    setShowGooglePopup(false);

    if (activeRole === 'traveler') {
      // Create or load stable traveler profile
      const stableID = 'traveler_google_' + acc.email.toLowerCase().replace(/[@.]/g, '_');
      const existing = savedTravelers.find(u => u.email.toLowerCase() === acc.email.toLowerCase());
      
      let travelerUser: UserProfile;
      if (existing) {
        travelerUser = {
          ...existing,
          name: acc.name, // Keep synced with Google
          avatarUrl: acc.avatarUrl
        };
      } else {
        travelerUser = {
          id: stableID,
          name: acc.name,
          email: acc.email,
          role: 'traveler',
          isOnboarded: true,
          avatarUrl: acc.avatarUrl
        };
      }

      const updated = [travelerUser, ...savedTravelers.filter(u => u.email.toLowerCase() !== acc.email.toLowerCase())];
      setSavedTravelers(updated);
      localStorage.setItem('ghurbo_saved_travelers', JSON.stringify(updated));

      onLoginSuccess(travelerUser);
    } else {
      // Entrepreneur Login with Google Account
      const existing = savedEntrepreneurs.find(u => u.email.toLowerCase() === acc.email.toLowerCase());
      if (existing) {
        // If they already have an onboarded brand under this Gmail account, log them right in
        onLoginSuccess(existing);
      } else {
        // Start entrepreneur onboarding wizard pre-populated with their unique Google credentials!
        setEmail(acc.email);
        setContactName(acc.name);
        setShackLogo(acc.avatarUrl); // Sync Gmail profile picture as business brand icon
        setBusinessName(acc.name + ' Heritage Stays');
        setBusinessDesc(`High-quality boutique accommodations and bespoke local travel services hosted by ${acc.name}.`);
        setAuthMode('entrepreneur_onboarding');
        setOnboardingStep(1);
      }
    }
  };

  const handleCreateNewGoogleAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoogleEmail || !newGoogleName) return;

    // Standardize gmail format
    let finalizedEmail = newGoogleEmail.trim();
    if (!finalizedEmail.includes('@')) {
      finalizedEmail += '@gmail.com';
    }

    const newAcc: GoogleAccount = {
      name: newGoogleName,
      email: finalizedEmail,
      avatarUrl: newGoogleAvatar
    };

    const updated = [newAcc, ...googleAccounts];
    setGoogleAccounts(updated);
    localStorage.setItem('ghurbo_google_accounts', JSON.stringify(updated));

    // Reset inputs
    setNewGoogleEmail('');
    setNewGoogleName('');
    setShowNewGoogleForm(false);

    // Auto select this newly registered credentials profile
    handleSelectGoogleAccount(newAcc);
  };

  // Login handler
  const handleFormLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (activeRole === 'traveler') {
      // Simulate traveler login with custom email
      const stableID = 'traveler_email_' + email.toLowerCase().replace(/[@.]/g, '_');
      const existing = savedTravelers.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      let travelerUser: UserProfile;
      if (existing) {
        travelerUser = existing;
      } else {
        travelerUser = {
          id: stableID,
          name: email.split('@')[0],
          email: email,
          role: 'traveler',
          isOnboarded: true,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`
        };
      }

      const updated = [travelerUser, ...savedTravelers.filter(u => u.email.toLowerCase() !== email.toLowerCase())];
      setSavedTravelers(updated);
      localStorage.setItem('ghurbo_saved_travelers', JSON.stringify(updated));

      onLoginSuccess(travelerUser);
    } else {
      // Entrepreneur Login
      const existing = savedEntrepreneurs.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        onLoginSuccess(existing);
      } else {
        // Trigger entrepreneur onboarding steps to populate profiles!
        setAuthMode('entrepreneur_onboarding');
        setOnboardingStep(1);
      }
    }
  };

  // Finish Entrepreneur onboarding
  const handleCompleteOnboarding = () => {
    const finalId = 'entrepreneur_google_' + (email || 'partner_ghurbo_com').toLowerCase().replace(/[@.]/g, '_');
    const entrepreneurUser: UserProfile = {
      id: finalId,
      name: contactName || 'Mike George',
      email: email || 'partner@ghurbo.com',
      role: 'entrepreneur',
      isOnboarded: true,
      avatarUrl: shackLogo,
      onboardingData: {
        businessName: businessName || 'Bengal Luxe Retreats',
        businessDesc: businessDesc || 'We offer exclusive luxury cottages and custom guided journeys in beautiful valleys.',
        category: category,
        yearsOperating: yearsOperating,
        contactInfo: contactInfo,
        location: location,
        faqServiceType: faqServiceType,
        logoUrl: shackLogo
      }
    };

    // Save to saved entrepreneurs registry
    const existIndex = savedEntrepreneurs.findIndex(u => u.email.toLowerCase() === entrepreneurUser.email.toLowerCase());
    let updated: UserProfile[];
    if (existIndex > -1) {
      updated = [...savedEntrepreneurs];
      updated[existIndex] = entrepreneurUser;
    } else {
      updated = [entrepreneurUser, ...savedEntrepreneurs];
    }
    setSavedEntrepreneurs(updated);
    localStorage.setItem('ghurbo_saved_entrepreneurs', JSON.stringify(updated));

    onLoginSuccess(entrepreneurUser);
  };

  const handleOnboardingNext = () => {
    if (slideIndex < ONBOARDING_SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setIsOnboardingDismissed(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] flex items-center justify-center p-0 md:p-6 lg:p-12 font-sans overflow-y-auto">
      <div id="login-container-card" className="w-full max-w-5xl md:bg-white md:rounded-[36px] md:shadow-[0_24px_60px_rgba(0,0,0,0.06)] md:border md:border-gray-100 md:min-h-[640px] md:grid md:grid-cols-12 overflow-hidden">
        
        {/* LEFT COLUMN: Premium Onboarding Visual Slides (Mockup Left Screen) */}
        {(!isOnboardingDismissed || window.innerWidth >= 768) && (
          <div className={`col-span-5 relative flex flex-col justify-between p-8 sm:p-10 text-white overflow-hidden min-h-[500px] md:min-h-0 ${isOnboardingDismissed ? 'hidden md:flex' : 'flex w-full md:w-auto md:flex'}`}>
            
            {/* Background Slides with AnimatePresence */}
            <div className="absolute inset-0 z-0 bg-gray-900">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slideIndex}
                  initial={{ opacity: 0.75, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.75, scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${ONBOARDING_SLIDES[slideIndex].image})` }}
                />
              </AnimatePresence>
              {/* Soft Gradient Overlay for text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-gray-900/40" />
            </div>

            {/* Skip Option in Header */}
            <div className="z-10 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#d8f2ff] drop-shadow-sm bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">GHURBO</span>
              <button
                type="button"
                onClick={() => setIsOnboardingDismissed(true)}
                className="text-xs font-extrabold hover:text-white/80 transition-colors uppercase cursor-pointer text-white/90 drop-shadow-sm flex items-center gap-1.5"
              >
                Skip
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Onboarding Info & Action */}
            <div className="z-10 mt-auto space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl sm:text-4.5xl font-black leading-tight tracking-tight text-white drop-shadow-md">
                  {ONBOARDING_SLIDES[slideIndex].title} <br/>
                  <span className="font-serif italic font-normal text-[#fcf6e8]">{ONBOARDING_SLIDES[slideIndex].titleItalic}</span>
                </h1>
                <p className="text-sm font-medium text-[#edf2f7] leading-relaxed max-w-sm drop-shadow-sm">
                  {ONBOARDING_SLIDES[slideIndex].subtitle}
                </p>
              </div>

              {/* Dots row and Next button exactly as in image layout */}
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  {/* Indicator Pills */}
                  <div className="flex gap-2">
                    {ONBOARDING_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSlideIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ease-out cursor-pointer ${slideIndex === idx ? 'w-7 bg-blue-500' : 'w-2 bg-white/40'}`}
                      />
                    ))}
                  </div>

                  {/* Tiny status indicator */}
                  <span className="text-[10px] font-bold text-white/50">{slideIndex + 1} / 3</span>
                </div>

                <button
                  type="button"
                  onClick={handleOnboardingNext}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-6 rounded-2xl shadow-[0_8px_30px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_35px_rgba(59,130,246,0.45)] transition-all cursor-pointer text-center text-sm font-sans"
                >
                  {slideIndex === ONBOARDING_SLIDES.length - 1 ? "Let's Explore" : "Next"}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* RIGHT COLUMN: Cool Minimal Login Form / Onboarding Form (Mockup Right Screen) */}
        {(isOnboardingDismissed || window.innerWidth >= 768) && (
          <div className="col-span-7 flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-20 bg-white min-h-screen md:min-h-0 w-full animate-fade-in">
            
            {/* Go Back to onboarding slide link on mobile */}
            {isOnboardingDismissed && (
              <button 
                onClick={() => setIsOnboardingDismissed(false)}
                className="md:hidden flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 mb-6 group font-bold tracking-wider"
              >
                <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                SHOW INTRO
              </button>
            )}

            {/* Selection/Login Mode */}
            {authMode === 'selection' && (
              <div>
                {/* Brand Logo Header - matching TripTastic minimalist layout */}
                <div className="flex items-center gap-3.5 mb-10">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(59,130,246,0.25)] transform rotate-6 hover:rotate-12 transition-transform">
                    <Compass size={22} className="text-white ring-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight leading-none font-sans">Ghurbo.</h2>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Explore Bengal</p>
                  </div>
                </div>

                {/* Minimal Segmented Tab Control */}
                <div className="bg-gray-100 p-1.5 rounded-2xl mb-8 flex border border-gray-50">
                  <button 
                    type="button"
                    onClick={() => setActiveRole('traveler')}
                    className={`flex-grow py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${activeRole === 'traveler' ? 'bg-white text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.03)] border-b border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    I am a Traveler
                  </button>
                  <button 
                    type="button"
                    onClick={() => setActiveRole('entrepreneur')}
                    className={`flex-grow py-2.5 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${activeRole === 'entrepreneur' ? 'bg-white text-gray-900 shadow-[0_4px_10px_rgba(0,0,0,0.03)] border-b border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    I am an Entrepreneur
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-800 tracking-tight">
                    {activeRole === 'traveler' ? 'Sign In to Discover' : 'Partner Dashboard'}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium mt-1.5 leading-relaxed">
                    {activeRole === 'traveler' 
                      ? 'Secure, authentic local stay & customized tour accommodations across Bangladesh.' 
                      : 'List and manage properties, tours, guides, local food houses & boutique hospitality.'}
                  </p>
                </div>

                {/* Main Minimal Credentials Form */}
                <form onSubmit={handleFormLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-450 font-bold mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="polex@gmail.com"
                      className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-450 font-bold mb-1.5">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Keep Remember Me & Forgot Password aligned */}
                  <div className="flex items-center justify-between text-xs font-bold text-gray-400 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-gray-300 text-blue-500 focus:ring-blue-400 cursor-pointer" 
                      />
                      <span>Remember me</span>
                    </label>
                    <button 
                      type="button" 
                      onClick={() => {
                        alert(`A quick recovery path has been dispatched for ${email || 'your registered account'}.`);
                      }}
                      className="hover:text-blue-500 transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="space-y-3 pt-4">
                    {/* Action button 1: Sign In (Vibrant Blue) */}
                    <button
                      type="submit"
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.18)] hover:shadow-[0_8px_25px_rgba(59,130,246,0.25)] transition-all cursor-pointer text-sm tracking-wide text-center uppercase"
                    >
                      Sign In
                    </button>

                    {/* Action button 2: Create Account (White Outline) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (activeRole === 'traveler') {
                          setShowGooglePopup(true); // Open the dynamic Google selector to create traveler profile
                        } else {
                          // Start entrepreneur onboarding step wizard inside the same card!
                          setAuthMode('entrepreneur_onboarding');
                          setOnboardingStep(1);
                        }
                      }}
                      className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer text-sm tracking-wide text-center uppercase"
                    >
                      Create Account
                    </button>
                  </div>
                </form>

                {/* Social Login Icons at Very Bottom - matching the exact mockup array */}
                <div className="mt-8">
                  <div className="flex items-center justify-center my-5">
                    <div className="flex-grow h-px bg-gray-100"></div>
                    <span className="text-[10px] text-gray-400 font-extrabold px-3 uppercase tracking-widest">Or login with</span>
                    <div className="flex-grow h-px bg-gray-100"></div>
                  </div>

                  <div className="flex justify-center items-center gap-5">
                    <button
                      type="button"
                      onClick={() => setShowGooglePopup(true)}
                      className="w-12 h-12 rounded-full border border-gray-150 flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 cursor-pointer"
                      title="Google Provider"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.74 0 3.3.6 4.53 1.77l3.38-3.38C17.88 1.41 15.17.62 12 .62c-4.91 0-9.03 2.81-11.03 6.91l3.77 2.92C5.69 7.15 8.58 5.04 12 5.04z"/>
                        <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.54h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.88 3.39-8.66z"/>
                        <path fill="#FBBC05" d="M4.74 14.37c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L.97 6.91C.35 8.16 0 10.02 0 12s.35 3.84.97 5.09l3.77-2.72z"/>
                        <path fill="#34A853" d="M12 23.38c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.42 0-6.31-2.11-7.34-5.35L.89 16.2c2 4.1 6.12 6.91 11.11 6.91z"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const fbUser: UserProfile = {
                          id: 'traveler_' + Math.floor(Math.random() * 10000),
                          name: 'Fahim Ahmed',
                          email: 'fahim@ghurbo.com',
                          role: 'traveler',
                          isOnboarded: true,
                          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
                        };
                        onLoginSuccess(fbUser);
                      }}
                      className="w-12 h-12 rounded-full border border-gray-150 flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 cursor-pointer"
                      title="Facebook Provider"
                    >
                      <svg className="w-5.5 h-5.5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const appleUser: UserProfile = {
                          id: 'traveler_' + Math.floor(Math.random() * 10000),
                          name: 'Anika Kabir',
                          email: 'anika@ghurbo.com',
                          role: 'traveler',
                          isOnboarded: true,
                          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
                        };
                        onLoginSuccess(appleUser);
                      }}
                      className="w-12 h-12 rounded-full border border-gray-150 flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm active:scale-95 cursor-pointer"
                      title="Apple ID"
                    >
                      <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.64.74-1.2 1.88-1.05 3 .1.1.05.05.07.05 1.12 0 2.27-.68 2.93-1.49"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* SAVED PROFILES SECTION: Beautiful minimal layout integrated smoothly */}
                {savedEntrepreneurs.length > 0 && activeRole === 'entrepreneur' && (
                  <div className="mt-8 pt-6 border-t border-gray-100 animate-slide-up">
                    <div className="flex justify-between items-center mb-3.5">
                      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Saved Partner Profiles
                      </h3>
                      <span className="text-[10px] text-blue-500 font-extrabold uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                        1-Click Login
                      </span>
                    </div>
                    <div className="space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
                      {savedEntrepreneurs.map((ent) => (
                        <div 
                          key={ent.id}
                          className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all duration-200 shadow-sm group"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setEmail(ent.email);
                              setPassword('••••••••');
                              onLoginSuccess(ent);
                            }}
                            className="flex-grow flex items-center gap-3.5 text-left min-w-0 cursor-pointer text-gray-700"
                          >
                            <img 
                              src={ent.avatarUrl || ent.onboardingData?.logoUrl} 
                              alt="Brand Logo" 
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-sm transition-transform group-hover:scale-105"
                            />
                            <div className="min-w-0 flex-grow">
                              <p className="font-bold text-gray-950 text-xs truncate group-hover:text-blue-500 transition-colors leading-snug">
                                {ent.onboardingData?.businessName || ent.name}
                              </p>
                              <p className="text-[10px] text-gray-400 font-semibold truncate leading-tight mt-0.5">
                                {ent.name} • {ent.email}
                              </p>
                              {ent.onboardingData?.category && (
                                <span className="inline-block mt-1 px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                                  {ent.onboardingData.category}
                                </span>
                              )}
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = savedEntrepreneurs.filter(u => u.id !== ent.id);
                              setSavedEntrepreneurs(updated);
                              localStorage.setItem('ghurbo_saved_entrepreneurs', JSON.stringify(updated));
                            }}
                            className="p-1 px-2.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50/70 transition-all cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                            title="Delete Profile"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Entrepreneur Onboarding Wizard Mode */}
            {authMode === 'entrepreneur_onboarding' && (
              <div className="animate-fade-in">
                {/* Back Link */}
                <button 
                  onClick={() => {
                    setAuthMode('selection');
                    setOnboardingStep(1);
                  }}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 mb-6 group font-bold tracking-wider"
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                  GO BACK
                </button>

                {/* Step indicator pills */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-extrabold text-blue-600 uppercase tracking-widest">
                    Partner Registration — Step {onboardingStep} of 3
                  </span>
                  <div className="flex gap-1.5">
                    <div className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${onboardingStep >= 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${onboardingStep >= 2 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                    <div className={`h-1.5 w-6 rounded-full transition-colors duration-300 ${onboardingStep >= 3 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                  </div>
                </div>

                {/* Step 1: Base Business Info */}
                {onboardingStep === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="serif text-xl font-bold text-gray-800">Your Travel Brand Details</h3>
                    <p className="text-xs text-gray-400 font-medium mb-4 leading-relaxed">Establish your public partner profile for customers to find your listings easily.</p>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Business Name</label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Sajek Wooden Hills Resort & Spa"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Short Service Description</label>
                      <textarea
                        rows={3}
                        required
                        value={businessDesc}
                        onChange={(e) => setBusinessDesc(e.target.value)}
                        placeholder="What exclusive service sets your brand apart for travelers across Bengal?"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Select Service Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as ListingCategory)}
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all cursor-pointer"
                      >
                        <option value="hotel">Hotels &amp; Resorts</option>
                        <option value="transport">Transport Provider</option>
                        <option value="restaurant">Food Houses &amp; Dining (Restaurants)</option>
                        <option value="guide">Verified Local Guides</option>
                        <option value="package">Tour Packages</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          if (!businessName || !businessDesc) {
                            alert("Please supply a business name & short description to progress.");
                            return;
                          }
                          setOnboardingStep(2);
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.18)] transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-[11px] cursor-pointer"
                      >
                        Continue to Step 2
                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Location & Background */}
                {onboardingStep === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="serif text-xl font-bold text-gray-800">Destination Details &amp; FAQ</h3>
                    <p className="text-xs text-gray-400 font-medium mb-4 leading-relaxed">Let travelers find your services instantly by selecting your key operation hubs.</p>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Tourism Destination Hub</label>
                      <select
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all cursor-pointer"
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
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Years of Business Operations</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={yearsOperating}
                        onChange={(e) => setYearsOperating(parseInt(e.target.value) || 1)}
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Identify your signature features / highlights</label>
                      <input
                        type="text"
                        required
                        value={faqServiceType}
                        onChange={(e) => setFaqServiceType(e.target.value)}
                        placeholder="e.g. Eco wood structure, beachfront pool, local Bengali dishes"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setOnboardingStep(1)}
                        className="w-1/2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer text-[11px] uppercase tracking-wider"
                      >
                        Go Back
                      </button>
                      <button
                        onClick={() => setOnboardingStep(3)}
                        className="w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.18)] transition-all cursor-pointer text-[11px] uppercase tracking-wider"
                      >
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Brand Logo & Verification Contacts */}
                {onboardingStep === 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                    <h3 className="serif text-xl font-bold text-gray-800">Partner Credentials</h3>
                    <p className="text-xs text-gray-400 font-medium mb-4 leading-relaxed font-sans">Finalize contacts to connect live communications.</p>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Operating Partner Name</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Al-Amin Khan"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Direct Mobile Call Center / Contact No</label>
                      <input
                        type="text"
                        required
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="e.g. +8801700100200"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl px-4 py-3 text-sm font-semibold text-gray-800 bg-white placeholder-gray-400 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 mb-1.5">Choose Partner Icon / Avatar Profile Preset</label>
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                        <img
                          src={shackLogo}
                          alt="Selected Logo"
                          className="w-14 h-14 rounded-xl object-cover border border-gray-200 shadow-sm bg-white"
                        />
                        <div className="flex-grow space-y-1.5">
                          <p className="text-[10px] text-gray-400 font-bold">Select style:</p>
                          <div className="flex gap-2.5">
                            <button
                              type="button"
                              onClick={() => setShackLogo('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80')}
                              className={`w-7 h-7 rounded-full border bg-cover bg-center cursor-pointer transition-all ${shackLogo.includes('photo-154606') ? 'ring-2 ring-blue-500 scale-105' : 'opacity-80'}`}
                              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=50&q=80')" }}
                            ></button>
                            <button
                              type="button"
                              onClick={() => setShackLogo('https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=150&q=80')}
                              className={`w-7 h-7 rounded-full border bg-cover bg-center cursor-pointer transition-all ${shackLogo.includes('photo-15796') ? 'ring-2 ring-blue-500 scale-105' : 'opacity-80'}`}
                              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&w=50&q=80')" }}
                            ></button>
                            <button
                              type="button"
                              onClick={() => setShackLogo('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80')}
                              className={`w-7 h-7 rounded-full border bg-cover bg-center cursor-pointer transition-all ${shackLogo.includes('photo-15190') ? 'ring-2 ring-blue-500 scale-105' : 'opacity-80'}`}
                              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=50&q=80')" }}
                            ></button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setOnboardingStep(2)}
                        className="w-1/3 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 font-bold py-3.5 px-4 rounded-2xl transition-all cursor-pointer text-[11px] uppercase tracking-wider"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCompleteOnboarding}
                        className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-[0_8px_20px_rgba(59,130,246,0.18)] transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-[11px] cursor-pointer"
                      >
                        Verify & Launch!
                        <Sparkles size={14} />
                      </button>
                    </div>
                  </motion.div>
                )}

              </div>
            )}

          </div>
        )}

      </div>

      {/* Beautiful Interactive Google Sign-In Popup Simulation */}
      <AnimatePresence>
        {showGooglePopup && (
          <div key="google-popup" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
            <motion.div 
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="bg-white rounded-[28px] shadow-[0_24px_70px_rgba(0,0,0,0.18)] max-w-md w-full border border-gray-150 overflow-hidden font-sans text-gray-700"
            >
              {/* Google styled Header bar */}
              <div className="p-6 pb-4 text-center border-b border-gray-100 bg-gray-50/50">
                <div className="flex justify-center mb-3">
                  <svg className="w-9 h-9" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.74 0 3.3.6 4.53 1.77l3.38-3.38C17.88 1.41 15.17.62 12 .62c-4.91 0-9.03 2.81-11.03 6.91l3.77 2.92C5.69 7.15 8.58 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.54h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.88 3.39-8.66z" />
                    <path fill="#FBBC05" d="M4.74 14.37c-.24-.71-.38-1.47-.38-2.27s.14-1.56.38-2.27L.97 6.91C.35 8.16 0 10.02 0 12s.35 3.84.97 5.09l3.77-2.72z" />
                    <path fill="#34A853" d="M12 23.38c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.68-2.31 1.09-4.3 1.09-3.42 0-6.31-2.11-7.34-5.35L.89 16.2c2 4.1 6.12 6.91 11.11 6.91z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Sign in with Google</h3>
                <p className="text-xs text-gray-400 mt-1">to continue to <span className="font-extrabold text-blue-500">Ghurbo</span></p>
                <div className="mt-3 inline-block px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-extrabold uppercase tracking-wide text-blue-600">
                  Active Role: {activeRole === 'traveler' ? '🔍 Traveler (Explore Mode)' : '💼 Entrepreneur (Partner)'}
                </div>
              </div>

              {!showNewGoogleForm ? (
                /* Choose account list view */
                <div className="p-6 space-y-4 max-h-[380px] overflow-y-auto">
                  <p className="text-xs text-gray-450 font-bold uppercase tracking-wider mb-1">Choose an Account</p>
                  
                  <div className="space-y-2">
                    {googleAccounts.map((acc, index) => (
                      <button
                        key={acc.email + index}
                        onClick={() => handleSelectGoogleAccount(acc)}
                        className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all text-left group cursor-pointer"
                      >
                        <img 
                          src={acc.avatarUrl} 
                          alt={acc.name} 
                          className="w-10 h-10 rounded-full object-cover border border-gray-200 group-hover:scale-105 transition-transform" 
                        />
                        <div className="flex-grow min-w-0">
                          <p className="font-bold text-gray-950 text-xs truncate group-hover:text-blue-500 transition-colors">
                            {acc.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-semibold truncate">
                            {acc.email}
                          </p>
                        </div>
                        <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold group-hover:bg-blue-50 group-hover:text-blue-500 group-hover:border-blue-300 transition-colors">
                          →
                        </div>
                      </button>
                    ))}

                    {/* Use another account option trigger */}
                    <button
                      onClick={() => setShowNewGoogleForm(true)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 border border-dashed border-gray-200 hover:border-blue-300 transition-all text-left cursor-pointer text-blue-600 font-bold text-xs"
                    >
                      <div className="w-9 h-9 rounded-full bg-white border border-dashed border-blue-200 flex items-center justify-center text-blue-500 font-extrabold text-lg">
                        +
                      </div>
                      <div>
                        <p>Use another Google/Gmail profile</p>
                        <p className="text-[10px] text-gray-400 font-normal">Create and sign in with a new custom Google account</p>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                /* Dynamic Account Creator form */
                <form onSubmit={handleCreateNewGoogleAccount} className="p-6 space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-xs font-bold text-gray-450 uppercase tracking-wider">Configure New Google Account</h4>
                    <button 
                      type="button"
                      onClick={() => setShowNewGoogleForm(false)}
                      className="text-[10px] text-blue-500 hover:underline font-bold"
                    >
                      View Accounts List
                    </button>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-450 mb-1">Gmail Address</label>
                      <input
                        type="text"
                        required
                        value={newGoogleEmail}
                        onChange={(e) => setNewGoogleEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-450 mb-1">Full Name</label>
                      <input
                        type="text"
                        required
                        value={newGoogleName}
                        onChange={(e) => setNewGoogleName(e.target.value)}
                        placeholder="e.g. Mahatir Mohammad"
                        className="w-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-800 bg-white placeholder-gray-300 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-450 mb-1.5">Choose Google Profile Picture Option</label>
                      <div className="grid grid-cols-6 gap-2">
                        {PRESET_AVATAR_IMAGES.map((img, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewGoogleAvatar(img)}
                            className={`w-10 h-10 rounded-full overflow-hidden border bg-cover bg-center transition-all ${newGoogleAvatar === img ? 'ring-2 ring-blue-500 scale-105 border-transparent' : 'opacity-70 hover:opacity-100'}`}
                            style={{ backgroundImage: `url(${img})` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2.5 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowNewGoogleForm(false)}
                      className="w-1/3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-650 font-bold py-2.5 rounded-xl text-xs uppercase"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl shadow-[0_4px_12px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_16px_rgba(59,130,246,0.3)] text-xs uppercase flex items-center justify-center gap-1 cursor-pointer"
                    >
                      Create & Continue
                      <CheckCircle2 size={13} />
                    </button>
                  </div>
                </form>
              )}

              {/* Footer bar for modal cancellation */}
              <div className="bg-gray-50/70 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400 font-medium">
                <span>Secured by Google Identity Sandbox</span>
                <button
                  type="button"
                  onClick={() => {
                    setShowGooglePopup(false);
                    setShowNewGoogleForm(false);
                  }}
                  className="bg-white hover:bg-gray-50 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-150 font-bold uppercase transition-colors text-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
