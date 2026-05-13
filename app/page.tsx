'use client';

import Spline from '@splinetool/react-spline';
import { useState, useEffect } from 'react';

const featuredReviews = [
    {
        name: "Joanne",
        location: "Manchester",
        content: "I had a full roof and fascias done. Very happy with the work and the fact they went out of their way to get the tiles I wanted. The roof looks amazing!",
        rating: 5,
    },
    {
        name: "Richard",
        location: "Manchester",
        content: "Excellent guy, can't fault him. Went out of his way to ensure the job was done correctly, great knowledge, didn't try to over-charge and did exactly what he said he would.",
        rating: 5,
    },
    {
        name: "Tom",
        location: "Manchester",
        content: "Really nice guys, provided a very reasonable quote and quickly replaced a flat roof. Fixed a couple of small roofing related things whilst they were here as well. Wouldn't hesitate to use again.",
        rating: 5,
    },
];

const services = [
    {
        title: "Roof Repairs",
        desc: "Fast, reliable repairs for leaks, slipped tiles, storm damage and more.",
        icon: "🔧",
    },
    {
        title: "Full Roofs",
        desc: "Complete roof replacements with quality materials and expert workmanship.",
        icon: "🏠",
    },
    {
        title: "Guttering & Fascias",
        desc: "Repair and replacement of gutters, fascias, and soffits to protect your home.",
        icon: "🌧️",
    },
    {
        title: "Pointing & Repointing",
        desc: "Brick repointing, ridge pointing and mortar repairs to keep your property weatherproof.",
        icon: "🧱",
    },
    {
        title: "Chimney Work",
        desc: "Chimney repointing, lead flashing, cowl fitting and stack repairs.",
        icon: "🔥",
    },
    {
        title: "Flat Roofing",
        desc: "High-quality flat roof installations and repairs for extensions and garages.",
        icon: "📐",
    },
    {
        title: "Lead Work",
        desc: "Expert lead flashing and valley repairs for a watertight finish.",
        icon: "🛡️",
    },
];

export default function Home() {
    const [text1, setText1] = useState('');
    const [text2, setText2] = useState('');
    const [isSplineLoaded, setIsSplineLoaded] = useState(false);
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    const fullText1 = 'Your Roof, ';
    const fullText2 = 'Our Priority';

    useEffect(() => {
        if (!isSplineLoaded) return;

        let i = 0;
        const totalLength = fullText1.length + fullText2.length;

        const typingInterval = setInterval(() => {
            if (i < fullText1.length) {
                setText1(fullText1.substring(0, i + 1));
            } else if (i < totalLength) {
                setText2(fullText2.substring(0, i - fullText1.length + 1));
            } else {
                clearInterval(typingInterval);
                setIsTypingComplete(true);
            }
            i++;
        }, 80);

        return () => clearInterval(typingInterval);
    }, [isSplineLoaded]);

    return (
        <>
            <main className="main-content">
                <div className="spline-container">
                    <Spline
                        scene="https://prod.spline.design/4zPqKb3wiEZeIKCx/scene.splinecode"
                        onLoad={() => setIsSplineLoaded(true)}
                    />
                </div>

                <section className="hero-content">
                    <div className="container">
                        <div className="hero-text animate-fade-in-up">
                            <h1 className="heading-xl" style={{ minHeight: '2.4em' }}>
                                {text1}{text1.length < fullText1.length && isSplineLoaded && <span className="typing-cursor" />}
                                <br />
                                <span className="text-gold">{text2}</span>
                                {text1.length === fullText1.length && !isTypingComplete && <span className="typing-cursor" />}
                            </h1>

                            {isTypingComplete && (
                                <>
                                    <p className="hero-subtitle animate-fade-in-up">
                                        Professional roofing and pointing services across Manchester and surrounding areas.
                                        Rated <strong className="text-gold">4.9/5</strong> from 68 verified reviews.
                                    </p>
                                    <div className="hero-actions animate-fade-in-up delay-100">
                                        <a href="/contact" className="btn btn-primary">Get a Free Quote</a>
                                        <a href="/reviews" className="btn btn-outline">Read Reviews</a>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <section className="services-section">
                <div className="container">
                    <h2 className="section-heading animate-fade-in-up">
                        What We <span className="text-gold">Do</span>
                    </h2>
                    <p className="section-subtitle animate-fade-in-up">
                        From emergency leak repairs to full roof replacements — we've got you covered.
                    </p>
                    <div className="services-grid">
                        {services.map((service, i) => (
                            <div key={service.title} className={`service-card glass-panel animate-fade-in-up delay-${i % 3}00`}>
                                <span className="service-icon">{service.icon}</span>
                                <h3>{service.title}</h3>
                                <p>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="reviews-preview-section">
                <div className="container">
                    <h2 className="section-heading animate-fade-in-up">
                        What Our <span className="text-gold">Clients</span> Say
                    </h2>
                    <p className="section-subtitle animate-fade-in-up">
                        Rated 4.9/5 from 68 reviews on MyBuilder
                    </p>
                    <div className="reviews-preview-grid">
                        {featuredReviews.map((review, i) => (
                            <div key={i} className={`review-preview-card glass-panel animate-fade-in-up delay-${i}00`}>
                                <div className="stars text-gold">{'★'.repeat(review.rating)}</div>
                                <p className="review-preview-text">"{review.content}"</p>
                                <div className="review-preview-author">
                                    <div className="review-preview-avatar">{review.name.charAt(0)}</div>
                                    <div>
                                        <strong>{review.name}</strong>
                                        <span className="text-gold"> · {review.location}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="section-cta animate-fade-in-up">
                        <a href="/reviews" className="btn btn-outline">See All 68 Reviews</a>
                    </div>
                </div>
            </section>

            <section className="cta-section">
                <div className="container">
                    <div className="cta-box glass-panel animate-fade-in-up">
                        <h2>Need Roofers You Can <span className="text-gold">Trust?</span></h2>
                        <p>Get in touch today for a free, no-obligation quote. We cover Manchester, Salford, Bolton, Stockport, Sale, and surrounding areas.</p>
                        <div className="hero-actions">
                            <a href="/contact" className="btn btn-primary">Get a Free Quote</a>
                            <a href="tel:+447856417543" className="btn btn-outline">Call Scott</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
