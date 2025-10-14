export type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    category: string;
};

export type Article = {
    id: number;
    title: string;
    excerpt: string;
    content: string;
    image: string;
    date: string;
    author: string;
    readTime: string;
    featured: boolean;
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
    initial: {};
    whileInView?: {
        transition: {
            staggerChildren: number;
        };
    };
    viewport?: { once: true };
};
