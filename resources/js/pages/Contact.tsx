import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Contact() {
    return (
        <div>
            <Navbar />

            {/* Banner (matching About/Craftmanship) */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/contact-lavanya.jpg" alt="Contact banner" className="absolute w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                        <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">CONTACT US</h1>
                    </div>
                </div>
            </div>

            {/* Full-width map */}
            <div className="w-full mt-8 md:mt-12">
                <iframe
                    title="Lavanya Ceramics - Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3943.9444146656656!2d115.176386!3d-8.6968289!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd246d9dcc47717%3A0xc4e5bc5834806352!2sJl.%20Sunset%20Road%20No.22%2C%20Legian%2C%20Kec.%20Kuta%2C%20Kabupaten%20Badung%2C%20Bali%2080361!5e0!3m2!1sen!2sid!4v1760612670287!5m2!1sen!2sid"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>

            <main className="max-w-4xl mx-auto py-12 px-4 text-center">
                <h2 className="text-xl tracking-widest mb-4">MANUFACTURE, OFFICES & SHOWROOM</h2>
                <address className="not-italic text-gray-700 leading-relaxed">
                    <div>Jl. Sunset road No.22, Seminyak, Bali 80361</div>
                    <div className="mt-2">(+62) 811-129-775</div>
                    <div className="mt-2">info@lavanyaceramics.com</div>
                </address>
            </main>

            <Footer />
        </div>
    );
}
