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
            <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                <img
                    src="/images/about/about-us-banner.jpg"
                    alt="About banner"
                    className="absolute h-full w-full object-cover"
                    style={{ filter: 'brightness(0.6)' }}
                />
                <div className="absolute inset-0 flex items-center">
                    <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 md:translate-y-16">
                        <h1 className="text-4xl font-semibold tracking-wide text-white uppercase md:text-5xl lg:text-6xl">ABOUT US</h1>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                <section className="match-height flex flex-col-reverse items-stretch gap-6 py-8 md:grid md:grid-cols-2 md:gap-8 md:py-10 lg:gap-12 lg:py-12">
                    <div className="match-text flex h-full w-full flex-col justify-start">
                        {/* Image on mobile, before headline */}
                        <div className="mb-6 block w-full md:mb-0 md:hidden">
                            <div className="match-image mx-auto overflow-hidden rounded-lg" style={{ maxWidth: '340px' }}>
                                <img src="/images/about/brand-history-1.jpg" alt="Porcelain plates" className="block h-auto w-full object-cover" />
                            </div>
                        </div>
                        <h2 className="mb-4 text-xl font-semibold text-gray-900 md:mb-6 md:text-2xl lg:text-3xl">Brand Story</h2>
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Founded in 2025 in Ubud, Bali, Lavanya Ceramics was born from a quiet devotion to the art of making by hand. Guided by
                            Bali's spirit of balance and its deep-rooted artistic traditions, we create ceramics that carry both function and soul.
                            Each piece begins with the earth — shaped, refined, and fired with patience. Our artisans work with a thoughtful rhythm,
                            blending traditional techniques with a modern sensibility. The result is a collection that feels honest and enduring,
                            where every curve and texture tells a story of touch and time.
                        </p>

                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            At Lavanya, we believe beauty lies in simplicity and sincerity. Through our ceramics, we aim to bring a sense of calm
                            presence to the table — a reminder of the harmony between human hands, nature, and everyday life.
                        </p>
                    </div>
                    {/* Image for desktop/tablet */}
                    <div className="match-image hidden h-full overflow-hidden rounded-lg md:block">
                        <img src="/images/about/brand-history-1.jpg" alt="Porcelain plates" className="block h-full w-full object-cover" />
                    </div>
                </section>

                <section className="match-height grid grid-cols-1 items-stretch gap-6 py-8 md:grid-cols-2 md:gap-8 md:py-10 lg:gap-12 lg:py-12">
                    <div className="match-image h-full overflow-hidden rounded-lg">
                        <img src="/images/about/brand-history-3.jpg" alt="Hands crafting" className="block h-full w-full object-cover" />
                    </div>
                    <div className="match-text flex h-full flex-col justify-start">
                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Our deep respect for the natural character of clay, combined with our in-house design and crafting process, guides every
                            piece we create. From shaping to glazing, each step is done with intention — allowing us to achieve forms and finishes
                            that reflect both simplicity and quiet sophistication.
                        </p>

                        <p className="mb-4 text-sm leading-relaxed text-gray-700 md:text-base">
                            Driven by curiosity and a commitment to evolve, our team continues to explore new materials and techniques — blending
                            stoneware, porcelain, and locally sourced elements that honor Bali's landscape. Every creation passes through the hands of
                            skilled artisans who care for the smallest detail, ensuring that each piece embodies the warmth, balance, and authenticity
                            at the heart of Lavanya Ceramics.
                        </p>
                    </div>
                </section>

                <section className="py-8 md:py-10 lg:py-12">
                    <h3 className="mb-6 text-lg font-semibold text-gray-900 md:mb-8 md:text-xl lg:text-2xl">Manifesto / Our Values</h3>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:gap-8">
                        <div className="space-y-4">
                            <img src="/images/about/our-vision-hand.jpg" alt="Vision" className="h-40 w-full rounded-lg object-cover" />
                            <h4 className="text-base font-semibold text-gray-900 md:text-lg">Our Vision</h4>
                            <p className="text-sm text-gray-700 md:text-base">
                                To build a lasting atelier that reflects the spirit of Bali — creating ceramics that embody timeless design,
                                thoughtful craftsmanship, and a quiet sense of beauty.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <img src="/images/about/our-mission-bowl.jpg" alt="Mission" className="h-40 w-full rounded-lg object-cover" />
                            <h4 className="text-base font-semibold text-gray-900 md:text-lg">Our Mission</h4>
                            <p className="text-sm text-gray-700 md:text-base">
                                To craft pieces that enrich everyday life through authenticity and purpose. Each creation is guided by care for
                                detail, respect for tradition, and a commitment to quality that endures. We aim to bring warmth and harmony to every
                                table, connecting people through the simple act of sharing.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <img src="/images/about/respect-raw-materials.jpg" alt="Nature" className="h-40 w-full rounded-lg object-cover" />
                            <h4 className="text-base font-semibold text-gray-900 md:text-lg">The Respect to Nature</h4>
                            <p className="text-sm text-gray-700 md:text-base">
                                Nature is at the heart of everything we do. Our materials are of natural origin, responsibly sourced, and free from
                                synthetic components. Each process is designed to minimize environmental impact while preserving the purity of the
                                earth that gives our ceramics life. For us, sustainability means creating with integrity — in balance with the land,
                                the craft, and the people who shape it.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="match-height flex flex-col-reverse items-stretch gap-6 py-8 md:flex-row md:gap-8 md:py-10 lg:gap-10 lg:py-12">
                    <div className="match-text flex h-full flex-1 flex-col justify-start">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl">Handmade</h3>
                        <p className="mb-6 text-sm text-gray-700 md:text-base">
                            Every Lavanya piece is shaped entirely by hand. From the first touch of clay to the final firing, each stage is carried
                            out with patience and precision by our skilled artisans in Bali. Every form passes through many careful steps — shaping,
                            drying, refining, glazing, and firing — each requiring time and attention to achieve the right balance of texture and
                            tone. The result is a piece that carries the quiet marks of human touch, where no two are ever exactly the same. At
                            Lavanya, handmade is not simply a process — it is a philosophy of respect for time, material, and the craft itself.
                        </p>
                        <Link
                            href="/craftsmanship"
                            className="block w-full rounded-md border border-transparent bg-black px-6 py-3 text-center text-white transition-colors duration-200 hover:border-black hover:bg-white hover:text-black md:w-full lg:w-[30%]"
                        >
                            See Craftsmanship
                        </Link>
                    </div>

                    <div className="match-image h-full w-full overflow-hidden rounded-lg md:w-1/3">
                        <img src="/images/about/handmade.jpg" alt="Craft workshop" className="block h-full w-full object-cover" />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
