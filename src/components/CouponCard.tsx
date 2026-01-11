
'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface CouponCardProps {
    coupon: any;
    layout?: 'vertical' | 'horizontal';
}

export function CouponCard({ coupon, layout = 'vertical' }: CouponCardProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(coupon.code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (coupon.store?.affiliateLink) {
            window.open(coupon.store.affiliateLink, '_blank');
        }
    };

    if (layout === 'horizontal') {
        return (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-row items-center p-4 gap-4">
                {/* Logo Section */}
                <div className="w-20 h-20 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center">
                    {coupon.imageUrl ? (
                        <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-cover rounded-lg" />
                    ) : coupon.store?.logoUrl ? (
                        <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                        <div className="text-xl font-bold text-slate-400">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                    )}
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0">
                    <div className="flex gap-2 mb-1">
                        {coupon.isExclusive && <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Exclusive</span>}
                        {coupon.isVerified && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Verified</span>}
                    </div>
                    <Link href={`/store/${coupon.store?.slug}`} className="text-xs text-slate-500 hover:text-violet-600 block mb-1">{coupon.store?.name}</Link>
                    <h3 className="font-bold text-slate-800 line-clamp-1 mb-2">{coupon.title}</h3>
                </div>

                {/* Action Section */}
                <div className="flex-shrink-0">
                    <button
                        onClick={handleCopy}
                        className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap min-w-[100px]"
                    >
                        {copied ? 'Copied!' : 'Get Code'}
                    </button>
                </div>
            </div>
        );
    }

    // Vertical Layout (Default)
    return (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group h-full flex flex-col">
            <div className="p-5 flex-1">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 flex-shrink-0 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                        {coupon.imageUrl ? (
                            <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-cover" />
                        ) : coupon.store?.logoUrl ? (
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="text-sm font-bold text-slate-400">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                        )}
                    </div>
                    <div>
                        <Link href={`/store/${coupon.store?.slug}`} className="text-xs text-slate-500 hover:text-violet-600 font-medium block">{coupon.store?.name}</Link>
                        <h3 className="font-bold text-slate-800 line-clamp-2 leading-tight">{coupon.title}</h3>
                    </div>
                </div>

                <div className="flex items-center gap-2 mb-4 flex-wrap">
                    {coupon.discountValue && (
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded text-xs border border-emerald-100">
                            {coupon.discountValue}
                        </span>
                    )}
                    {coupon.isExclusive && (
                        <span className="text-purple-600 font-bold bg-purple-50 px-2 py-1 rounded text-xs uppercase border border-purple-100">
                            Exclusive
                        </span>
                    )}
                    {coupon.isVerified && (
                        <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded text-xs uppercase border border-green-100">
                            Verified
                        </span>
                    )}
                </div>

                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {coupon.description || 'Click to reveal code and open store.'}
                </p>
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-slate-100 mt-auto">
                <button
                    onClick={handleCopy}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-violet-200 hover:border-violet-500 text-violet-600 font-mono font-bold py-2 rounded-lg transition-all group-hover:bg-violet-600 group-hover:text-white group-hover:border-transparent relative overflow-hidden"
                >
                    {copied ? (
                        <>
                            <Check size={18} />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <span className="relative z-10 flex items-center gap-2">
                            Show Code <span className="text-xs opacity-50 font-normal ml-1 border-l border-current pl-2">{coupon.code?.slice(0, 4)}***</span>
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
