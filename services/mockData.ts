import {
    MusicRelease, Artist, Book, Author, SmartLink, PressRelease,
    Contact, Campaign, Content, Product, Order, Transaction, TransactionStatus, 
    TransactionType, AudienceData, Goal, GoalStatus,
    CollaborationProject, CollaborationProjectStatus, CreativeFeedback,
    FanInteraction
} from '../types';

export const releases: MusicRelease[] = [
    { id: 'rel-1', title: 'Cosmic Dream', artist: 'Casey Creator', coverArt: 'https://picsum.photos/seed/cosmic/400/400', status: 'Published', streams: 1250000, revenue: 4500, platforms: 150 },
    { id: 'rel-2', title: 'Midnight City', artist: 'Casey Creator', coverArt: 'https://picsum.photos/seed/midnight/400/400', status: 'Published', streams: 850000, revenue: 2800, platforms: 150 },
    { id: 'rel-3', title: 'Ocean Tides', artist: 'Casey Creator', coverArt: 'https://picsum.photos/seed/ocean/400/400', status: 'Pending', streams: 0, revenue: 0, platforms: 0 },
    { id: 'rel-4', title: 'Synthwave Memories', artist: 'Alex Admin', coverArt: 'https://picsum.photos/seed/synth/400/400', status: 'Published', streams: 3200000, revenue: 9800, platforms: 200 },
];

export const artists: Artist[] = [
    { id: 'creator-001', name: 'Casey Creator', avatar: 'https://i.pravatar.cc/150?u=casey-creator', monthlyListeners: 2500000, totalStreams: 2100000, totalRevenue: 7300, releases: releases.filter(r => r.artist === 'Casey Creator') },
    { id: 'admin-001', name: 'Alex Admin', avatar: 'https://i.pravatar.cc/150?u=admin-alex', monthlyListeners: 5800000, totalStreams: 3200000, totalRevenue: 9800, releases: releases.filter(r => r.artist === 'Alex Admin') },
];

export const books: Book[] = [
    { id: 'book-1', title: 'The Silent Forest', author: 'Pat Publisher', coverArt: 'https://picsum.photos/seed/forest/400/600', status: 'Published', sales: 15200, revenue: 65000, stores: 20 },
    { id: 'book-2', title: 'Echoes of Tomorrow', author: 'Pat Publisher', coverArt: 'https://picsum.photos/seed/echoes/400/600', status: 'Published', sales: 8500, revenue: 38000, stores: 20 },
    { id: 'book-3', title: 'Secrets of the Deep', author: 'Pat Publisher', coverArt: 'https://picsum.photos/seed/deep/400/600', status: 'Draft', sales: 0, revenue: 0, stores: 0 },
];

export const authors: Author[] = [
    { id: 'author-001', name: 'Pat Publisher', avatar: 'https://i.pravatar.cc/150?u=pat-publisher', booksPublished: 2, totalSales: 23700, totalRevenue: 103000, books },
];

export const smartLinks: SmartLink[] = [
    { id: 'sl-1', name: 'Cosmic Dream Pre-Save', shortUrl: 'fan.link/cosmic', originalUrl: 'spotify:track:123', type: 'Pre-Save', clicks: 12450, conversions: 4500 },
    { id: 'sl-2', name: 'Casey Creator Bio', shortUrl: 'fan.link/casey', originalUrl: 'https://casey.com', type: 'Bio-Link', clicks: 8800, conversions: 0 },
];

export const pressReleases: PressRelease[] = [
    { id: 'pr-1', title: 'Casey Creator Announces "Cosmic Dream" Single', status: 'Sent', sentDate: '2024-05-15', openRate: 45 },
    { id: 'pr-2', title: 'Pat Publisher\'s "The Silent Forest" Hits Bestseller List', status: 'Draft', sentDate: null, openRate: 0 },
];

