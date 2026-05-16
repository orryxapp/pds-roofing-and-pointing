'use client';

import './globals.css';
import { useState } from 'react';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <html lang="en">
            <head>
                <title>PDS Roofing and Pointing - Professional Roofing Services in Manchester</title>
                <meta name="description" content="PDS Roofing and Pointing — trusted roofing services across Manchester and surrounding areas. Rated 4.9/5 from 68 reviews. Roof repairs, full roofs, guttering, pointing and more." />
            </head>
            <body>
                <nav className="main-nav">
                    <div className="container nav-content">
                        <a href="/" className="logo"><span className="text-gold">PDS</span> ROOFING</a>
                        <button
                            className="mobile-menu-toggle"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <span className={`hamburger ${menuOpen ? 'open' : ''}`} />
                        </button>
                        <div className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
                            <a href="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</a>
                            <a href="/gallery" className="nav-link" onClick={() => setMenuOpen(false)}>Gallery</a>
                            <a href="/reviews" className="nav-link" onClick={() => setMenuOpen(false)}>Reviews</a>
                            <a href="/contact" className="nav-link" onClick={() => setMenuOpen(false)}>Contact</a>
                            <a href="/contact" className="btn btn-primary nav-cta" onClick={() => setMenuOpen(false)}>Get a Free Quote</a>
                        </div>
                    </div>
                </nav>
                {children}
                <footer className="site-footer">
                    <div className="container">
                        <div className="footer-grid">
                            <div className="footer-col">
                                <h3><span className="text-gold">PDS</span> Roofing & Pointing</h3>
                                <p className="footer-desc">Professional roofing and pointing services across Manchester and surrounding areas. Rated 4.9/5 on MyBuilder.</p>
                                <p className="footer-registered">A trading name of MRE Roofing Ltd</p>
                            </div>
                            <div className="footer-col">
                                <h4>Services</h4>
                                <ul>
                                    <li>Full Roof Replacements</li>
                                    <li>Roof Repairs</li>
                                    <li>Pointing & Repointing</li>
                                    <li>Guttering & Fascias</li>
                                    <li>Chimney Repairs</li>
                                    <li>Flat Roofing</li>
                                    <li>Lead Work</li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>Contact</h4>
                                <ul>
                                    <li>Manchester & Surrounding Areas</li>
                                    <li>
                                        <a href="tel:+447856417543" className="footer-link">Scott: 07856 417543</a>
                                    </li>
                                    <li>
                                        <a href="tel:+447704620531" className="footer-link">David: 07704 620531</a>
                                    </li>
                                    <li>
                                        <a href="mailto:sfitz0181@gmail.com" className="footer-link">sfitz0181@gmail.com</a>
                                    </li>
                                    <li>
                                        <a href="/contact" className="footer-link">Get a Free Quote</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p>&copy; {new Date().getFullYear()} PDS Roofing and Pointing. Trading name of MRE Roofing Ltd. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
