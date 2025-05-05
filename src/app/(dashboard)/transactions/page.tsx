'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsUpDownIcon,
    DocumentArrowDownIcon,
    TagIcon,
} from '@heroicons/react/24/outline';

// Mock transactions data
const mockTransactions = [
    {
        _id: 'tx1',
        timestamp: '2025-04-25T10:30:00Z',
        txType: 'receive',
        category: 'income',
        amount: 500,
        currency: 'XRP',
        baseCurrencyAmount: 250.0,
        wallet: { name: 'Main Wallet' },
        txHash: 'ABC123456789',
    },
    {
        _id: 'tx2',
        timestamp: '2025-04-24T14:15:00Z',
        txType: 'send',
        category: 'expense',
        amount: 200,
        currency: 'XRP',
        baseCurrencyAmount: 100.0,
        wallet: { name: 'Trading Wallet' },
        txHash: 'DEF987654321',
    },
    {
        _id: 'tx3',
        timestamp: '2025-04-23T09:00:00Z',
        txType: 'trade',
        category: 'investment',
        amount: 1000,
        currency: 'XRP',
        baseCurrencyAmount: 500.0,
        wallet: { name: 'Main Wallet' },
        txHash: 'GHI456123789',
    },
    {
        _id: 'tx4',
        timestamp: '2025-04-22T18:45:00Z',
        txType: 'fee',
        category: 'expense',
        amount: 0.5,
        currency: 'XRP',
        baseCurrencyAmount: 0.25,
        wallet: { name: 'Cold Storage' },
        txHash: 'JKL321654987',
    },
    {
        _id: 'tx5',
        timestamp: '2025-04-21T12:00:00Z',
        txType: 'receive',
        category: 'income',
        amount: 300,
        currency: 'XRP',
        baseCurrencyAmount: 150.0,
        wallet: { name: 'Main Wallet' },
        txHash: 'MNO654987321',
    },
];

const typeIcon = (type: string) => {
    switch (type) {
        case 'receive':
            return <ArrowDownIcon className="h-5 w-5 text-green-500" />;
        case 'send':
            return <ArrowUpIcon className="h-5 w-5 text-red-500" />;
        case 'trade':
            return <ArrowsUpDownIcon className="h-5 w-5 text-blue-500" />;
        case 'fee':
            return <DocumentArrowDownIcon className="h-5 w-5 text-gray-500" />;
        default:
            return <div className="h-5 w-5" />;
    }
};

export default function TransactionsPage() {
    const [search, setSearch] = useState('');
    const filtered = mockTransactions.filter(
        (tx) =>
            tx.txHash.toLowerCase().includes(search.toLowerCase()) ||
            tx.wallet.name.toLowerCase().includes(search.toLowerCase()) ||
            tx.txType.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto py-10 px-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-500 mt-1">Your recent XRP Ledger transactions</p>
                </div>
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search by hash, wallet, or type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <Link
                        href="/transactions/import"
                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        <DocumentArrowDownIcon className="h-5 w-5 mr-1" /> Import
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg shadow bg-white">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Wallet</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Hash</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-10 text-gray-400">
                                    No transactions found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((tx) => (
                                <tr key={tx._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(tx.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-2">
                                        {typeIcon(tx.txType)}
                                        <span className="capitalize">{tx.txType}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span
                                            className={
                                                tx.txType === 'receive'
                                                    ? 'text-green-600 font-semibold'
                                                    : tx.txType === 'send' || tx.txType === 'fee'
                                                    ? 'text-red-600 font-semibold'
                                                    : 'text-gray-900 font-semibold'
                                            }
                                        >
                                            {tx.txType === 'receive'
                                                ? '+'
                                                : tx.txType === 'send' || tx.txType === 'fee'
                                                ? '-'
                                                : ''}
                                            {tx.amount} {tx.currency}
                                        </span>
                                        <div className="text-xs text-gray-400">${tx.baseCurrencyAmount.toFixed(2)}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {tx.wallet.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                                            {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-500">
                                        {tx.txHash.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <Link
                                            href={`/transactions/${tx._id}`}
                                            className="text-indigo-600 hover:text-indigo-900 font-medium"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 rounded-md bg-blue-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-blue-700">
                        Properly categorizing transactions helps generate accurate tax reports.
                    </span>
                </div>
                <Link href="#" className="text-sm font-medium text-blue-700 hover:text-blue-600">
                    Tax Guide <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </div>
    );
}
