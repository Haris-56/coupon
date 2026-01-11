
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, Search, ChevronRight, User, Facebook, Twitter, Youtube, Linkedin, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

interface MobileMenuProps {
    isAuth: boolean;
    role?: string | null;
}

export function MobileMenu({ isAuth, role }: MobileMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.width = 'auto';
        };
    }, [isOpen]);

    const sidebarContent = (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-[9998] transition-opacity backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Panel - Portal ensures this is top-level */}
            <div
                className={cn(
                    "fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                {/* Header / Logo Section */}
                <div className="p-6 flex flex-col items-center border-b border-slate-100 relative">
                    {/* Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
                    >
                        <X size={20} />
                    </button>

                    {/* Logo */}
                    <Link href="/" onClick={() => setIsOpen(false)} className="flex flex-col items-center gap-2 mb-6 mt-4">
                        <div className="bg-violet-600 text-white p-3 rounded-2xl shadow-violet-200 shadow-lg">
                            <span className="font-bold text-2xl">CP</span>
                        </div>
                        <div className="text-center">
                            <span className="font-extrabold text-xl text-slate-800 block leading-none">CouponPro</span>
                            <span className="text-xs text-slate-500 font-medium tracking-wider uppercase">Hub</span>
                        </div>
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="p-6 border-b border-slate-100">
                    {isAuth ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 truncate">Admin</p>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsOpen(false)}
                                    className="text-xs text-slate-400 hover:text-violet-600 transition-colors flex items-center gap-1"
                                >
                                    View Profile <ChevronRight size={10} />
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <Link href="/login" onClick={() => setIsOpen(false)} className="w-full py-2.5 px-4 bg-slate-100 text-slate-700 font-bold rounded-lg text-center hover:bg-slate-200 transition-colors">
                                Log In
                            </Link>
                            <Link href="/signup" onClick={() => setIsOpen(false)} className="w-full py-2.5 px-4 bg-violet-600 text-white font-bold rounded-lg text-center hover:bg-violet-700 transition-colors shadow-md shadow-violet-200">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-6 space-y-2">
                    {[
                        { label: 'Search', href: '/search', icon: Search },
                        { label: 'Categories', href: '/categories', icon: null },
                        { label: 'Stores', href: '/stores', icon: null },
                        { label: 'Home', href: '/', icon: null },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-slate-700 hover:bg-slate-50 transition-all group",
                                pathname === item.href && "bg-violet-50 text-violet-600"
                            )}
                        >
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-violet-400 transition-colors",
                                pathname === item.href && "bg-violet-600"
                            )}></span>

                            <span className="text-lg">{item.label}</span>
                        </Link>
                    ))}

                    {isAuth && (
                        <button
                            onClick={async () => {
                                await logout();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold text-red-600 hover:bg-red-50 transition-all group mt-4"
                        >
                            <LogOut size={18} />
                            <span>Log Out</span>
                        </button>
                    )}
                </nav>

                {/* Footer / Socials */}
                <div className="p-6 border-t border-slate-100 mt-auto">
                    <div className="flex items-center justify-center gap-4">
                        {[
                            { Icon: Facebook, href: '#' },
                            { Icon: Twitter, href: '#' },
                            { Icon: Youtube, href: '#' },
                            { Icon: Linkedin, href: '#' },
                        ].map(({ Icon, href }, idx) => (
                            <Link
                                key={idx}
                                href={href}
                                className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center text-slate-400 hover:text-violet-600 hover:border-violet-200 hover:bg-violet-50 transition-all"
                            >
                                <Icon size={18} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );

    if (!mounted) {
        return (
            <button
                className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Open Menu Placeholder"
            >
                <Menu size={24} />
            </button>
        );
    }

    return (
        <div className="md:hidden">
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                aria-label="Open Menu"
            >
                <Menu size={24} />
            </button>
            {createPortal(sidebarContent, document.body)}
        </div>
    );
}
