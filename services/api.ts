// FIX: This file was a placeholder file. Implemented mock data and API functions, including integration with the Gemini API for AI-powered features.
import { GoogleGenAI, Type } from "@google/genai";
// FIX: Imported `ActivityStatus` enum to resolve 'Cannot find name' errors.
import {
    MusicRelease, Artist, AnalyticsData, Book, Author, SmartLink, GeneratedTrack, PressRelease,
    Contact, Campaign, CalendarEvent, MediaMention, Content, Product, Order, SocialPlatform,
    Contract, PlaylistPlacement, PublishingStore, Role, ActivityStatus, Transaction, TransactionStatus, 
    TransactionType, WalletData, AudienceData, AudienceSegment, Goal, GoalStatus,
    CollaborationProject, CollaborationProjectStatus, CreativeFeedback, CatalogueAsset, AuditOpportunity,
    SalesForecast,
    CampaignStrategy,
    MarketTrend,
    CreativeOpportunity,
    FanInteraction,
    CommunityAnalytics,
    BrandKeyword,
    BrandReport
} from '../types';

// --- GEMINI API SETUP ---
// FIX: Initialize GoogleGenAI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const BASE_URL = process.env.BASE_URL || '';
const USE_MOCKS = (process.env.USE_MOCKS ?? 'false') === 'true';

async function apiGet<T>(path: string): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, { credentials: 'include' });
    if (!res.ok) {
      const ct = res.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
      const msg = typeof body === 'object' && body && 'message' in body ? (body as { message: string }).message : String(body || res.statusText || res.status);
      throw new Error(msg);
    }
    return res.json();
  } catch (error: unknown) {
    console.error('API GET error:', error);
    return {} as T;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const ct = res.headers.get('content-type') || '';
      const errBody = ct.includes('application/json') ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
      const msg = typeof errBody === 'object' && errBody && 'message' in errBody ? (errBody as { message: string }).message : String(errBody || res.statusText || res.status);
      throw new Error(msg);
    }
    return res.json();
  } catch (error: unknown) {
    console.error('API POST error:', error);
    return {} as T;
  }
}


// --- MOCK DATA ---
const releases: MusicRelease[] = [
    { id: 'rel-1', title: 'Cosmic Dream', artist: 'Casey Creator', coverArt: 'https://picsum.photos/seed/cosmic/400/400', status: 'Published', streams: 1250000, revenue: 4500, platforms: 150 },
    { id: 'rel-2', title: 'Midnight City', artist: 'Casey Creator', coverArt: 'https://picsum.photos/seed/midnight/400/400', status: 'Published', streams: 850000, revenue: 2800, platforms: 150 },
    { id: 'rel-3', title: 'Ocean Tides', artist: 'Casey Creator', coverArt: 'https://picsum.photos/seed/ocean/400/400', status: 'Pending', streams: 0, revenue: 0, platforms: 0 },
    { id: 'rel-4', title: 'Synthwave Memories', artist: 'Alex Admin', coverArt: 'https://picsum.photos/seed/synth/400/400', status: 'Published', streams: 3200000, revenue: 9800, platforms: 200 },
];

const artists: Artist[] = [
    { id: 'creator-001', name: 'Casey Creator', avatar: 'https://i.pravatar.cc/150?u=casey-creator', monthlyListeners: 2500000, totalStreams: 2100000, totalRevenue: 7300, releases: releases.filter(r => r.artist === 'Casey Creator') },
    { id: 'admin-001', name: 'Alex Admin', avatar: 'https://i.pravatar.cc/150?u=admin-alex', monthlyListeners: 5800000, totalStreams: 3200000, totalRevenue: 9800, releases: releases.filter(r => r.artist === 'Alex Admin') },
];

const books: Book[] = [
    { id: 'book-1', title: 'The Silent Forest', author: 'Pat Publisher', coverArt: 'https://picsum.photos/seed/forest/400/600', status: 'Published', sales: 15200, revenue: 65000, stores: 20 },
    { id: 'book-2', title: 'Echoes of Tomorrow', author: 'Pat Publisher', coverArt: 'https://picsum.photos/seed/echoes/400/600', status: 'Published', sales: 8500, revenue: 38000, stores: 20 },
    { id: 'book-3', title: 'Secrets of the Deep', author: 'Pat Publisher', coverArt: 'https://picsum.photos/seed/deep/400/600', status: 'Draft', sales: 0, revenue: 0, stores: 0 },
];

const authors: Author[] = [
    { id: 'author-001', name: 'Pat Publisher', avatar: 'https://i.pravatar.cc/150?u=pat-publisher', booksPublished: 2, totalSales: 23700, totalRevenue: 103000, books },
];

const smartLinks: SmartLink[] = [
    { id: 'sl-1', name: 'Cosmic Dream Pre-Save', shortUrl: 'fan.link/cosmic', originalUrl: 'spotify:track:123', type: 'Pre-Save', clicks: 12450, conversions: 4500 },
    { id: 'sl-2', name: 'Casey Creator Bio', shortUrl: 'fan.link/casey', originalUrl: 'https://casey.com', type: 'Bio-Link', clicks: 8800, conversions: 0 },
];

const pressReleases: PressRelease[] = [
    { id: 'pr-1', title: 'Casey Creator Announces "Cosmic Dream" Single', status: 'Sent', sentDate: '2024-05-15', openRate: 45 },
    { id: 'pr-2', title: 'Pat Publisher\'s "The Silent Forest" Hits Bestseller List', status: 'Draft', sentDate: null, openRate: 0 },
];

const contacts: Contact[] = [
    { id: 'ct-1', name: 'John Doe', email: 'john.doe@musicblog.com', role: 'Press', list: 'Press & Media', dateAdded: '2024-01-10' },
];

const campaigns: Campaign[] = [
    { id: 'camp-1', name: 'Cosmic Dream Release Campaign', status: 'Active', budget: 5000, startDate: '2024-05-01', endDate: '2024-06-01', channels: ['Spotify Ads', 'Instagram'] },
];

const contentLibrary: Content[] = [
    { id: 'cl-1', title: 'Cosmic Dream Instagram Post', type: 'Social Post', status: 'Published', content: 'My new single is out now!', lastModified: '2024-05-20' },
];

const products: Product[] = [
    { id: 'prod-1', name: 'Cosmic Dream T-Shirt', price: 25, image: 'https://picsum.photos/seed/tshirt/400/400', category: 'Apparel', sales: 150, stock: 50 },
];

const orders: Order[] = [
    { id: 'ord-1', customerName: 'Jane Smith', date: '2024-05-21', total: 25.00, status: 'Delivered', items: [{ productId: 'prod-1', quantity: 1 }] },
];

