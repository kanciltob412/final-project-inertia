export type Product = {
    id: number;
    name: string;
    category_id: number;
    description: string;
    price: number;
    stock: number;
    color: string;
    image: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
    category?: {
        id: number;
        name: string;
    };
};

export type Article = {
    id: number;
    title: string;
    slug: string;
    seo_keywords?: string;
    excerpt?: string;
    content: string;
    featured_image?: string;
    category?: string;
    tags?: string;
    author_name?: string;
    reading_time?: number;
    is_featured: boolean;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
};
export type Animation = {
    initial: { opacity: number; y?: number; x?: number; scale?: number };
    whileInView?: { opacity: number; y?: number; x?: number; scale?: number };
    viewport?: { once: true };
    transition: { duration?: number; ease?: string };
    animate?: { opacity: number; y?: number; x?: number };
    exit?: { opacity: number; y?: number; x?: number };
};

export type AnimationContainer = {
    initial: object;
    whileInView?: {
        transition: {
            staggerChildren: number;
        };
    };
    viewport?: { once: true };
};
