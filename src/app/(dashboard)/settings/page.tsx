'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserIcon, CogIcon, LockClosedIcon, BellIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { User, UserSettings, TaxSettings, NotificationSettings, ApiSettings } from '@/types/api';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('profile');
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Fetch user profile data
    const { data: profileData, isLoading: profileLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            try {
                const response = await api.getUserProfile();
                return response.data;
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Return default data if API fails
                return {
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    country: 'US',
                    timezone: 'America/New_York',
                };
            }
        },
    });

    // Create state based on the fetched data
    const [profileForm, setProfileForm] = useState({
        name: profileData?.name || '',
        email: profileData?.email || '',
        country: profileData?.country || 'US',
        timezone: profileData?.timezone || 'America/New_York',
    });

    // Update profile form when data is loaded
    useEffect(() => {
        if (profileData) {
            setProfileForm({
                name: profileData.name || '',
                email: profileData.email || '',
                country: profileData.country || 'US',
                timezone: profileData.timezone || 'America/New_York',
            });
        }
    }, [profileData]);

    // Fetch user settings
    const { data: settingsData, isLoading: settingsLoading } = useQuery<UserSettings>({
        queryKey: ['userSettings'],
        queryFn: async () => {
            try {
                const response = await api.getUserSettings();
                return response.data;
            } catch (error) {
                console.error('Error fetching settings:', error);
                // Return default settings if API fails
                return {
                    tax: {
                        defaultMethod: 'fifo',
                        fiscalYearEnd: 'december',
                        currency: 'USD',
                        includeFees: true,
                    },
                    notifications: {
                        emailNotifications: true,
                        transactionAlerts: true,
                        priceAlerts: false,
                        marketingSummaries: false,
                    },
                    api: {
                        apiEnabled: false,
                        apiKey: '',
                        allowedOrigins: '',
                    },
                };
            }
        },
    });

    const [taxSettings, setTaxSettings] = useState({
        defaultMethod: settingsData?.tax?.defaultMethod || 'fifo',
        fiscalYearEnd: settingsData?.tax?.fiscalYearEnd || 'december',
        currency: settingsData?.tax?.currency || 'USD',
        includeFees: settingsData?.tax?.includeFees ?? true,
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: settingsData?.notifications?.emailNotifications ?? true,
        transactionAlerts: settingsData?.notifications?.transactionAlerts ?? true,
        priceAlerts: settingsData?.notifications?.priceAlerts ?? false,
        marketingSummaries: settingsData?.notifications?.marketingSummaries ?? false,
    });

    const [apiSettings, setApiSettings] = useState({
        apiEnabled: settingsData?.api?.apiEnabled ?? false,
        apiKey: settingsData?.api?.apiKey || '',
        allowedOrigins: settingsData?.api?.allowedOrigins || '',
    });

    // Update settings forms when data is loaded
    useEffect(() => {
        if (settingsData) {
            setTaxSettings({
                defaultMethod: settingsData.tax?.defaultMethod || 'fifo',
                fiscalYearEnd: settingsData.tax?.fiscalYearEnd || 'december',
                currency: settingsData.tax?.currency || 'USD',
                includeFees: settingsData.tax?.includeFees ?? true,
            });

            setNotificationSettings({
                emailNotifications: settingsData.notifications?.emailNotifications ?? true,
                transactionAlerts: settingsData.notifications?.transactionAlerts ?? true,
                priceAlerts: settingsData.notifications?.priceAlerts ?? false,
                marketingSummaries: settingsData.notifications?.marketingSummaries ?? false,
            });

            setApiSettings({
                apiEnabled: settingsData.api?.apiEnabled ?? false,
                apiKey: settingsData.api?.apiKey || '',
                allowedOrigins: settingsData.api?.allowedOrigins || '',
            });
        }
    }, [settingsData]);

    // Determine if initial data is still loading
    const isInitialLoading = profileLoading || settingsLoading;

    // Update profile mutation
    const updateProfileMutation = useMutation({
        mutationFn: (profileData: Partial<User>) => api.updateUserProfile(profileData),
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Failed to update profile' });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
    });

    // Update settings mutation
    const updateSettingsMutation = useMutation({
        mutationFn: (
            settingsData: Partial<{
                tax: Partial<TaxSettings>;
                notifications: Partial<NotificationSettings>;
                api: Partial<ApiSettings>;
            }>
        ) => api.updateUserSettings(settingsData),
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Settings updated successfully!' });
            queryClient.invalidateQueries({ queryKey: ['userSettings'] });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Failed to update settings' });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
    });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: (passwordData: { currentPassword: string; newPassword: string }) =>
            api.changePassword(passwordData.currentPassword, passwordData.newPassword),
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Failed to change password' });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
    });

    // Generate API Key mutation
    const generateApiKeyMutation = useMutation({
        mutationFn: () => api.generateApiKey(),
        onSuccess: (response) => {
            if (response.data && response.data.apiKey) {
                setApiSettings((prev) => ({ ...prev, apiKey: response.data.apiKey }));
                setMessage({ type: 'success', text: 'New API key generated successfully' });
            }

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Failed to generate API key' });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);
        },
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfileForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTaxSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setTaxSettings((prev) => ({ ...prev, [name]: val }));
    };

    const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setNotificationSettings((prev) => ({ ...prev, [name]: checked }));
    };

    const handleApiSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setApiSettings((prev) => ({ ...prev, [name]: val }));
    };

    const handleGenerateApiKey = () => {
        generateApiKeyMutation.mutate();
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        updateProfileMutation.mutate(profileForm);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });

            // Clear message after 3 seconds
            setTimeout(() => {
                setMessage(null);
            }, 3000);

            return;
        }

        changePasswordMutation.mutate(passwordForm);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Information</h3>
                            <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
                        </div>

                        <form onSubmit={handleSaveProfile}>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={profileForm.name}
                                            onChange={handleProfileChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={profileForm.email}
                                            onChange={handleProfileChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                                        Country
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="country"
                                            name="country"
                                            value={profileForm.country}
                                            onChange={handleProfileChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="DE">Germany</option>
                                            <option value="JP">Japan</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                                        Timezone
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="timezone"
                                            name="timezone"
                                            value={profileForm.timezone}
                                            onChange={handleProfileChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="America/New_York">Eastern Time (US)</option>
                                            <option value="America/Chicago">Central Time (US)</option>
                                            <option value="America/Denver">Mountain Time (US)</option>
                                            <option value="America/Los_Angeles">Pacific Time (US)</option>
                                            <option value="Europe/London">London</option>
                                            <option value="Europe/Paris">Paris</option>
                                            <option value="Asia/Tokyo">Tokyo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={updateProfileMutation.isLoading}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                >
                                    {updateProfileMutation.isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Change Password</h3>
                            <p className="mt-1 text-sm text-gray-500">Update your password.</p>
                        </div>

                        <form onSubmit={handleChangePassword}>
                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="currentPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Current Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type="password"
                                            required
                                            value={passwordForm.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        New Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type="password"
                                            required
                                            value={passwordForm.newPassword}
                                            onChange={handlePasswordChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            minLength={8}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            required
                                            value={passwordForm.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={changePasswordMutation.isLoading}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                >
                                    {changePasswordMutation.isLoading ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>
                        </form>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Two-Factor Authentication</h3>
                            <div className="mt-2 max-w-xl text-sm text-gray-500">
                                <p>Add additional security to your account using two-factor authentication.</p>
                            </div>
                            <div className="mt-5">
                                <button
                                    type="button"
                                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                >
                                    <LockClosedIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                                    Set up 2FA
                                </button>
                            </div>
                        </div>
                    </div>
                );

            case 'taxes':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Tax Calculation Settings</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Configure how your tax calculations are performed.
                            </p>
                        </div>

                        <form>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="defaultMethod" className="block text-sm font-medium text-gray-700">
                                        Default Accounting Method
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="defaultMethod"
                                            name="defaultMethod"
                                            value={taxSettings.defaultMethod}
                                            onChange={handleTaxSettingsChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="fifo">First In, First Out (FIFO)</option>
                                            <option value="lifo">Last In, First Out (LIFO)</option>
                                            <option value="hifo">Highest In, First Out (HIFO)</option>
                                            <option value="acb">Average Cost Basis (ACB)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="fiscalYearEnd" className="block text-sm font-medium text-gray-700">
                                        Fiscal Year End
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="fiscalYearEnd"
                                            name="fiscalYearEnd"
                                            value={taxSettings.fiscalYearEnd}
                                            onChange={handleTaxSettingsChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="december">December 31</option>
                                            <option value="january">January 31</option>
                                            <option value="february">February 28/29</option>
                                            <option value="march">March 31</option>
                                            <option value="april">April 30</option>
                                            <option value="may">May 31</option>
                                            <option value="june">June 30</option>
                                            <option value="july">July 31</option>
                                            <option value="august">August 31</option>
                                            <option value="september">September 30</option>
                                            <option value="october">October 31</option>
                                            <option value="november">November 30</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                                        Base Currency
                                    </label>
                                    <div className="mt-1">
                                        <select
                                            id="currency"
                                            name="currency"
                                            value={taxSettings.currency}
                                            onChange={handleTaxSettingsChange}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        >
                                            <option value="USD">US Dollar (USD)</option>
                                            <option value="EUR">Euro (EUR)</option>
                                            <option value="GBP">British Pound (GBP)</option>
                                            <option value="CAD">Canadian Dollar (CAD)</option>
                                            <option value="AUD">Australian Dollar (AUD)</option>
                                            <option value="JPY">Japanese Yen (JPY)</option>
                                        </select>
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Used for tax reporting and value calculations.
                                    </p>
                                </div>

                                <div className="sm:col-span-3">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="includeFees"
                                                name="includeFees"
                                                type="checkbox"
                                                checked={taxSettings.includeFees}
                                                onChange={handleTaxSettingsChange}
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="includeFees" className="font-medium text-gray-700">
                                                Include fees in cost basis
                                            </label>
                                            <p className="text-gray-500">
                                                Transaction fees will be included in the cost basis calculations.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    disabled={updateSettingsMutation.isLoading}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                    onClick={() => updateSettingsMutation.mutate({ tax: taxSettings })}
                                >
                                    {updateSettingsMutation.isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Settings</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Configure how and when you receive notifications.
                            </p>
                        </div>

                        <form>
                            <div className="space-y-6">
                                <fieldset>
                                    <legend className="text-base font-medium text-gray-900">Email Notifications</legend>
                                    <div className="mt-4 space-y-4">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="emailNotifications"
                                                    name="emailNotifications"
                                                    type="checkbox"
                                                    checked={notificationSettings.emailNotifications}
                                                    onChange={handleNotificationChange}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor="emailNotifications"
                                                    className="font-medium text-gray-700"
                                                >
                                                    Email Notifications
                                                </label>
                                                <p className="text-gray-500">
                                                    Receive email notifications for account activity.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="transactionAlerts"
                                                    name="transactionAlerts"
                                                    type="checkbox"
                                                    checked={notificationSettings.transactionAlerts}
                                                    onChange={handleNotificationChange}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor="transactionAlerts"
                                                    className="font-medium text-gray-700"
                                                >
                                                    Transaction Alerts
                                                </label>
                                                <p className="text-gray-500">
                                                    Get notified when new transactions are detected in your wallets.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="priceAlerts"
                                                    name="priceAlerts"
                                                    type="checkbox"
                                                    checked={notificationSettings.priceAlerts}
                                                    onChange={handleNotificationChange}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="priceAlerts" className="font-medium text-gray-700">
                                                    Price Alerts
                                                </label>
                                                <p className="text-gray-500">
                                                    Get notified about significant price changes for XRP.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="marketingSummaries"
                                                    name="marketingSummaries"
                                                    type="checkbox"
                                                    checked={notificationSettings.marketingSummaries}
                                                    onChange={handleNotificationChange}
                                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor="marketingSummaries"
                                                    className="font-medium text-gray-700"
                                                >
                                                    Marketing Emails
                                                </label>
                                                <p className="text-gray-500">
                                                    Receive product updates, news, and promotional content.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    disabled={updateSettingsMutation.isLoading}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                    onClick={() =>
                                        updateSettingsMutation.mutate({ notifications: notificationSettings })
                                    }
                                >
                                    {updateSettingsMutation.isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                );

            case 'api':
                return (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">API Access</h3>
                            <p className="mt-1 text-sm text-gray-500">Manage API keys and access for integrations.</p>
                        </div>

                        <form>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id="apiEnabled"
                                            name="apiEnabled"
                                            type="checkbox"
                                            checked={apiSettings.apiEnabled}
                                            onChange={handleApiSettingsChange}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor="apiEnabled" className="font-medium text-gray-700">
                                            Enable API Access
                                        </label>
                                        <p className="text-gray-500">
                                            Allow third-party applications to access your data via API.
                                        </p>
                                    </div>
                                </div>

                                {apiSettings.apiEnabled && (
                                    <>
                                        <div>
                                            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
                                                API Key
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    type="text"
                                                    name="apiKey"
                                                    id="apiKey"
                                                    value={apiSettings.apiKey}
                                                    readOnly
                                                    className="block w-full rounded-none rounded-l-md border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="No API key generated"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleGenerateApiKey}
                                                    className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                                >
                                                    Generate
                                                </button>
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                This is your secret API key. Keep it secure and do not share it
                                                publicly.
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="allowedOrigins"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Allowed Origins (CORS)
                                            </label>
                                            <div className="mt-1">
                                                <textarea
                                                    id="allowedOrigins"
                                                    name="allowedOrigins"
                                                    rows={3}
                                                    value={apiSettings.allowedOrigins}
                                                    onChange={handleApiSettingsChange}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="https://example.com, https://app.example.com"
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Enter allowed origins separated by commas. Leave empty to allow all
                                                origins.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    disabled={updateSettingsMutation.isLoading}
                                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
                                    onClick={() => updateSettingsMutation.mutate({ api: apiSettings })}
                                >
                                    {updateSettingsMutation.isLoading ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>

                        <div className="rounded-md bg-blue-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg
                                        className="h-5 w-5 text-blue-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="ml-3 flex-1">
                                    <p className="text-sm text-blue-700">
                                        Our API documentation is available{' '}
                                        <a href="#" className="font-medium underline">
                                            here
                                        </a>
                                        . Learn about endpoints, rate limits, and how to authenticate your requests.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // Display loading state when initial data is loading
    if (isInitialLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Loading your settings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-5">
                <h2 className="text-base font-semibold leading-6 text-gray-900">Settings</h2>
                <p className="mt-2 text-sm text-gray-700">Manage your account settings and preferences</p>
            </div>

            {/* Alert message */}
            {message && (
                <div className={`rounded-md p-4 ${message.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex">
                        <div className="ml-3">
                            <p
                                className={`text-sm font-medium ${
                                    message.type === 'success' ? 'text-green-800' : 'text-red-800'
                                }`}
                            >
                                {message.text}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow sm:rounded-lg">
                <div className="border-b border-gray-200">
                    <div className="sm:px-6">
                        <nav className="-mb-px flex space-x-4 sm:space-x-0" aria-label="Tabs">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`${
                                    activeTab === 'profile'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <UserIcon className="h-5 w-5 mr-2" />
                                Profile
                            </button>
                            <button
                                onClick={() => setActiveTab('security')}
                                className={`${
                                    activeTab === 'security'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <LockClosedIcon className="h-5 w-5 mr-2" />
                                Security
                            </button>
                            <button
                                onClick={() => setActiveTab('taxes')}
                                className={`${
                                    activeTab === 'taxes'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <DocumentTextIcon className="h-5 w-5 mr-2" />
                                Tax Settings
                            </button>
                            <button
                                onClick={() => setActiveTab('notifications')}
                                className={`${
                                    activeTab === 'notifications'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <BellIcon className="h-5 w-5 mr-2" />
                                Notifications
                            </button>
                            <button
                                onClick={() => setActiveTab('api')}
                                className={`${
                                    activeTab === 'api'
                                        ? 'border-indigo-500 text-indigo-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
                            >
                                <CogIcon className="h-5 w-5 mr-2" />
                                API Access
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Tab content */}
                <div className="px-4 py-5 sm:p-6">{renderTabContent()}</div>
            </div>

            {/* Delete account section */}
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete account</h3>
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                        <p>Once you delete your account, you will lose all data associated with it.</p>
                    </div>
                    <div className="mt-5">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
                        >
                            Delete account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
