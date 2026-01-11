
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import { CouponCard } from '@/components/CouponCard';
import { notFound } from 'next/navigation';
import { ExternalLink, Share2 } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getStoreData(slug: string) {
    await connectToDatabase();
    const store = await StoreModel.findOne({ slug, isActive: true });

    if (!store) return null;

    const coupons = await Coupon.find({ store: store._id, isActive: true })
        .populate('store')
        .sort({ isFeatured: -1, createdAt: -1 });

    return {
        store: JSON.parse(JSON.stringify(store)),
        coupons: JSON.parse(JSON.stringify(coupons)),
    };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const data = await getStoreData(params.slug);
    if (!data) return { title: 'Store Not Found' };

    return {
        title: `${data.store.name} Coupons & Promo Codes - CouponPro`,
        description: data.store.description || `Get the latest ${data.store.name} coupons and deals.`,
    };
}

export default async function StorePage({ params }: { params: { slug: string } }) {
    const data = await getStoreData(params.slug);

    if (!data) {
        notFound();
    }

    const { store, coupons } = data;

    return (
        <div className="bg-slate-50 min-h-screen pb-16">
            {/* Store Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-8 md:py-12">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl bg-white shadow-lg border border-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400 shrink-0">
                            {store.logoUrl ? (
                                <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain p-2" />
                            ) : (
                                store.name.substring(0, 1)
                            )}
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-4">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{store.name} Coupons</h1>
                            <p className="text-slate-600 max-w-2xl">{store.description}</p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                                {store.affiliateLink && (
                                    <a
                                        href={store.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-colors shadow-sm"
                                    >
                                        Visit Store <ExternalLink size={16} />
                                    </a>
                                )}

                                <button className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-full font-medium transition-colors">
                                    <Share2 size={16} /> Share
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupons List */}
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center gap-2 mb-8">
                    <h2 className="text-xl font-bold text-slate-800">Available Coupons</h2>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-600 text-xs font-bold rounded-full">{coupons.length}</span>
                </div>

                {coupons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500 mb-2">No active coupons found for {store.name} at this moment.</p>
                        <Link href="/" className="text-blue-600 font-medium hover:underline">Browse other stores</Link>
                    </div>
                )}
            </div>
        </div>
    );
}
