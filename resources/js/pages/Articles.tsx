import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link } from '@inertiajs/react';
import { Calendar, ChevronRight, Clock } from 'lucide-react';
import { articles } from '../data/products';

export default function Articles() {
    const featuredArticle = articles.find((article) => article.featured);
    const regularArticles = articles.filter((article) => !article.featured);

    return (
        <div>
            <Navbar></Navbar>{' '}
            <div>
                {/* Banner (matching About/Craftsmanship/Contact/Products/ProductDetail) */}
                <div className="relative h-[400px] md:h-[420px] overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1200"
                        alt="Articles banner"
                        className="absolute w-full h-full object-cover"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="max-w-6xl w-full mx-auto px-4 transform translate-y-12 md:translate-y-16 text-white">
                            <h1 className="text-4xl md:text-5xl font-semibold uppercase tracking-wide">ARTICLES</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-16">
                    {/* Featured Article */}
                    {featuredArticle && (
                        <div className="mb-16">
                            <h2 className="mb-6 text-2xl font-semibold">Featured Article</h2>
                            <div className="grid gap-8 overflow-hidden rounded-lg bg-white shadow-lg md:grid-cols-2">
                                <div className="relative h-[400px] md:h-auto">
                                    <img
                                        src={featuredArticle.image}
                                        alt={featuredArticle.title}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col justify-between p-8">
                                    <div>
                                        <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {new Date(featuredArticle.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {featuredArticle.readTime}
                                            </div>
                                        </div>
                                        <h3 className="mb-4 text-3xl font-bold">{featuredArticle.title}</h3>
                                        <p className="mb-4 text-gray-600">{featuredArticle.excerpt}</p>
                                        <p className="text-gray-500">By {featuredArticle.author}</p>
                                    </div>
                                    <Link
                                        href={`/articles/${featuredArticle.id}`}
                                        className="mt-6 inline-flex items-center font-semibold text-black hover:underline"
                                    >
                                        Read Article
                                        <ChevronRight className="ml-1 h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Regular Articles Grid */}
                    <div>
                        <h2 className="mb-6 text-2xl font-semibold">Latest Articles</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {regularArticles.slice(0, 6).map((article) => (
                                <div key={article.id} className="group overflow-hidden rounded-lg bg-white shadow-md">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {new Date(article.date).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {article.readTime}
                                            </div>
                                        </div>
                                        <h3 className="mb-3 text-xl font-bold transition-colors group-hover:text-gray-600">{article.title}</h3>
                                        <p className="mb-4 line-clamp-2 text-gray-600">{article.excerpt}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">By {article.author}</span>
                                            <Link
                                                href={`/articles/${article.id}`}
                                                className="inline-flex items-center font-semibold text-black hover:underline"
                                            >
                                                Read More
                                                <ChevronRight className="ml-1 h-4 w-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}
