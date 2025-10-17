import '../css/app.css';
import { createRoot } from 'react-dom/client';

// Simple test component first
function TestApp() {
    return (
        <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ color: '#423F3B', fontSize: '3rem', textAlign: 'center', marginBottom: '2rem' }}>
                LAVANYA CERAMICS
            </h1>
            <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
                    Discover our curated collection of premium ceramics that blend timeless elegance, 
                    artisanal craftsmanship, and modern design.
                </p>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '2rem',
                    marginTop: '3rem'
                }}>
                    <div style={{ 
                        padding: '2rem', 
                        backgroundColor: '#f8f8f8', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#423F3B', marginBottom: '1rem' }}>Premium Quality</h3>
                        <p style={{ color: '#666' }}>Handcrafted ceramics made with the finest materials</p>
                    </div>
                    <div style={{ 
                        padding: '2rem', 
                        backgroundColor: '#f8f8f8', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#423F3B', marginBottom: '1rem' }}>Timeless Design</h3>
                        <p style={{ color: '#666' }}>Beautiful pieces that complement any space</p>
                    </div>
                    <div style={{ 
                        padding: '2rem', 
                        backgroundColor: '#f8f8f8', 
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#423F3B', marginBottom: '1rem' }}>Artisan Crafted</h3>
                        <p style={{ color: '#666' }}>Each piece is carefully crafted by skilled artisans</p>
                    </div>
                </div>
                <div style={{ marginTop: '3rem' }}>
                    <p style={{ color: '#888', fontSize: '1rem' }}>
                        ✨ Static deployment successful - Lavanya Ceramics is live! ✨
                    </p>
                </div>
            </div>
        </div>
    );
}

const appEl = document.getElementById('app');
if (appEl) {
    const root = createRoot(appEl);
    root.render(<TestApp />);
} else {
    console.error('App element not found');
}