'use client';

import { useState, useEffect } from 'react';
import './admin.css';

interface Review {
    id: string;
    name: string;
    location: string;
    content: string;
    rating: number;
    date: string;
    jobType: string;
    status: string;
    source: string;
}

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
    const [error, setError] = useState('');

    const fetchReviews = async (pw: string) => {
        const res = await fetch(`/api/admin/reviews?password=${encodeURIComponent(pw)}`);
        if (res.ok) {
            const data = await res.json();
            setReviews(data);
            setAuthenticated(true);
            setError('');
        } else {
            setError('Wrong password');
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        fetchReviews(password);
    };

    const handleAction = async (id: string, status: 'approved' | 'rejected') => {
        const res = await fetch('/api/admin/reviews', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, status, password }),
        });
        if (res.ok) {
            setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this review?')) return;
        const res = await fetch('/api/admin/reviews', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password }),
        });
        if (res.ok) {
            setReviews(reviews.filter(r => r.id !== id));
        }
    };

    const filtered = filter === 'all' ? reviews : reviews.filter(r => r.status === filter);
    const pendingCount = reviews.filter(r => r.status === 'pending').length;

    if (!authenticated) {
        return (
            <main className="admin-main">
                <div className="admin-login glass-panel">
                    <h1>Admin <span className="text-gold">Login</span></h1>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                    {error && <p className="admin-error">{error}</p>}
                </div>
            </main>
        );
    }

    return (
        <main className="admin-main">
            <div className="container">
                <div className="admin-header">
                    <h1>Review <span className="text-gold">Manager</span></h1>
                    {pendingCount > 0 && (
                        <span className="pending-badge">{pendingCount} pending</span>
                    )}
                </div>

                <div className="admin-filters">
                    {(['pending', 'approved', 'rejected', 'all'] as const).map(f => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''}`}
                            onClick={() => setFilter(f)}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className="filter-count">
                                {f === 'all' ? reviews.length : reviews.filter(r => r.status === f).length}
                            </span>
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="admin-empty glass-panel">
                        <p>No {filter === 'all' ? '' : filter} reviews found.</p>
                    </div>
                ) : (
                    <div className="admin-reviews-list">
                        {filtered.map(review => (
                            <div key={review.id} className={`admin-review-card glass-panel status-${review.status}`}>
                                <div className="admin-review-header">
                                    <div>
                                        <strong>{review.name}</strong>
                                        <span className="admin-location"> · {review.location}</span>
                                        <span className={`status-tag tag-${review.status}`}>{review.status}</span>
                                        {review.source === 'website' && <span className="source-tag">Website</span>}
                                        {review.source === 'mybuilder' && <span className="source-tag mb-tag">MyBuilder</span>}
                                    </div>
                                    <div className="admin-stars text-gold">
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </div>
                                </div>
                                <div className="admin-review-meta">
                                    <span>{review.jobType}</span> · <span>{review.date}</span>
                                </div>
                                <p className="admin-review-content">&ldquo;{review.content}&rdquo;</p>
                                <div className="admin-actions">
                                    {review.status !== 'approved' && (
                                        <button className="btn btn-sm btn-approve" onClick={() => handleAction(review.id, 'approved')}>
                                            Approve
                                        </button>
                                    )}
                                    {review.status !== 'rejected' && (
                                        <button className="btn btn-sm btn-reject" onClick={() => handleAction(review.id, 'rejected')}>
                                            Reject
                                        </button>
                                    )}
                                    <button className="btn btn-sm btn-delete" onClick={() => handleDelete(review.id)}>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
