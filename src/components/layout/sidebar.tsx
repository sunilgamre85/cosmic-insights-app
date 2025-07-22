'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  Home,
  Hand,
  Gem,
  Sparkles,
  Newspaper,
  User,
  Settings,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/palm-reading', icon: Hand, label: 'Palm Reading' },
  { href: '/numerology', icon: Gem, label: 'Numerology' },
  { href: '/horoscope', icon: Sparkles, label: 'Daily Horoscope' },
  { href: '/blog', icon: Newspaper, label: 'Blog' },
];

const adminItems = [
    { href: '/admin', icon: Shield, label: 'Admin Panel' },
];

export function AppSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 md:border-r">
        <SidebarContent className="p-2">
            <SidebarHeader className="p-2 pb-4">
                <Link href="/" className="flex items-center gap-2">
                    <Gem className="w-8 h-8 text-accent" />
                    <span className="font-headline text-xl font-bold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                        Cosmic Insights
                    </span>
                </Link>
            </SidebarHeader>

            <SidebarMenu className="flex-1">
                {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton
                            isActive={isActive(item.href)}
                            tooltip={{
                                children: item.label,
                                className: 'bg-sidebar text-sidebar-foreground border-sidebar-border',
                            }}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>
            
            <SidebarMenu>
                 {adminItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <Link href={item.href} legacyBehavior passHref>
                        <SidebarMenuButton
                            isActive={isActive(item.href)}
                            tooltip={{
                                children: item.label,
                                className: 'bg-sidebar text-sidebar-foreground border-sidebar-border',
                            }}
                        >
                            <item.icon />
                            <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
                ))}
            </SidebarMenu>

        </SidebarContent>
        <SidebarFooter className="p-2">
            <div className="flex items-center gap-2 p-2 rounded-md bg-sidebar-accent/20">
                <User className="w-8 h-8" />
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sm">Guest User</span>
                    <span className="text-xs text-sidebar-foreground/70">Login for premium</span>
                </div>
            </div>
        </SidebarFooter>
    </Sidebar>
  );
}
