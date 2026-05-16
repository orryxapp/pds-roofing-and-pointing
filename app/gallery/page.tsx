'use client';

import { useState, useEffect } from 'react';
import './gallery.css';

interface GalleryImage {
    url: string;
    pathname: string;
    uploadedAt: string;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [lightbox, setLightbox] = useState<number | null>(null);

    useEffect(() => {
        fetch('/api/gallery')
            .then(res => res.json())
            .then(data => setImages(data))
            .catch(() => {});
    }, []);

    const openLightbox = (index: number) => setLightbox(index);
    const closeLightbox = () => setLightbox(null);

    const goNext = () => {
        if (lightbox !== null) setLightbox((lightbox + 1) % images.length);
    };

    const goPrev = () => {
        if (lightbox !== null) setLightbox((lightbox - 1 + images.length) % images.length);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (lightbox === null) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    });

    return (
        <main className="gallery-main">
            <div className="container">
                <div className="gallery-header animate-fade-in-up">
                    <h1 className="heading-xl">Our <span className="text-gold">Work</span></h1>
                    <p className="hero-subtitle">
                        Photos from recent roofing, pointing and repair jobs across Manchester.
                    </p>
                </div>

                {images.length === 0 ? (
                    <div className="gallery-empty animate-fade-in-up">
                        <p>Photos coming soon.</p>
                    </div>
                ) : (
                    <div className="gallery-grid animate-fade-in-up">
                        {images.map((image, index) => (
                            <div
                                key={image.url}
                                className="gallery-item"
                                onClick={() => openLightbox(index)}
                            >
                                <img src={image.url} alt="Roofing work by PDS Roofing" loading="lazy" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {lightbox !== null && images[lightbox] && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <img
                        className="lightbox-img"
                        src={images[lightbox].url}
                        alt="Roofing work by PDS Roofing"
                        onClick={e => e.stopPropagation()}
                    />
                    <button className="lightbox-close" onClick={closeLightbox}>✕</button>
                    {images.length > 1 && (
                        <>
                            <button className="lightbox-nav lightbox-prev" onClick={e => { e.stopPropagation(); goPrev(); }}>←</button>
                            <button className="lightbox-nav lightbox-next" onClick={e => { e.stopPropagation(); goNext(); }}>→</button>
                        </>
                    )}
                </div>
            )}
        </main>
    );
}
