'use client';

import { useState, useEffect, useRef } from 'react';
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

interface GalleryImage {
    url: string;
    pathname: string;
    uploadedAt: string;
}

export default function AdminPage() {
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
    const [error, setError] = useState('');
    const [tab, setTab] = useState<'reviews' | 'gallery'>('reviews');
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [uploading, setUploading] = useState(false);
    const [migrating, setMigrating] = useState(false);
    const [migrateMessage, setMigrateMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const fetchImages = async () => {
        const res = await fetch('/api/gallery');
        if (res.ok) {
            const data = await res.json();
            setImages(data);
        }
    };

    useEffect(() => {
        if (authenticated) fetchImages();
    }, [authenticated]);

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

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('password', password);
            await fetch('/api/admin/gallery', { method: 'POST', body: formData });
        }

        await fetchImages();
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleMigrate = async () => {
        if (!confirm('Import the original MyBuilder reviews into the database? This is safe to run multiple times — existing reviews will be skipped.')) return;
        setMigrating(true);
        setMigrateMessage('');
        try {
            const res = await fetch('/api/admin/migrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMigrateMessage(`Imported ${data.imported} reviews, skipped ${data.skipped}`);
                fetchReviews(password);
            } else {
                setMigrateMessage(`Error: ${data.error || 'Migration failed'}`);
            }
        } catch {
            setMigrateMessage('Error: Could not connect');
        } finally {
            setMigrating(false);
        }
    };

    const handleDeleteImage = async (url: string) => {
        if (!confirm('Delete this photo?')) return;
        const res = await fetch('/api/admin/gallery', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url, password }),
        });
        if (res.ok) {
            setImages(images.filter(img => img.url !== url));
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
                    <h1>Admin <span className="text-gold">Panel</span></h1>
                </div>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${tab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setTab('reviews')}
                    >
                        Reviews
                        {pendingCount > 0 && <span className="pending-badge">{pendingCount}</span>}
                    </button>
                    <button
                        className={`tab-btn ${tab === 'gallery' ? 'active' : ''}`}
                        onClick={() => setTab('gallery')}
                    >
                        Gallery
                        <span className="filter-count">{images.length}</span>
                    </button>
                </div>

                {tab === 'reviews' && (
                    <>
                        {reviews.length === 0 && (
                            <div className="migrate-section glass-panel">
                                <h3>Import <span className="text-gold">MyBuilder Reviews</span></h3>
                                <p>It looks like the database is empty. Click below to import the original 16 MyBuilder reviews.</p>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleMigrate}
                                    disabled={migrating}
                                >
                                    {migrating ? 'Importing...' : 'Import Reviews'}
                                </button>
                                {migrateMessage && <p className="migrate-message">{migrateMessage}</p>}
                            </div>
                        )}

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
                    </>
                )}

                {tab === 'gallery' && (
                    <div className="gallery-admin">
                        <div className="upload-section glass-panel">
                            <h3>Upload <span className="text-gold">Photos</span></h3>
                            <p className="upload-hint">Select one or multiple photos to upload.</p>
                            <div className="upload-controls">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleUpload}
                                    id="gallery-upload"
                                    className="file-input-hidden"
                                />
                                <label htmlFor="gallery-upload" className="btn btn-primary upload-btn">
                                    {uploading ? 'Uploading...' : 'Choose Photos'}
                                </label>
                            </div>
                        </div>

                        {images.length === 0 ? (
                            <div className="admin-empty glass-panel">
                                <p>No photos uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="admin-gallery-grid">
                                {images.map(image => (
                                    <div key={image.url} className="admin-gallery-item glass-panel">
                                        <img src={image.url} alt="Gallery photo" />
                                        <button
                                            className="btn btn-sm btn-delete gallery-delete-btn"
                                            onClick={() => handleDeleteImage(image.url)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
}
