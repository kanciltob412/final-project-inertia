import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { CategoryDataTable } from './CategoryDataTable';
import { columns } from './column';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

interface Props {
    data: Category[];
}

export default function Index({ data }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories List" />

            <div className="space-y-6 p-6">
                <div className="mb-8 flex items-center justify-between">
                    <HeadingSmall title="Categories List" description="Manage your categories here" />
                    <Button asChild className="relative z-10 cursor-pointer">
                        <Link href="/admin/categories/create">
                            <Plus className="size-4" />
                            Create Category
                        </Link>
                    </Button>
                </div>

                <CategoryDataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
