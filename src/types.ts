export type DestinationName =
  | 'Cox_s Bazar'
  | 'St. Martin'
  | 'Bandarban'
  | 'Sajek'
  | 'Sylhet'
  | 'Haor';

export type ListingCategory =
  | 'hotel'
  | 'transport'
  | 'restaurant'
  | 'guide'
  | 'package';

export interface Listing {
  id: string;
  entrepreneurId: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  destination: DestinationName;
  imageUrl: string;
  rating: number;
  ratingCount: number;
  availability: boolean;
  contactNumber?: string;
  specifications: { label: string; value: string }[];
}

export interface Booking {
  id: string;
  listingId: string;
  travelerName: string;
  travelerEmail: string;
  listingTitle: string;
  listingCategory: ListingCategory;
  destination: DestinationName;
  dateFrom: string;
  dateTo: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: 'bKash' | 'card';
  paymentTxId: string;
  createdAt: string;
  groupSize?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'entrepreneur';
  isOnboarded: boolean;
  onboardingData?: {
    businessName: string;
    businessDesc: string;
    category: ListingCategory;
    yearsOperating: number;
    contactInfo: string;
    location: string;
    faqServiceType: string;
    logoUrl?: string;
  };
  avatarUrl?: string;
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}
