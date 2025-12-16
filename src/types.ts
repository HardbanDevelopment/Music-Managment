
// FIX: This was a placeholder file. Added all necessary type definitions and enums for the application to resolve type-related errors across multiple files.
import React from 'react';

export enum Role {
    ADMIN = 'ADMIN',
    MUSIC_CREATOR = 'MUSIC_CREATOR',
    BOOK_AUTHOR = 'BOOK_AUTHOR',
}

export interface User {
    id: string;
    name: string;
    role: Role;
    avatar: string;
    // New fields for profile management
    email?: string;
    bio?: string;
    location?: string;
    website?: string;
}

export interface StatCardData {
    title: string;
    value: string;
    trend: string;
    icon: React.ReactNode;
    description: string;
    color: string;
}

export interface PerformanceMetric {
    title: string;
    value: string;
    trend: string;
    subtext: string;
    icon: React.ReactNode;
    gradient: string;
}

export enum ActivityStatus {
    SUCCESS = 'Success',
    PENDING = 'Pending',
    FAILED = 'Failed',
}

export interface ActivityItem {
    emoji: string;
    title: string;
    details: string;
    status: ActivityStatus;
}

export interface MusicRelease {
    id: string;
    title: string;
    artist: string;
    coverArt: string;
    status: 'Published' | 'Pending' | 'Draft';
    streams: number;
    revenue: number;
    platforms: number;
}

export interface Artist {
    id:string;
    name: string;
    avatar: string;
    monthlyListeners: number;
    totalStreams: number;
    totalRevenue: number;
    releases: MusicRelease[];
}

export interface GeoData {
    id: string;
    value: number;
}

export interface Book {
    id: string;
    title: string;
    author: string;
    coverArt: string;
    status: 'Published' | 'Draft';
    sales: number;
    revenue: number;
    stores: number;
}

export interface Author {
    id: string;
    name: string;
    avatar: string;
    booksPublished: number;
    totalSales: number;
    totalRevenue: number;
    books: Book[];
}

export interface SmartLink {
    id: string;
    name: string;
    shortUrl: string;
    originalUrl: string;
    type: 'Pre-Save' | 'Bio-Link' | 'Single';
    clicks: number;
    conversions: number;
}

export interface GeneratedTrack {
    title: string;
    genre: string;
    mood: string;
    duration: number;
    url: string;
}

export interface PressRelease {
    id: string;
    title: string;
    status: 'Sent' | 'Draft';
    sentDate: string | null;
    openRate: number;
}

export interface Contact {
    id: string;
    name: string;
    email: string;
    role: string;
    list: string;
    dateAdded: string;
}

export type CampaignStatus = 'Active' | 'Planning' | 'Completed' | 'Paused';

export interface Campaign {
    id: string;
    name: string;
    status: CampaignStatus;
    budget: number;
    startDate: string;
    endDate: string;
    channels: string[];
}

export interface CalendarEvent {
    date: string;
    title: string;
    color: 'purple' | 'blue' | 'green' | 'yellow';
}

export interface MediaMention {
    id: string;
    source: string;
    url: string;
    title: string;
    snippet: string;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    publishedAt: string;
}

export interface Content {
    id: string;
    title: string;
    type: 'Social Post' | 'Blog Article' | 'Ad Copy' | 'Email';
    status: 'Draft' | 'Scheduled' | 'Published';
    content: string;
    lastModified: string;
}

export type ProductCategory = 'Apparel' | 'Accessory' | 'Digital';

export interface Product {
    id: string;
    name: string;
    price: number;
    image: string;
    category: ProductCategory;
    sales: number;
    stock: number;
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
    id: string;
    customerName: string;
    date: string;
    total: number;
    status: OrderStatus;
    items: { productId: string; quantity: number }[];
}

export interface AnalyticsData {
    streamsTrend: { name: string; streams: number }[];
    revenueBreakdown: { name: string; value: number }[];
    platformRevenue: { name: string; value: number }[];
    geoDistribution: GeoData[];
    fanDemographics: {
        age: { name: string; value: number }[];
        gender: { name: string; value: number }[];
    };
}

export interface SocialPlatform {
    id: string;
    name: string;
    icon: React.ReactNode;
    status: 'Connected' | 'Not Connected';
}

export interface Contract {
    id: string;
    name: string;
    date: string;
    status: 'Active' | 'Expired';
}

export interface PlaylistPlacement {
    id: string;
    playlistName: string;
    platform: string;
    followers: number;
    releaseTitle: string;
}

export interface PublishingStore {
    name: string;
    logo: string;
    status: 'Live' | 'Processing';
}

export enum TransactionType {
    ROYALTY = 'Royalty',
    SALE = 'Sale',
    PAYOUT = 'Payout',
    REFUND = 'Refund'
}

export enum TransactionStatus {
    CLEARED = 'Cleared',
    PENDING = 'Pending',
    PAID_OUT = 'Paid Out',
    FAILED = 'Failed',
}

export interface Transaction {
    id: string;
    date: string;
    description: string;
    type: TransactionType;
    status: TransactionStatus;
    amount: number; // positive for earnings, negative for payouts/refunds
}

export interface WalletData {
    currentBalance: number;
    lifetimeEarnings: number;
    nextPayoutAmount: number;
    nextPayoutDate: string;
    earningsBreakdown: { name: string; value: number }[];
}

