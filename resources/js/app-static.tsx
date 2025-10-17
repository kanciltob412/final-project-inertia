import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { CartProvider } from 'react-use-cart';
import { FilterProvider } from './context/FilterContext';

// Import only the main public pages (no auth pages)
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Craftsmanship from './pages/Craftsmanship';
import Contact from './pages/Contact';
import Articles from './pages/Articles';

// Simple static router for demo purposes
function StaticApp() {
    const path = window.location.pathname;
    
    let Component = Home; // Default to Home
    
    switch (path) {
        case '/about':
            Component = About;
            break;
        case '/products':
            Component = Products;
            break;
        case '/craftsmanship':
            Component = Craftsmanship;
            break;
        case '/contact':
            Component = Contact;
            break;
        case '/articles':
            Component = Articles;
            break;
        default:
            Component = Home;
    }
    
    return (
        <div className="flex min-h-screen flex-col bg-gray-50 text-black">
            <CartProvider>
                <FilterProvider>
                    <Component />
                </FilterProvider>
            </CartProvider>
        </div>
    );
}

const appEl = document.getElementById('app');
if (appEl) {
    const root = createRoot(appEl);
    root.render(<StaticApp />);
}