import { useEffect, useState } from 'react';
import { client } from '../lib/neon';
import { AuthContext } from './context';
import { api } from '../lib/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        const checkSession = async () => {
            try {
                const result = await client.auth.getSession();
                if (result.data?.user) {
                    setUser(result.data.user);
                }
            } catch (error) {
                console.error('Error getting session:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    useEffect(() => {
        const loadProfile = async () => {
            if (!user?.id) return;
            try {
                const profile = await api.getProfile(user.id);
                if (profile?.currency) {
                    setCurrency(profile.currency.toUpperCase());
                }
            } catch (error) {
                console.error('Error loading profile:', error);
            }
        };
        loadProfile();
    }, [user?.id]);

    const value = {
        signInWithPassword: async (email, password) => {
            const result = await client.auth.signIn.email({ email, password });
            if (!result.error && result.data?.user) {
                setUser(result.data.user);
            }
            return result;
        },
        signUpWithPassword: async (email, password) => {
            const name = email.split('@')[0] || 'User';
            const result = await client.auth.signUp.email({ email, password, name });
            if (!result.error && result.data?.user) {
                setUser(result.data.user);
            }
            return result;
        },
        signInWithGoogle: async () => {
            return await client.auth.signIn.social({
                provider: 'google',
                callbackURL: import.meta.env.VITE_SITE_URL
            });
        },
        signInWithMagicLink: async ({ email }) => {
            return await client.auth.emailOtp.sendVerificationOtp({
                email,
                type: 'sign-in'
            });
        },
        verifyMagicLink: async ({ email, otp }) => {
            const result = await client.auth.signIn.emailOtp({ email, otp });
            if (!result.error && result.data?.user) {
                setUser(result.data.user);
            }
            return result;
        },
        signOut: async () => {
            await client.auth.signOut();
            setUser(null);
        },
        user,
        loading,
        currency,
        setCurrency: (newCurrency) => {
            setCurrency(newCurrency);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center h-screen w-full">
                    <img src="/manifest-icon.png" alt="Loading" width={45} height={45} />
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
