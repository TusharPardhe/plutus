'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Wallet } from '@/types/api';
import { PlusIcon, ArrowPathIcon, TrashIcon, PencilIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

export default function WalletsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [wallets, setWallets] = useState<Wallet[]>([]);

    useEffect(() => {
        const fetchWallets = async () => {
            // In a real app, this would be an API call to get wallets
            try {
                // Simulate API call with timeout
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // Mock data
                setWallets([
                    {
                        _id: 'wallet1',
                        user: 'user1',
                        name: 'Main Wallet',
                        address: 'rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh',
                        isActive: true,
                        lastSynced: '2025-04-24T10:30:00Z',
                        balance: 10000,
                        balanceUSD: 5020.0,
                    },
                    {
                        _id: 'wallet2',
                        user: 'user1',
                        name: 'Trading Wallet',
                        address: 'rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe',
                        isActive: true,
                        lastSynced: '2025-04-23T15:45:00Z',
                        balance: 6500,
                        balanceUSD: 3263.0,
                    },
                    {
                        _id: 'wallet3',
                        user: 'user1',
                        name: 'Cold Storage',
                        address: 'rUAKitrA5RmbQTjLDLGdYxVA8aMzLi6eyP',
                        isActive: false,
                        lastSynced: null,
                        balance: 0,
                        balanceUSD: 0,
                    },
                ]);

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching wallets:', error);
                setIsLoading(false);
            }
        };

        fetchWallets();
    }, []);

    const handleSyncWallet = async (walletId: string) => {
        // In a real app, this would call the API to sync the wallet
        console.log(`Syncing wallet ${walletId}`);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Update the wallet with new data
        setWallets((prevWallets) =>
            prevWallets.map((wallet) => {
                if (wallet._id === walletId) {
                    return {
                        ...wallet,
                        lastSynced: new Date().toISOString(),
                    };
                }
                return wallet;
            })
        );
    };

    const handleDeleteWallet = async (walletId: string, walletName: string) => {
        // In a real app, this would show a confirmation dialog and call the API
        if (
            window.confirm(`Are you sure you want to delete the wallet "${walletName}"? This action cannot be undone.`)
        ) {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Remove wallet from list
            setWallets((prevWallets) => prevWallets.filter((wallet) => wallet._id !== walletId));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div>
            {/* Wallets header with Add button */}
            <div className="mb-5 sm:flex sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-base font-semibold leading-6 text-gray-900">Your XRPL Wallets</h2>
                    <p className="mt-2 text-sm text-gray-700">
                        Connect your XRP Ledger addresses to track transactions and generate tax reports.
                    </p>
                </div>
                <div className="mt-3 sm:ml-4 sm:mt-0">
                    <Link
                        href="/wallets/add"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                        Add Wallet
                    </Link>
                </div>
            </div>

            {/* Wallets list */}
            {wallets.length === 0 ? (
                <div className="rounded-md bg-indigo-50 p-4 text-center">
                    <div className="flex justify-center">
                        <ExclamationCircleIcon className="h-6 w-6 text-indigo-400" aria-hidden="true" />
                        <h3 className="ml-3 text-sm font-medium text-indigo-800">No wallets added yet</h3>
                    </div>
                    <div className="mt-4">
                        <Link href="/wallets/add" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Add your first XRP wallet to get started
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                            >
                                                Name
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Address
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Last Synced
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                                            >
                                                Transactions
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                                            >
                                                Balance
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {wallets.map((wallet) => (
                                            <tr
                                                key={wallet._id}
                                                className={!wallet.isActive ? 'bg-gray-50' : undefined}
                                            >
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                    <Link
                                                        href={`/wallets/${wallet._id}`}
                                                        className="hover:text-indigo-600"
                                                    >
                                                        {wallet.name}
                                                    </Link>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    <span className="font-mono">
                                                        {wallet.address.substring(0, 8)}...
                                                        {wallet.address.substring(wallet.address.length - 4)}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            wallet.isActive
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {wallet.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {wallet.lastSynced
                                                        ? new Date(wallet.lastSynced).toLocaleString()
                                                        : 'Never'}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                    {/* No transactionCount in Wallet type, so show N/A or 0 */}0
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-right">
                                                    <div>
                                                        <div className="font-medium text-gray-900">
                                                            {wallet.balance.toLocaleString()} XRP
                                                        </div>
                                                        <div className="text-gray-500">
                                                            ${wallet.balanceUSD.toLocaleString()}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                    <div className="flex justify-end space-x-2">
                                                        <button
                                                            onClick={() => handleSyncWallet(wallet._id)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Sync wallet"
                                                        >
                                                            <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                                                            <span className="sr-only">Sync</span>
                                                        </button>
                                                        <Link
                                                            href={`/wallets/${wallet._id}/edit`}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Edit wallet"
                                                        >
                                                            <PencilIcon className="h-5 w-5" aria-hidden="true" />
                                                            <span className="sr-only">Edit</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDeleteWallet(wallet._id, wallet.name)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Delete wallet"
                                                        >
                                                            <TrashIcon className="h-5 w-5" aria-hidden="true" />
                                                            <span className="sr-only">Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add wallet info section */}
            <div className="mt-10 rounded-md bg-blue-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                            You can connect any XRP Ledger wallet without providing private keys. Simply use your
                            r-address to track transactions.
                        </p>
                        <p className="mt-3 text-sm md:ml-6 md:mt-0">
                            <a
                                href="https://xrpl.org/accounts.html"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                            >
                                Learn more <span aria-hidden="true">&rarr;</span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
