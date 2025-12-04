import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Article } from '@/types/types';
import { Link, router } from '@inertiajs/react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

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
    filters?: {
        category?: string;
        tag?: string;
    };
}

export default function Articles({ articles, filters }: ArticlesProps) {
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
                <div className="relative h-[400px] overflow-hidden md:h-[420px]">
                    <img
                        src="https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3?w=1200"
                        alt="Articles banner"
                        className="absolute h-full w-full object-cover"
                        style={{ filter: 'brightness(0.6)' }}
                    />
                    <div className="absolute inset-0 flex items-center">
                        <div className="mx-auto w-full max-w-6xl translate-y-12 transform px-4 text-white md:translate-y-16">
                            <h1 className="text-4xl font-semibold tracking-wide uppercase md:text-5xl lg:text-6xl">ARTICLES</h1>
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
                    {/* Active Filters */}
                    {(filters?.category || filters?.tag) && (
                        <div className="mb-8 flex flex-wrap items-center gap-4">
                            <span className="font-medium text-gray-600">Filtered by:</span>
                            {filters.category && (
                                <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                                    <span>Category: {filters.category}</span>
                                    <Link href="/articles" className="ml-1 hover:text-blue-600" title="Clear category filter">
                                        ×
                                    </Link>
                                </div>
                            )}
                            {filters.tag && (
                                <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                                    <span>Tag: {filters.tag}</span>
                                    <Link
                                        href={filters.category ? `/articles?category=${encodeURIComponent(filters.category)}` : '/articles'}
                                        className="ml-1 hover:text-green-600"
                                        title="Clear tag filter"
                                    >
                                        ×
                                    </Link>
                                </div>
                            )}
                            <Link href="/articles" className="text-sm text-gray-500 underline hover:text-gray-700">
                                Clear all filters
                            </Link>
                        </div>
                    )}

                    {/* Featured Article */}
                    {featuredArticle && (
                        <div className="mb-16">
                            <h2 className="mb-6 text-xl font-semibold text-gray-900 md:text-2xl lg:text-3xl">Featured Article</h2>
                            <div className="grid gap-6 overflow-hidden rounded-lg bg-white shadow-lg md:grid-cols-2" style={{ height: '440px' }}>
                                <Link
                                    href={`/articles/${featuredArticle.id}`}
                                    className="relative block h-32 transition-opacity hover:opacity-90 md:h-full"
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
                                        className="relative inset-0 h-full w-full object-cover"
                                    />
                                </Link>
                                <div className="flex flex-col justify-start p-6 pr-10">
                                    <div className="mb-6">
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
                                        <Link href={`/articles/${featuredArticle.id}`} className="mb-3 block">
                                            <h3 className="text-2xl font-bold transition-colors hover:text-gray-600 md:text-3xl lg:text-4xl">
                                                {featuredArticle.title}
                                            </h3>
                                        </Link>
                                        <p className="mb-3 text-gray-600">{featuredArticle.excerpt}</p>
                                        <p className="text-sm text-gray-500">By {featuredArticle.author_name || 'Admin'}</p>
                                    </div>
                                    <Link
                                        href={`/articles/${featuredArticle.id}`}
                                        className="inline-flex items-center font-semibold text-black hover:underline"
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
                        <h2 className="mb-6 text-xl font-semibold text-gray-900 md:text-2xl lg:text-3xl">Latest Articles</h2>
                        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                            {regularArticles.map((article) => (
                                <div key={article.id} className="group overflow-hidden rounded-lg bg-white shadow-md">
                                    <Link href={`/articles/${article.id}`} className="relative block h-48 overflow-hidden">
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
                                        <Link href={`/articles/${article.id}`} className="mb-3 block">
                                            <h3 className="text-lg font-bold transition-colors hover:text-gray-600 md:text-xl lg:text-2xl">
                                                {article.title}
                                            </h3>
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
                        <div className="mt-12 flex flex-col items-center space-y-4">
                            {/* Page Info */}
                            <div className="text-sm text-gray-600">
                                Page {articles.current_page} of {articles.last_page} | {articles.total} total articles
                            </div>

                            {articles.last_page > 1 && (
                                <div className="flex items-center justify-center space-x-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={articles.current_page === 1}
                                        className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <ChevronLeft className="mr-1 h-4 w-4" />
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    <div className="flex space-x-1">
                                        {getPageNumbers().map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => handlePageClick(page)}
                                                className={`rounded-md px-3 py-2 text-sm font-medium ${page === articles.current_page
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
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
                                        className="flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Next
                                        <ChevronRight className="ml-1 h-4 w-4" />
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
