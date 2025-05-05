// API Response types for better type checking

export interface ApiResponse<T> {
    data: T;
    message?: string;
    success?: boolean;
}

// Auth related types
export interface User {
    _id: string;
    name: string;
    email: string;
    country: string;
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    _id: string;
    name: string;
    email: string;
    token: string;
}

// Settings types
export interface TaxSettings {
    defaultMethod: string;
    fiscalYearEnd: string;
    currency: string;
    includeFees: boolean;
}

export interface NotificationSettings {
    emailNotifications: boolean;
    transactionAlerts: boolean;
    priceAlerts: boolean;
    marketingSummaries: boolean;
}

export interface ApiSettings {
    apiEnabled: boolean;
    apiKey: string;
    allowedOrigins: string;
}

export interface UserSettings {
    tax: TaxSettings;
    notifications: NotificationSettings;
    api: ApiSettings;
}

// Wallet types
export interface Wallet {
    _id: string;
    user: string;
    name: string;
    address: string;
    isActive: boolean;
    balance: number;
    balanceUSD: number;
    lastSynced: string | null;
}

// Transaction types
export interface Transaction {
    _id: string;
    user: string;
    wallet: string | { _id: string; name: string; address: string };
    txHash: string;
    txType: string;
    timestamp: string;
    category: string;
    classification: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    currency: string;
    feeAmount: number;
    feeCurrency: string;
    baseCurrencyAmount: number;
    baseCurrencyRate: number;
    baseCurrency: string;
    isImported: boolean;
    notes: string;
    metadata: Record<string, any>;
}

export interface TransactionsPaginatedResponse {
    transactions: Transaction[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

// Dashboard data
export interface DashboardData {
    walletCount: number;
    transactionCount: number;
    balanceUSD: number;
    recentTransactions: {
        id: string;
        date: string;
        type: string;
        amount: number;
        currency: string;
        usdValue: number;
    }[];
    taxSummary: {
        totalIncome: number;
        totalCapitalGains: number;
        totalShortTermGains: number;
        totalLongTermGains: number;
    };
}

// Report types
export interface ReportOptions {
    years: number[];
    formats: string[];
    accountingMethods: string[];
    countries: string[];
    forms: string[];
}

export interface ReportData {
    id: string;
    name: string;
    year: number;
    type: string;
    accountingMethod: string;
    dateGenerated: string;
    downloadUrl: string;
}