const transactions: Transaction[] = [
    { id: 'txn-1', date: '2024-06-20', description: "Royalty from 'Cosmic Dream' on Spotify", type: TransactionType.ROYALTY, status: TransactionStatus.CLEARED, amount: 150.25 },
    { id: 'txn-2', date: '2024-06-19', description: "Sale of 'Cosmic Dream T-Shirt'", type: TransactionType.SALE, status: TransactionStatus.CLEARED, amount: 18.50 },
    { id: 'txn-3', date: '2024-06-18', description: "Sale of 'The Silent Forest' on Amazon", type: TransactionType.SALE, status: TransactionStatus.CLEARED, amount: 4.99 },
    { id: 'txn-4', date: '2024-06-15', description: "Payout to Bank Account", type: TransactionType.PAYOUT, status: TransactionStatus.PAID_OUT, amount: -5200.00 },
    { id: 'txn-5', date: '2024-06-12', description: "Royalty from 'Midnight City' on Apple Music", type: TransactionType.ROYALTY, status: TransactionStatus.PENDING, amount: 85.60 },
    { id: 'txn-6', date: '2024-06-10', description: "Royalty from 'Synthwave Memories' on YouTube", type: TransactionType.ROYALTY, status: TransactionStatus.CLEARED, amount: 45.10 },
];

const audienceData: AudienceData = {
    totalAudience: 785430,
    audienceGrowth: [
        { month: 'Jan', newFollowers: 1200 },
        { month: 'Feb', newFollowers: 1500 },
        { month: 'Mar', newFollowers: 1300 },
        { month: 'Apr', newFollowers: 1800 },
        { month: 'May', newFollowers: 2500 },
        { month: 'Jun', newFollowers: 3200 },
    ],
    engagementRate: 4.7,
    topEngagement: [
        { id: 'eng-1', contentTitle: 'Cosmic Dream', contentType: 'Release', metric: 'Streams', value: 1250000 },
        { id: 'eng-2', contentTitle: 'The Silent Forest', contentType: 'Book', metric: 'Sales', value: 15200 },
        { id: 'eng-3', contentTitle: 'Cosmic Dream T-Shirt', contentType: 'Product', metric: 'Sales', value: 150 },
        { id: 'eng-4', contentTitle: 'New single announcement!', contentType: 'Post', metric: 'Likes', value: 12000 },
    ],
    geoDistribution: [ { id: 'USA', value: 500000 }, { id: 'GBR', value: 150000 }, { id: 'CAN', value: 120000 }, { id: 'AUS', value: 100000 }, { id: 'DEU', value: 80000 } ],
    fanDemographics: {
        age: [ { name: '18-24', value: 45 }, { name: '25-34', value: 35 }, { name: '35-44', value: 15 }, { name: '45+', value: 5 } ],
        gender: [ { name: 'Female', value: 55 }, { name: 'Male', value: 42 }, { name: 'Non-binary', value: 3 } ]
    }
};

const goals: Goal[] = [
    { 
        id: 'goal-1', 
        title: "Increase 'Cosmic Dream' streams", 
        description: "Boost the streams for the latest single to drive discovery and revenue.",
        status: GoalStatus.ON_TRACK, 
        dueDate: '2024-08-31', 
        progress: 25, 
        targetMetric: "5,000,000 streams",
        currentValue: "1,250,000",
        suggestedTasks: [
            { id: 't-1-1', description: 'Create a Smart Link for the single', isCompleted: true, link: '/marketing/smart-links' },
            { id: 't-1-2', description: 'Run a social media ad campaign', isCompleted: false, link: '/marketing/campaigns' },
            { id: 't-1-3', description: 'Pitch to 10 independent playlist curators', isCompleted: false, link: '/marketing/contacts' },
        ]
    },
    { 
        id: 'goal-2', 
        title: "Launch 'Cosmic Dream' Merchandise", 
        description: "Capitalize on the single's momentum by releasing a new line of merchandise.",
        status: GoalStatus.NOT_STARTED, 
        dueDate: '2024-09-15', 
        progress: 0, 
        targetMetric: "$1,000 in sales",
        currentValue: "$0",
        suggestedTasks: [
            { id: 't-2-1', description: 'Design a T-shirt in the Creative Studio', isCompleted: false, link: '/marketing/creative-studio' },
            { id: 't-2-2', description: 'Add the new T-shirt to the store', isCompleted: false, link: '/ecommerce/products' },
            { id: 't-2-3', description: 'Announce the merch drop on social media', isCompleted: false, link: '/marketing/social-media' },
        ]
    }
];

const collaborationProjects: CollaborationProject[] = [
    {
        id: 'collab-1',
        title: 'Seeking Vocalist for Chillwave Track',
        description: 'I have a fully produced instrumental track in the style of Tycho and Com Truise. Looking for a talented vocalist with a dreamy, ethereal voice to write and record vocals.',
        creatorId: 'creator-001',
        creatorName: 'Casey Creator',
        status: CollaborationProjectStatus.OPEN,
        rolesNeeded: ['Vocalist', 'Lyricist'],
        revenueSplits: [
            { role: 'Producer', share: 50, userId: 'creator-001' },
            { role: 'Vocalist', share: 25 },
            { role: 'Lyricist', share: 25 },
        ]
    },
    {
        id: 'collab-2',
        title: 'Illustrator for Sci-Fi Book Cover',
        description: 'My new novel, "Echoes of Tomorrow", is complete. I need a talented illustrator to create a compelling, professional cover in a retro-futuristic style.',
        creatorId: 'author-001',
        creatorName: 'Pat Publisher',
        status: CollaborationProjectStatus.OPEN,
        rolesNeeded: ['Illustrator'],
        revenueSplits: [
            { role: 'Author', share: 95, userId: 'author-001' },
            { role: 'Illustrator', share: 5 },
        ]
    },
     {
        id: 'collab-3',
        title: 'Remix Opportunity: "Cosmic Dream"',
        description: 'Calling all producers! I\'m looking for creative remixes of my latest single, "Cosmic Dream". Open to all genres, from house to drum and bass. Stems are available upon request.',
        creatorId: 'creator-001',
        creatorName: 'Casey Creator',
        status: CollaborationProjectStatus.IN_PROGRESS,
        rolesNeeded: ['Remixer', 'Producer'],
        revenueSplits: [
            { role: 'Original Artist', share: 60, userId: 'creator-001' },
            { role: 'Remixer', share: 40 },
        ]
    }
];

