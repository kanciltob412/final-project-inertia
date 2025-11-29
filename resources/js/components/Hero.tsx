function Hero({ title, description, image }: { title: string; description: string; image: string }) {
    return (
        <div className="relative h-[60vh] overflow-hidden">
            <img className="absolute h-full w-full object-cover" style={{ filter: 'brightness(0.5)' }} src={image}></img>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="max-w-3xl px-4 text-center text-white">
                    <h1 className="mb-6 text-6xl font-bold">{title}</h1>
                    <p className="mb-8 text-xl opacity-90">{description}</p>
                </div>
            </div>
        </div>
    );
}

export default Hero;
