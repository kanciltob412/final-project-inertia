import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Contact() {
    return (
        <div>
            <Navbar />

            {/* Full-width map */}
            <div className="w-full">
                <iframe
                    title="PORDAMSA - Location"
                    src="https://maps.app.goo.gl/i2RRPCdiggcZmVxy7"
                    width="100%"
                    height="360"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                ></iframe>

                <div className="text-center mt-4">
                    <a href="https://maps.app.goo.gl/i2RRPCdiggcZmVxy7" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 underline">View on Google Maps</a>
                </div>
            </div>

            <main className="max-w-4xl mx-auto py-12 px-4 text-center">
                <h2 className="text-xl tracking-widest mb-4">MANUFACTURE, OFFICES & SHOWROOM</h2>
                <address className="not-italic text-gray-700 leading-relaxed">
                    <div>C-66, Km 5.5 · St. Climent de Peralta</div>
                    <div>La Bisbal d'Empordà, Girona (ES)</div>
                    <div className="mt-2">(+34) 972 634 175</div>
                    <div className="mt-2">pordamsa@pordamsa.com</div>
                </address>
            </main>

            <Footer />
        </div>
    );
}
