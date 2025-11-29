import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Contact() {
    return (
        <div>
            <Navbar />

            {/* Banner (matching About/Craftmanship) */}
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img
                    src="/lavanya-ceramics-hq.jpg"
                    alt="Contact banner"
                    className="absolute h-full w-full object-cover"
                    style={{ filter: 'brightness(0.6)' }}
                />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 text-white md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">CONTACT US</h1>
                    </div>
                </div>
            </div>

            {/* Full-width map */}
            <div className="mt-8 w-full md:mt-12 lg:mt-16">
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

            <main className="mx-auto max-w-4xl px-4 py-8 text-center md:px-6 md:py-12 lg:px-8 lg:py-16">
                <h2 className="mb-4 text-xl tracking-widest text-gray-900 md:mb-6 md:text-2xl lg:text-3xl">MANUFACTURE, OFFICES & SHOWROOM</h2>
                <address className="text-sm leading-relaxed text-gray-700 not-italic md:text-base">
                    <div>Jl. Sunset road No.22, Seminyak, Bali 80361</div>
                    <div className="mt-2">(+62) 811-129-775</div>
                    <div className="mt-2">info@lavanyaceramics.com</div>
                </address>
            </main>

            <Footer />
        </div>
    );
}
