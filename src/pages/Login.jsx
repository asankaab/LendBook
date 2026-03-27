
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export default function Login() {
    const { signInWithGoogle, user, loading: authLoading, signInWithMagicLink, verifyMagicLink } = useAuth();
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && user) {
            navigate('/');
        }
    }, [authLoading, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            setMagicLinkSent(false);
            setSuccessMessage('');

            const result = await signInWithMagicLink({ email });
            if (result?.error) {
                setError(result.error.message || 'Failed to send OTP');
            } else {
                setMagicLinkSent(true);
                setSuccessMessage('OTP sent to your email! Enter it below.');
                setOtp('');
            }
        } catch (err) {
            setError(err?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (!otp || otp.length !== 6) {
                setError('Please enter a valid 6-digit OTP');
                setLoading(false);
                return;
            }

            const result = await verifyMagicLink({ email, otp });
            if (result?.error) {
                setError(result.error.message || 'Invalid OTP');
            }
        } catch (err) {
            setError(err?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signInWithGoogle();
            if (result?.error) {
                setError(result.error.message || 'Failed to sign in with Google');
            }
        } catch (err) {
            setError(err?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center center h-screen">
            <div className="glass" style={{ padding: '3rem', borderRadius: '1rem', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ marginBottom: '2rem', fontSize: '2rem', textAlign: 'center' }}>
                    Lendbook
                </h1>

                {error && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
                {!error && magicLinkSent && (
                    <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginBottom: '1rem', textAlign: 'center' }}>
                        {successMessage}
                    </div>
                )}

                {!user ? <>
                    {!magicLinkSent ? (
                        <>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px solid var(--border-color)',
                                        background: 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        fontWeight: 'bold',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.6 : 1
                                    }}
                                >
                                    {loading ? 'Sending...' : 'Send OTP'}
                                </button>
                            </form>
                            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                <small style={{ color: 'var(--text-secondary)' }}>We will send a One-Time Password to your email.</small>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', color: 'var(--text-secondary)' }}>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                                <span style={{ padding: '0 1rem', fontSize: '0.875rem', fontWeight: '500' }}>OR</span>
                                <div style={{ flex: 1, height: '1px', background: 'var(--border-color)' }}></div>
                            </div>
                            <button
                                onClick={handleGoogleSignIn}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontWeight: 'bold',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    opacity: loading ? 0.6 : 1
                                }}
                            >
                                Sign in with Google
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
                                <small style={{ color: 'var(--text-secondary)' }}>OTP sent to {email}</small>
                            </div>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                maxLength="6"
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.5rem',
                                    letterSpacing: '0.5rem',
                                    textAlign: 'center',
                                    fontWeight: 'bold'
                                }}
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading || otp.length !== 6}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--text-primary)',
                                    fontWeight: 'bold',
                                    cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                                    opacity: loading || otp.length !== 6 ? 0.6 : 1
                                }}
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setMagicLinkSent(false);
                                    setOtp('');
                                    setError('');
                                    setSuccessMessage('');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    fontWeight: '500',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                            >
                                Back to email
                            </button>
                        </form>
                    )}
                </> : 
                <div className="flex items-center justify-center center gap-2">
                    <Loader2 style={{ animation: 'spin 1s linear infinite' }} size={20} />
                    <small>Redirecting...</small>
                </div>}
            </div>

            {/* Footer Links */}
            <div style={{ 
                marginTop: '2rem', 
                textAlign: 'center', 
                fontSize: '0.875rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1.5rem',
                flexWrap: 'wrap'
            }}>
                <Link 
                    to="/privacy" 
                    style={{
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                    Privacy Policy
                </Link>
                <span style={{ color: 'var(--border-color)' }}>•</span>
                <Link 
                    to="/terms" 
                    style={{
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        transition: 'color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                >
                    Terms of Service
                </Link>
            </div>
        </div>
    );
}
