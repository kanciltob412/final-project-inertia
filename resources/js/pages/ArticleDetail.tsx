import { Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, Facebook, Linkedin, Share2, Twitter } from 'lucide-react';
import { useMemo } from 'react';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { articles } from '../data/products';

type Article = {
    id: number;
    title: string;
    image: string;
    date: string | number | Date;
    readTime: string;
    author: string;
    content?: string; // jadikan opsional biar aman
};

type PageProps = {
    id?: number; // dikirim dari server
    article?: Article; // atau server langsung kirim object
};

export default function ArticleDetail() {
    const { props } = usePage<PageProps>();

    // Ambil ID dari props server ATAU pakai article dari props
    const articleId: number | undefined =
        (typeof props.id === 'number' ? props.id : undefined) ?? (typeof props.article?.id === 'number' ? props.article.id : undefined);

    // Tentukan artikel: prioritas dari props.article, fallback cari di array lokal berdasarkan id
    const article: Article | undefined = useMemo(() => {
        if (props.article) return props.article;
        if (typeof articleId === 'number') return (articles as Article[]).find((a) => a.id === articleId);
        return undefined;
    }, [props.article, articleId]);

    // Related articles (ambil selain id ini)
    const relatedArticles: Article[] = useMemo(() => {
        const list = articles as Article[];
        if (typeof articleId !== 'number') return list.slice(0, 3);
        return list.filter((a) => a.id !== articleId).slice(0, 3);
    }, [articleId]);

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
            <Navbar />
            <div className="mx-auto max-w-7xl px-4 py-16 text-black">
                <button onClick={() => router.visit('/articles')} className="mb-8 inline-flex items-center gap-2 text-gray-600 hover:text-black">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Articles
                </button>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <img src={article.image} alt={article.title} className="mb-8 h-[400px] w-full rounded-xl object-cover" />

                        <div className="mb-6 flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {new Date(article.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {article.readTime}
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
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h2 className="mb-6 text-2xl font-bold">Related Articles</h2>

                            <div className="space-y-6">
                                {relatedArticles.map((related) => (
                                    <div key={related.id} className="group">
                                        <Link href={`/articles/${related.id}`} className="flex gap-4">
                                            <div className="h-24 w-24 overflow-hidden rounded-lg">
                                                <img
                                                    src={related.image}
                                                    alt={related.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="mb-2 font-semibold transition-colors group-hover:text-gray-600">{related.title}</h3>
                                                <div className="flex items-center gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(related.date).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {related.readTime}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>

                            {/* Author Info */}
                            <div className="mt-12 rounded-xl bg-gray-50 p-6">
                                <div className="mb-4 flex items-center gap-4">
                                    <img
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
                                        alt={article.author}
                                        className="h-16 w-16 rounded-full object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{article.author}</h3>
                                        <p className="text-sm text-gray-600">Fashion Writer</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">A passionate fashion writer with over 10 years of experience in the industry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
