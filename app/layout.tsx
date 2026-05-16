import type { Metadata } from 'next';
import './globals.css';
import Nav from './components/Nav';

export const metadata: Metadata = {
    title: {
        default: 'PDS Roofing and Pointing | Roofers in Manchester | Rated 4.9/5',
        template: '%s | PDS Roofing and Pointing',
    },
    description: 'Professional roofing and pointing services across Manchester, Salford, Bolton, Stockport and surrounding areas. Roof repairs, full roofs, guttering, chimney work and more. Rated 4.9/5 from 68 reviews. Free quotes.',
    keywords: [
        'roofer Manchester', 'roofing Manchester', 'roof repair Manchester',
        'pointing Manchester', 'repointing Manchester', 'roofer Salford',
        'roofer Bolton', 'roofer Stockport', 'roofer Sale', 'roofer Cheadle',
        'roofer Oldham', 'roofer Bury', 'roofer Heywood',
        'guttering Manchester', 'fascias Manchester', 'chimney repair Manchester',
        'flat roofing Manchester', 'lead work Manchester',
        'roof replacement Manchester', 'emergency roofer Manchester',
        'PDS Roofing', 'PDS Roofing and Pointing',
    ],
    openGraph: {
        title: 'PDS Roofing and Pointing | Roofers in Manchester',
        description: 'Trusted roofing and pointing services across Manchester. Rated 4.9/5 from 68 reviews. Roof repairs, full roofs, guttering, pointing and more. Free no-obligation quotes.',
        url: 'https://pdsroofing.com',
        siteName: 'PDS Roofing and Pointing',
        locale: 'en_GB',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'PDS Roofing and Pointing | Roofers in Manchester',
        description: 'Trusted roofing and pointing services across Manchester. Rated 4.9/5 from 68 reviews. Free quotes.',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: 'https://pdsroofing.com',
    },
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RoofingContractor',
    name: 'PDS Roofing and Pointing',
    legalName: 'MRE Roofing Ltd',
    url: 'https://pdsroofing.com',
    telephone: '+447856417543',
    email: 'sfitz0181@gmail.com',
    description: 'Professional roofing and pointing services across Manchester and surrounding areas. Roof repairs, full roofs, guttering, fascias, chimney work, flat roofing and lead work.',
    areaServed: [
        { '@type': 'City', name: 'Manchester' },
        { '@type': 'City', name: 'Salford' },
        { '@type': 'City', name: 'Bolton' },
        { '@type': 'City', name: 'Stockport' },
        { '@type': 'City', name: 'Sale' },
        { '@type': 'City', name: 'Cheadle' },
        { '@type': 'City', name: 'Oldham' },
        { '@type': 'City', name: 'Bury' },
        { '@type': 'City', name: 'Heywood' },
    ],
    address: {
        '@type': 'PostalAddress',
        addressLocality: 'Manchester',
        addressRegion: 'Greater Manchester',
        addressCountry: 'GB',
    },
    aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '68',
        bestRating: '5',
    },
    hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Roofing Services',
        itemListElement: [
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Roof Repairs' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Full Roof Replacements' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Guttering & Fascias' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Pointing & Repointing' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Chimney Repairs' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Flat Roofing' } },
            { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Lead Work' } },
        ],
    },
    priceRange: 'Free quotes',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body>
                <Nav />
                {children}
                <footer className="site-footer">
                    <div className="container">
                        <div className="footer-grid">
                            <div className="footer-col">
                                <h3><span className="text-gold">PDS</span> Roofing &amp; Pointing</h3>
                                <p className="footer-desc">Professional roofing and pointing services across Manchester and surrounding areas. Rated 4.9/5 on MyBuilder.</p>
                                <p className="footer-registered">A trading name of MRE Roofing Ltd</p>
                            </div>
                            <div className="footer-col">
                                <h4>Services</h4>
                                <ul>
                                    <li>Full Roof Replacements</li>
                                    <li>Roof Repairs</li>
                                    <li>Pointing &amp; Repointing</li>
                                    <li>Guttering &amp; Fascias</li>
                                    <li>Chimney Repairs</li>
                                    <li>Flat Roofing</li>
                                    <li>Lead Work</li>
                                </ul>
                            </div>
                            <div className="footer-col">
                                <h4>Contact</h4>
                                <ul>
                                    <li>Manchester &amp; Surrounding Areas</li>
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
                            <p>&copy; 2025 PDS Roofing and Pointing. Trading name of MRE Roofing Ltd. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}
