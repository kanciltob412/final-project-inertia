import { Link } from '@inertiajs/react';
import CustomerLayout from '@/layouts/customer-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Calendar } from 'lucide-react';

interface Promo {
    id: number;
    title: string;
    description: string;
    type: string;
    image_url?: string;
    link_url?: string;
    start_date: string;
    end_date?: string;
}

interface Props {
    promos: {
        data: Promo[];
    };
}

export default function MemberPromo({ promos }: Props) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'news':
                return 'bg-blue-100 text-blue-800';
            case 'banner':
                return 'bg-purple-100 text-purple-800';
            case 'promotion':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'news':
                return '📰';
            case 'banner':
                return '🎯';
            case 'promotion':
                return '🎉';
            default:
                return '📌';
        }
    };

    return (
        <CustomerLayout title="Member Promos & News">

            <div className="space-y-6 p-4 md:p-8 max-w-6xl mx-auto">
                {/* Back Link */}
                <Link href="/customer/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors mb-6">
                    <span>←</span>
                    <span>Back to Dashboard</span>
                </Link>

                {/* Header */}
                <div className="rounded-lg bg-linear-to-r from-orange-500 to-red-600 p-8 text-white">
                    <h1 className="flex items-center gap-3 text-4xl font-bold">
                        <Bell className="h-10 w-10" />
                        Member Promos & News
                    </h1>
                    <p className="mt-2 text-orange-100">Exclusive offers and news for our valued members</p>
                </div>

                {/* Filter/Info */}
                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-sm text-blue-900">
                        💡 Stay updated with the latest promotions, news, and exclusive member offers!
                    </p>
                </div>

                {/* Promos Grid */}
                {promos.data && promos.data.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {promos.data.map((promo) => (
                            <Card key={promo.id} className="overflow-hidden transition-shadow hover:shadow-lg">
                                {/* Image */}
                                {promo.image_url && (
                                    <div className="relative h-48 overflow-hidden bg-gray-200">
                                        <img
                                            src={promo.image_url}
                                            alt={promo.title}
                                            className="h-full w-full object-cover"
                                        />
                                        <div className={`absolute right-2 top-2 rounded-full px-3 py-1 text-xs font-semibold ${getTypeColor(promo.type)}`}>
                                            {getTypeIcon(promo.type)} {promo.type.charAt(0).toUpperCase() + promo.type.slice(1)}
                                        </div>
                                    </div>
                                )}

                                {/* Content */}
                                <CardHeader>
                                    <CardTitle className="line-clamp-2 text-lg">{promo.title}</CardTitle>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="line-clamp-3 text-sm text-gray-600">{promo.description}</p>

                                    {/* Date Info */}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <Calendar className="h-4 w-4" />
                                        <span>
                                            From {new Date(promo.start_date).toLocaleDateString()}
                                            {promo.end_date && ` until ${new Date(promo.end_date).toLocaleDateString()}`}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    {promo.link_url && (
                                        <Button asChild className="w-full" size="sm">
                                            <a href={promo.link_url} target="_blank" rel="noopener noreferrer">
                                                Learn More →
                                            </a>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="py-12 text-center">
                            <Bell className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                            <p className="text-gray-500">No active promos or news at the moment.</p>
                            <p className="mt-2 text-sm text-gray-400">Check back soon for exciting offers!</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </CustomerLayout>
    );
}
