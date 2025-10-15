import { Link } from '@inertiajs/react';

export default function CraftsmanshipSection() {
  return (
    <section className="w-full bg-gray-100 py-16">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row gap-8 items-center">
        {/* Left: Images */}
        <div className="flex-1 flex gap-4">
          <img
            src="/craft-1.jpg"
            alt="Crafting detail 1"
            className="w-1/2 object-cover rounded-md h-64"
            style={{ minWidth: '0' }}
          />
          <img
            src="/craft-2.jpg"
            alt="Crafting detail 2"
            className="w-1/2 object-cover rounded-md h-64"
            style={{ minWidth: '0' }}
          />
        </div>
        {/* Right: Text */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-5xl font-light mb-8">CRAFTMANSHIP</h2>
          <p className="mb-8 text-lg text-gray-700 max-w-xl mx-auto md:mx-0">
            Each piece is unique due to its traditional manufacturing process being able to appreciate light singularities in shape and texture.
          </p>
          <Link href="/craftsmanship" className="inline-block border-2 border-black px-8 py-3 text-lg text-black hover:bg-black hover:text-white transition-colors">
            SEE MORE
          </Link>
        </div>
      </div>
    </section>
  );
}