const creativeFeedbackHistory: CreativeFeedback[] = [
    {
        id: 'cf-1',
        ideaSnippet: "A new song called 'Starlight Echoes' about finding a lost connection through time.",
        commercialPotential: 88,
        keyEmotions: [
            { emotion: 'Nostalgia', score: 92 },
            { emotion: 'Melancholy', score: 75 },
            { emotion: 'Joy', score: 60 },
        ],
        creativeSuggestions: [
            "Lean into the nostalgic theme with vintage synth sounds, as this resonates strongly with your 'Loyal Collector' segment.",
            "Consider a contrasting bridge section that shifts from melancholy to a more hopeful tone to maximize emotional impact.",
            "The title 'Starlight Echoes' is strong; use it in visual marketing with cosmic imagery."
        ],
        analysisDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

const fanInteractions: FanInteraction[] = [
    { id: 'fi-1', fanId: 'fan-1', fanName: 'SynthwaveLover88', fanAvatar: 'https://i.pravatar.cc/150?u=fan1', type: 'Comment', content: "Cosmic Dream is an absolute masterpiece! The synth solo gives me chills every time. Can't wait for the vinyl release!", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-2', fanId: 'fan-2', fanName: 'BookwormJane', fanAvatar: 'https://i.pravatar.cc/150?u=fan2', type: 'Comment', content: "Just finished The Silent Forest and I'm speechless. The world-building is incredible. Is there going to be a sequel??", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-3', fanId: 'fan-1', fanName: 'SynthwaveLover88', fanAvatar: 'https://i.pravatar.cc/150?u=fan1', type: 'Purchase', content: "Purchased 'Cosmic Dream T-Shirt'", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-4', fanId: 'fan-3', fanName: 'MusicFan23', fanAvatar: 'https://i.pravatar.cc/150?u=fan3', type: 'Comment', content: "This is a good song but the mix feels a little muddy in the low end.", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-5', fanId: 'fan-4', fanName: 'Alex R.', fanAvatar: 'https://i.pravatar.cc/150?u=fan4', type: 'Comment', content: "When are you touring next? Would love to see you live!", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];


// --- API FUNCTIONS ---

// MUSIC
export const getMusicData = async () => {
    if (!USE_MOCKS) {
        const [rels, arts] = await Promise.all([
            apiGet<MusicRelease[]>('/api/releases'),
            apiGet<Artist[]>('/api/artists'),
        ]);
        return { releases: rels, artists: arts };
    }
    return { releases, artists };
};
export const getArtists = async () => {
    if (!USE_MOCKS) return apiGet<Artist[]>('/api/artists');
    return artists;
};
export const getArtistById = async (id: string): Promise<Artist | undefined> => {
    if (!USE_MOCKS) return apiGet<Artist | undefined>(`/api/artists/${id}`);
    return artists.find(a => a.id === id);
};
export const addArtist = async (name: string) => {
    if (!USE_MOCKS) return apiPost<Artist>('/api/artists', { name });
    const newArtist: Artist = {
        id: `artist-${Date.now()}`, name, avatar: 'https://i.pravatar.cc/150?u=' + Date.now(), monthlyListeners: 0, totalStreams: 0, totalRevenue: 0, releases: []
    };
    artists.unshift(newArtist);
    return newArtist;
}
export const addRelease = async (releaseData: Partial<MusicRelease>): Promise<MusicRelease> => {
    if (!USE_MOCKS) return apiPost<MusicRelease>('/api/releases', releaseData);
    const newRelease: MusicRelease = {
        id: `rel-${Date.now()}`,
        title: 'New Release',
        artist: 'Casey Creator',
        coverArt: 'https://picsum.photos/seed/new/400/400',
        status: 'Draft',
        streams: 0,
        revenue: 0,
        platforms: 0,
        ...releaseData
    };
    releases.unshift(newRelease);
    return newRelease;
};
export const getArtistContracts = async (artistId: string): Promise<Contract[]> => {
    if (!USE_MOCKS) return apiGet<Contract[]>(`/api/artists/${artistId}/contracts`);
    return [ { id: 'cont-1', name: 'Recording Contract 2024', date: '2024-01-01', status: 'Active' } ];
};

// PUBLISHING
export const getPublishingData = async () => {
    if (!USE_MOCKS) {
        const [bks, auths] = await Promise.all([
            apiGet<Book[]>('/api/books'),
            apiGet<Author[]>('/api/authors'),
        ]);
        return { books: bks, authors: auths };
    }
    return { books, authors };
};
export const getAuthors = async () => {
    if (!USE_MOCKS) return apiGet<Author[]>('/api/authors');
    return authors;
};
export const getAuthorById = async (id: string): Promise<Author | undefined> => {
    if (!USE_MOCKS) return apiGet<Author | undefined>(`/api/authors/${id}`);
    return authors.find(a => a.id === id);
};
export const addAuthor = async (name: string) => {
    if (!USE_MOCKS) return apiPost<Author>('/api/authors', { name });
    const newAuthor: Author = {
        id: `author-${Date.now()}`, name, avatar: 'https://i.pravatar.cc/150?u=' + Date.now(), booksPublished: 0, totalSales: 0, totalRevenue: 0, books: []
    };
    authors.unshift(newAuthor);
    return newAuthor;
}
export const addBook = async (bookData: Partial<Book>): Promise<Book> => {
    if (!USE_MOCKS) return apiPost<Book>('/api/books', bookData);
    const newBook: Book = {
        id: `book-${Date.now()}`,
        title: 'New Book',
        author: 'Pat Publisher',
        coverArt: 'https://picsum.photos/seed/newbook/400/600',
        status: 'Draft',
        sales: 0,
        revenue: 0,
        stores: 0,
        ...bookData
    };
    books.unshift(newBook);
    return newBook;
};

// ECOMMERCE
export const getProducts = async () => {
    if (!USE_MOCKS) return apiGet<Product[]>('/api/products');
    return products;
};
export const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    if (!USE_MOCKS) return apiPost<Product>('/api/products', productData);
    const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: 'New Product',
        price: 0,
        stock: 0,
        image: 'https://picsum.photos/seed/newprod/400/400',
        category: 'Apparel',
        sales: 0,
        ...productData
    };
    products.unshift(newProduct);
    return newProduct;
}
export const getOrders = async () => {
    if (!USE_MOCKS) return apiGet<Order[]>('/api/orders');
    return orders;
};

// ANALYTICS & MARKETING
export const getAnalyticsData = async (userId?: string): Promise<AnalyticsData> => {
    if (!USE_MOCKS) return apiGet<AnalyticsData>(`/api/analytics${userId ? `?userId=${encodeURIComponent(userId)}` : ''}`);
    return {
        streamsTrend: [ { name: 'Jan', streams: 120000 }, { name: 'Feb', streams: 150000 }, { name: 'Mar', streams: 130000 }, { name: 'Apr', streams: 180000 }, { name: 'May', streams: 250000 }, { name: 'Jun', streams: 320000 } ],
        revenueBreakdown: [ { name: 'Spotify', value: 4500 }, { name: 'Apple Music', value: 3200 }, { name: 'Amazon', value: 1800 }, { name: 'YouTube', value: 1200 } ],
        platformRevenue: [ { name: 'Spotify', value: 4500 }, { name: 'Apple Music', value: 3200 }, { name: 'Amazon', value: 1800 }, { name: 'YouTube', value: 1200 } ],
        geoDistribution: [ { id: 'USA', value: 500000 }, { id: 'GBR', value: 150000 }, { id: 'CAN', value: 120000 }, { id: 'AUS', value: 100000 }, { id: 'DEU', value: 80000 } ],
        fanDemographics: {
            age: [ { name: '18-24', value: 45 }, { name: '25-34', value: 35 }, { name: '35-44', value: 15 }, { name: '45+', value: 5 } ],
            gender: [ { name: 'Female', value: 55 }, { name: 'Male', value: 42 }, { name: 'Non-binary', value: 3 } ]
        }
    };
};
export const getAudienceData = async (): Promise<AudienceData> => {
    if (!USE_MOCKS) return apiGet<AudienceData>('/api/audience');
    return audienceData;
};
export const getBookSalesData = async () => {
    if (!USE_MOCKS) return apiGet<{ month: string; amazon: number; apple: number; kobo: number }[]>('/api/book-sales');
    return [ { month: 'Jan', amazon: 4000, apple: 2400, kobo: 1200 }, { month: 'Feb', amazon: 3000, apple: 1398, kobo: 1000 }, { month: 'Mar', amazon: 2000, apple: 9800, kobo: 1500 }, { month: 'Apr', amazon: 2780, apple: 3908, kobo: 1800 }, { month: 'May', amazon: 1890, apple: 4800, kobo: 2000 }, { month: 'Jun', amazon: 2390, apple: 3800, kobo: 2200 } ];
};
export const getPublishingStores = async (): Promise<PublishingStore[]> => {
    if (!USE_MOCKS) return apiGet<PublishingStore[]>('/api/publishing/stores');
    return [ { name: 'Amazon KDP', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Amazon-KDP-Logo.svg/2560px-Amazon-KDP-Logo.svg.png', status: 'Live' }, { name: 'Apple Books', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Apple_Music_icon.svg/1024px-Apple_Music_icon.svg.png', status: 'Live' } ];
};
export const getSmartLinks = async () => {
    if (!USE_MOCKS) return apiGet<SmartLink[]>('/api/smart-links');
    return smartLinks;
};
export const addSmartLink = async (data: Omit<SmartLink, 'id' | 'shortUrl' | 'clicks' | 'conversions'>): Promise<SmartLink> => {
    if (!USE_MOCKS) return apiPost<SmartLink>('/api/smart-links', data);
    const newLink: SmartLink = { ...data, id: `sl-${Date.now()}`, shortUrl: `fan.link/new${Date.now()}`, clicks: 0, conversions: 0 };
    smartLinks.unshift(newLink);
    return newLink;
}
export const getPressReleases = () => pressReleases;
export const addPressRelease = async (data: Partial<PressRelease>): Promise<PressRelease> => {
    if (!USE_MOCKS) return apiPost<PressRelease>('/api/press-releases', data);
    const newRelease: PressRelease = { id: `pr-${Date.now()}`, title: data.title || 'New Draft', status: 'Draft', sentDate: null, openRate: 0 };
    pressReleases.unshift(newRelease);
    return newRelease;
}
export const getContacts = async () => {
    if (!USE_MOCKS) return apiGet<Contact[]>('/api/contacts');
    return contacts;
};
export const addContact = async (data: Omit<Contact, 'id' | 'dateAdded'>): Promise<Contact> => {
    if (!USE_MOCKS) return apiPost<Contact>('/api/contacts', data);
    const newContact: Contact = { ...data, id: `ct-${Date.now()}`, dateAdded: new Date().toISOString().split('T')[0] };
    contacts.unshift(newContact);
    return newContact;
}
export const getCampaigns = async () => {
    if (!USE_MOCKS) return apiGet<Campaign[]>('/api/campaigns');
    return campaigns;
};
export const addCampaign = async (data: Partial<Campaign>): Promise<Campaign> => {
    if (!USE_MOCKS) return apiPost<Campaign>('/api/campaigns', data);
    const newCampaign: Campaign = { id: `camp-${Date.now()}`, name: 'New Campaign', status: 'Planning', budget: 0, startDate: '', endDate: '', channels: [], ...data };
    campaigns.unshift(newCampaign);
    return newCampaign;
}
export const getSocialPlatforms = async (): Promise<SocialPlatform[]> => {
    if (!USE_MOCKS) return apiGet<SocialPlatform[]>('/api/social/platforms');
    return [
    { id: 'sp-1', name: 'Instagram', icon: '📷', status: 'Connected' },
    { id: 'sp-2', name: 'TikTok', icon: '🎵', status: 'Connected' },
    { id: 'sp-3', name: 'X / Twitter', icon: '✖️', status: 'Not Connected' },
    ];
};
export const getCalendarEvents = async (): Promise<CalendarEvent[]> => {
    if (!USE_MOCKS) return apiGet<CalendarEvent[]>('/api/calendar/events');
    return [ { date: new Date().toISOString(), title: 'Release: Cosmic Dream', color: 'purple' } ];
};
export const getContentLibrary = async () => {
    if (!USE_MOCKS) return apiGet<Content[]>('/api/content');
    return contentLibrary;
};
export const addContent = async (data: Partial<Content>): Promise<Content> => {
    if (!USE_MOCKS) return apiPost<Content>('/api/content', data);
    const newContent: Content = { id: `cl-${Date.now()}`, title: 'New Content', type: 'Social Post', status: 'Draft', content: '', lastModified: new Date().toISOString().split('T')[0], ...data };
    contentLibrary.unshift(newContent);
    return newContent;
}
export const getPlaylistPlacements = async (): Promise<PlaylistPlacement[]> => {
    if (!USE_MOCKS) return apiGet<PlaylistPlacement[]>('/api/playlist-placements');
    return [
    { id: 'pl-1', playlistName: 'Chillwave Vibes', platform: 'Spotify', followers: 125000, releaseTitle: 'Cosmic Dream' },
    { id: 'pl-2', playlistName: 'Synthwave Hits', platform: 'Apple Music', followers: 250000, releaseTitle: 'Synthwave Memories' },
    ];
};

// FINANCES
export const getWalletData = async (): Promise<WalletData> => {
    if (!USE_MOCKS) return apiGet<WalletData>('/api/wallet');
    return {
        currentBalance: 5850.75,
        lifetimeEarnings: 125680.00,
        nextPayoutAmount: 5850.75,
        nextPayoutDate: 'July 15, 2024',
        earningsBreakdown: [
            { name: 'Music Royalties', value: 75000 },
            { name: 'Book Sales', value: 45000 },
            { name: 'Merchandise', value: 5680 },
        ]
    };
};
export const getTransactions = async (): Promise<Transaction[]> => {
    if (!USE_MOCKS) return apiGet<Transaction[]>('/api/transactions');
    return transactions;
};

// STRATEGY
export const getGoals = async (): Promise<Goal[]> => {
    if (!USE_MOCKS) return apiGet<Goal[]>('/api/goals');
    return goals;
};
export const addGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
    if (!USE_MOCKS) return apiPost<Goal>('/api/goals', goalData);
    const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        title: 'New Goal',
        description: '',
        status: GoalStatus.NOT_STARTED,
        dueDate: '',
        progress: 0,
        targetMetric: '',
        currentValue: '',
        suggestedTasks: [],
        ...goalData
    };
    goals.unshift(newGoal);
    return newGoal;
};