export const contacts: Contact[] = [
    { id: 'ct-1', name: 'John Doe', email: 'john.doe@musicblog.com', role: 'Press', list: 'Press & Media', dateAdded: '2024-01-10' },
];

export const campaigns: Campaign[] = [
    { id: 'camp-1', name: 'Cosmic Dream Release Campaign', status: 'Active', budget: 5000, startDate: '2024-05-01', endDate: '2024-06-01', channels: ['Spotify Ads', 'Instagram'] },
];

export const contentLibrary: Content[] = [
    { id: 'cl-1', title: 'Cosmic Dream Instagram Post', type: 'Social Post', status: 'Published', content: 'My new single is out now!', lastModified: '2024-05-20' },
];

export const products: Product[] = [
    { id: 'prod-1', name: 'Cosmic Dream T-Shirt', price: 25, image: 'https://picsum.photos/seed/tshirt/400/400', category: 'Apparel', sales: 150, stock: 50 },
];

export const orders: Order[] = [
    { id: 'ord-1', customerName: 'Jane Smith', date: '2024-05-21', total: 25.00, status: 'Delivered', items: [{ productId: 'prod-1', quantity: 1 }] },
];

export const transactions: Transaction[] = [
    { id: 'txn-1', date: '2024-06-20', description: "Royalty from 'Cosmic Dream' on Spotify", type: TransactionType.ROYALTY, status: TransactionStatus.CLEARED, amount: 150.25 },
    { id: 'txn-2', date: '2024-06-19', description: "Sale of 'Cosmic Dream T-Shirt'", type: TransactionType.SALE, status: TransactionStatus.CLEARED, amount: 18.50 },
    { id: 'txn-3', date: '2024-06-18', description: "Sale of 'The Silent Forest' on Amazon", type: TransactionType.SALE, status: TransactionStatus.CLEARED, amount: 4.99 },
    { id: 'txn-4', date: '2024-06-15', description: "Payout to Bank Account", type: TransactionType.PAYOUT, status: TransactionStatus.PAID_OUT, amount: -5200.00 },
    { id: 'txn-5', date: '2024-06-12', description: "Royalty from 'Midnight City' on Apple Music", type: TransactionType.ROYALTY, status: TransactionStatus.PENDING, amount: 85.60 },
    { id: 'txn-6', date: '2024-06-10', description: "Royalty from 'Synthwave Memories' on YouTube", type: TransactionType.ROYALTY, status: TransactionStatus.CLEARED, amount: 45.10 },
];

export const audienceData: AudienceData = {
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

export const goals: Goal[] = [
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

export const collaborationProjects: CollaborationProject[] = [
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

export const creativeFeedbackHistory: CreativeFeedback[] = [
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

export const fanInteractions: FanInteraction[] = [
    { id: 'fi-1', fanId: 'fan-1', fanName: 'SynthwaveLover88', fanAvatar: 'https://i.pravatar.cc/150?u=fan1', type: 'Comment', content: "Cosmic Dream is an absolute masterpiece! The synth solo gives me chills every time. Can't wait for the vinyl release!", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-2', fanId: 'fan-2', fanName: 'BookwormJane', fanAvatar: 'https://i.pravatar.cc/150?u=fan2', type: 'Comment', content: "Just finished The Silent Forest and I'm speechless. The world-building is incredible. Is there going to be a sequel??", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-3', fanId: 'fan-1', fanName: 'SynthwaveLover88', fanAvatar: 'https://i.pravatar.cc/150?u=fan1', type: 'Purchase', content: "Purchased 'Cosmic Dream T-Shirt'", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-4', fanId: 'fan-3', fanName: 'MusicFan23', fanAvatar: 'https://i.pravatar.cc/150?u=fan3', type: 'Comment', content: "This is a good song but the mix feels a little muddy in the low end.", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'fi-5', fanId: 'fan-4', fanName: 'Alex R.', fanAvatar: 'https://i.pravatar.cc/150?u=fan4', type: 'Comment', content: "When are you touring next? Would love to see you live!", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];
