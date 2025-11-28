import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { useEffect } from 'react';

export default function Craftsmanship() {
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
        <div>
            <Navbar />

            <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                <img src="/images/craftmanship/craftmanship_banner.jpg" alt="Craftsmanship banner" className="absolute w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-semibold uppercase tracking-wide">CRAFTMANSHIP</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto py-8 md:py-12 lg:py-16 px-4 md:px-6 lg:px-8">
                <section className="py-8 md:py-10 lg:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch match-height">
                    <div className="h-full flex flex-col justify-start match-text">
                        <h2 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-4 md:mb-6">Giving Form to An Idea</h2>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">At Lavanya Ceramics we are fascinated by the possibility of being able to represent an idea with our own hands. The origin of each piece is born in our imagination as well as from the desire to listen to the demands of a constantly evolving market where creativity is an essential pillar.</p>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">Once the idea is defined, the design team values materials, aesthetics and functionality and as of that moment, the manufacturing process begins with the fusion of old techniques together with innovative processes all based on manual work and care for detail.</p>
                    </div>

                    <div className="h-full overflow-hidden match-image rounded-lg">
                        <img src="/images/craftmanship/craftmanship-01.jpg" alt="Giving form" className="w-full h-full object-cover rounded-lg block" />
                    </div>
                </section>

                <section className="py-8 md:py-10 lg:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch match-height">
                    <div className="h-full overflow-hidden match-image rounded-lg">
                        <img src="/images/craftmanship/craftmanship-01.jpg" alt="Giving form" className="w-full h-full object-cover rounded-lg block" />
                    </div>
                    <div className="h-full flex flex-col justify-start match-text">
                        <h3 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-4 md:mb-6">Noble Materials</h3>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">Porcelain is composed by the raw materials kaolin, feldspar and quartz. It has a high level of resistance and high density, as it is fired at 1400°C. Porcelain, stoneware and earthenware are very similar materials, and there is even a tendency for them to be confused.</p>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">While porcelain is an impermeable material, stoneware and earthenware contain silica and clay in their composition and they easily absorb some elements to which they are exposed. Porcelain composition go through much more demanding qualitative selection criteria regarding consistency of the technical characteristics and the absence of contaminants. This unique characteristics make porcelain a pure material suitable for any event.</p>
                    </div>
                </section>

                <section className="py-8 md:py-10 lg:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch match-height">
                    <div className="h-full flex flex-col justify-start match-text">
                        <h3 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-4 md:mb-6">Handmade Process</h3>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">Our designers and modellers work together in close cooperation to construct the models. Once they have been shaped to satisfaction, they are used to make the master moulds that will be used to turn to make the negative casting moulds. After that, the items are shaped in porcelain or glass and the manufacturing process begins.</p>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">All our fine porcelain and glass creations are crafted, fired and polished by hand with an emphasis on detail and quality.</p>
                    </div>
                    <div className="h-full overflow-hidden match-image rounded-lg">
                        <img src="/images/craftmanship/craftmanship_03.jpg" alt="Handmade" className="w-full h-full object-cover rounded-lg block" />
                    </div>
                </section>

                <section className="py-8 md:py-10 lg:py-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-stretch match-height">
                    <div className="h-full overflow-hidden match-image rounded-lg">
                        <img src="/images/craftmanship/craftmanship_03.jpg" alt="Handmade" className="w-full h-full object-cover rounded-lg block" />
                    </div>
                    <div className="h-full flex flex-col justify-start match-text">
                        <h3 className="text-lg md:text-xl lg:text-2xl text-gray-900 font-semibold mb-4 md:mb-6">Finishing</h3>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">In the porcelain manufacturing process, the biscuit fired pieces are glazed. The glaze is a mixture of quartz, feldspar, kaolin and a high proportion of different firing agents. Because of its high content of quartz, it produces a very hard surface when fired. The glaze melts when fired and fuses with the body before its pores close, creating an inseparable bond between the porcelain body and glaze.</p>
                        <p className="mb-4 text-sm md:text-base text-gray-700 leading-relaxed">The glaze can be glossy or matte, that is both rough and refined. One of the features that most differentiate Lavanya products is the combination of gloss and matt in the same piece. In that case, the matt area is called biscuit porcelain. It still has a non-porous surface and offers an extraordinary light contrast when combined with glossy glaze in the same piece as it is shown in the picture below.</p>
                    </div>
                </section>

                <section className="py-8 md:py-10 lg:py-12">
                    <div className="aspect-w-16 aspect-h-9">
                        <iframe
                            className="w-full h-64 md:h-80 lg:h-96 rounded-lg"
                            src="https://www.youtube.com/embed/NTEEiJ6Huy0"
                            title="Lavanya Ceramics - Craftsmanship"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