// COLLABORATION
export const getCollaborationProjects = async (): Promise<CollaborationProject[]> => {
    if (!USE_MOCKS) return apiGet<CollaborationProject[]>('/api/collab/projects');
    return collaborationProjects;
};
// FIX: Update function signature to correctly reflect that creator info is passed separately, resolving a type error in ProjectFinderPage.tsx.
export const addCollaborationProject = async (projectData: Omit<CollaborationProject, 'id' | 'status' | 'creatorId' | 'creatorName'>, creator: {id: string, name: string}): Promise<CollaborationProject> => {
    if (!USE_MOCKS) return apiPost<CollaborationProject>('/api/collab/projects', { ...projectData, creator });
    const newProject: CollaborationProject = {
        ...projectData,
        id: `collab-${Date.now()}`,
        status: CollaborationProjectStatus.OPEN,
        creatorId: creator.id,
        creatorName: creator.name,
    };
    collaborationProjects.unshift(newProject);
    return newProject;
};

// CREATIVE
export const getCreativeFeedbackHistory = async (): Promise<CreativeFeedback[]> => {
    if (!USE_MOCKS) return apiGet<CreativeFeedback[]>('/api/creative/feedback');
    return creativeFeedbackHistory;
};
export const addCreativeFeedback = async (feedback: Omit<CreativeFeedback, 'id' | 'analysisDate'>): Promise<CreativeFeedback> => {
    if (!USE_MOCKS) return apiPost<CreativeFeedback>('/api/creative/feedback', feedback);
    const newFeedback: CreativeFeedback = {
        ...feedback,
        id: `cf-${Date.now()}`,
        analysisDate: new Date().toISOString(),
    };
    creativeFeedbackHistory.unshift(newFeedback);
    return newFeedback;
};


