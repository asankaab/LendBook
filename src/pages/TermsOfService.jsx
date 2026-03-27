import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function TermsOfService() {
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

            <h1 style={{ marginBottom: '2rem', fontSize: '2.5rem', fontWeight: 'bold' }}>Terms of Service</h1>

            <div style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                <section style={{ marginBottom: '2rem' }}>
                    <p style={{ marginBottom: '1rem' }}>
                        <strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>1. Acceptance of Terms</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        By accessing and using the LendBook application, you accept and agree to be bound by the terms and provision
                        of this agreement. If you do not agree to abide by the above, please do not use this service.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>2. Use License</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        Permission is granted to temporarily download one copy of the materials (information or software) on
                        LendBook for personal, non-commercial transitory viewing only. This is the grant of a license, not a
                        transfer of title, and under this license you may not:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Modifying or copying the materials</li>
                        <li style={{ marginBottom: '0.5rem' }}>Using the materials for any commercial purpose or for any public display</li>
                        <li style={{ marginBottom: '0.5rem' }}>Attempting to decompile or reverse engineer any software contained on LendBook</li>
                        <li style={{ marginBottom: '0.5rem' }}>Removing any copyright or other proprietary notations from the materials</li>
                        <li style={{ marginBottom: '0.5rem' }}>Transferring the materials to another person or "mirroring" the materials on any other server</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>3. User Accounts</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        When you create an account with LendBook, you are responsible for maintaining the confidentiality of your
                        account information and password and for restricting access to your computer. You agree to accept
                        responsibility for all activities that occur under your account. You must notify us immediately of any
                        unauthorized uses of your account or any other breaches of security.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>4. User Responsibilities</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        You agree that all information you provide to LendBook is accurate, current, and complete. You agree not to:
                    </p>
                    <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li style={{ marginBottom: '0.5rem' }}>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
                        <li style={{ marginBottom: '0.5rem' }}>Post or transmit abusive, offensive, or illegal content</li>
                        <li style={{ marginBottom: '0.5rem' }}>Attempt to gain unauthorized access to the Service or its systems</li>
                        <li style={{ marginBottom: '0.5rem' }}>Use automated tools or scripts to access the Service</li>
                        <li style={{ marginBottom: '0.5rem' }}>Violate any applicable laws or regulations</li>
                    </ul>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>5. Financial Disclaimer</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        LendBook is a personal finance tracking tool designed to help you manage loans and lending records. The Service
                        is provided on an "as-is" basis without warranties of any kind. LendBook does not provide financial, legal, or
                        investment advice. You should consult with appropriate professionals for financial decisions.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>6. Limitation of Liability</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        In no event shall LendBook, its owners, developers, or affiliates be liable for any damages (including, without
                        limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
                        inability to use the materials on LendBook, even if we or an authorized representative has been notified
                        orally or in writing of the possibility of such damage.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>7. Accuracy of Materials</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        The materials appearing on LendBook could include technical, typographical, or photographic errors. LendBook does
                        not warrant that any of the materials on the Service are accurate, complete, or current. LendBook may make
                        changes to the materials contained on the Service at any time without notice.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>8. Modifications to Terms</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        LendBook may revise these terms of service for the Service at any time without notice. By using the Service,
                        you are agreeing to be bound by the then current version of these terms of service. We will notify users of
                        any material changes via the application.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>9. Governing Law</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in
                        which LendBook operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>10. Termination</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        LendBook reserves the right to terminate your account and access to the Service at any time, for any reason,
                        without notice. Upon termination, you should delete all downloaded materials in your possession whether in digital or printed format.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>11. Disclaimers</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        The materials on LendBook are provided on an 'as-is' basis. LendBook makes no warranties, expressed or implied,
                        and hereby disclaims and negates all other warranties including, without limitation, implied warranties or
                        conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or
                        other violation of rights.
                    </p>
                </section>

                <section style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--text-primary)' }}>12. Contact Us</h2>
                    <p style={{ marginBottom: '1rem' }}>
                        If you have any questions about these Terms of Service, please contact us through the application's support
                        features or reach out to us directly.
                    </p>
                </section>
            </div>
        </div>
    );
}
