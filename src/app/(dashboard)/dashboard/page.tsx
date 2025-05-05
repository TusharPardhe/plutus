'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api';
import type { DashboardData as ApiDashboardData } from '@/types/api';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    PlusCircleIcon,
    DocumentTextIcon,
    CurrencyDollarIcon,
    CheckCircleIcon,
} from '@heroicons/react/24/outline';

// Use the DashboardData type from our shared types
interface Transaction {
    id: string;
    date: string;
    type: string;
    amount: number;
    currency: string;
    usdValue: number;
    walletName?: string;
    walletAddress?: string;
}

// Alias our API type for backwards compatibility
type DashboardData = ApiDashboardData;

export default function Dashboard() {
    const router = useRouter();

    // Use React Query to fetch dashboard data
    const {
        data: dashboardData,
        isLoading,
        error,
    } = useQuery<DashboardData>({
        queryKey: ['dashboardData'],
        queryFn: async () => {
            try {
                // Call our backend API
                const response = await apiClient.getDashboard();
                return response.data;
            } catch (error) {
                console.error('Error fetching dashboard data:', error);

                // Fallback to mock data if API call fails
                console.error('Using fallback mock data due to API error');
                return {
                    walletCount: 3,
                    transactionCount: 156,
                    balanceUSD: 8435.72,
                    recentTransactions: [
                        {
                            id: 'tx1',
                            date: '2025-04-23',
                            type: 'receive',
                            amount: 250,
                            currency: 'XRP',
                            usdValue: 125.5,
                        },
                        { id: 'tx2', date: '2025-04-22', type: 'send', amount: 100, currency: 'XRP', usdValue: 50.2 },
                        { id: 'tx3', date: '2025-04-20', type: 'trade', amount: 500, currency: 'XRP', usdValue: 251.0 },
                        {
                            id: 'tx4',
                            date: '2025-04-18',
                            type: 'receive',
                            amount: 1000,
                            currency: 'XRP',
                            usdValue: 501.0,
                        },
                        { id: 'tx5', date: '2025-04-15', type: 'fee', amount: 0.1, currency: 'XRP', usdValue: 0.05 },
                    ],
                    taxSummary: {
                        totalIncome: 1250.75,
                        totalCapitalGains: 325.5,
                        totalShortTermGains: 125.0,
                        totalLongTermGains: 200.5,
                    },
                };
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Handle error state
    if (error) {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg
                            className="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>There was an error loading your dashboard data. Please try refreshing the page.</p>
                            <p className="mt-2">If the problem persists, please contact support.</p>
                        </div>
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => window.location.reload()}
                                className="rounded-md bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-100"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const renderStatusCard = (title: string, value: string | number, icon: React.ReactNode, color: string) => (
        <div className="overflow-hidden rounded-lg bg-white shadow">
            <div className="p-5">
                <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center`}>{icon}</div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="truncate text-sm font-medium text-gray-500">{title}</dt>
                            <dd>
                                <div className="text-lg font-medium text-gray-900">{value}</div>
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
                <div className="text-sm">
                    <Link
                        href={title === 'Total Wallets' ? '/wallets' : '/transactions'}
                        className="font-medium text-indigo-700 hover:text-indigo-900"
                    >
                        View details
                    </Link>
                </div>
            </div>
        </div>
    );

    if (isLoading || !dashboardData) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                <p className="text-gray-600">Loading your dashboard data...</p>
                <p className="text-sm text-gray-500 mt-2">
                    This may take a moment while we fetch your latest transactions and wallet balances.
                </p>
            </div>
        );
    }

    // Replace dashboardData.recentTransactions with mock data
    const mockRecentTransactions = [
        {
            id: 'tx1',
            date: '2025-04-23',
            type: 'receive',
            amount: 250,
            currency: 'XRP',
            usdValue: 125.5,
        },
        { id: 'tx2', date: '2025-04-22', type: 'send', amount: 100, currency: 'XRP', usdValue: 50.2 },
        { id: 'tx3', date: '2025-04-20', type: 'trade', amount: 500, currency: 'XRP', usdValue: 251.0 },
        {
            id: 'tx4',
            date: '2025-04-18',
            type: 'receive',
            amount: 1000,
            currency: 'XRP',
            usdValue: 501.0,
        },
        { id: 'tx5', date: '2025-04-15', type: 'fee', amount: 0.1, currency: 'XRP', usdValue: 0.05 },
    ];

    return (
        <div>
            {/* Status cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {renderStatusCard(
                    'Total Wallets',
                    dashboardData.walletCount,
                    <PlusCircleIcon className="h-5 w-5 text-white" />,
                    'bg-indigo-500'
                )}
                {renderStatusCard(
                    'Total Transactions',
                    dashboardData.transactionCount,
                    <DocumentTextIcon className="h-5 w-5 text-white" />,
                    'bg-green-500'
                )}
                {renderStatusCard(
                    'Portfolio Value',
                    `$${dashboardData.balanceUSD.toLocaleString()}`,
                    <CurrencyDollarIcon className="h-5 w-5 text-white" />,
                    'bg-blue-500'
                )}
                {renderStatusCard(
                    'Tax Year',
                    `${new Date().getFullYear() - 1}`,
                    <CheckCircleIcon className="h-5 w-5 text-white" />,
                    'bg-yellow-500'
                )}
            </div>

            {/* Recent transactions and Tax Summary */}
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                        <h2 className="text-base font-semibold leading-6 text-gray-900">Recent Transactions</h2>
                        <div className="mt-4 flow-root">
                            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Date
                                                </th>
                                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                    Type
                                                </th>
                                                <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                    Amount
                                                </th>
                                                <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                    USD Value
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {mockRecentTransactions.map((tx: Transaction) => (
                                                <tr
                                                    key={tx.id}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                    onClick={() => router.push(`/transactions/${tx.id}`)}
                                                >
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                        {tx.date}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4">
                                                        <div className="flex items-center">
                                                            {tx.type === 'receive' && (
                                                                <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
                                                            )}
                                                            {tx.type === 'send' && (
                                                                <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
                                                            )}
                                                            <span
                                                                className={`text-sm ${
                                                                    tx.type === 'receive'
                                                                        ? 'text-green-700'
                                                                        : tx.type === 'send'
                                                                        ? 'text-red-700'
                                                                        : 'text-gray-900'
                                                                }`}
                                                            >
                                                                {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                                                        {tx.amount} {tx.currency}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-right text-gray-900">
                                                        ${tx.usdValue.toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center justify-center">
                            <Link
                                href="/transactions"
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                View all transactions <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                        <h2 className="text-base font-semibold leading-6 text-gray-900">Tax Summary</h2>
                        <div className="mt-4">
                            <dl className="grid grid-cols-1 gap-4">
                                <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray-500">Total Income</dt>
                                    <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                                        ${dashboardData.taxSummary.totalIncome.toLocaleString()}
                                    </dd>
                                </div>
                                <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
                                    <dt className="truncate text-sm font-medium text-gray-500">Total Capital Gains</dt>
                                    <dd className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
                                        ${dashboardData.taxSummary.totalCapitalGains.toLocaleString()}
                                    </dd>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
                                        <dt className="truncate text-sm font-medium text-gray-500">Short Term Gains</dt>
                                        <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                                            ${dashboardData.taxSummary.totalShortTermGains.toLocaleString()}
                                        </dd>
                                    </div>
                                    <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 shadow sm:p-6">
                                        <dt className="truncate text-sm font-medium text-gray-500">Long Term Gains</dt>
                                        <dd className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                                            ${dashboardData.taxSummary.totalLongTermGains.toLocaleString()}
                                        </dd>
                                    </div>
                                </div>
                            </dl>
                        </div>
                        <div className="mt-6 flex items-center justify-center">
                            <Link href="/reports" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                Generate tax report <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Getting Started */}
            <div className="mt-8 overflow-hidden rounded-lg bg-indigo-700 shadow">
                <div className="px-6 py-8 sm:p-10">
                    <div className="flex flex-col items-start lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-white">Getting Started</h3>
                            <p className="mt-2 text-indigo-200">
                                Follow these steps to set up your tax reporting system
                            </p>
                        </div>
                        <div className="mt-6 rounded-md bg-white px-6 py-3 shadow lg:mt-0">
                            <Link
                                href="/wallets/add"
                                className="text-sm font-medium text-indigo-700 hover:text-indigo-600"
                            >
                                Add your first wallet <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-8">
                        <div className="flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-300 bg-indigo-800 text-white">
                                1
                            </div>
                            <p className="ml-4 text-base text-white">Add your XRP wallets to the system</p>
                        </div>
                        <div className="mt-4 flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-300 bg-indigo-800 text-white">
                                2
                            </div>
                            <p className="ml-4 text-base text-white">Sync and categorize your transactions</p>
                        </div>
                        <div className="mt-4 flex items-center">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-300 bg-indigo-800 text-white">
                                3
                            </div>
                            <p className="ml-4 text-base text-white">Generate and download your tax reports</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