// --- GEMINI API FUNCTIONS ---

export const generateTextContent = async (prompt: string): Promise<string> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<string>('/api/ai/text', { prompt });
            return r as unknown as string;
        }
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
        return response.text;
    } catch (error) {
        console.error("Error generating text content:", error);
        return "Sorry, I couldn't generate content right now.";
    }
};

export const generateAIImage = async (prompt: string, style: string): Promise<string> => {
    if (!USE_MOCKS) {
        const r = await apiPost<string>('/api/ai/image', { prompt, style });
        return r;
    }
    return new Promise(resolve => {
        setTimeout(() => {
            const seed = encodeURIComponent(`${prompt}-${style}`);
            resolve(`https://picsum.photos/seed/${seed}/512/512`);
        }, 2000);
    });
};


export const generateAITrack = (genre: string, mood: string, duration: number): Promise<GeneratedTrack> => {
    if (!USE_MOCKS) {
        return apiPost<GeneratedTrack>('/api/ai/track', { genre, mood, duration });
    }
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ title: `${mood} ${genre} Groove`, genre, mood, duration, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' });
        }, 3000);
    });
};

export const getAIInsight = async (contextData: string): Promise<string> => {
     try {
        if (!USE_MOCKS) {
            const r = await apiPost<string>('/api/ai/insight', { contextData });
            return r as unknown as string;
        }
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `Based on this JSON data for a user dashboard, provide a short, actionable strategic insight (2-3 sentences max). Data: ${contextData}` });
        return response.text;
    } catch (error) {
        console.error("Error generating AI insight:", error);
        return "Could not generate an insight at this time. Please check your connection and configuration.";
    }
};

export const generateAudienceSegments = async (data: AudienceData): Promise<AudienceSegment[]> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<AudienceSegment[]>('/api/ai/segments', { data });
            return r;
        }
        const prompt = `Based on the following JSON data about a creator's audience, generate 3 distinct audience segments or personas. For each segment, provide a creative name, a brief description, its size as a percentage of the total audience, 2-3 key characteristics, and a short, actionable marketing insight. Audience data: ${JSON.stringify(data)}`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, sizePercentage: { type: Type.NUMBER }, keyCharacteristics: { type: Type.ARRAY, items: { type: Type.STRING } }, marketingInsight: { type: Type.STRING } } } } } });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error generating audience segments:", error);
        // Return mock data on failure
        return [
            { name: 'The Trendsetter', description: 'Early adopters who are highly engaged on social media.', sizePercentage: 25, keyCharacteristics: ['Ages 18-24', 'High social media usage', 'Prefers digital music'], marketingInsight: 'Engage them with TikTok challenges and behind-the-scenes content.' },
            { name: 'The Loyal Collector', description: 'Dedicated fans who purchase physical media and merchandise.', sizePercentage: 15, keyCharacteristics: ['Ages 25-44', 'Buys merchandise', 'Attends live events'], marketingInsight: 'Offer exclusive limited-edition vinyl or signed book copies.' },
            { name: 'The Casual Browser', description: 'Discovered the creator through playlists or recommendations.', sizePercentage: 60, keyCharacteristics: ['Wide age range', 'Passive listener/reader', 'Low merchandise purchase rate'], marketingInsight: 'Convert them to followers with targeted ads and email newsletters offering exclusive content.' },
        ];
    }
};

export const generateGoalSuggestions = async (userRole: Role, userData: unknown): Promise<Partial<Goal>[]> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<Partial<Goal>[]>('/api/ai/goals-suggestions', { userRole, userData });
            return r;
        }
        const prompt = `You are a strategic advisor for a ${userRole === Role.MUSIC_CREATOR ? 'music creator' : 'book author'}. Based on their current data, suggest 3 actionable and specific goals. For each goal, provide a title, a short description, a targetMetric (e.g., "100,000 streams"), and a due date within the next 3 months. User Data: ${JSON.stringify(userData)}`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING }, targetMetric: { type: Type.STRING }, dueDate: { type: Type.STRING, description: "Date in YYYY-MM-DD format" } }, required: ["title", "description", "targetMetric", "dueDate"] } } } });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error generating goal suggestions:", error);
        // Return mock data on failure
        return [
            { title: "Engage Your Top Audience Segment", description: "Create a targeted campaign for 'The Trendsetter' segment to boost engagement.", targetMetric: "10% engagement increase", dueDate: new Date(Date.now() + 60*24*60*60*1000).toISOString().split('T')[0] },
            { title: "Boost 'Midnight City' Streams", description: "Run a campaign to get the 'Midnight City' single to 1 million total streams.", targetMetric: "1,000,000 streams", dueDate: new Date(Date.now() + 90*24*60*60*1000).toISOString().split('T')[0] },
            { title: "Plan Next Release", description: "Finalize and schedule your next release, 'Ocean Tides', to maintain momentum.", targetMetric: "Release scheduled", dueDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0] },
        ];
    }
}

export const analyzeCreativeIdea = async (idea: string, audienceData: AudienceData): Promise<Omit<CreativeFeedback, 'id' | 'analysisDate'>> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<Omit<CreativeFeedback, 'id' | 'analysisDate'>>('/api/ai/analyze-idea', { idea, audienceData });
            return r;
        }
        const prompt = `You are an expert A&R and literary agent. Analyze this creative idea: "${idea}". 
        Base your analysis on this audience data: ${JSON.stringify(audienceData.fanDemographics)}.
        Provide a commercial potential score (0-100).
        Identify the top 3 key emotional triggers from this list: Nostalgia, Excitement, Melancholy, Tension, Joy. Provide a score for each (0-100).
        Give 3 concrete, actionable creative suggestions for improvement.
        Return the data as a JSON object.`;
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { responseMimeType: 'application/json', responseSchema: { type: Type.OBJECT, properties: { ideaSnippet: { type: Type.STRING }, commercialPotential: { type: Type.NUMBER }, keyEmotions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { emotion: { type: Type.STRING }, score: { type: Type.NUMBER } } } }, creativeSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } } } } } });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error analyzing creative idea:", error);
        // Fallback mock data
        return {
            ideaSnippet: idea,
            commercialPotential: 75,
            keyEmotions: [{ emotion: 'Nostalgia', score: 85 }, { emotion: 'Joy', score: 65 }],
            creativeSuggestions: ["This is mock data due to an API error.", "Consider simplifying the chorus.", "The visual concept is strong."]
        };
    }
};

