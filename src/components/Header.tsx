
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { verifySession } from '@/lib/session';
import { MobileMenu } from './MobileMenu';

export async function Header() {
    const session = await verifySession();

    return (
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-violet-600 text-white p-1.5 rounded-lg">
                        <span className="font-bold text-lg">CP</span>
                    </div>
                    <span className="font-bold text-xl text-slate-800 hidden sm:block">CouponPro</span>
                </Link>

                {/* Search Bar - Hidden on mobile, visible on md+ */}
                <div className="hidden md:flex flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search for stores and brands..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-light"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    <Link href="/categories" className="text-slate-600 hover:text-blue-600 font-medium text-sm hidden sm:block transition-colors">
                        Categories
                    </Link>
                    <Link href="/stores" className="text-slate-600 hover:text-blue-600 font-medium text-sm hidden sm:block transition-colors">
                        Stores
                    </Link>

                    {session.isAuth ? (
                        <Link href="/admin" className="hidden sm:flex items-center gap-2 text-slate-700 hover:text-violet-600 font-medium">
                            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                                <User size={16} />
                            </div>
                            <span className="hidden lg:block text-sm">Account</span>
                        </Link>
                    ) : (
                        <div className="hidden sm:flex items-center gap-3">
                            <Link href="/login" className="text-slate-600 hover:text-violet-600 font-medium text-sm">
                                Log in
                            </Link>
                            <Link href="/signup" className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-violet-200">
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
