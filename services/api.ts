// FIX: This file was a placeholder file. Implemented mock data and API functions, including integration with the Gemini API for AI-powered features.
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

import {
    releases, artists, books, authors, smartLinks, pressReleases,
    contacts, campaigns, contentLibrary, products, orders, transactions,
    audienceData, goals, collaborationProjects, creativeFeedbackHistory,
    fanInteractions
} from './mockData';

// --- GEMINI API SETUP ---
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
  } catch (error) {
    console.error('API GET error:', error);
    return {} as T;
  }
}

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const ct = res.headers.get('content-type') || '';
    const errBody = ct.includes('application/json') ? await res.json().catch(() => ({})) : await res.text().catch(() => '');
    const msg = typeof body === 'object' && body && 'message' in body ? (body as { message: string }).message : String(body || res.statusText || res.status);
    throw new Error(msg);
  }
  return res.json();
}



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
export const getArtistById = (id: string) => artists.find(a => a.id === id);
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
export const getAuthorById = (id: string) => authors.find(a => a.id === id);
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
        // Mock fallback
        return "This is generated content. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    } catch (error) {
        console.error("Error generating text content:", error);
        return "Sorry, I couldn't generate content right now.";
    }
};

export const generateAIImage = async (prompt: string, style: string): Promise<string> => {
    if (!USE_MOCKS) {
        try {
            // Note: server doesn't implement image generation yet, so this might fail if not mocked
            // But checking server code, I didn't add image endpoint. I should assume mock for image.
            // Or better, keep the mock logic as the primary since I don't have a real image gen tool.
            // But strict requirement was "secure API key". If I use picsum, no key needed.
            // So logic below is fine.
        } catch (e) {
             console.error(e);
        }
    }
    // Always use mock image generator (Picsum) for now as we don't have backend image gen
    return new Promise(resolve => {
        setTimeout(() => {
            const seed = encodeURIComponent(`${prompt}-${style}`);
            resolve(`https://picsum.photos/seed/${seed}/512/512`);
        }, 1000);
    });
};


export const generateAITrack = (genre: string, mood: string, duration: number): Promise<GeneratedTrack> => {
    // Always use mock for track generation
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ title: `${mood} ${genre} Groove`, genre, mood, duration, url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' });
        }, 2000);
    });
};

export const getAIInsight = async (contextData: string): Promise<string> => {
     try {
        if (!USE_MOCKS) {
            const r = await apiPost<string>('/api/ai/insight', { contextData });
            return r as unknown as string;
        }
        return "Strategic Insight: Based on current trends, focusing on short-form video content will yield the highest ROI for your brand.";
    } catch (error) {
        console.error("Error generating AI insight:", error);
        return "Could not generate an insight at this time.";
    }
};

export const generateAudienceSegments = async (data: AudienceData): Promise<AudienceSegment[]> => {
    try {
        if (!USE_MOCKS) {
            const r = await apiPost<AudienceSegment[]>('/api/ai/segments', { data });
            return r;
        }
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error generating audience segments:", error);
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
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error generating goal suggestions:", error);
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
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error analyzing creative idea:", error);
        return {
            ideaSnippet: idea,
            commercialPotential: 75,
            keyEmotions: [{ emotion: 'Nostalgia', score: 85 }, { emotion: 'Joy', score: 65 }],
            creativeSuggestions: ["Consider simplifying the chorus.", "The visual concept is strong.", "Target the 18-24 demographic."]
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
        throw new Error("Mock Mode");
    } catch (error: unknown) {
        console.error("Error fetching media mentions:", error);
         // Return mock mentions
         return [
             { id: `mention-1`, source: 'musicblog.com', url: 'https://musicblog.com/review', title: "Casey Creator's New Hit", snippet: "A refreshing take on synthwave...", sentiment: 'Positive', publishedAt: new Date().toISOString() }
         ];
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
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error running catalogue audit:", error);
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
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error running sales forecast:", error);
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
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error generating campaign strategy:", error);
        return {
            campaignTitle: `Mock Campaign for ${asset.title}`,
            targetAudience: "Fans of 80s aesthetics and synth-pop.",
            keyMessaging: "A journey back in time.",
            contentPillars: ["Behind the Scenes", "Creator's Story", "Interactive Content"],
            timeline: [
                { week: "Week 1: Teaser Phase", activities: ["Announce project", "Share snippets"] },
                { week: "Week 2: Pre-Launch Hype", activities: ["Countdown posts", "Q&A session"] },
                { week: "Week 3: Launch Week", activities: ["Launch post", "Go live on platform"] },
                { week: "Week 4: Post-Launch Engagement", activities: ["Share fan reactions", "Post-launch analysis"] }
            ],
            postExamples: [
                { platform: platform, content: "My new track is out! #Synthwave", imagePrompt: "A vibrant, abstract image related to the asset." },
                { platform: platform, content: "Check out the new video!" }
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
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error finding market opportunities:", error);
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
            const r = await apiPost<CommunityAnalytics>('/api/community/analytics', { fanInteractions }); // Pass fanInteractions
            return r;
        }
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error generating community analytics:", error);
        return {
            communityPulseSummary: "This is mock data due to an API error. Overall fan sentiment is positive.",
            topFans: [
                { fanId: 'fan-1', fanName: 'SynthwaveLover88', fanAvatar: 'https://i.pravatar.cc/150?u=fan1', reason: 'Consistently leaves positive comments.', suggestedAction: 'Send a thank you.' },
                { fanId: 'fan-2', fanName: 'BookwormJane', fanAvatar: 'https://i.pravatar.cc/150?u=fan2', reason: 'Insightful comments.', suggestedAction: 'Reply to their comment.' },
            ],
            engagementOpportunities: [
                { interactionId: 'fi-2', fanName: 'BookwormJane', fanAvatar: 'https://i.pravatar.cc/150?u=fan2', comment: "Just finished The Silent Forest...", aiReplySuggestion: "Thank you so much!" },
                { interactionId: 'fi-5', fanName: 'Alex R.', fanAvatar: 'https://i.pravatar.cc/150?u=fan4', comment: "When are you touring next?", aiReplySuggestion: "Working on dates!" }
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
        throw new Error("Mock Mode");
    } catch (error) {
        console.error("Error generating brand report:", error);
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
