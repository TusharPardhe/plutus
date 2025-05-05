'use client';

import Link from 'next/link';
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const features = [
    {
        name: 'Automated Transaction Tracking',
        description: 'Connect your XRP wallets and automatically track all your transactions.',
    },
    {
        name: 'Tax Lot Identification Methods',
        description: 'Calculate gains using FIFO, LIFO, HIFO, or average cost methods.',
    },
    {
        name: 'Compliant Tax Reports',
        description: 'Generate IRS Form 8949 and other compliant tax documents.',
    },
    {
        name: 'Real-time Price Data',
        description: 'Accurate historical price data for proper cost basis calculation.',
    },
    {
        name: 'Classification Rules',
        description: 'Intelligent transaction categorization for accurate tax treatment.',
    },
    {
        name: 'Multi-wallet Support',
        description: 'Track all your XRP wallets in one unified dashboard.',
    },
];

export default function Home() {
    // Fix hydration issues with date rendering
    const currentYear = new Date().getFullYear();

    return (
        <div className="bg-white min-h-screen">
            {/* Hero section */}
            <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20 pb-16 pt-14 sm:pb-20">
                <svg
                    className="absolute inset-0 -z-10 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                    aria-hidden="true"
                >
                    <defs>
                        <pattern
                            id="grid-pattern"
                            width={200}
                            height={200}
                            x="50%"
                            y={-1}
                            patternUnits="userSpaceOnUse"
                        >
                            <path d="M.5 200V.5H200" fill="none" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern)" />
                </svg>

                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
                        {/* Text column */}
                        <div className="max-w-2xl lg:col-span-5 lg:pt-8">
                            <div className="mb-8">
                                <div className="flex items-center gap-x-3">
                                    <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                                        Just Released
                                    </span>
                                    <span className="inline-flex items-center text-sm font-medium text-gray-600">
                                        API Access
                                        <ArrowRightIcon className="ml-2 h-4 w-4 text-gray-400" aria-hidden="true" />
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                                XRPL Tax Reporting Made Simple
                            </h1>

                            <p className="mt-6 text-lg leading-8 text-gray-600">
                                Simplify your cryptocurrency tax reporting with our comprehensive solution. Track
                                transactions, calculate gains, and generate compliant tax reports for XRP Ledger
                                transactions.
                            </p>

                            <div className="mt-10 flex items-center gap-x-6">
                                <Link
                                    href="/register"
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Get started
                                </Link>
                                <Link href="/login" className="text-sm font-semibold leading-6 text-gray-900">
                                    Already have an account? <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>

                        {/* Code preview column */}
                        <div className="mt-10 lg:col-span-7 lg:mt-0">
                            <div className="overflow-hidden rounded-xl bg-gray-900 shadow-xl">
                                {/* Code editor tabs */}
                                <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                                    <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                                        <div className="border-b border-r border-b-white/20 border-r-white/10 bg-white/5 px-4 py-2 text-white">
                                            Dashboard.tsx
                                        </div>
                                        <div className="border-r border-gray-600/10 px-4 py-2">WalletsList.tsx</div>
                                    </div>
                                </div>

                                {/* Code content */}
                                <div className="px-6 py-6">
                                    <div className="text-sm font-mono text-gray-300">
                                        <div>
                                            <span className="text-indigo-400">import</span>{' '}
                                            <span className="text-sky-300">{'{ useState, useEffect }'}</span>{' '}
                                            <span className="text-indigo-400">from</span>{' '}
                                            <span className="text-green-300">&apos;react&apos;</span>;
                                        </div>
                                        <div>&nbsp;</div>
                                        <div>
                                            <span className="text-indigo-400">function</span>{' '}
                                            <span className="text-yellow-300">TaxReport</span>
                                            <span className="text-gray-500">()</span>{' '}
                                            <span className="text-gray-500">{'{'}</span>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;<span className="text-indigo-400">const</span>{' '}
                                            <span className="text-gray-500">[</span>transactions
                                            <span className="text-gray-500">,</span> setTransactions
                                            <span className="text-gray-500">]</span>{' '}
                                            <span className="text-gray-500">=</span>{' '}
                                            <span className="text-yellow-300">useState</span>
                                            <span className="text-gray-500">([])</span>;
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;<span className="text-indigo-400">const</span>{' '}
                                            <span className="text-gray-500">[</span>wallets
                                            <span className="text-gray-500">,</span> setWallets
                                            <span className="text-gray-500">]</span>{' '}
                                            <span className="text-gray-500">=</span>{' '}
                                            <span className="text-yellow-300">useState</span>
                                            <span className="text-gray-500">([])</span>;
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;<span className="text-indigo-400">const</span>{' '}
                                            <span className="text-gray-500">[</span>loading
                                            <span className="text-gray-500">,</span> setLoading
                                            <span className="text-gray-500">]</span>{' '}
                                            <span className="text-gray-500">=</span>{' '}
                                            <span className="text-yellow-300">useState</span>
                                            <span className="text-gray-500">(</span>
                                            <span className="text-yellow-300">true</span>
                                            <span className="text-gray-500">)</span>;
                                        </div>
                                        <div>&nbsp;</div>
                                        <div>
                                            &nbsp;&nbsp;<span className="text-yellow-300">useEffect</span>
                                            <span className="text-gray-500">{'(() => {'}</span>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="text-indigo-400">async function</span>{' '}
                                            <span className="text-yellow-300">fetchData</span>
                                            <span className="text-gray-500">()</span>{' '}
                                            <span className="text-gray-500">{'{'}</span>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="text-indigo-400">const</span> response{' '}
                                            <span className="text-gray-500">=</span>{' '}
                                            <span className="text-indigo-400">await</span>{' '}
                                            <span className="text-yellow-300">fetch</span>
                                            <span className="text-gray-500">(</span>
                                            <span className="text-green-300">&apos;/api/xrpl/transactions&apos;</span>
                                            <span className="text-gray-500">)</span>;
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="text-indigo-400">const</span> data{' '}
                                            <span className="text-gray-500">=</span>{' '}
                                            <span className="text-indigo-400">await</span> response.
                                            <span className="text-yellow-300">json</span>
                                            <span className="text-gray-500">()</span>;
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="text-yellow-300">setTransactions</span>
                                            <span className="text-gray-500">(</span>data.transactions
                                            <span className="text-gray-500">)</span>;
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="text-yellow-300">setLoading</span>
                                            <span className="text-gray-500">(</span>
                                            <span className="text-yellow-300">false</span>
                                            <span className="text-gray-500">)</span>;
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="text-gray-500">{'}'}</span>
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;&nbsp;&nbsp;
                                            <span className="text-yellow-300">fetchData</span>
                                            <span className="text-gray-500">()</span>;
                                        </div>
                                        <div>
                                            &nbsp;&nbsp;<span className="text-gray-500">{'})'}</span>;
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature section */}
            <div className="bg-white py-16 sm:py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600">Everything You Need</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Complete Tax Reporting for XRPL Users
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Our platform is designed specifically for XRP Ledger users to simplify the complex process
                            of cryptocurrency tax reporting.
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3">
                            {features.map((feature) => (
                                <div key={feature.name} className="relative">
                                    <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                        <CheckCircleIcon
                                            className="h-5 w-5 flex-none text-indigo-600"
                                            aria-hidden="true"
                                        />
                                        {feature.name}
                                    </dt>
                                    <dd className="mt-4 text-base leading-7 text-gray-600">{feature.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </div>

            {/* CTA section */}
            <div className="bg-white">
                <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-16 sm:rounded-3xl sm:px-16 sm:py-24">
                        <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                            Ready to simplify your crypto taxes?
                        </h2>
                        <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-gray-300">
                            Join thousands of XRPL users who are already benefiting from our tax reporting solution.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link
                                href="/register"
                                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            >
                                Get started
                            </Link>
                            <Link href="/login" className="text-sm font-semibold leading-6 text-white">
                                Sign in <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                        <svg
                            viewBox="0 0 1024 1024"
                            className="absolute left-1/2 top-1/2 -z-10 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
                            aria-hidden="true"
                        >
                            <circle cx={512} cy={512} r={512} fill="url(#gradient-radial)" fillOpacity="0.6" />
                            <defs>
                                <radialGradient id="gradient-radial">
                                    <stop stopColor="#7775D6" />
                                    <stop offset={1} stopColor="#3B82F6" />
                                </radialGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-100">
                <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <Link href="/about" className="text-gray-500 hover:text-gray-600">
                            About
                        </Link>
                        <Link href="/privacy" className="text-gray-500 hover:text-gray-600">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-gray-500 hover:text-gray-600">
                            Terms
                        </Link>
                        <Link href="/contact" className="text-gray-500 hover:text-gray-600">
                            Contact
                        </Link>
                    </div>
                    <div className="mt-8 md:order-1 md:mt-0">
                        <p className="text-center text-xs leading-5 text-gray-500">
                            &copy; {currentYear} XRPL Tax Reporter. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
