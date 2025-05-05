'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { AxiosError } from 'axios';

interface User {
    _id: string;
    name: string;
    email: string;
    country?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, country?: string) => Promise<void>;
    logout: () => void;
}

export function useAuth(): AuthState {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');

        if (storedToken && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
                setIsAuthenticated(true);
            } catch (error) {
                console.error('Failed to parse user data:', error);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }

        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await api.login(email, password);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setToken(token);
            setIsAuthenticated(true);

            router.push('/dashboard');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message || 'Failed to login';
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, password: string, country: string = 'US') => {
        setIsLoading(true);
        try {
            const response = await api.register(name, email, password, country);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            setToken(token);
            setIsAuthenticated(true);

            router.push('/dashboard');
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>;
            const message = axiosError.response?.data?.message || 'Failed to register';
            throw new Error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        router.push('/login');
    };

    return {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
    };
}
