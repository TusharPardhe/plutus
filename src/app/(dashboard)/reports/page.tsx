'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { ReportOptions as ApiReportOptions, ReportData } from '@/types/api';
import {
    DocumentTextIcon,
    DocumentArrowDownIcon,
    PresentationChartLineIcon,
    CalculatorIcon,
    ArrowPathIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';

// API types
interface ReportOptions {
    years: number[];
    formats: string[];
    accountingMethods: string[];
    countries: string[];
    forms: string[];
}

interface Report {
    id: string;
    name: string;
    year: number;
    type: string;
    accountingMethod: string;
    dateGenerated: string;
    format: string;
    status: string;
    url: string;
    country: string;
}

export default function ReportsPage() {
    const queryClient = useQueryClient();

    // State for form
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedReportType, setSelectedReportType] = useState('complete');
    const [accountingMethod, setAccountingMethod] = useState('fifo');
    const [selectedCountry, setSelectedCountry] = useState('US');
    const [selectedFormat, setSelectedFormat] = useState('pdf');

    // Fetch report options from API
    const {
        data: reportOptions,
        isLoading: isLoadingOptions,
        error: optionsError,
    } = useQuery<ReportOptions>({
        queryKey: ['reportOptions'],
        queryFn: async () => {
            // Use our typed API client's raw method for now
            const response = await api.raw.get('/reports/options');
            return response.data;
        },
    });

    // Fetch user reports
    const { data: reports = [], isLoading: isLoadingReports } = useQuery<Report[]>({
        queryKey: ['reports'],
        queryFn: async () => {
            // In a real application, this would be fetched from an API
            // For now, we'll return mock data
            return [
                {
                    id: 'report-1',
                    name: '2024 Complete Tax Report',
                    year: 2024,
                    type: 'complete',
                    accountingMethod: 'fifo',
                    dateGenerated: '2025-02-14T10:30:00Z',
                    format: 'pdf',
                    status: 'completed',
                    url: '#',
                    country: 'US',
                },
                {
                    id: 'report-2',
                    name: '2024 Transactions Summary',
                    year: 2024,
                    type: 'transactions',
                    accountingMethod: 'fifo',
                    dateGenerated: '2025-02-01T14:15:00Z',
                    format: 'csv',
                    status: 'completed',
                    url: '#',
                    country: 'US',
                },
                {
                    id: 'report-3',
                    name: '2023 Complete Tax Report',
                    year: 2023,
                    type: 'complete',
                    accountingMethod: 'fifo',
                    dateGenerated: '2024-01-20T09:45:00Z',
                    format: 'pdf',
                    status: 'completed',
                    url: '#',
                    country: 'US',
                },
            ];
        },
    });

    // Generate report mutation
    const { mutate: generateReport, isLoading: isGenerating } = useMutation({
        mutationFn: async () => {
            // In a real implementation, this would be an API call
            const response = await api.raw.post('/reports/generate', {
                year: currentYear,
                country: selectedCountry,
                format: selectedFormat,
                accountingMethod: accountingMethod,
                reportType: selectedReportType,
            });
            return response.data;
        },
        onSuccess: () => {
            const newReport = {
                id: `report-${Date.now()}`,
                name: `${currentYear} ${getReportTypeName(selectedReportType)}`,
                year: currentYear,
                type: selectedReportType,
                accountingMethod,
                dateGenerated: new Date().toISOString(),
                format: selectedFormat,
                status: 'completed',
                url: '#', // In a real app, this would be a download URL
                country: selectedCountry,
            };

            // Invalidate and refetch reports
            queryClient.setQueryData(['reports'], (oldData: Report[] | undefined) =>
                oldData ? [newReport, ...oldData] : [newReport]
            );
        },
    });

    const handleGenerateReport = () => {
        generateReport();
    };

    const getReportTypeName = (type: string) => {
        switch (type) {
            case 'complete':
                return 'Complete Tax Report';
            case 'transactions':
                return 'Transactions Summary';
            case 'gains':
                return 'Capital Gains Report';
            case 'income':
                return 'Income Report';
            default:
                return 'Tax Report';
        }
    };

    const getReportIcon = (type: string) => {
        switch (type) {
            case 'complete':
                return <DocumentTextIcon className="h-5 w-5 text-indigo-500" />;
            case 'transactions':
                return <PresentationChartLineIcon className="h-5 w-5 text-green-500" />;
            case 'gains':
                return <CalculatorIcon className="h-5 w-5 text-blue-500" />;
            case 'income':
                return <DocumentArrowDownIcon className="h-5 w-5 text-yellow-500" />;
            default:
                return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
        }
    };

    // Handle errors
    if (optionsError) {
        return (
            <div className="bg-red-50 p-4 rounded-md">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading report options</h3>
                        <div className="mt-2 text-sm text-red-700">
                            Please try refreshing the page or contact support if the problem persists.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-base font-semibold leading-6 text-gray-900">Tax Reports</h2>
                <p className="mt-2 text-sm text-gray-700">Generate tax reports for your XRPL transactions</p>
            </div>

            {/* Report generation form */}
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Generate a new report</h3>
                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                        <div className="sm:col-span-2">
                            <label htmlFor="year" className="block text-sm font-medium leading-6 text-gray-900">
                                Tax Year
                            </label>
                            <div className="mt-2">
                                <select
                                    id="year"
                                    name="year"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    value={currentYear}
                                    onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                                    disabled={isLoadingOptions || isGenerating}
                                >
                                    {isLoadingOptions ? (
                                        <option>Loading...</option>
                                    ) : (
                                        reportOptions?.years.map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        )) ||
                                        Array.from({ length: 5 }, (_, i) => {
                                            const year = new Date().getFullYear() - i;
                                            return (
                                                <option key={year} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="report-type" className="block text-sm font-medium leading-6 text-gray-900">
                                Report Type
                            </label>
                            <div className="mt-2">
                                <select
                                    id="report-type"
                                    name="reportType"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    value={selectedReportType}
                                    onChange={(e) => setSelectedReportType(e.target.value)}
                                    disabled={isGenerating}
                                >
                                    <option value="complete">Complete Tax Report</option>
                                    <option value="transactions">Transactions Summary</option>
                                    <option value="gains">Capital Gains Report</option>
                                    <option value="income">Income Report</option>
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="accounting-method"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                Accounting Method
                            </label>
                            <div className="mt-2">
                                <select
                                    id="accounting-method"
                                    name="accountingMethod"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    value={accountingMethod}
                                    onChange={(e) => setAccountingMethod(e.target.value)}
                                    disabled={isLoadingOptions || isGenerating}
                                >
                                    {isLoadingOptions ? (
                                        <option>Loading...</option>
                                    ) : (
                                        reportOptions?.accountingMethods.map((method) => (
                                            <option key={method} value={method.toLowerCase()}>
                                                {method}{' '}
                                                {method === 'FIFO'
                                                    ? '(First In, First Out)'
                                                    : method === 'LIFO'
                                                    ? '(Last In, First Out)'
                                                    : method === 'HIFO'
                                                    ? '(Highest In, First Out)'
                                                    : method === 'ACB'
                                                    ? '(Average Cost Basis)'
                                                    : ''}
                                            </option>
                                        )) ||
                                        [
                                            { value: 'fifo', label: 'FIFO (First In, First Out)' },
                                            { value: 'lifo', label: 'LIFO (Last In, First Out)' },
                                            { value: 'hifo', label: 'HIFO (Highest In, First Out)' },
                                            { value: 'acb', label: 'ACB (Average Cost Basis)' },
                                        ].map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                                Country
                            </label>
                            <div className="mt-2">
                                <select
                                    id="country"
                                    name="country"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    value={selectedCountry}
                                    onChange={(e) => setSelectedCountry(e.target.value)}
                                    disabled={isLoadingOptions || isGenerating}
                                >
                                    {isLoadingOptions ? (
                                        <option>Loading...</option>
                                    ) : (
                                        reportOptions?.countries.map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        )) ||
                                        ['US', 'UK', 'EU'].map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="format" className="block text-sm font-medium leading-6 text-gray-900">
                                Format
                            </label>
                            <div className="mt-2">
                                <select
                                    id="format"
                                    name="format"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    value={selectedFormat}
                                    onChange={(e) => setSelectedFormat(e.target.value)}
                                    disabled={isLoadingOptions || isGenerating}
                                >
                                    {isLoadingOptions ? (
                                        <option>Loading...</option>
                                    ) : (
                                        reportOptions?.formats.map((format) => (
                                            <option key={format} value={format.toLowerCase()}>
                                                {format}
                                            </option>
                                        )) ||
                                        ['PDF', 'CSV', 'JSON', 'Excel'].map((format) => (
                                            <option key={format} value={format.toLowerCase()}>
                                                {format}
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 rounded-md bg-blue-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm text-blue-700">
                                    {selectedReportType === 'complete'
                                        ? 'The complete tax report includes all transactions, capital gains calculations, and income statements needed for tax filing.'
                                        : selectedReportType === 'transactions'
                                        ? 'The transactions summary provides a detailed list of all your transactions for the selected tax year.'
                                        : selectedReportType === 'gains'
                                        ? 'The capital gains report calculates your realized gains and losses for the selected tax year.'
                                        : 'The income report summarizes all income events like staking rewards, airdrops, and mining rewards.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5">
                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            disabled={isGenerating || isLoadingOptions}
                            className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-75"
                        >
                            {isGenerating ? (
                                <>
                                    <ArrowPathIcon className="animate-spin -ml-0.5 mr-2 h-5 w-5" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <DocumentTextIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Available reports list */}
            <div className="mt-8">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Your reports</h3>
                <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
                    {isLoadingReports ? (
                        <div className="px-4 py-12 text-center">
                            <ArrowPathIcon className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                            <p className="mt-2 text-sm text-gray-500">Loading your reports...</p>
                        </div>
                    ) : reports.length === 0 ? (
                        <div className="px-4 py-12 text-center">
                            <p className="text-sm text-gray-500">No reports found. Generate your first report above.</p>
                        </div>
                    ) : (
                        <ul role="list" className="divide-y divide-gray-200">
                            {reports.map((report) => (
                                <li key={report.id}>
                                    <div className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                {getReportIcon(report.type)}
                                                <p className="ml-2 text-sm font-medium text-gray-900">{report.name}</p>
                                            </div>
                                            <div className="ml-2 flex-shrink-0 flex">
                                                <a
                                                    href={report.url}
                                                    className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Download {report.format.toUpperCase()}
                                                </a>
                                            </div>
                                        </div>
                                        <div className="mt-2 sm:flex sm:justify-between">
                                            <div className="sm:flex">
                                                <p className="flex items-center text-sm text-gray-500">
                                                    Method: {report.accountingMethod.toUpperCase()}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    Country: {report.country}
                                                </p>
                                                <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                    Generated: {new Date(report.dateGenerated).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Info panel */}
            <div className="mt-8 bg-gray-50 shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Tax Reporting Information</h3>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Important details about cryptocurrency tax reporting.
                    </p>
                </div>
                <div className="border-t border-gray-200">
                    <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Tax Compliance</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                Our reports are designed to help with your tax obligations, but we strongly recommend
                                consulting with a tax professional.
                            </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Accounting Methods</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                Different jurisdictions have different rules regarding acceptable accounting methods for
                                cryptocurrency. The default FIFO (First In, First Out) method is widely accepted, but
                                you may need to use a specific method based on your location.
                            </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt className="text-sm font-medium text-gray-500">Data Accuracy</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                Tax reports are generated based on the transactions synchronized from your wallets.
                                Ensure all your wallets are properly synchronized and transactions are correctly
                                categorized for accurate reporting.
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
}
