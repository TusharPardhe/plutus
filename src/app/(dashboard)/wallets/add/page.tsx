'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AddWallet() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        description: '',
        isActive: true,
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isAddressValid, setIsAddressValid] = useState<boolean | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

        // Clear error when field is modified
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));

        // If address field is being modified, reset validation state
        if (name === 'address' && isAddressValid !== null) {
            setIsAddressValid(null);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: val,
        }));
    };

    const validateAddress = async () => {
        if (!formData.address.trim()) {
            setErrors((prev) => ({
                ...prev,
                address: 'Address is required',
            }));
            return false;
        }

        // XRPL address format validation - basic regex check
        const xrplAddressRegex = /^r[a-zA-Z0-9]{24,34}$/;
        if (!xrplAddressRegex.test(formData.address)) {
            setErrors((prev) => ({
                ...prev,
                address: 'Invalid XRP Ledger address format',
            }));
            return false;
        }

        setIsValidating(true);

        try {
            // In a real app, this would call your backend API to validate the address on the XRPL
            // Simulating API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // For demo, validate randomly with 80% success rate
            const isValid = Math.random() > 0.2;

            setIsAddressValid(isValid);

            if (!isValid) {
                setErrors((prev) => ({
                    ...prev,
                    address: 'Address not found on XRP Ledger or is invalid',
                }));
            }

            return isValid;
        } catch (error) {
            console.error('Error validating address:', error);
            setErrors((prev) => ({
                ...prev,
                address: 'Failed to validate address. Please try again.',
            }));
            return false;
        } finally {
            setIsValidating(false);
        }
    };

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Wallet name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // If address hasn't been validated yet, validate it first
        if (isAddressValid !== true) {
            const isValid = await validateAddress();
            if (!isValid) return;
        }

        setIsSubmitting(true);

        try {
            // In a real app, this would call your backend API to add the wallet
            // Simulate API call with timeout
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Redirect to wallets list
            router.push('/wallets');
        } catch (error) {
            console.error('Error adding wallet:', error);
            setErrors({
                submit: 'Failed to add wallet. Please try again.',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="mb-5">
                <h2 className="text-base font-semibold leading-6 text-gray-900">Add New XRP Wallet</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Connect an XRP Ledger address to track transactions and generate tax reports.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    {errors.submit && (
                        <div className="mb-4 rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">{errors.submit}</h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                Wallet Name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                        errors.name ? 'ring-red-300' : 'ring-gray-300'
                                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                    placeholder="My XRP Wallet"
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                                XRP Ledger Address
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                                            errors.address
                                                ? 'ring-red-300'
                                                : isAddressValid === true
                                                ? 'ring-green-300'
                                                : 'ring-gray-300'
                                        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 font-mono`}
                                        placeholder="rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh"
                                    />
                                    <button
                                        type="button"
                                        onClick={validateAddress}
                                        disabled={isValidating || !formData.address.trim()}
                                        className="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isValidating ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Validating
                                            </>
                                        ) : (
                                            'Validate Address'
                                        )}
                                    </button>
                                </div>
                                {errors.address ? (
                                    <p className="mt-2 text-sm text-red-600">{errors.address}</p>
                                ) : isAddressValid === true ? (
                                    <p className="mt-2 text-sm text-green-600">
                                        Address is valid and active on the XRP Ledger.
                                    </p>
                                ) : null}
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                Description (Optional)
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="description"
                                    name="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="Add some notes about this wallet (optional)"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <div className="relative flex items-start">
                                <div className="flex h-6 items-center">
                                    <input
                                        id="isActive"
                                        name="isActive"
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) =>
                                            setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                                        }
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                    />
                                </div>
                                <div className="ml-3 text-sm leading-6">
                                    <label htmlFor="isActive" className="font-medium text-gray-900">
                                        Active Wallet
                                    </label>
                                    <p className="text-gray-500">
                                        Active wallets will be regularly synced for new transactions.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <Link
                        href="/wallets"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 mr-3"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
                    >
                        {isSubmitting ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Adding Wallet...
                            </>
                        ) : (
                            'Add Wallet'
                        )}
                    </button>
                </div>
            </form>

            <div className="mt-6 rounded-md bg-blue-50 p-4">
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
                            When you add a wallet, we only track the public address. No private keys or seeds are
                            required or stored. All transaction data is fetched directly from the XRP Ledger.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
