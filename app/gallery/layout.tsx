import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gallery | Photos of Our Roofing Work in Manchester',
    description: 'Browse photos of completed roofing, pointing and repair work by PDS Roofing and Pointing across Manchester and surrounding areas.',
    openGraph: {
        title: 'Our Work | PDS Roofing and Pointing Gallery',
        description: 'Photos of completed roofing jobs across Manchester — roof repairs, full roofs, guttering, pointing and more.',
        url: 'https://pdsroofing.com/gallery',
    },
    alternates: {
        canonical: 'https://pdsroofing.com/gallery',
    },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return children;
}
