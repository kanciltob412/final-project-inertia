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
                <h2 className="mb-4 text-2xl font-bold">Article not found</h2>
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
            <div className="mx-auto max-w-7xl px-4 py-16 text-black">
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

                        <h1 className="mb-6 text-4xl font-bold">{article.title}</h1>

                        {/* AMAN: kalau content undefined → pakai string kosong */}
                        {typeof article.content === 'string' && article.content.trim().length > 0 ? (
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        ) : null}

                        {/* Contoh konten tambahan */}
                        <div className="prose prose-lg max-w-none">
                            <p className="mb-6 text-gray-600">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna
                                aliqua.
                            </p>
                            <h2 className="mt-8 mb-4 text-2xl font-bold">The Evolution of Fashion</h2>
                            <p className="mb-6 text-gray-600">
                                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                            </p>
                            <blockquote className="my-8 border-l-4 border-black pl-4 italic">
                                "Fashion is not something that exists in dresses only. Fashion is in the sky, in the street..."
                            </blockquote>
                            <p className="mb-6 text-gray-600">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
                            </p>
                        </div>

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
                            <h2 className="mb-6 text-2xl font-bold">Article Information</h2>
                            
                            <div className="rounded-lg bg-gray-50 p-6">
                                <h3 className="mb-4 font-semibold">Category</h3>
                                <p className="text-gray-600 mb-4">{article.category || 'General'}</p>
                                
                                {article.tags && (
                                    <>
                                        <h3 className="mb-4 font-semibold">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {article.tags.split(',').map((tag, index) => (
                                                <span key={index} className="rounded-full bg-gray-200 px-3 py-1 text-sm">
                                                    {tag.trim()}
                                                </span>
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
