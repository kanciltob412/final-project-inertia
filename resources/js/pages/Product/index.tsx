import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import products from '../../routes/products';
import { columns } from './column';
import { ProductDataTable } from './ProductDataTable';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/admin/products',
    },
];

interface Props {
    data: Product[];
}

export default function Index({ data }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products List" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall title="Products List" description="Manage your products here" />
                    <Button asChild>
                        <Link href={products.create().url}>
                            <Plus className="size-4" />
                            Create Product
                        </Link>
                    </Button>
                </div>

                <ProductDataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
