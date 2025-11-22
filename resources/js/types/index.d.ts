import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    role: 'ADMIN' | 'CUSTOMER';
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface Category {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id?: number;
    product_id?: number;
    sku?: string;
    color: string;
    stock: number;
    image?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
    alt_text?: string;
    sort_order: number;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: number;
    sku: string;
    name: string;
    category_id: number;
    image: string;
    description: string;
    price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    
    // Relation to Category
    category: Category;
    // Relation to Variants
    variants?: ProductVariant[];
    // Relation to Gallery Images
    images?: ProductImage[];
    
    // Legacy fields for backward compatibility (will be removed)
    stock?: number;
    color?: string;
}

export interface Article {
    id: number;
    title: string;  
    slug: string;
    seo_keywords: string;
    excerpt: string;
    content: string;
    featured_image: string;
    category: string;
    tags: string;
    author_name: string;
    reading_time: number;
    is_featured: boolean;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: number;
    user_id: number;
    phone: string;
    address: string;
    city: string;
    country: string;
    postal_code: string;
    status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    url: string;
    total: number;
    payment_method: string;
    payment_channel: string;
    paid_at: string | null;
    courier_name: string | null;
    tracking_number: string | null;
    shipped_at: string | null;
    shipping_cost?: number;
    shipping_courier?: string;
    shipping_service?: string;
    destination_city_id?: number;
    created_at: string;
    updated_at: string;

    
    // Relation to User
    user: User;
    // Relation to Order Items
    items: OrderItem[];

}
export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_variant_id?: number;
    quantity: number;
    price: number;
    created_at: string;
    updated_at: string;
    
    // Relations
    product: Product;
    product_variant?: ProductVariant;
}
