import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Article } from "@/types";
import { Head, router, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import HeadingSmall from "@/components/heading-small";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from "@/components/ImageUpload";
import TiptapEditor from "@/components/TiptapEditor";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Articles",
        href: "/admin/articles",
    },
];

interface Props {
    article?: Article;
    categories?: any[];
}

export default function Form({ article, categories }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm<{
        title: string;
        slug: string;
        seo_keywords: string;
        excerpt: string;
        content: string;
        featured_image: File | null;
        category: string;
        tags: string;
        author_name: string;
        reading_time: number | string;
        is_featured: boolean;
        status: string;
    }>({
        title: article ? article.title : "",
        slug: article ? article.slug : "",
        seo_keywords: article ? article.seo_keywords : "",
        excerpt: article ? article.excerpt : "",
        content: article ? (article.content || "") : "",
        featured_image: null,
        category: article ? article.category : "",
        tags: article ? article.tags : "",
        author_name: article ? article.author_name : "",
        reading_time: article ? article.reading_time : "",
        is_featured: article ? article.is_featured : false,
        status: article ? article.status : "draft",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (article) {
            router.post(`/admin/articles/${article.id}`, {
                ...data,
                _method: "put",
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    router.visit("/admin/articles");
                },
                forceFormData: true,
            });
        } else {
            post("/admin/articles", {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    router.visit("/admin/articles");
                },
                forceFormData: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={article ? "Edit article" : "Create article"} />

            <div className="p-6">
                <HeadingSmall
                    title={`${article ? "Edit" : "Create"} article`}
                    description={`Fill out the form below to ${article ? "edit an existing" : "create a new"} article.`}
                />

                <Separator className="my-8" />

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
                            disabled={processing}
                            placeholder="Article title"
                        />
                        {errors.title && (
                            <p className="text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Slug */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            value={data.slug}
                            onChange={(e) => setData("slug", e.target.value)}
                            disabled={processing}
                            placeholder="article-slug"
                        />
                        {errors.slug && (
                            <p className="text-sm text-red-600">{errors.slug}</p>
                        )}
                    </div>

                    {/* Excerpt */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            value={data.excerpt}
                            onChange={(e) => setData("excerpt", e.target.value)}
                            disabled={processing}
                            placeholder="Brief summary of the article..."
                            rows={3}
                        />
                        {errors.excerpt && (
                            <p className="text-sm text-red-600">{errors.excerpt}</p>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="content">Content</Label>
                        <TiptapEditor
                            value={data.content}
                            onChange={(content) => setData("content", content)}
                            disabled={processing}
                            placeholder="Write your article content here..."
                        />
                        {errors.content && (
                            <p className="text-sm text-red-600">{errors.content}</p>
                        )}
                    </div>

                    {/* Featured Image */}
                    <ImageUpload
                        id="featured_image"
                        label="Featured Image"
                        value={data.featured_image}
                        onChange={(file) => setData("featured_image", file)}
                        disabled={processing}
                        currentImage={article?.featured_image}
                        currentImageAlt={article?.title || "Article featured image"}
                        error={errors.featured_image}
                        maxSize={2}
                    />

                    {/* Category */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={data.category}
                            onChange={(e) => setData("category", e.target.value)}
                            disabled={processing}
                            placeholder="Article category"
                        />
                        {errors.category && (
                            <p className="text-sm text-red-600">{errors.category}</p>
                        )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                            id="tags"
                            value={data.tags}
                            onChange={(e) => setData("tags", e.target.value)}
                            disabled={processing}
                            placeholder="comma, separated, tags"
                        />
                        {errors.tags && (
                            <p className="text-sm text-red-600">{errors.tags}</p>
                        )}
                    </div>

                    {/* Author Name */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="author_name">Author Name</Label>
                        <Input
                            id="author_name"
                            value={data.author_name}
                            onChange={(e) => setData("author_name", e.target.value)}
                            disabled={processing}
                            placeholder="Author name"
                        />
                        {errors.author_name && (
                            <p className="text-sm text-red-600">{errors.author_name}</p>
                        )}
                    </div>

                    {/* Reading Time */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="reading_time">Reading Time (minutes)</Label>
                        <Input
                            id="reading_time"
                            type="number"
                            value={data.reading_time}
                            onChange={(e) => setData("reading_time", parseInt(e.target.value) || 0)}
                            disabled={processing}
                            placeholder="5"
                        />
                        {errors.reading_time && (
                            <p className="text-sm text-red-600">{errors.reading_time}</p>
                        )}
                    </div>

                    {/* SEO Keywords */}
                    <div className="flex flex-col gap-y-2">
                        <Label htmlFor="seo_keywords">SEO Keywords</Label>
                        <Input
                            id="seo_keywords"
                            value={data.seo_keywords}
                            onChange={(e) => setData("seo_keywords", e.target.value)}
                            disabled={processing}
                            placeholder="seo, keywords, for, search"
                        />
                        {errors.seo_keywords && (
                            <p className="text-sm text-red-600">{errors.seo_keywords}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Featured */}
                        <div className="flex flex-col gap-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onChange={(e) => setData("is_featured", e.target.checked)}
                                    disabled={processing}
                                    className="h-4 w-4"
                                />
                                <Label htmlFor="is_featured">Featured Article</Label>
                            </div>
                            {errors.is_featured && (
                                <p className="text-sm text-red-600">{errors.is_featured}</p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="flex flex-col gap-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) => setData("status", value)}
                                disabled={processing}
                            >
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? "Saving..." : (article ? "Update Article" : "Create Article")}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}