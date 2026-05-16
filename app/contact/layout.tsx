import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Get a Free Roofing Quote in Manchester',
    description: 'Contact PDS Roofing and Pointing for a free, no-obligation roofing quote in Manchester, Salford, Bolton, Stockport and surrounding areas. Call Scott on 07856 417543 or book online.',
    openGraph: {
        title: 'Get a Free Roofing Quote | PDS Roofing Manchester',
        description: 'Contact us for a free roofing quote. We cover Manchester, Salford, Bolton, Stockport, Sale and surrounding areas.',
        url: 'https://pdsroofing.com/contact',
    },
    alternates: {
        canonical: 'https://pdsroofing.com/contact',
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return children;
}
