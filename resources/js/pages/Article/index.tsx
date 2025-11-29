import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Article, BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { ArticleDataTable } from './ArticleDataTable';
import { columns } from './column';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Articles',
        href: '/admin/articles',
    },
];

interface Props {
    data: Article[];
}

export default function Index({ data }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Articles" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall title="Articles" description="Manage your articles here" />
                    <Button asChild>
                        <Link href="/admin/articles/create">
                            <Plus className="size-4" />
                            Create Article
                        </Link>
                    </Button>
                </div>

                <ArticleDataTable columns={columns} data={data} />
            </div>
        </AppLayout>
    );
}
