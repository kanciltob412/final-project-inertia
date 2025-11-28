import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Share2, Twitter } from 'lucide-react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { Article } from '@/types/types';

interface ArticleDetailProps {
    article: Article;
    [key: string]: unknown;
}

export default function ArticleDetail() {
    const { props } = usePage<ArticleDetailProps>();
    const { article } = props;

    if (!article) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h2 className="mb-4 text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Article not found</h2>
                <Link href="/articles" className="inline-flex items-center gap-2 text-black hover:underline">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Articles
                </Link>
            </div>
        );
    }

    return (
        <div>
            <Navbar forceBlack={true} />
            <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8 py-8 md:py-12 lg:py-16 text-black">
                <button onClick={() => router.visit('/articles')} className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-black">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Articles
                </button>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <img
                            src={
                                article.featured_image?.startsWith('http')
                                    ? article.featured_image
                                    : article.featured_image
                                        ? `/storage/${article.featured_image}`
                                        : 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'
                            }
                            alt={article.title}
                            className="mb-8 h-[400px] w-full rounded-xl object-cover"
                        />

                        <div className="mb-6 flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(article.created_at).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {article.reading_time ? `${article.reading_time} min read` : '5 min read'}
                            </div>
                        </div>

                        <h1 className="mb-6 text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">{article.title}</h1>

                        {/* AMAN: kalau content undefined → pakai string kosong */}
                        {typeof article.content === 'string' && article.content.trim().length > 0 ? (
                            <div className="ck-content" dangerouslySetInnerHTML={{ __html: article.content }} />
                        ) : null}

                        {/* Share Section */}
                        <div className="mt-12 border-t border-gray-200 pt-8">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 font-semibold">
                                    <Share2 className="h-5 w-5" />
                                    Share this article
                                </span>
                                <div className="flex gap-4">
                                    <button
                                        className="rounded-full p-2 hover:bg-gray-100"
                                        onClick={() => window.open('https://facebook.com', '_blank')}
                                    >
                                        <Facebook className="h-5 w-5" />
                                    </button>
                                    <button
                                        className="rounded-full p-2 hover:bg-gray-100"
                                        onClick={() => window.open('https://twitter.com', '_blank')}
                                    >
                                        <Twitter className="h-5 w-5" />
                                    </button>
                                    <button
                                        className="rounded-full p-2 hover:bg-gray-100"
                                        onClick={() => window.open('https://www.linkedin.com', '_blank')}
                                    >
                                        <Linkedin className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h2 className="mb-6 text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">Article Information</h2>

                            <div className="rounded-lg bg-gray-50 p-6">
                                <h3 className="mb-4 font-semibold">Category</h3>
                                <Link
                                    href={`/articles?category=${encodeURIComponent(article.category || 'General')}`}
                                    className="inline-block text-gray-600 hover:text-black hover:underline mb-4 transition-colors"
                                >
                                    {article.category || 'General'}
                                </Link>

                                {article.tags && (
                                    <>
                                        <h3 className="mb-4 font-semibold">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.split(',').map((tag, index) => (
                                                <Link
                                                    key={index}
                                                    href={`/articles?tag=${encodeURIComponent(tag.trim())}`}
                                                    className="rounded-full bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300 transition-colors cursor-pointer"
                                                >
                                                    {tag.trim()}
                                                </Link>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>                            {/* Author Info */}
                            {article.author_name && (
                                <div className="mt-12 rounded-xl bg-gray-50 p-6">
                                    <div className="mb-4 flex items-center gap-4">
                                        <img
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                                            alt={article.author_name}
                                            className="h-16 w-16 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{article.author_name}</h3>
                                            <p className="text-sm text-gray-600">Author</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">Thank you for reading this article.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