export const getAIAssistantResponse = async (prompt: string): Promise<string> => {
    return generateTextContent(`You are an expert marketing assistant for music artists and authors. Respond to the following user query: "${prompt}"`);
};

export const getMediaMentions = async (): Promise<MediaMention[] | { error: string }> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiGet<MediaMention[]>('/api/media/mentions');
            return r;
        }
        const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: "Find recent web mentions for the artist 'Casey Creator' and their single 'Cosmic Dream'. Return only the most relevant articles, blogs, or social media posts from the last month.", config: { tools: [{ googleSearch: {} }] } });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (!groundingChunks || groundingChunks.length === 0) {
            return [];
        }

        const mentions: MediaMention[] = groundingChunks.map((chunk, index) => ({ id: `mention-${index}-${Date.now()}`, source: new URL(chunk.web.uri).hostname.replace('www.', ''), url: chunk.web.uri, title: chunk.web.title || "Untitled Mention", snippet: response.text.substring(0, 150) + '...', sentiment: 'Positive', publishedAt: new Date().toISOString() }));

        return mentions;
    } catch (error: unknown) {
        console.error("Error fetching media mentions:", error);
        // FIX: Provide a more generic error as per guidelines, assuming API key is handled via environment.
        let errorMsg = 'Unknown error';
        if (error instanceof Error) {
            errorMsg = error.message;
        }
        return { error: `An error occurred while searching for mentions: ${errorMsg}` };
    }
};

export const getCreatorCatalogue = async (userId: string): Promise<CatalogueAsset[]> => {
    if (!USE_MOCKS) return apiGet<CatalogueAsset[]>(`/api/catalogue?userId=${encodeURIComponent(userId)}`);
    const musicAssets: CatalogueAsset[] = releases.map(r => ({ id: r.id, type: 'Music', title: r.title, authorOrArtist: r.artist, coverArt: r.coverArt, releaseDate: '2023-10-26' }));
    const bookAssets: CatalogueAsset[] = books.map(b => ({ id: b.id, type: 'Book', title: b.title, authorOrArtist: b.author, coverArt: b.coverArt, releaseDate: '2022-05-15' }));
    return [...musicAssets, ...bookAssets];
};

export const runCatalogueAudit = async (catalogue: CatalogueAsset[]): Promise<AuditOpportunity[]> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<AuditOpportunity[]>('/api/catalogue/audit', { catalogue });
            return r;
        }
        const prompt = `You are an expert A&R and marketing strategist. Analyze this creator's back-catalogue and identify up to 3-4 assets with the highest untapped potential for re-monetization or promotion. For each identified asset, provide a "potentialScore" (0-100), a concise "insight" explaining why it has potential (e.g., genre is trending, seasonal relevance), and a list of 2-3 concrete "suggestedActions". Catalogue data: ${JSON.stringify(catalogue)}`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            assetId: { type: Type.STRING },
                            assetTitle: { type: Type.STRING },
                            assetType: { type: Type.STRING },
                            potentialScore: { type: Type.NUMBER },
                            insight: { type: Type.STRING },
                            suggestedActions: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            }
                        },
                        required: ["assetId", "assetTitle", "assetType", "potentialScore", "insight", "suggestedActions"]
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error running catalogue audit:", error);
        // Fallback mock data
        return [
            { assetId: 'rel-2', assetTitle: 'Midnight City', assetType: 'Music', potentialScore: 85, insight: "The Synthwave genre is experiencing a resurgence on TikTok. This track fits the trend perfectly.", suggestedActions: ["Create a TikTok campaign using this track.", "Pitch to 'Retro Revival' Spotify playlists.", "Run targeted ads to fans of The Midnight and Kavinsky."] },
            { assetId: 'book-1', assetTitle: 'The Silent Forest', assetType: 'Book', potentialScore: 78, insight: "With the rise of #DarkAcademia and #CottageCore on social media, this book's theme is highly relevant again.", suggestedActions: ["Promote on Instagram and Pinterest with aesthetic visuals.", "Offer a limited-time discount for the e-book.", "Engage with BookTok influencers for reviews."] },
        ];
    }
};

export const runSalesForecast = async (asset: CatalogueAsset, period: number): Promise<SalesForecast> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<SalesForecast>('/api/forecast/sales', { asset, period });
            return r;
        }
        const unit = asset.type === 'Music' ? 'streams' : 'sales';
        const prompt = `You are a data scientist specializing in media sales forecasting. Analyze this creative asset: ${JSON.stringify(asset)}. 
        Generate a realistic sales/stream forecast for the next ${period} months. 
        Provide a month-by-month breakdown with 'projected', 'optimistic', and 'pessimistic' scenarios for the units (${unit}).
        Also provide a total projectedUnits and projectedRevenue for the period, a confidence level ('High', 'Medium', or 'Low'), and a short strategic 'insight'.
        Assume a revenue of $0.0035 per stream for music, and $4.50 per sale for books.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        projectedUnits: { type: Type.NUMBER },
                        projectedRevenue: { type: Type.NUMBER },
                        confidence: { type: Type.STRING },
                        insight: { type: Type.STRING },
                        data: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    month: { type: Type.STRING },
                                    projected: { type: Type.NUMBER },
                                    optimistic: { type: Type.NUMBER },
                                    pessimistic: { type: Type.NUMBER }
                                }
                            }
                        }
                    },
                    required: ["projectedUnits", "projectedRevenue", "confidence", "insight", "data"]
                }
            }
        });
        
        const jsonResult = JSON.parse(response.text.trim());
        return {
            ...jsonResult,
            assetId: asset.id,
            assetTitle: asset.title,
            forecastPeriod: period,
        };

    } catch (error) {
        console.error("Error running sales forecast:", error);
        // Fallback mock data
        const months = Array.from({ length: period }, (_, i) => new Date(Date.now() + i * 30 * 24 * 60 * 60 * 1000).toLocaleString('default', { month: 'short' }));
        const mockData = months.map((m, i) => ({
            month: m,
            projected: 50000 + i * 10000,
            optimistic: 60000 + i * 12000,
            pessimistic: 40000 + i * 8000,
        }));

        return {
            assetId: asset.id,
            assetTitle: asset.title,
            forecastPeriod: period,
            projectedUnits: 390000,
            projectedRevenue: 1365,
            confidence: 'Medium',
            insight: 'This is fallback mock data due to an API error. The forecast suggests steady growth based on historical trends.',
            data: mockData
        };
    }
};

export const generateCampaignStrategy = async (asset: CatalogueAsset, platform: string): Promise<CampaignStrategy> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<CampaignStrategy>('/api/campaign/strategy', { asset, platform });
            return r;
        }
        const prompt = `You are an expert marketing strategist for independent creators. A ${asset.type === 'Music' ? 'musician' : 'author'} wants to launch a marketing campaign for their asset titled "${asset.title}" by ${asset.authorOrArtist}. The campaign will primarily target ${platform}. Create a comprehensive 4-week marketing strategy as a JSON object. The strategy should include a catchy campaign title, a description of the target audience, the key messaging, 3-4 content pillars, a 4-week timeline with specific activities for each week, and 2 sample posts for the target platform, including an image prompt for one of them.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        campaignTitle: { type: Type.STRING },
                        targetAudience: { type: Type.STRING },
                        keyMessaging: { type: Type.STRING },
                        contentPillars: { type: Type.ARRAY, items: { type: Type.STRING } },
                        timeline: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    week: { type: Type.STRING },
                                    activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        },
                        postExamples: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    platform: { type: Type.STRING },
                                    content: { type: Type.STRING },
                                    imagePrompt: { type: Type.STRING }
                                }
                            }
                        }
                    },
                    required: ["campaignTitle", "targetAudience", "keyMessaging", "contentPillars", "timeline", "postExamples"]
                }
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error generating campaign strategy:", error);
        // Fallback mock data
        return {
            campaignTitle: `Mock Campaign for ${asset.title}`,
            targetAudience: "This is mock data due to an API error. Target audience would be described here.",
            keyMessaging: "Key messaging and campaign slogan.",
            contentPillars: ["Behind the Scenes", "Creator's Story", "Interactive Content"],
            timeline: [
                { week: "Week 1: Teaser Phase", activities: ["Announce project", "Share snippets"] },
                { week: "Week 2: Pre-Launch Hype", activities: ["Countdown posts", "Q&A session"] },
                { week: "Week 3: Launch Week", activities: ["Launch post", "Go live on platform"] },
                { week: "Week 4: Post-Launch Engagement", activities: ["Share fan reactions", "Post-launch analysis"] }
            ],
            postExamples: [
                { platform: platform, content: "This is a mock post example.", imagePrompt: "A vibrant, abstract image related to the asset." },
                { platform: platform, content: "Another mock post to showcase variety." }
            ]
        };
    }
};

