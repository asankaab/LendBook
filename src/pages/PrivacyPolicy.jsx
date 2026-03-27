import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <Link
                to="/"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                }}
            >
                <ChevronLeft size={16} />
                Back
            </Link>

            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Privacy Policy</h1>

            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Introduction</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        LendBook ("Company", "we", "our", or "us") operates the LendBook application. This page informs you of our
                        policies regarding the collection, use, and disclosure of personal data when you use our Service and the
                        choices you have associated with that data.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Information Collection and Use</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        We collect several different types of information for various purposes to provide and improve our Service.
                    </p>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Types of Data Collected:</h3>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Personal Data:</strong> Email address, name, and any information you provide in your profile.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Usage Data:</strong> Information about how you interact with our Service, including transactions, people records, and activity logs.
                        </li>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <strong>Device Information:</strong> Browser type, operating system, device type, and IP address.
                        </li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>3. Purpose of Data Collection</h2>
                    <p style={{ marginBottom: '1rem' }}>LendBook collects and uses personal data for the following purposes:</p>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>To provide, maintain, and improve the Service</li>
                        <li style={{ marginBottom: '0.5rem' }}>To authenticate your identity and maintain your account</li>
                        <li style={{ marginBottom: '0.5rem' }}>To send administrative information and security updates</li>
                        <li style={{ marginBottom: '0.5rem' }}>To respond to your inquiries and provide customer support</li>
                        <li style={{ marginBottom: '0.5rem' }}>To analyze usage patterns to enhance user experience</li>
                        <li style={{ marginBottom: '0.5rem' }}>To detect and prevent fraudulent activity or abuse</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>4. Data Security</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        The security of your data is important to us but remember that no method of transmission over the Internet
                        or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
                        protect your personal data, we cannot guarantee its absolute security.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>5. Data Retention</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        We retain your personal data only for as long as necessary to provide you with the Service and to fulfill
                        the purposes outlined in this Privacy Policy. You can request deletion of your data at any time by
                        contacting us through the application's support features.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>6. Your Rights</h2>
                    <p style={{ marginBottom: '1rem' }}>You have the right to:</p>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Access your personal data</li>
                        <li style={{ marginBottom: '0.5rem' }}>Correct inaccurate data</li>
                        <li style={{ marginBottom: '0.5rem' }}>Request deletion of your data</li>
                        <li style={{ marginBottom: '0.5rem' }}>Export your data in a machine-readable format</li>
                        <li style={{ marginBottom: '0.5rem' }}>Withdraw consent at any time</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>7. Third-Party Services</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Our Service may use third-party services for:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Authentication (Google OAuth)</li>
                        <li style={{ marginBottom: '0.5rem' }}>Data storage and hosting</li>
                        <li style={{ marginBottom: '0.5rem' }}>Analytics and monitoring</li>
                    </ul>
                    <p style={{ marginBottom: '1rem' }}>
                        These third parties have their own privacy policies governing the use of your information. We encourage
                        you to review their privacy policies before providing any information.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>8. Changes to This Privacy Policy</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by updating the
                        "Last Updated" date of this Privacy Policy. You are advised to review this Privacy Policy periodically
                        for any changes.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>9. Contact Us</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        If you have any questions about this Privacy Policy, please contact us through the application's support
                        features or reach out to us directly.
                    </p>
                </section>
            </div>
        </div>
    );
}
