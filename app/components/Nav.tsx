'use client';

import { useState } from 'react';

export default function Nav() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
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
    );
}
