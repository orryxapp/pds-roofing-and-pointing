'use client';

import { useState, useEffect, FormEvent } from 'react';
import Spline from '@splinetool/react-spline';
import './reviews.css';

interface Review {
    id: string;
    name: string;
    location: string;
    content: string;
    rating: number;
    date: string;
    jobType: string;
    source: string;
}

const jobTypes = [
    'Roof Repair',
    'Full Roof Replacement',
    'Guttering & Fascias',
    'Pointing & Repointing',
    'Chimney Repair',
    'Flat Roofing',
    'Lead Work',
    'Other',
];

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        jobType: '',
        rating: '5',
        content: '',
    });

    useEffect(() => {
        fetch('/api/reviews')
            .then(res => res.json())
            .then(data => setReviews(data))
            .catch(() => {});
    }, []);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % reviews.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const getCardClass = (index: number) => {
        if (index === activeIndex) return 'card-active';
        if (index === (activeIndex + 1) % reviews.length) return 'card-next';
        if (index === (activeIndex - 1 + reviews.length) % reviews.length) return 'card-prev';
        return 'card-hidden';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...formData,
                rating: Number(formData.rating),
            }),
        });
        if (res.ok) {
            setSubmitted(true);
            setFormData({ name: '', location: '', jobType: '', rating: '5', content: '' });
        }
    };

    return (
        <main className="reviews-main">
            <div className="spline-container-reviews">
                <Spline scene="https://prod.spline.design/tisAVLlbjySdt4Nw/scene.splinecode" />
            </div>

            <div className="container relative-z">
                <div className="reviews-header text-center animate-fade-in-up">
                    <h1 className="heading-xl">Client <span className="text-gold">Reviews</span></h1>
                    <p className="hero-subtitle">
                        Rated <span className="text-gold" style={{ fontWeight: 700 }}>4.9/5</span> from 68 reviews on MyBuilder
                    </p>
                </div>

                {reviews.length > 0 && (
                    <div className="carousel-container delay-200 animate-fade-in-up">
                        <div className="cards-wrapper">
                            {reviews.map((review, index) => {
                                const cardClass = getCardClass(index);
                                return (
                                    <div
                                        key={review.id}
                                        className={`review-card ${cardClass}`}
                                    >
                                        <div className="stars text-gold">
                                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                        </div>
                                        <p className="content">&ldquo;{review.content}&rdquo;</p>
                                        <div className="author">
                                            <div className="avatar">
                                                {review.name.charAt(0)}
                                            </div>
                                            <div className="info">
                                                <h4>{review.name}</h4>
                                                <span className="role">{review.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="carousel-controls">
                            <button className="btn btn-outline round-btn" onClick={handlePrev}>←</button>
                            <span className="review-counter">{activeIndex + 1} / {reviews.length}</span>
                            <button className="btn btn-outline round-btn" onClick={handleNext}>→</button>
                        </div>
                    </div>
                )}

                <div className="leave-review-section animate-fade-in-up">
                    {!showForm && !submitted && (
                        <button
                            className="btn btn-primary leave-review-btn"
                            onClick={() => setShowForm(true)}
                        >
                            Leave a Review
                        </button>
                    )}

                    {submitted && (
                        <div className="review-submitted glass-panel">
                            <span className="success-check">✓</span>
                            <h3>Thank You!</h3>
                            <p>Your review has been submitted and is awaiting approval. It will appear on the site once verified.</p>
                        </div>
                    )}

                    {showForm && !submitted && (
                        <form className="review-form glass-panel" onSubmit={handleSubmit}>
                            <h3>Leave a <span className="text-gold">Review</span></h3>
                            <p className="form-subtitle">Share your experience with PDS Roofing</p>

                            <div className="rf-row">
                                <div className="rf-group">
                                    <label htmlFor="rf-name">Your Name *</label>
                                    <input
                                        type="text"
                                        id="rf-name"
                                        name="name"
                                        required
                                        placeholder="e.g. John"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="rf-group">
                                    <label htmlFor="rf-location">Your Area *</label>
                                    <input
                                        type="text"
                                        id="rf-location"
                                        name="location"
                                        required
                                        placeholder="e.g. Manchester"
                                        value={formData.location}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="rf-row">
                                <div className="rf-group">
                                    <label htmlFor="rf-jobType">Work Done *</label>
                                    <select
                                        id="rf-jobType"
                                        name="jobType"
                                        required
                                        value={formData.jobType}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select...</option>
                                        {jobTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="rf-group">
                                    <label htmlFor="rf-rating">Rating *</label>
                                    <div className="star-select">
                                        {[5, 4, 3, 2, 1].map(n => (
                                            <button
                                                key={n}
                                                type="button"
                                                className={`star-btn ${Number(formData.rating) >= n ? 'active' : ''}`}
                                                onClick={() => setFormData({ ...formData, rating: String(n) })}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="rf-group rf-full">
                                <label htmlFor="rf-content">Your Review *</label>
                                <textarea
                                    id="rf-content"
                                    name="content"
                                    required
                                    rows={4}
                                    placeholder="Tell us about your experience..."
                                    value={formData.content}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="rf-actions">
                                <button type="submit" className="btn btn-primary">Submit Review</button>
                                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                            </div>
                            <p className="rf-note">Your review will be published after verification.</p>
                        </form>
                    )}
                </div>
            </div>
        </main>
    );
}
