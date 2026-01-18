
'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, X, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';
import { voteCoupon } from '@/actions/coupon';
import Link from 'next/link';

interface CouponCardProps {
    coupon: any;
    layout?: 'vertical' | 'horizontal';
}

export function CouponCard({ coupon, layout = 'vertical' }: CouponCardProps) {
    const [copied, setCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    const handleCopy = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (coupon.code) {
            navigator.clipboard.writeText(coupon.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();

        // Open the tracking link in a new tab
        const link = coupon.trackingLink || coupon.store?.affiliateLink || '#';
        if (link !== '#') {
            window.open(link, '_blank');
        }

        // Show modal for all types
        setShowModal(true);
    };

    const handleVote = async (isUp: boolean) => {
        if (hasVoted) return;
        setHasVoted(true);
        await voteCoupon(coupon._id, isUp);
    };

    const closeModal = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        setShowModal(false);
    };

    // Modal Component
    const Modal = () => {
        if (!showModal) return null;

        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-secondary-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeModal}>
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                    {/* Header */}
                    <div className="bg-primary-50 p-6 flex flex-col items-center text-center border-b border-primary-100 relative">
                        <button
                            onClick={closeModal}
                            className="absolute right-4 top-4 text-secondary-400 hover:text-secondary-600 p-1 rounded-full hover:bg-white/50 transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="w-16 h-16 bg-white rounded-lg shadow-sm border border-secondary-100 flex items-center justify-center mb-4 p-2">
                            {coupon.store?.logoUrl ? (
                                <img src={coupon.store.logoUrl} alt={coupon.store?.name} className="w-full h-full object-contain" />
                            ) : (
                                <span className="font-bold text-secondary-400 text-xl">{coupon.store?.name?.substring(0, 1)}</span>
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-secondary-800 break-words w-full px-4">{coupon.title}</h3>
                        <p className="text-secondary-500 text-sm mt-1">at {coupon.store?.name}</p>
                    </div>

                    {/* Body */}
                    <div className="p-8 flex flex-col items-center gap-6">
                        {coupon.couponType === 'Code' ? (
                            <div className="text-center space-y-2 w-full text-center">
                                <p className="text-sm font-semibold text-secondary-500 uppercase tracking-wide">Copy and paste this code at {coupon.store?.name}</p>
                                <div className="relative group cursor-pointer" onClick={handleCopy}>
                                    <div className="bg-secondary-50 border-2 border-dashed border-secondary-300 rounded-xl px-8 py-4 flex items-center gap-4 min-w-[240px] justify-center hover:border-primary-400 hover:bg-primary-50/10 transition-all">
                                        <span className="text-2xl font-mono font-bold text-primary-600 tracking-wider select-all">{coupon.code}</span>
                                        <button className="bg-primary-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold ml-2">Copy</button>
                                    </div>
                                    {copied && <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-green-600 font-bold animate-in fade-in slide-in-from-bottom-1">Copied!</span>}
                                </div>
                                <div className="pt-4">
                                    <a
                                        href={coupon.trackingLink || coupon.store?.affiliateLink || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-95 text-center"
                                    >
                                        Go to {coupon.store?.name}
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center space-y-4 w-full text-center">
                                <p className="text-secondary-600 font-medium px-4">No code required! The discount will be automatically applied when you click the button below.</p>
                                <a
                                    href={coupon.trackingLink || coupon.store?.affiliateLink || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-200 transition-all active:scale-95 text-center"
                                >
                                    Go to Deal
                                </a>
                            </div>
                        )}

                        {/* Did it work? */}
                        <div className="flex flex-col items-center gap-3 pt-4 border-t border-secondary-100 w-full">
                            <p className="text-sm font-medium text-secondary-500">
                                {hasVoted ? 'Thanks for your feedback!' : 'Did it work?'}
                            </p>
                            <div className="flex gap-4">
                                <button
                                    disabled={hasVoted}
                                    onClick={() => handleVote(false)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all group",
                                        hasVoted ? "opacity-50 cursor-default border-secondary-200" : "border-secondary-200 hover:bg-red-50 hover:border-red-200"
                                    )}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">🙁</span>
                                    <span className="text-sm font-bold text-secondary-600 group-hover:text-red-600">{coupon.votesDown || 0}</span>
                                </button>
                                <button
                                    disabled={hasVoted}
                                    onClick={() => handleVote(true)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-full border transition-all group",
                                        hasVoted ? "opacity-50 cursor-default border-secondary-200" : "border-secondary-200 hover:bg-green-50 hover:border-green-200"
                                    )}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">😊</span>
                                    <span className="text-sm font-bold text-secondary-600 group-hover:text-green-600">{coupon.votesUp || 0}</span>
                                </button>
                            </div>
                        </div>

                        <button onClick={closeModal} className="text-sm text-secondary-400 hover:text-secondary-600 hover:underline">
                            Close and continue to {coupon.store?.name}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (layout === 'horizontal') {
        return (
            <>
                <Modal />
                <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:shadow-lg transition-all group flex flex-col sm:flex-row items-center p-4 gap-4 relative">
                    {/* Logo Section */}
                    <div className="w-full sm:w-32 h-24 sm:h-24 flex-shrink-0 bg-secondary-50/50 rounded-lg flex items-center justify-center p-2 border border-secondary-100">
                        {coupon.imageUrl ? (
                            <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : coupon.store?.logoUrl ? (
                            <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain mix-blend-multiply" />
                        ) : (
                            <div className="text-xl font-bold text-secondary-300">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                        <div className="flex flex-wrap items-center gap-2 mb-1 justify-center sm:justify-start">
                            {coupon.isVerified && <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"><Check size={10} strokeWidth={4} /> Verified</span>}
                            {coupon.isExclusive && <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider">Exclusive</span>}

                            {/* Vote Counts on Card */}
                            <div className="flex items-center gap-2 ml-auto sm:ml-0 bg-secondary-50 px-2 py-0.5 rounded-full border border-secondary-100">
                                <div className="flex items-center gap-1 grayscale-[0.5]">
                                    <span className="text-xs">😊</span>
                                    <span className="text-[10px] font-bold text-secondary-600">{coupon.votesUp || 0}</span>
                                </div>
                                <div className="flex items-center gap-1 grayscale-[0.5]">
                                    <span className="text-xs">🙁</span>
                                    <span className="text-[10px] font-bold text-secondary-600">{coupon.votesDown || 0}</span>
                                </div>
                            </div>
                        </div>
                        <h3 className="text-lg font-bold text-secondary-800 mb-1 lg:pr-20 title-clamp">{coupon.title}</h3>
                        <p className="text-secondary-500 text-sm line-clamp-2 md:line-clamp-1 mb-2">{coupon.description}</p>
                    </div>

                    {/* Action Section */}
                    <div className="flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                        {coupon.couponType === 'Code' ? (
                            <button
                                onClick={handleAction}
                                className="w-full sm:w-auto relative group overflow-hidden bg-white border-2 border-dashed border-primary-500 text-primary-600 font-bold px-6 py-2.5 rounded-lg transition-all hover:bg-primary-50 flex items-center justify-center gap-2"
                            >
                                <Scissors size={18} className="rotate-[-45deg]" />
                                <span className="relative z-10">Show Code</span>
                                <div className="absolute inset-0 bg-primary-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>
                        ) : (
                            <button
                                onClick={handleAction}
                                className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold px-6 py-3 rounded-lg transition-all shadow-md shadow-primary-200 active:scale-95"
                            >
                                Get Deal
                            </button>
                        )}
                    </div>
                </div>
            </>
        );
    }

    // Vertical Layout (Default - Box Card)
    return (
        <>
            <Modal />
            <div className="bg-white border border-secondary-200 rounded-xl overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300 group h-full flex flex-col relative">
                <div className="p-5 flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 flex-shrink-0 bg-secondary-50 rounded-lg flex items-center justify-center overflow-hidden border border-secondary-100 p-1">
                            {coupon.imageUrl ? (
                                <img src={coupon.imageUrl} alt={coupon.title} className="w-full h-full object-contain" />
                            ) : coupon.store?.logoUrl ? (
                                <img src={coupon.store.logoUrl} alt={coupon.store.name} className="w-full h-full object-contain" />
                            ) : (
                                <div className="text-sm font-bold text-secondary-300">{coupon.store?.name?.substring(0, 2).toUpperCase()}</div>
                            )}
                        </div>
                        <div>
                            <Link href={`/store/${coupon.store?.slug}`} className="text-xs text-secondary-500 hover:text-primary-600 font-bold uppercase tracking-wider block mb-0.5">{coupon.store?.name}</Link>
                            <div className="flex items-center gap-2">
                                {coupon.isVerified && <span className="text-[10px] font-bold text-green-600 flex items-center gap-0.5"><Check size={10} /> Verified</span>}
                                <div className="flex items-center gap-2 bg-secondary-50 px-1.5 py-0.5 rounded-full border border-secondary-100">
                                    <div className="flex items-center gap-0.5">
                                        <span className="text-[10px]">😊</span>
                                        <span className="text-[10px] font-bold text-secondary-500">{coupon.votesUp || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <span className="text-[10px]">🙁</span>
                                        <span className="text-[10px] font-bold text-secondary-500">{coupon.votesDown || 0}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-secondary-900 leading-tight mb-3 line-clamp-2 h-[3.25rem]">{coupon.title}</h3>

                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {coupon.couponType === 'Code' ? (
                            <span className="text-xs font-bold bg-secondary-100 text-secondary-600 px-2 py-1 rounded border border-secondary-200">CODE</span>
                        ) : (
                            <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">DEAL</span>
                        )}
                        {coupon.discountValue && (
                            <span className="text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded border border-primary-100">
                                {coupon.discountValue}
                            </span>
                        )}
                    </div>

                    <p className="text-sm text-secondary-500 line-clamp-2 mb-4">
                        {coupon.description || 'Click to see details and redeem this offer.'}
                    </p>
                </div>

                <div className="p-4 bg-secondary-50/50 border-t border-secondary-100 mt-auto">
                    {coupon.couponType === 'Code' ? (
                        <button
                            onClick={handleAction}
                            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-dashed border-primary-300 hover:border-primary-500 text-primary-600 font-mono font-bold py-2.5 rounded-lg transition-all group-hover:bg-primary-50"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Show Code <span className="bg-secondary-100 text-secondary-500 text-[10px] px-1.5 py-0.5 rounded">{coupon.code?.slice(0, 4)}***</span>
                            </span>
                        </button>
                    ) : (
                        <button
                            onClick={handleAction}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg transition-all shadow-md shadow-primary-200 active:scale-95"
                        >
                            Get Deal
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
