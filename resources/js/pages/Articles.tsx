import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Link, router } from '@inertiajs/react';
import { Calendar, ChevronRight, Clock, ChevronLeft } from 'lucide-react';
import { Article } from '@/types/types';

interface PaginatedArticles {
    data: Article[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    featured_article?: Article;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface ArticlesProps {
    articles: PaginatedArticles;
}

export default function Articles({ articles }: ArticlesProps) {
    const featuredArticle = articles.featured_article;
    const regularArticles = articles.data; // All articles in data are already regular (non-featured)

    const handlePreviousPage = () => {
        if (articles.current_page > 1) {
            router.visit(`/articles?page=${articles.current_page - 1}`);
        }
    };

    const handleNextPage = () => {
        if (articles.current_page < articles.last_page) {
            router.visit(`/articles?page=${articles.current_page + 1}`);
        }
    };

    const handlePageClick = (page: number) => {
        router.visit(`/articles?page=${page}`);
    };

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, articles.current_page - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(articles.last_page, startPage + maxVisiblePages - 1);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        return pages;
    };

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
                                <Link 
                                    href={`/articles/${featuredArticle.id}`}
                                    className="relative h-[400px] md:h-auto block hover:opacity-90 transition-opacity"
                                >
                                    <img
                                        src={
                                            featuredArticle.featured_image?.startsWith('http') 
                                                ? featuredArticle.featured_image 
                                                : featuredArticle.featured_image 
                                                    ? `/storage/${featuredArticle.featured_image}` 
                                                    : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'
                                        }
                                        alt={featuredArticle.title}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </Link>
                                <div className="flex flex-col justify-between p-8">
                                    <div>
                                        <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {new Date(featuredArticle.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {featuredArticle.reading_time ? `${featuredArticle.reading_time} min read` : '5 min read'}
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/articles/${featuredArticle.id}`}
                                            className="block mb-4"
                                        >
                                            <h3 className="text-3xl font-bold hover:text-gray-600 transition-colors">{featuredArticle.title}</h3>
                                        </Link>
                                        <p className="mb-4 text-gray-600">{featuredArticle.excerpt}</p>
                                        <p className="text-gray-500">By {featuredArticle.author_name || 'Admin'}</p>
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
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 mb-8">
                            {regularArticles.map((article) => (
                                <div key={article.id} className="group overflow-hidden rounded-lg bg-white shadow-md">
                                    <Link 
                                        href={`/articles/${article.id}`}
                                        className="relative h-48 overflow-hidden block"
                                    >
                                        <img
                                            src={
                                                article.featured_image?.startsWith('http') 
                                                    ? article.featured_image 
                                                    : article.featured_image 
                                                        ? `/storage/${article.featured_image}` 
                                                        : 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500'
                                            }
                                            alt={article.title}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </Link>
                                    <div className="p-6">
                                        <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Calendar className="mr-2 h-4 w-4" />
                                                {new Date(article.created_at).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {article.reading_time ? `${article.reading_time} min read` : '5 min read'}
                                            </div>
                                        </div>
                                        <Link 
                                            href={`/articles/${article.id}`}
                                            className="block mb-3"
                                        >
                                            <h3 className="text-xl font-bold transition-colors hover:text-gray-600">{article.title}</h3>
                                        </Link>
                                        <p className="mb-4 line-clamp-2 text-gray-600">{article.excerpt}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">By {article.author_name || 'Admin'}</span>
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

                        {/* Pagination */}
                        <div className="flex flex-col items-center space-y-4 mt-12">
                            {/* Page Info */}
                            <div className="text-sm text-gray-600">
                                Page {articles.current_page} of {articles.last_page} | {articles.total} total articles
                            </div>
                            
                            {articles.last_page > 1 && (
                                <div className="flex justify-center items-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={articles.current_page === 1}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex space-x-1">
                                        {getPageNumbers().map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageClick(page)}
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                    page === articles.current_page
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Next Button */}
                                    <button
                                        onClick={handleNextPage}
                                        disabled={articles.current_page === articles.last_page}
                                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer></Footer>
        </div>
    );
}
