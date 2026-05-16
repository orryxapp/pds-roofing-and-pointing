import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Reviews | Rated 4.9/5 from 68 Verified Reviews',
    description: 'Read 68 verified reviews from real customers of PDS Roofing and Pointing in Manchester. Rated 4.9/5 on MyBuilder for roof repairs, full roofs, guttering, pointing and more.',
    openGraph: {
        title: 'PDS Roofing Reviews | Rated 4.9/5 from 68 Reviews',
        description: 'Read what our customers say about PDS Roofing and Pointing. 68 verified reviews on MyBuilder.',
        url: 'https://pdsroofing.com/reviews',
    },
    alternates: {
        canonical: 'https://pdsroofing.com/reviews',
    },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
