
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

export async function generateMetadata(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const data = await getStoreData(params.slug);
    if (!data) return { title: 'Store Not Found' };

    return {
        title: `${data.store.name} Coupons & Promo Codes - CouponPro`,
        description: data.store.description || `Get the latest ${data.store.name} coupons and deals.`,
    };
}

export default async function StorePage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const data = await getStoreData(params.slug);

    if (!data) {
        notFound();
    }

    const { store, coupons } = data;

    return (
        <div className="bg-secondary-50 min-h-screen pb-16 pt-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* Left Sidebar */}
                    <div className="lg:w-1/4 w-full flex-shrink-0 lg:sticky lg:top-24">
                        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 flex flex-col items-center text-center space-y-4">
                            <div className="w-32 h-32 rounded-xl bg-white shadow-md border border-secondary-100 flex items-center justify-center text-4xl font-bold text-secondary-300 overflow-hidden mb-2">
                                {store.logoUrl ? (
                                    <img src={store.logoUrl} alt={store.name} className="w-full h-full object-contain p-2" />
                                ) : (
                                    store.name.substring(0, 1)
                                )}
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-secondary-900">{store.name}</h1>

                                {/* Static Rating for Aesthetics */}
                                <div className="flex items-center justify-center gap-1 mt-2 text-primary-500">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-xs text-secondary-500 mt-1">4.8 out of 5 stars</p>
                            </div>

                            <p className="text-secondary-600 text-sm leading-relaxed">{store.description}</p>
                        </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 w-full">
                        <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-secondary-900">{store.name} Coupon Codes</h2>
                                <div className="h-1 w-20 bg-primary-500 rounded-full mt-2"></div>
                            </div>
                            <div className="flex gap-3">
                                {store.affiliateLink && (
                                    <a
                                        href={store.affiliateLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-primary-200 active:scale-95"
                                    >
                                        Visit Store <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>

                        {coupons.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {coupons.map((coupon: any) => (
                                    <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-xl border border-dashed border-secondary-300">
                                <p className="text-secondary-500 mb-2">No active coupons found for {store.name} at this moment.</p>
                                <Link href="/" className="text-primary-600 font-medium hover:underline">Browse other stores</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
