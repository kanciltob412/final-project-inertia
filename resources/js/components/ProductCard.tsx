import { Product } from '@/types';
import { formatPrice } from '@/utils/helper';
import { Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';

export default function ProductCard({ product, viewMode = 'grid' }: { product: Product; viewMode?: 'grid' | 'list' }) {
    if (viewMode === 'list') {
        return (
            <div className="overflow-hidden rounded-lg bg-white shadow-md">
                <div className="flex">
                    <div className="relative h-48 w-48 overflow-hidden">
                        <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                            <h3 className="mb-2 text-xl font-semibold text-black">{product.name}</h3>
                            <p className="mb-4 text-gray-600">{formatPrice(product.price)}</p>
                            <p className="text-gray-500">{product.description}</p>
                        </div>
                        <Link
                            href={`/products/${product.id}`}
                            className="inline-flex w-fit items-center gap-2 rounded-md bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800"
                        >
                            <Eye className="h-4 w-4" />
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group overflow-hidden rounded-lg bg-white shadow-md">
            <div className="relative overflow-hidden">
                <img
                    src={`/storage/${product.image}`}
                    alt={product.name}
                    className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                        href={`/products/${product.id}`}
                        className="flex items-center gap-2 rounded-md bg-white px-6 py-2 text-black hover:bg-gray-100 transition-colors duration-200"
                    >
                        <Eye className="h-4 w-4" />
                        View Details
                    </Link>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-black">
                    <Link
                        href={`/products/${product.id}`}
                        className="hover:text-gray-600 transition-colors duration-200"
                    >
                        {product.name}
                    </Link>
                </h3>
                <p className="mt-1 text-gray-600">{formatPrice(product.price)}</p>
                <p className="mt-2 text-sm text-gray-500">{product.description}</p>
            </div>
        </div>
    );
}
