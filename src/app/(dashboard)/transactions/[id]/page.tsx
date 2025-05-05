'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowDownIcon,
    ArrowUpIcon,
    ArrowsUpDownIcon,
    DocumentArrowDownIcon,
    TagIcon,
} from '@heroicons/react/24/outline';

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

export default function TransactionDetailPage() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const tx = mockTransactions.find((t) => t._id === id);

    if (!tx) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Transaction Not Found</h1>
                <p className="text-gray-500 mb-6">We couldn&apos;t find a transaction with this ID.</p>
                <Link href="/dashboard/transactions" className="text-indigo-600 hover:underline">
                    ← Back to Transactions
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="mb-8">
                <Link href="/dashboard/transactions" className="text-indigo-600 hover:underline text-sm">
                    ← Back to Transactions
                </Link>
            </div>
            <div className="bg-white rounded-lg shadow p-8">
                <div className="flex items-center gap-3 mb-6">
                    {typeIcon(tx.txType)}
                    <h1 className="text-xl font-bold text-gray-900 capitalize">{tx.txType} Transaction</h1>
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ml-2">
                        {tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}
                    </span>
                </div>
                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Date</dt>
                        <dd className="mt-1 text-base text-gray-900">{new Date(tx.timestamp).toLocaleString()}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Wallet</dt>
                        <dd className="mt-1 text-base text-gray-900">{tx.wallet.name}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">Amount</dt>
                        <dd className="mt-1 text-base text-gray-900">
                            {tx.amount} {tx.currency}
                        </dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium text-gray-500">USD Value</dt>
                        <dd className="mt-1 text-base text-gray-900">${tx.baseCurrencyAmount.toFixed(2)}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">Transaction Hash</dt>
                        <dd className="mt-1 text-base font-mono text-gray-700 break-all">{tx.txHash}</dd>
                    </div>
                </dl>
                <div className="mt-8 flex items-center gap-2">
                    <TagIcon className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-blue-700">
                        Properly categorizing transactions helps generate accurate tax reports.
                    </span>
                </div>
            </div>
        </div>
    );
}
