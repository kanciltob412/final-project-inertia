import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link } from '@inertiajs/react';
import { useEffect } from 'react';

export default function About() {
    useEffect(() => {
        // small debounce to avoid repeated layout thrashing
        function debounce(fn: () => void, wait = 100) {
            let t: number | undefined;
            return () => {
                if (t) window.clearTimeout(t);
                t = window.setTimeout(() => fn(), wait);
            };
        }

        function syncHeights() {
            // Only apply matching on medium+ screens to avoid layout issues on mobile
            if (window.innerWidth < 768) {
                // reset any previously set heights
                document.querySelectorAll('.match-image').forEach((m) => {
                    (m as HTMLElement).style.height = '';
                    const img = m.querySelector('img') as HTMLImageElement | null;
                    if (img) img.style.height = '';
                });
                return;
            }

            document.querySelectorAll('.match-height').forEach((container) => {
                const text = container.querySelector('.match-text') as HTMLElement | null;
                const imgWrapper = container.querySelector('.match-image') as HTMLElement | null;
                const imgEl = imgWrapper ? (imgWrapper.querySelector('img') as HTMLImageElement | null) : null;
                if (text && imgWrapper && imgEl) {
                    // reset first so we can measure correctly on smaller screens
                    imgWrapper.style.height = 'auto';
                    imgEl.style.height = 'auto';

                    // use getBoundingClientRect for a more stable measurement and include margins
                    const rect = text.getBoundingClientRect();
                    const computed = window.getComputedStyle(text);
                    const marginTop = parseFloat(computed.marginTop || '0');
                    const marginBottom = parseFloat(computed.marginBottom || '0');
                    const textH = Math.round(rect.height + marginTop + marginBottom);

                    if (textH > 0) {
                        // set wrapper to text height and make image fill it
                        imgWrapper.style.height = `${textH}px`;
                        imgEl.style.height = '100%';
                        imgEl.style.objectFit = 'cover';
                    }
                }
            });
        }

        const debouncedSync = debounce(syncHeights, 120);

        // Run initially and after a short delay to let fonts and images settle
        syncHeights();
        const initialTimer = window.setTimeout(syncHeights, 150);

        // Re-run when window resizes
        window.addEventListener('resize', debouncedSync);

        // Also run after the full page load (images/fonts)
        window.addEventListener('load', syncHeights);

        // If any image inside the matching containers is still loading, listen for its load event
        const imgs = Array.from(document.querySelectorAll('.match-height img')) as HTMLImageElement[];
        const onImgLoad = () => syncHeights();
        imgs.forEach((img) => {
            if (!img.complete) img.addEventListener('load', onImgLoad);
        });

        // Use ResizeObserver to detect changes to the text block size (more reliable than MutationObserver for layout changes)
        const win = window as unknown as { ResizeObserver?: typeof ResizeObserver };
        const ro = win.ResizeObserver ? new win.ResizeObserver(debouncedSync) : null;
        if (ro) {
            document.querySelectorAll('.match-text').forEach((el) => ro.observe(el));
        }

        // Keep a MutationObserver as a fallback for DOM changes (e.g., content injected dynamically)
        const mo = new MutationObserver(debouncedSync);
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            window.removeEventListener('resize', debouncedSync);
            window.removeEventListener('load', syncHeights);
            imgs.forEach((img) => img.removeEventListener('load', onImgLoad));
            if (ro) {
                try {
                    document.querySelectorAll('.match-text').forEach((el) => ro.unobserve(el));
                    ro.disconnect();
                } catch {
                    // ignore
                }
            }
            mo.disconnect();
            window.clearTimeout(initialTimer);
        };
    }, []);

    return (
        <div className="overflow-x-hidden">
            <Navbar />

            {/* Simple banner image with centered title (not the Home hero) */}
            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/images/about/about-us-banner.jpg" alt="About banner" className="absolute w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16">
                        <h1 className="text-4xl md:text-5xl text-white font-semibold uppercase tracking-wide">ABOUT US</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto py-16 px-4">
                <section className="flex flex-col-reverse md:grid md:grid-cols-2 gap-10 items-stretch match-height">
                    <div className="h-full flex flex-col justify-start match-text w-full">
                        {/* Image on mobile, before headline */}
                        <div className="block md:hidden w-full mb-5">
                            <div className="overflow-hidden match-image rounded-lg mx-auto" style={{ maxWidth: '340px' }}>
                                <img src="/images/about/brand-history-1.jpg" alt="Porcelain plates" className="w-full h-auto object-cover block" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-semibold mb-4">Brand Story</h2>
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Founded in 2025 in Ubud, Bali, Lavanya Ceramics was born from a quiet devotion to the art of making by hand. Guided by Bali’s spirit of balance and its deep-rooted artistic traditions, we create ceramics that carry both function and soul.

                            Each piece begins with the earth — shaped, refined, and fired with patience. Our artisans work with a thoughtful rhythm, blending traditional techniques with a modern sensibility. The result is a collection that feels honest and enduring, where every curve and texture tells a story of touch and time.
                        </p>

                        <p className="mb-4 text-gray-700 leading-relaxed">
                            At Lavanya, we believe beauty lies in simplicity and sincerity. Through our ceramics, we aim to bring a sense of calm presence to the table — a reminder of the harmony between human hands, nature, and everyday life.
                        </p>
                    </div>
                    {/* Image for desktop/tablet */}
                    <div className="hidden md:block h-full overflow-hidden match-image rounded-lg">
                        <img src="/images/about/brand-history-1.jpg" alt="Porcelain plates" className="w-full h-full object-cover block" />
                    </div>
                </section>

                <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-stretch match-height">
                    <div className="h-full overflow-hidden match-image rounded-lg">
                        <img src="/images/about/brand-history-3.jpg" alt="Hands crafting" className="w-full h-full object-cover block" />
                    </div>
                    <div className="h-full flex flex-col justify-start match-text">
                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Our deep respect for the natural character of clay, combined with our in-house design and crafting process, guides every piece we create. From shaping to glazing, each step is done with intention — allowing us to achieve forms and finishes that reflect both simplicity and quiet sophistication.
                        </p>

                        <p className="mb-4 text-gray-700 leading-relaxed">
                            Driven by curiosity and a commitment to evolve, our team continues to explore new materials and techniques — blending stoneware, porcelain, and locally sourced elements that honor Bali’s landscape. Every creation passes through the hands of skilled artisans who care for the smallest detail, ensuring that each piece embodies the warmth, balance, and authenticity at the heart of Lavanya Ceramics.
                        </p>
                    </div>
                </section>

                <section className="py-12">
                    <h3 className="text-2xl font-semibold mb-6">Manifesto / Our Values</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-4">
                            <img src="/images/about/our-vision-hand.jpg" alt="Vision" className="w-full h-40 object-cover rounded-lg" />
                            <h4 className="font-semibold">Our Vision</h4>
                            <p className="text-gray-700">To build a lasting atelier that reflects the spirit of Bali — creating ceramics that embody timeless design, thoughtful craftsmanship, and a quiet sense of beauty.</p>
                        </div>

                        <div className="space-y-4">
                            <img src="/images/about/our-mission-bowl.jpg" alt="Mission" className="w-full h-40 object-cover rounded-lg" />
                            <h4 className="font-semibold">Our Mission</h4>
                            <p className="text-gray-700">To craft pieces that enrich everyday life through authenticity and purpose. Each creation is guided by care for detail, respect for tradition, and a commitment to quality that endures. We aim to bring warmth and harmony to every table, connecting people through the simple act of sharing.</p>
                        </div>

                        <div className="space-y-4">
                            <img src="/images/about/respect-raw-materials.jpg" alt="Nature" className="w-full h-40 object-cover rounded-lg" />
                            <h4 className="font-semibold">The Respect to Nature</h4>
                            <p className="text-gray-700">Nature is at the heart of everything we do. Our materials are of natural origin, responsibly sourced, and free from synthetic components. Each process is designed to minimize environmental impact while preserving the purity of the earth that gives our ceramics life. For us, sustainability means creating with integrity — in balance with the land, the craft, and the people who shape it.</p>
                        </div>
                    </div>
                </section>

                <section className="py-12 flex flex-col-reverse md:flex-row items-stretch gap-8 match-height">
                    <div className="flex-1 h-full flex flex-col justify-start match-text">
                        <h3 className="text-2xl font-semibold mb-4">Handmade</h3>
                        <p className="text-gray-700 mb-6">Every Lavanya piece is shaped entirely by hand. From the first touch of clay to the final firing, each stage is carried out with patience and precision by our skilled artisans in Bali.

                            Every form passes through many careful steps — shaping, drying, refining, glazing, and firing — each requiring time and attention to achieve the right balance of texture and tone. The result is a piece that carries the quiet marks of human touch, where no two are ever exactly the same.

                            At Lavanya, handmade is not simply a process — it is a philosophy of respect for time, material, and the craft itself.</p>
                        <Link
                            href="/craftsmanship"
                            className="block w-full md:w-full lg:w-[30%] text-center rounded-md bg-black text-white px-6 py-3 transition-colors duration-200 hover:bg-white hover:text-black border border-transparent hover:border-black"
                        >
                            See Craftsmanship
                        </Link>
                    </div>

                    <div className="w-full md:w-1/3 h-full match-image overflow-hidden rounded-lg">
                        <img src="/images/about/handmade.jpg" alt="Craft workshop" className="w-full h-full object-cover block" />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
