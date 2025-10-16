import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link } from '@inertiajs/react';

export default function Craftsmanship() {
    return (
        <div>
            <Navbar />

            <div className="relative h-[360px] overflow-hidden">
                <img src="/images/craftmanship/craftmanship_banner.jpg" alt="Craftsmanship banner" className="absolute w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
                <div className="absolute inset-0 flex items-center">
                    <div className="max-w-6xl w-full mx-auto px-4 text-white">
                        <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">CRAFTMANSHIP</h1>
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto py-16 px-4">
                <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h2 className="text-xl font-semibold mb-3">GIVING FORM TO AN IDEA</h2>
                        <p className="text-gray-700 leading-relaxed mb-4">At Lavanya Ceramics we are fascinated by the possibility of being able to represent an idea with our own hands. The origin of each piece is born in our imagination as well as from the desire to listen to the demands of a constantly evolving market where creativity is an essential pillar.</p>
                        <p className="text-gray-700 leading-relaxed">Once the idea is defined, the design team values materials, aesthetics and functionality and as of that moment, the manufacturing process begins with the fusion of old techniques together with innovative processes all based on manual work and care for detail.</p>
                    </div>

                    <div>
                        <img src="/images/craftmanship/craftmanship-01.jpg" alt="Giving form" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                </section>

                <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <img src="/images/craftmanship/craftmanship_02.jpg" alt="Materials" className="w-full h-72 object-cover rounded-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">NOBLE MATERIALS</h3>
                        <p className="text-gray-700 leading-relaxed mb-3">Porcelain is composed by the raw materials kaolin, feldspar and quartz. It has a high level of resistance and high density, as it is fired at 1400°C. Porcelain, stoneware and earthenware are very similar materials, and there is even a tendency for them to be confused.</p>
                        <p className="text-gray-700 leading-relaxed">While porcelain is an impermeable material, stoneware and earthenware contain silica and clay in their composition and they easily absorb some elements to which they are exposed. Porcelain composition go through much more demanding qualitative selection criteria regarding consistency of the technical characteristics and the absence of contaminants. This unique characteristics make porcelain a pure material suitable for any event.</p>
                    </div>
                </section>

                <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">HANDMADE PROCESS</h3>
                        <p className="text-gray-700 leading-relaxed mb-3">Our designers and modellers work together in close cooperation to construct the models. Once they have been shaped to satisfaction, they are used to make the master moulds that will be used to turn to make the negative casting moulds. After that, the items are shaped in porcelain or glass and the manufacturing process begins.</p>
                        <p className="text-gray-700 leading-relaxed">All our fine porcelain and glass creations are crafted, fired and polished by hand with an emphasis on detail and quality.</p>
                    </div>
                    <div>
                        <img src="/images/craftmanship/craftmanship_03.jpg" alt="Handmade" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                </section>

                <section className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div>
                        <img src="/images/craftmanship/craftmanship_04.jpg" alt="Finishing" className="w-full h-48 object-cover rounded-lg" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">FINISHING</h3>
                        <p className="text-gray-700 leading-relaxed">In the porcelain manufacturing process, the biscuit fired pieces are glazed. The glaze is a mixture of quartz, feldspar, kaolin and a high proportion of different firing agents. Because of its high content of quartz, it produces a very hard surface when fired. The glaze melts when fired and fuses with the body before its pores close, creating an inseparable bond between the porcelain body and glaze.</p>
                        <p className="text-gray-700 leading-relaxed">The glaze can be glossy or matte, that is both rough and refined. One of the features that most differentiate Lavanya products is the combination of gloss and matt in the same piece. In that case, the matt area is called biscuit porcelain. It still has a non-porous surface and offers an extraordinary light contrast when combined with glossy glaze in the same piece as it is shown in the picture below.</p>
                    </div>
                </section>

                <section className="py-12">
                    <div className="aspect-w-16 aspect-h-9">
                            <iframe
                                className="w-full h-96 rounded-lg"
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
