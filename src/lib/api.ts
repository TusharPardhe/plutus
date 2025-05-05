import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding token
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle 401 Unauthorized errors (expired tokens)
        if (error.response && error.response.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login if not already on login or register page
            const pathname = window.location.pathname;
            if (pathname !== '/login' && pathname !== '/register') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

// Type-safe API helper methods
const apiClient = {
    // Auth endpoints
    async login(email: string, password: string) {
        return api.post('/auth/login', { email, password });
    },

    async register(name: string, email: string, password: string, country: string) {
        return api.post('/auth/register', { name, email, password, country });
    },

    async getUserProfile() {
        return api.get('/auth/profile');
    },

    async updateUserProfile(profileData: any) {
        return api.put('/auth/profile', profileData);
    },

    async changePassword(currentPassword: string, newPassword: string) {
        return api.put('/auth/change-password', { currentPassword, newPassword });
    },

    // Settings endpoints
    async getUserSettings() {
        return api.get('/auth/settings');
    },

    async updateUserSettings(settingsData: any) {
        return api.put('/auth/settings', settingsData);
    },

    async generateApiKey() {
        return api.post('/auth/settings/api-key');
    },

    // Wallets endpoints
    async getWallets() {
        return api.get('/wallets');
    },

    async addWallet(address: string, name: string) {
        return api.post('/wallets', { address, name });
    },

    async syncWallet(walletId: string) {
        return api.post(`/wallets/${walletId}/sync`);
    },

    // Transactions endpoints
    async getTransactions(params?: any) {
        return api.get('/transactions', { params });
    },

    async getTransactionById(id: string) {
        return api.get(`/transactions/${id}`);
    },

    // Reports endpoints
    async generateReport(options: any) {
        return api.post('/reports/generate', options);
    },

    // Dashboard endpoint
    async getDashboard() {
        return api.get('/dashboard');
    },

    // Raw axios instance for custom requests
    raw: api,
};

export default apiClient;
