import { Listing, DestinationName } from './types';

export const DESTINATIONS: {
  id: string;
  name: DestinationName;
  tagline: string;
  description: string;
  imageUrl: string;
}[] = [
  {
    id: 'coxs_bazar',
    name: 'Cox_s Bazar',
    tagline: 'The World_s Longest Sandy Beach',
    description: 'Cox_s Bazar is famous for its unbroken 120-kilometer golden sandy beach, looking out over the Bay of Bengal. Explore the marine drive, delicious local seafood, and majestic ocean sunsets.',
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'st_martin',
    name: 'St. Martin',
    tagline: 'The Only Coral Island of Bangladesh',
    description: 'A tiny, tropical paradise in the Bay of Bengal. Adorned with coconut groves, pristine white coral shores, crystal blue waters, and freshly cooked crabs and lobsters.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bandarban',
    name: 'Bandarban',
    tagline: 'Mist-Covered Hills and Lush Greenery',
    description: 'Home to some of the highest peaks in Bangladesh like Nilgiri and Tajingdong. Bandarban offers trekking through tribal villages, visiting breathtaking waterfalls, and enjoying clouds below your feet.',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sajek',
    name: 'Sajek',
    tagline: 'The Queen of Hills Floating on Clouds',
    description: 'Located high up in the Kasalong range of Rangamati, Sajek boasts beautiful wooden cottages nestled in the valley. Witness the dramatic dawn of rolling cotton-like clouds at the top of the mountains.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'sylhet',
    name: 'Sylhet',
    tagline: 'Emerald Tea Gardens and Crystal Rivers',
    description: 'Blessed with vibrant tea estates cascading down hillsides, tranquil swamp forests of Ratargul, and crystal clear tourmaline rivers of Jaflong and Lalakhal flowing from Indian hills.',
    imageUrl: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'haor',
    name: 'Haor',
    tagline: 'Vast Freshwater Inland Sea & Houseboat Trails',
    description: 'Tanguar Haor becomes a spectacular vast freshwater inland sea during monsoon. Drift into serenity on custom wooden houseboats, count stars under open skies, and explore swampy forests.',
    imageUrl: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  // Cox's Bazar
  {
    id: 'l_coxs_1',
    entrepreneurId: 'ent_1',
    title: 'Mermaid Eco Resort',
    description: 'A boutique luxury eco-conscious getaway right on the secluded shores of Pechala beach, Cox_s Bazar. Experience organic local cuisines and personalized wooden bungalow suites.',
    price: 8500,
    category: 'hotel',
    destination: 'Cox_s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 124,
    availability: true,
    contactNumber: '+8801819324888',
    specifications: [
      { label: 'Room Type', value: 'Sea view Suite' },
      { label: 'Beds', value: '1 King, 1 Queen' },
      { label: 'Amenities', value: 'Private Deck, Organic Breakfast' }
    ]
  },
  {
    id: 'l_coxs_2',
    entrepreneurId: 'ent_2',
    title: 'Sayeman Beach Resort - Sea View Queen',
    description: 'Oceanfront hotel rooms with pristine service right in front of Kolatoli Beach. Known for its gorgeous infinity pool merging with the horizon.',
    price: 11000,
    category: 'hotel',
    destination: 'Cox_s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    ratingCount: 310,
    availability: true,
    contactNumber: '+8801755691001',
    specifications: [
      { label: 'Room Type', value: 'Executive King Suite' },
      { label: 'Beds', value: '1 Super King' },
      { label: 'Amenities', value: 'Ocean View Balcony, Pool Access' }
    ]
  },
  {
    id: 'l_coxs_3',
    entrepreneurId: 'ent_3',
    title: 'Surf Lounge Restaurant & Cafe',
    description: 'A wonderful beach club restaurant offering live music, stunning sunset views, and local dry fish spicy curries plus western coastal seafood meals.',
    price: 1200,
    category: 'restaurant',
    destination: 'Cox_s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    ratingCount: 180,
    availability: true,
    contactNumber: '+8801711204050',
    specifications: [
      { label: 'Cuisine', value: 'Local Seafood & Fusion' },
      { label: 'Specialty', value: 'Crab Chili Fry & Coconut Water shakes' },
      { label: 'Atmosphere', value: 'Open-air Beachfront' }
    ]
  },
  {
    id: 'l_coxs_4',
    entrepreneurId: 'ent_4',
    title: 'Cox_s Bazar Surfing & Marine Drive Package',
    description: 'Go surfing with professional lifesaver guides at Himchari beach, followed by an open-hood Jeep ride along the Marine Drive road flanked by hills and sea.',
    price: 3500,
    category: 'package',
    destination: 'Cox_s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 42,
    availability: true,
    contactNumber: '+8801826500501',
    specifications: [
      { label: 'Duration', value: '6 Hours' },
      { label: 'Includes', value: 'Surfboards, Instructor, Jeep transfers' },
      { label: 'Group Size', value: 'Up to 4 people' }
    ]
  },
  {
    id: 'l_coxs_5',
    entrepreneurId: 'ent_1',
    title: 'Cox_s Bazar Premium Bike Rental',
    description: 'Rent premium motorbikes or gear bicycles to explore the beautiful scenic Marine Drive road at your own pace. Helmets and document folder included.',
    price: 1500,
    category: 'transport',
    destination: 'Cox_s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 74,
    availability: true,
    contactNumber: '+8801819324888',
    specifications: [
      { label: 'Vehicle Type', value: '150cc Japanese Motorbike / Gear Bicycle' },
      { label: 'Renting Period', value: 'Per Day (24hr return cycle)' },
      { label: 'Requirements', value: 'Valid driving license / ID photocopy' }
    ]
  },
  {
    id: 'l_coxs_6',
    entrepreneurId: 'ent_2',
    title: 'Classic Chander Gari Marine Drive Safari',
    description: 'Adventure-rich open-air traditional 4x4 Chander Gari canopy roof truck ride along the majestic hills and coastal curves of Cox_s Bazar marine drive.',
    price: 6000,
    category: 'transport',
    destination: 'Cox_s Bazar',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 93,
    availability: true,
    contactNumber: '+8801755691001',
    specifications: [
      { label: 'Vehicle', value: 'Traditional 4x4 Jeep / Chander Gari' },
      { label: 'Capacity', value: 'Up to 12 passengers' },
      { label: 'Includes', value: 'Experienced hill-coastal driver' }
    ]
  },

  // St. Martin
  {
    id: 'l_st_1',
    entrepreneurId: 'ent_max_1',
    title: 'Music Eco Resort St. Martin_s',
    description: 'Located at the southern end of the island, Chera Dwip point. Unblemished natural beauty paired with peaceful evenings far from crowded bazaar beaches.',
    price: 6500,
    category: 'hotel',
    destination: 'St. Martin',
    imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 96,
    availability: true,
    contactNumber: '+8801815525366',
    specifications: [
      { label: 'Room Type', value: 'Cottage Room' },
      { label: 'Beds', value: '1 Double, 1 Single' },
      { label: 'Vibe', value: 'Oceanfront hammocks, Starlight music' }
    ]
  },
  {
    id: 'l_st_2',
    entrepreneurId: 'ent_max_2',
    title: 'Koral View Resort',
    description: 'A beautiful hotel providing a scenic overview of both the bay beach and the local coconut forestry, equipped with high-speed satellite internet.',
    price: 5500,
    category: 'hotel',
    destination: 'St. Martin',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    ratingCount: 64,
    availability: true,
    contactNumber: '+8801732551421',
    specifications: [
      { label: 'Room Type', value: 'Garden Deluxe Double' },
      { label: 'Beds', value: '1 Double Bed' },
      { label: 'Specs', value: 'Hot water, Air conditioning' }
    ]
  },
  {
    id: 'l_st_3',
    entrepreneurId: 'ent_max_3',
    title: 'Chera Dwip Coral Kayaking Guide',
    description: 'Explore the shallow, crystal clear coral beds of Chera Dwip with transparent plastic kayaks. Swim with marine life under strict safety supervision.',
    price: 1500,
    category: 'guide',
    destination: 'St. Martin',
    imageUrl: 'https://images.unsplash.com/photo-1527192482341-7f8a8451f8dc?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 38,
    availability: true,
    contactNumber: '+8801824411122',
    specifications: [
      { label: 'Equipment', value: 'Crystal clear dual kayak, life jacket' },
      { label: 'Language', value: 'Bangla, English' },
      { label: 'Duration', value: '2 Hours' }
    ]
  },

  // Bandarban
  {
    id: 'l_band_1',
    entrepreneurId: 'ent_band_1',
    title: 'Sairu Hill Resort',
    description: 'Sairu Nestles on the slopes of the peaks of Bandarban. Wake up inside low-hanging clouds and gaze upon majestic rivers winding down like silver threads.',
    price: 13500,
    category: 'hotel',
    destination: 'Bandarban',
    imageUrl: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 152,
    availability: true,
    contactNumber: '+8801531411255',
    specifications: [
      { label: 'Room Type', value: 'Premium Hill-Top Glass Villa' },
      { label: 'Infinity View', value: '360° Mountain and Valleys' },
      { label: 'Includes', value: 'Gym, Spa & Buffet breakfast' }
    ]
  },
  {
    id: 'l_band_2',
    entrepreneurId: 'ent_band_2',
    title: 'Chander Gari (4x4 Jeep) Hill Tour',
    description: 'Book a classic open-hood 4x4 Chander Gari jeep with seasoned driver to tour the scenic viewpoints like Nilgiri hills, Chimbuk hill, and Shoilo Propat waterfall.',
    price: 7500,
    category: 'transport',
    destination: 'Bandarban',
    imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    ratingCount: 88,
    availability: true,
    contactNumber: '+8801833501021',
    specifications: [
      { label: 'Vehicle', value: '4x4 Open Hood Offroad Jeep' },
      { label: 'Capacity', value: 'Up to 10 travelers' },
      { label: 'Destination', value: 'Nilgiri, Chimbuk, Shoilo Propat' }
    ]
  },
  {
    id: 'l_band_3',
    entrepreneurId: 'ent_band_3',
    title: 'Local Marma Food House - Chimbuk Road',
    description: 'Enjoy traditional ethnic tribal cuisines, such as bamboo shoot chicken, wild honey roasted mutton, and organic red rice, in beautiful hillside settings.',
    price: 600,
    category: 'restaurant',
    destination: 'Bandarban',
    imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    ratingCount: 75,
    availability: true,
    contactNumber: '+8801552140501',
    specifications: [
      { label: 'Cuisine', value: 'Authentic Indigenous Marma' },
      { label: 'Must Try', value: 'Bamboo Shoot Chicken, Pitha' },
      { label: 'Seat Type', value: 'Open Deck Overlooking Hills' }
    ]
  },

  // Sajek
  {
    id: 'l_saj_1',
    entrepreneurId: 'ent_saj_1',
    title: 'Sajek Resort (Lush Hills Executive)',
    description: 'Prime, beautiful government-managed resort with private cottages located at Ruilui Para. Get the ultimate view of Mizoram mountains and sunrise clouds.',
    price: 9000,
    category: 'hotel',
    destination: 'Sajek',
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 210,
    availability: true,
    contactNumber: '+8801755694321',
    specifications: [
      { label: 'Room Type', value: 'VIP Premium Cottage' },
      { label: 'View', value: 'East Face (Sunrise Cloudbed)' },
      { label: 'Facilities', value: 'Power Backup, Hot Water' }
    ]
  },
  {
    id: 'l_saj_2',
    entrepreneurId: 'ent_saj_2',
    title: 'Rock Paradise Resort Sajek',
    description: 'Modern, elevated wooden eco-cabins overlooking green hills on Sajek Ridge. Watch the clouds wrap around your cottage columns under soft starlight.',
    price: 4500,
    category: 'hotel',
    destination: 'Sajek',
    imageUrl: 'https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    ratingCount: 112,
    availability: true,
    contactNumber: '+8801832441155',
    specifications: [
      { label: 'Cottage', value: 'Wooden Balcony Suite' },
      { label: 'Beds', value: '2 Semi-Double Beds' },
      { label: 'Vibe', value: 'Sunset view, hammock included' }
    ]
  },
  {
    id: 'l_saj_3',
    entrepreneurId: 'ent_saj_3',
    title: 'Kasalong Valley Trekking Guide',
    description: 'Hire our certified local ethnic tour guide to safely navigate beautiful hiking trails to Konglak para peak, bamboo forests, and secret hilly springs.',
    price: 1800,
    category: 'guide',
    destination: 'Sajek',
    imageUrl: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    ratingCount: 45,
    availability: true,
    specifications: [
      { label: 'Trek Level', value: 'Easy to Moderate' },
      { label: 'Language', value: 'Bangla, Lushai, English' },
      { label: 'Safety Pack', value: 'Emergency aid, trekking sticks' }
    ]
  },

  // Sylhet
  {
    id: 'l_syl_1',
    entrepreneurId: 'ent_syl_1',
    title: 'The Palace Luxury Resort Bahubal',
    description: 'A massive 5-star forest-girded resort in Habiganj, Sylhet. Complete with sprawling tea-hill buggy rides, private lake boating, multiple fine restaurants, and fully active health clubs.',
    price: 18500,
    category: 'hotel',
    destination: 'Sylhet',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 340,
    availability: true,
    contactNumber: '+8801913397333',
    specifications: [
      { label: 'Villa Type', value: 'Hilltop Forest Lodge' },
      { label: 'Buggy Service', value: 'Complimentary 24/7' },
      { label: 'Activities', value: 'Lawn Tennis, Boating, Archery' }
    ]
  },
  {
    id: 'l_syl_2',
    entrepreneurId: 'ent_syl_2',
    title: 'Grand Sylhet Hotel & Resort',
    description: 'A world-class premium resort located right near Sylhet International Airport. Offering highly ambient modern hospitality and luxury wedding, dining facilities.',
    price: 9500,
    category: 'hotel',
    destination: 'Sylhet',
    imageUrl: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    ratingCount: 204,
    availability: true,
    contactNumber: '+8801313444455',
    specifications: [
      { label: 'Suite', value: 'Premium Suite Room' },
      { label: 'Bed', value: '1 King Size Orthopedic' },
      { label: 'Includes', value: 'Rooftop Swimming Pool Access' }
    ]
  },
  {
    id: 'l_syl_3',
    entrepreneurId: 'ent_syl_3',
    title: 'Seven Color Tea & Sylhet Traditional Thali',
    description: 'A traditional dining experience on Shah Jalal road. Includes the famous Nilkantha layer-separated seven-color tea of Sreemangal and traditional spicy beef with Shatkora (citrus fruit).',
    price: 450,
    category: 'restaurant',
    destination: 'Sylhet',
    imageUrl: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    ratingCount: 310,
    availability: true,
    contactNumber: '+8801811202021',
    specifications: [
      { label: 'Specialty', value: 'Spicy Beef Shatkora, Duck bamboo fry' },
      { label: 'Beverage', value: 'Original Nilkantha 7 Color tea' },
      { label: 'Rating', value: 'Loved by locals & expats' }
    ]
  },

  // Haor
  {
    id: 'l_haor_1',
    entrepreneurId: 'ent_haor_1',
    title: 'Tanguar Luxe Houseboat Odyssey',
    description: 'Ultra-deluxe custom-designed wooden floating villa built for navigating Tanguar Haor. Features premium airconditioned suites, solar backup, open rooftop decks, and fresh haor fish delicacies on board.',
    price: 12000,
    category: 'package',
    destination: 'Haor',
    imageUrl: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    ratingCount: 82,
    availability: true,
    contactNumber: '+8801755122144',
    specifications: [
      { label: 'Cruise Type', value: 'Full Board Private Cabin' },
      { label: 'Includes', value: 'Kayak, Lifejacket, 5 Meals daily' },
      { label: 'Excursions', value: 'Watchtower swim, Tekerghat, swamp forest' }
    ]
  },
  {
    id: 'l_haor_2',
    entrepreneurId: 'ent_haor_2',
    title: 'Jol Tori Eco Floating Cabins',
    description: 'Secluded floating wooden structures anchored near safe village edges, giving a full 360° sight of the wetlands, fresh cool winds, and starry nights.',
    price: 4000,
    category: 'hotel',
    destination: 'Haor',
    imageUrl: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    ratingCount: 45,
    availability: true,
    contactNumber: '+8801824141516',
    specifications: [
      { label: 'Anchorage', value: 'Sreepur Haor Safe Zone' },
      { label: 'Vibe', value: 'Fishing trips, absolute solitude' },
      { label: 'Power', value: 'Eco Solar Energy grid' }
    ]
  }
];

export const REVIEWS: Record<string, any[]> = {
  default: [
    { id: 'r1', userName: 'Anika Rahman', rating: 5, comment: 'Simply beautiful! The quality and service was flawless of this hospitality partner. Highly recommended for premium stays.', date: 'May 12, 2026' },
    { id: 'r2', userName: 'Ziaul Hoque', rating: 4.5, comment: 'Spectacular local food and amazing service. Made our family trip truly unforgettable. Special thanks to the host.', date: 'May 28, 2026' },
    { id: 'r3', userName: 'Tahsin Kabir', rating: 5, comment: 'What an unparalleled experience! The views from the balcony were stunning, and booking through Ghurbo was instantly seamless.', date: 'June 02, 2026' }
  ]
};
export const MOCK_NOTIFICATIONS = [
  { id: 'n1', title: 'Welcome to Ghurbo!', message: 'Explore Cox_s Bazar, Sajek, Sylhet and other spectacular places with local entrepreneurs.', time: 'Just now' },
  { id: 'n2', title: 'Booking Confirmed', message: 'Your payment simulation for Mermaid Eco Resort was successful. Reference: TXN-bKash-93284', time: '1 hour ago' }
];
