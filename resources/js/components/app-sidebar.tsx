import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { Coffee, Banknote, LayoutGrid, NotebookPen, Tag, Mail } from 'lucide-react';
import AppLogo from './app-logo';
import categories from '../routes/categories';
import products from '../routes/products';
import articles from '../routes/articles';
import orders from '../routes/orders';


const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Categories',
        href: categories.index().url,
        icon: Tag,
    },
    {
        title: 'Products',
        href: products.index().url,
        icon: Coffee,
    },
    {
        title: 'Articles',
        href: articles.index().url,
        icon: NotebookPen,
    },
    {
        title: 'Orders',
        href: orders.index().url,
        icon: Banknote,
    },
    {
        title: 'Newsletter',
        href: '/admin/newsletter',
        icon: Mail,
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
