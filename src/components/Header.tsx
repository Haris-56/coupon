
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { verifySession } from '@/lib/session';
import { MobileMenu } from './MobileMenu';
import SearchForm from '@/components/SearchForm';

export async function Header() {
    const session = await verifySession();

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-secondary-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-primary-600 text-white p-1.5 rounded-lg">
                        <span className="font-bold text-lg">CP</span>
                    </div>
                    <span className="font-bold text-xl text-secondary-900 hidden sm:block">CouponPro</span>
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden md:block flex-1 max-w-md">
                    <SearchForm compact />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-secondary-600 hover:text-primary-600 font-medium text-sm hidden sm:block transition-colors">
                        Home
                    </Link>
                    <Link href="/categories" className="text-secondary-600 hover:text-primary-600 font-medium text-sm hidden sm:block transition-colors">
                        Categories
                    </Link>
                    <Link href="/stores" className="text-secondary-600 hover:text-primary-600 font-medium text-sm hidden sm:block transition-colors">
                        Stores
                    </Link>

                    {session.isAuth ? (
                        <Link href="/admin" className="hidden sm:flex items-center gap-2 text-secondary-700 hover:text-primary-600 font-medium">
                            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                                <User size={16} />
                            </div>
                            <span className="hidden lg:block text-sm">Account</span>
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-3">
                            <Link href="/login" className="text-secondary-600 hover:text-primary-600 font-medium text-sm">
                                Log in
                            </Link>
                            <Link href="/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-primary-200">
                                Sign up
                            </Link>
                        </div>
                    )}

                    {/* Mobile Menu */}
                    <MobileMenu isAuth={session.isAuth} role={session.role} />
                </nav>
            </div>
        </header>
    );
}