export interface EngagementItem {
    id: string;
    contentTitle: string;
    contentType: 'Release' | 'Book' | 'Product' | 'Post';
    metric: string; 
    value: number;
}

export interface AudienceSegment {
    name: string;
    description: string;
    sizePercentage: number;
    keyCharacteristics: string[];
    marketingInsight: string;
}

export interface AudienceData {
    totalAudience: number;
    audienceGrowth: { month: string; newFollowers: number }[];
    engagementRate: number;
    topEngagement: EngagementItem[];
    geoDistribution: GeoData[];
    fanDemographics: {
        age: { name: string; value: number }[];
        gender: { name: string; value: number }[];
    };
}

export enum GoalStatus {
    ON_TRACK = 'On Track',
    AT_RISK = 'At Risk',
    COMPLETED = 'Completed',
    NOT_STARTED = 'Not Started'
}

export interface SuggestedTask {
    id: string;
    description: string;
    isCompleted: boolean;
    link?: string; // Optional link to a relevant page in the app
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    status: GoalStatus;
    dueDate: string;
    progress: number; // Percentage 0-100
    targetMetric: string; // e.g., "50,000 streams"
    currentValue: string; // e.g., "12,500 streams"
    suggestedTasks: SuggestedTask[];
}

export enum CollaborationProjectStatus {
    OPEN = 'Open for Applications',
    IN_PROGRESS = 'In Progress',
    COMPLETED = 'Completed',
}

export interface RevenueSplit {
    role: string;
    share: number; // Percentage
    userId?: string;
}

export interface CollaborationProject {
    id: string;
    title: string;
    description: string;
    creatorId: string;
    creatorName: string;
    status: CollaborationProjectStatus;
    rolesNeeded: string[];
    revenueSplits: RevenueSplit[];
}

export interface EmotionalMetric {
  emotion: 'Nostalgia' | 'Excitement' | 'Melancholy' | 'Tension' | 'Joy';
  score: number; // 0-100
}

export interface CreativeFeedback {
  id: string;
  ideaSnippet: string;
  commercialPotential: number; // 0-100
  keyEmotions: EmotionalMetric[];
  creativeSuggestions: string[];
  analysisDate: string;
}

export interface CatalogueAsset {
  id: string;
  type: 'Music' | 'Book';
  title: string;
  authorOrArtist: string;
  coverArt: string;
  releaseDate: string;
}

export interface AuditOpportunity {
  assetId: string;
  assetTitle: string;
  assetType: 'Music' | 'Book';
  potentialScore: number; // 0-100
  insight: string;
  suggestedActions: string[];
}

export interface ForecastDataPoint {
  month: string;
  projected: number;
  optimistic: number;
  pessimistic: number;
}

export interface SalesForecast {
  assetId: string;
  assetTitle: string;
  forecastPeriod: number; // in months
  projectedUnits: number; // streams or sales
  projectedRevenue: number;
  confidence: 'High' | 'Medium' | 'Low';
  insight: string;
  data: ForecastDataPoint[];
}

export interface PostExample {
    platform: string;
    content: string;
    imagePrompt?: string;
}

export interface CampaignStrategy {
    campaignTitle: string;
    targetAudience: string;
    keyMessaging: string;
    contentPillars: string[];
    timeline: { week: string; activities: string[] }[];
    postExamples: PostExample[];
}

export interface MarketTrend {
    id: string;
    platform: string;
    description: string;
    source: {
        title: string;
        uri: string;
    };
}

export interface CreativeOpportunity {
    id: string;
    title: string;
    description: string;
    relatedTrendId: string;
    assetSuggestion: {
        type: 'New Release' | 'Short-form Content' | 'Short Story' | 'Remix';
        format: string;
    };
    aiSnippet: {
        type: 'Lyrical Idea' | 'Plot Point' | 'Melody Description';
        content: string;
    };
    rationale: string;
}

export interface Fan {
    id: string;
    name: string;
    avatar: string;
    subscriptionTier: 'Gold' | 'Silver' | 'Bronze' | 'None';
    joinDate: string;
}

export interface FanInteraction {
    id: string;
    fanId: string;
    fanName: string;
    fanAvatar: string;
    type: 'Comment' | 'Purchase' | 'Like';
    content: string;
    date: string;
}

export interface EngagementOpportunity {
    interactionId: string;
    fanName: string;
    fanAvatar: string;
    comment: string;
    aiReplySuggestion: string;
}

export interface TopFan {
    fanId: string;
    fanName: string;
    fanAvatar: string;
    reason: string;
    suggestedAction: string;
}

export interface CommunityAnalytics {
    communityPulseSummary: string;
    topFans: TopFan[];
    engagementOpportunities: EngagementOpportunity[];
}

export interface BrandKeyword {
    id: string;
    text: string;
    isActive: boolean;
}

export interface BrandSentimentAnalysis {
    positiveScore: number; // 0-100
    neutralScore: number; // 0-100
    negativeScore: number; // 0-100
    keyPositiveTopics: string[];
    keyNegativeTopics: string[];
}

export interface BrandArchetype {
    name: string;
    description: string;
    keywords: string[];
}

export interface SWOT {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
}

export interface BrandReport {
    generatedAt: string;
    sentiment: BrandSentimentAnalysis;
    archetype: BrandArchetype;
    swot: SWOT;
}