export const findMarketOpportunities = async (catalogue: CatalogueAsset[], role: Role): Promise<{ trends: MarketTrend[], opportunities: CreativeOpportunity[] }> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<{ trends: MarketTrend[], opportunities: CreativeOpportunity[] }>('/api/market/opportunities', { catalogue, role });
            return r;
        }
        const creatorType = role === Role.MUSIC_CREATOR ? 'music creator specializing in genres like synthwave and chillwave' : 'book author specializing in fantasy and sci-fi';
        const prompt = `You are a market trend analyst for a ${creatorType}. Their current catalogue is: ${JSON.stringify(catalogue.map(c => c.title))}. 
        Using Google Search, find 3 current (within the last 3-6 months), specific, and verifiable market trends for their niche on platforms like TikTok, YouTube, Instagram, or Goodreads. 
        Then, generate 2 unique and actionable creative opportunities based on these trends and the creator's existing style shown in their catalogue. 
        Each opportunity must directly relate to one of the trends you found. Provide a strong rationale for why the opportunity fits the trend and the creator's brand.
        For music, an AI snippet could be a lyrical theme or a description of a musical motif. For books, it could be a character archetype or a plot hook.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        trends: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    platform: { type: Type.STRING },
                                    description: { type: Type.STRING }
                                }
                            }
                        },
                        opportunities: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    id: { type: Type.STRING },
                                    title: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    relatedTrendId: { type: Type.STRING },
                                    assetSuggestion: {
                                        type: Type.OBJECT,
                                        properties: {
                                            type: { type: Type.STRING },
                                            format: { type: Type.STRING }
                                        }
                                    },
                                    aiSnippet: {
                                        type: Type.OBJECT,
                                        properties: {
                                            type: { type: Type.STRING },
                                            content: { type: Type.STRING }
                                        }
                                    },
                                    rationale: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        const jsonResponse = JSON.parse(response.text.trim());
        
        if (groundingChunks && groundingChunks.length > 0) {
            jsonResponse.trends.forEach((trend: Record<string, unknown>, index: number) => {
                const source = groundingChunks[index % groundingChunks.length]?.web;
                if (source) {
                    (trend as { source: { title: string; uri: string } }).source = { title: source.title || "Web Source", uri: source.uri };
                }
            });
        }
        
        return jsonResponse as { trends: MarketTrend[]; opportunities: CreativeOpportunity[] };

    } catch (error) {
        console.error("Error finding market opportunities:", error);
        // Fallback mock data
        return {
            trends: [
                { id: 'trend-1', platform: 'TikTok', description: 'Retro-funk and synthwave sounds are trending in dance challenges.', source: { title: 'TikTok Trends Report', uri: '#' } },
                { id: 'trend-2', platform: 'YouTube', description: 'Long-form "focus music" mixes (1hr+) are gaining millions of views, especially in the lofi and chillwave genres.', source: { title: 'YouTube Music Insights', uri: '#' } },
            ],
            opportunities: [
                { id: 'opp-1', title: 'Create a "Neon Groove" TikTok Sound', description: 'Produce a high-energy, 15-second synthwave audio clip designed for viral dance challenges.', relatedTrendId: 'trend-1', assetSuggestion: { type: 'Short-form Content', format: '15-second TikTok Audio' }, aiSnippet: { type: 'Melody Description', content: 'A punchy bassline with a catchy, arpeggiated synth lead and a strong, simple drum beat.' }, rationale: 'This directly taps into the TikTok trend while fitting perfectly with your existing synthwave style, potentially driving traffic to your full tracks.' },
                { id: 'opp-2', title: 'Launch "Cosmic Dreams: The Focus Session"', description: 'Compile your existing tracks like "Cosmic Dream" and "Midnight City" into a 1-hour seamless mix for YouTube.', relatedTrendId: 'trend-2', assetSuggestion: { type: 'New Release', format: '1-hour YouTube Mix' }, aiSnippet: { type: 'Lyrical Idea', content: 'Use titles like "Synthwave for Coding" or "Retro Focus Playlist" to capture search traffic.' }, rationale: 'This leverages your back-catalogue to engage the large "focus music" audience on YouTube, requiring minimal new production effort for potentially high-reward in terms of streams and discovery.' },
            ]
        };
    }
};

export const getCommunityAnalytics = async (): Promise<CommunityAnalytics> => {
     try {
        if (!USE_MOCKS) {
            const r = await apiGet<CommunityAnalytics>('/api/community/analytics');
            return r;
        }
        const prompt = `You are an expert community manager for a creative artist. Analyze this raw data of recent fan interactions and generate a community analytics report. 
        The report should contain:
        1. A "communityPulseSummary": A short, 2-3 sentence summary of the overall community mood, key topics of discussion, and any recurring questions.
        2. A list of 2 "topFans": Identify the most engaged and positive fans. For each, provide a reason for why they are a top fan and a suggested action for the creator to take to acknowledge them.
        3. A list of 2 "engagementOpportunities": Find specific, interesting comments from fans that warrant a reply. For each, provide a suggested reply that is authentic, engaging, and personalized.

        Fan Interaction Data: ${JSON.stringify(fanInteractions)}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        communityPulseSummary: { type: Type.STRING },
                        topFans: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    fanId: { type: Type.STRING },
                                    fanName: { type: Type.STRING },
                                    fanAvatar: { type: Type.STRING },
                                    reason: { type: Type.STRING },
                                    suggestedAction: { type: Type.STRING }
                                }
                            }
                        },
                        engagementOpportunities: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    interactionId: { type: Type.STRING },
                                    fanName: { type: Type.STRING },
                                    fanAvatar: { type: Type.STRING },
                                    comment: { type: Type.STRING },
                                    aiReplySuggestion: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Error generating community analytics:", error);
        // Fallback mock data
        return {
            communityPulseSummary: "This is mock data due to an API error. Overall fan sentiment is positive, with lots of excitement around new releases. Fans are frequently asking about upcoming tours and merchandise.",
            topFans: [
                { fanId: 'fan-1', fanName: 'SynthwaveLover88', fanAvatar: 'https://i.pravatar.cc/150?u=fan1', reason: 'Consistently leaves positive comments and purchased merchandise.', suggestedAction: 'Send a direct message thanking them for their support and offer a small discount code for their next purchase.' },
                { fanId: 'fan-2', fanName: 'BookwormJane', fanAvatar: 'https://i.pravatar.cc/150?u=fan2', reason: 'Passionate and insightful comments about book plots.', suggestedAction: 'Reply to their comment publicly, acknowledging their great question about a sequel.' },
            ],
            engagementOpportunities: [
                { interactionId: 'fi-2', fanName: 'BookwormJane', fanAvatar: 'https://i.pravatar.cc/150?u=fan2', comment: "Just finished The Silent Forest and I'm speechless. The world-building is incredible. Is there going to be a sequel??", aiReplySuggestion: "Thank you so much for reading! I'm so glad you enjoyed the world of The Silent Forest. I can't say anything official yet, but let's just say I'm not done with that world... 😉" },
                { interactionId: 'fi-5', fanName: 'Alex R.', fanAvatar: 'https://i.pravatar.cc/150?u=fan4', comment: "When are you touring next? Would love to see you live!", aiReplySuggestion: "Thanks for the love! We're working on some tour dates right now. Make sure you're following on Bandsintown or signed up for the newsletter to be the first to know!" }
            ]
        };
    }
};

