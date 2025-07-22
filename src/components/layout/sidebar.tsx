'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import {
  Home,
  Hand,
  Gem,
  Sparkles,
  Newspaper,
  User,
  Shield,
  Star,
  HeartHandshake,
  Bot,
  Smartphone,
  BookOpen,
  CalendarDays,
  Smile,
  LogOut,
  LogIn
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/FirebaseContext';
import { Button } from '../ui/button';

const menuItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/palm-reading', icon: Hand, label: 'Palm Reading' },
  { href: '/face-reading', icon: Smile, label: 'Face Reading' },
  { href: '/numerology', icon: Gem, label: 'Numerology' },
  { href: '/horoscope', icon: Sparkles, label: 'Daily Horoscope' },
  { href: '/panchang', icon: CalendarDays, label: 'Daily Panchang' },
  { href: '/janam-kundli', icon: Star, label: 'Janam Kundli' },
  { href: '/kundli-matching', icon: HeartHandshake, label: 'Kundli Matching' },
  { href: '/mobile-numerology', icon: Smartphone, label: 'Mobile Numerology' },
  { href: '/tarot-reading', icon: BookOpen, label: 'Tarot Reading' },
  { href: '/chat', icon: Bot, label: 'AI Chat' },
  { href: '/blog', icon: Newspaper, label: 'Blog' },
];

const adminItems = [
    { href: '/admin', icon: Shield, label: 'Admin Panel' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOutUser } = useAuth();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };
  
  const handleSignOut = async () => {
    await signOutUser();
    router.push('/login');
  }

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
                    <Link href={item.href}>
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
                    <Link href={item.href}>
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
                <div className="flex flex-col group-data-[collapsible=icon]:hidden flex-1">
                    <span className="font-semibold text-sm truncate">{user ? user.email : 'Guest User'}</span>
                    <span className="text-xs text-sidebar-foreground/70">
                        {user ? 'Logged In' : 'Login for premium'}
                    </span>
                </div>
                {user ? (
                    <Button variant="ghost" size="icon" onClick={handleSignOut} className="group-data-[collapsible=icon]:hidden h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                        <LogOut className="h-4 w-4" />
                    </Button>
                ) : (
                     <Button variant="ghost" size="icon" onClick={() => router.push('/login')} className="group-data-[collapsible=icon]:hidden h-8 w-8 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent">
                        <LogIn className="h-4 w-4" />
                    </Button>
                )}
            </div>
        </SidebarFooter>
    </Sidebar>
  );
}
