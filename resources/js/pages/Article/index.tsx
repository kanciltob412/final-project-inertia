import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Article } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { columns } from "./column";
import HeadingSmall from "@/components/heading-small";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Articles',
        href: '/admin/articles',
    },
];

interface Props {
    data: Article[]
}

export default function Index({ data }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Articles" />

            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title="Articles"
                        description="Manage your articles here"
                    />
                    <Button asChild>
                        <Link href="/admin/articles/create">
                            <Plus className="size-4" />
                            Create Article
                        </Link>
                    </Button>
                </div>

                <DataTable columns={columns} data={data} />
            </div>

        </AppLayout>
    );
}