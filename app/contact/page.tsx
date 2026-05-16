'use client';

import { useState, FormEvent } from 'react';
import './contact.css';

const jobTypes = [
    'Roof Repair',
    'Full Roof Replacement',
    'Pointing & Repointing',
    'Guttering & Fascias',
    'Chimney Repair',
    'Flat Roofing',
    'Lead Work',
    'Emergency Leak',
    'Other',
];

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        postcode: '',
        jobType: '',
        description: '',
        preferredDate: '',
    });
    const [submitted, setSubmitted] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError('');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                const data = await res.json().catch(() => null);
                setError(data?.error || 'Something went wrong. Please call us directly instead.');
            }
        } catch {
            setError('Something went wrong. Please call us directly instead.');
        } finally {
            setSending(false);
        }
    };

    if (submitted) {
        return (
            <main className="contact-main">
                <div className="container">
                    <div className="success-message glass-panel animate-fade-in-up">
                        <span className="success-icon">✓</span>
                        <h2>Quote Request <span className="text-gold">Sent!</span></h2>
                        <p>Thanks {formData.name}, we've received your request. Scott will be in touch within 24 hours to discuss your {formData.jobType.toLowerCase()} job.</p>
                        <div className="success-actions">
                            <a href="/" className="btn btn-outline">Back to Home</a>
                            <a href="tel:+447856417543" className="btn btn-primary">Call Scott</a>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="contact-main">
            <div className="container">
                <div className="contact-header animate-fade-in-up">
                    <h1 className="heading-xl">Get a Free <span className="text-gold">Quote</span></h1>
                    <p className="hero-subtitle">
                        Tell us about your roofing job and we'll get back to you within 24 hours.
                    </p>
                </div>

                <div className="contact-grid">
                    <form className="booking-form glass-panel animate-fade-in-up" onSubmit={handleSubmit}>
                        <h3>Book Your Job</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    placeholder="Your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    required
                                    placeholder="07XXX XXXXXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="postcode">Postcode *</label>
                                <input
                                    type="text"
                                    id="postcode"
                                    name="postcode"
                                    required
                                    placeholder="e.g. M1 1AA"
                                    value={formData.postcode}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="jobType">Type of Work *</label>
                                <select
                                    id="jobType"
                                    name="jobType"
                                    required
                                    value={formData.jobType}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a service...</option>
                                    {jobTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="preferredDate">Preferred Date</label>
                                <input
                                    type="date"
                                    id="preferredDate"
                                    name="preferredDate"
                                    value={formData.preferredDate}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label htmlFor="description">Describe the Job *</label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                rows={4}
                                placeholder="Tell us what's going on — e.g. leaking roof, missing tiles, need new guttering..."
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>

                        {error && <p className="form-error">{error}</p>}
                        <button type="submit" className="btn btn-primary submit-btn" disabled={sending}>
                            {sending ? 'Sending...' : 'Request Free Quote'}
                        </button>
                        <p className="form-note">No obligation — we'll call to discuss your job and arrange a visit.</p>
                    </form>

                    <div className="contact-info animate-fade-in-up delay-200">
                        <div className="info-card glass-panel">
                            <h3>Get in <span className="text-gold">Touch</span></h3>
                            <div className="info-item">
                                <span className="info-icon">📞</span>
                                <div>
                                    <strong>Scott Fitzhugh</strong>
                                    <a href="tel:+447856417543">07856 417543</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">📞</span>
                                <div>
                                    <strong>David Fitzhugh</strong>
                                    <a href="tel:+447704620531">07704 620531</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">📧</span>
                                <div>
                                    <strong>Email</strong>
                                    <a href="mailto:sfitz0181@gmail.com">sfitz0181@gmail.com</a>
                                </div>
                            </div>
                            <div className="info-item">
                                <span className="info-icon">📍</span>
                                <div>
                                    <strong>Areas Covered</strong>
                                    <p>Manchester, Salford, Bolton, Stockport, Sale, Cheadle, Oldham, Bury, Heywood & surrounding areas</p>
                                </div>
                            </div>
                        </div>

                        <div className="info-card glass-panel">
                            <h3>Why Choose <span className="text-gold">Us?</span></h3>
                            <ul className="why-list">
                                <li>Rated <strong className="text-gold">4.9/5</strong> from 68 reviews</li>
                                <li>Free, no-obligation quotes</li>
                                <li>Fully insured & experienced</li>
                                <li>Clean & tidy workmanship</li>
                                <li>Photos provided before & after</li>
                                <li>Honest pricing, no hidden costs</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