export const getBrandReport = async (keywords: BrandKeyword[]): Promise<BrandReport> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<BrandReport>('/api/brand/report', { keywords });
            return r;
        }
        const activeKeywords = keywords.filter(k => k.isActive).map(k => k.text).join(', ');
        if (!activeKeywords) throw new Error("No active keywords provided for brand analysis.");

        const prompt = `You are a professional brand strategist and PR analyst. Using Google Search, analyze the public perception of a creative brand based on these keywords: "${activeKeywords}".
        Provide a comprehensive brand report as a JSON object. The report must include:
        1.  A "sentiment" object with scores (0-100) for positive, neutral, and negative sentiment, and lists of key topics driving positive and negative discussions.
        2.  An "archetype" object identifying the brand's primary Jungian archetype (e.g., The Creator, The Rebel, The Sage), with a brief description and a few keywords that define it.
        3.  A "swot" analysis object with concise lists of Strengths, Weaknesses, Opportunities, and Threats based on the public discourse.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        sentiment: {
                            type: Type.OBJECT,
                            properties: {
                                positiveScore: { type: Type.NUMBER },
                                neutralScore: { type: Type.NUMBER },
                                negativeScore: { type: Type.NUMBER },
                                keyPositiveTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                                keyNegativeTopics: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        },
                        archetype: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                description: { type: Type.STRING },
                                keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        },
                        swot: {
                            type: Type.OBJECT,
                            properties: {
                                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                                opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                                threats: { type: Type.ARRAY, items: { type: Type.STRING } }
                            }
                        }
                    }
                }
            }
        });

        const jsonStr = response.text.trim();
        const reportData = JSON.parse(jsonStr);
        
        return {
            ...reportData,
            generatedAt: new Date().toISOString()
        };

    } catch (error) {
        console.error("Error generating brand report:", error);
        // Fallback mock data
        return {
            generatedAt: new Date().toISOString(),
            sentiment: {
                positiveScore: 65,
                neutralScore: 25,
                negativeScore: 10,
                keyPositiveTopics: ["Nostalgic synth sounds", "Engaging live performances", "Authentic social media presence"],
                keyNegativeTopics: ["Long wait between releases", "Merchandise shipping times"]
            },
            archetype: {
                name: "The Magician",
                description: "Creates transformative and immersive experiences, making dreams a reality for their audience.",
                keywords: ["Visionary", "Immersive", "Mysterious", "Charismatic"]
            },
            swot: {
                strengths: ["Strong, loyal fanbase", "Unique and recognizable sonic identity", "High engagement on Instagram"],
                weaknesses: ["Infrequent release schedule", "Limited presence on TikTok", "Narrow genre appeal"],
                opportunities: ["Collaborate with a visual artist for immersive live shows", "Launch a Patreon for exclusive content", "Utilize trending retro themes on TikTok"],
                threats: ["Rise of similar-sounding artists", "Audience burnout from long waits", "Changes in streaming royalty payouts"]
            }
        };
    }
};


// MOCK DASHBOARD DATA AGGREGATORS
export const getAdminDashboardData = async () => {
    if (!USE_MOCKS) return apiGet('/api/admin/dashboard');
    return {
        stats: {
            totalRevenue: artists.reduce((sum, a) => sum + a.totalRevenue, 0) + authors.reduce((sum, a) => sum + a.totalRevenue, 0),
            activeArtists: artists.length,
            activeAuthors: authors.length,
            totalStreams: artists.reduce((sum, a) => sum + a.totalStreams, 0),
        },
        activities: [
            { emoji: '🎵', title: 'New Release: "Cosmic Dream"', details: 'Casey Creator', status: ActivityStatus.SUCCESS },
            { emoji: '📖', title: 'Book Published: "The Silent Forest"', details: 'Pat Publisher', status: ActivityStatus.SUCCESS },
        ]
    };
};

export const getCreatorDashboardData = async (userId: string, role: Role) => {
    if (!USE_MOCKS) return apiGet(`/api/creator/${encodeURIComponent(userId)}/dashboard?role=${encodeURIComponent(role)}`);
    if (role === Role.MUSIC_CREATOR) {
        const artist = getArtistById(userId);
        return {
            stats: {
                monthlyListeners: artist?.monthlyListeners || 0,
                totalStreams: artist?.totalStreams || 0,
                totalRevenue: artist?.totalRevenue || 0,
            },
            activities: artist?.releases.slice(0, 2).map(r => ({
                 emoji: '🎵', title: `Release: "${r.title}"`, details: r.status, status: r.status === 'Published' ? ActivityStatus.SUCCESS : ActivityStatus.PENDING
            }))
        }
    }
    if (role === Role.BOOK_AUTHOR) {
        const author = getAuthorById(userId);
        return {
            stats: {
                booksPublished: author?.booksPublished || 0,
                totalSales: author?.totalSales || 0,
                totalRevenue: author?.totalRevenue || 0,
            },
             activities: author?.books.slice(0, 2).map(b => ({
                 emoji: '📖', title: `Book: "${b.title}"`, details: b.status, status: b.status === 'Published' ? ActivityStatus.SUCCESS : ActivityStatus.PENDING
            }))
        }
    }
    return {};
};
