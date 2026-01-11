
import Link from 'next/link';
import { Facebook, Twitter, Instagram } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-white">CouponPro</h3>
                    <p className="text-sm text-slate-400">
                        Your ultimate destination for the best deals, discounts, and exclusive coupons from top brands.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-white font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/stores" className="hover:text-blue-400 transition-colors">Browse Stores</Link></li>
                        <li><Link href="/categories" className="hover:text-blue-400 transition-colors">Categories</Link></li>
                        <li><Link href="/new-arrivals" className="hover:text-blue-400 transition-colors">New Arrivals</Link></li>
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-white font-bold mb-4">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link></li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="text-white font-bold mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-blue-400 transition-colors"><Facebook size={20} /></a>
                        <a href="#" className="hover:text-blue-400 transition-colors"><Twitter size={20} /></a>
                        <a href="#" className="hover:text-blue-400 transition-colors"><Instagram size={20} /></a>
                    </div>
                    <p className="mt-6 text-xs text-slate-500">
                        &copy; {new Date().getFullYear()} CouponPro. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
