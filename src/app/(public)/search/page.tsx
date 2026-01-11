
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import Category from '@/models/Category';
import StoreModel from '@/models/Store';
import { CouponCard } from '@/components/CouponCard';
import { Search } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getSearchData(searchParams: { category?: string; store?: string; query?: string; type?: string }) {
    await connectToDatabase();

    const query: any = { isActive: true };

    // Filter by Category Slug
    if (searchParams.category) {
        const category = await Category.findOne({ slug: searchParams.category });
        if (category) {
            query.category = category._id;
        }
    }

    // Filter by Store Slug
    if (searchParams.store) {
        const store = await StoreModel.findOne({ slug: searchParams.store });
        if (store) {
            query.store = store._id;
        }
    }

    // Filter by Search Query (Title or Description)
    if (searchParams.query) {
        query.$or = [
            { title: { $regex: searchParams.query, $options: 'i' } },
            { description: { $regex: searchParams.query, $options: 'i' } }
        ];
    }

    // Filter by Type (Exclusive / Verified / Featured)
    if (searchParams.type === 'exclusive') query.isExclusive = true;
    if (searchParams.type === 'verified') query.isVerified = true;
    if (searchParams.type === 'featured') query.isFeatured = true;

    const coupons = await Coupon.find(query).populate('store').sort({ createdAt: -1 });
    const allCategories = await Category.find({ isActive: true }).sort({ name: 1 });
    const allStores = await StoreModel.find({ isActive: true }).select('name slug count').sort({ name: 1 }).limit(10); // Show top 10 for sidebar

    return {
        coupons: JSON.parse(JSON.stringify(coupons)),
        categories: JSON.parse(JSON.stringify(allCategories)),
        stores: JSON.parse(JSON.stringify(allStores)),
    };
}

export default async function SearchPage(props: { searchParams: Promise<any> }) {
    const params = await props.searchParams;
    const { coupons, categories, stores } = await getSearchData(params);

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        {/* Categories Filter */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Categories</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map((cat: any) => (
                                    <Link
                                        href={`/search?category=${cat.slug}`}
                                        key={cat._id}
                                        className={`block text-sm py-1.5 hover:text-blue-600 transition-colors ${params.category === cat.slug ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Stores Filter */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Stores</h3>
                            <div className="space-y-2">
                                {stores.map((store: any) => (
                                    <Link
                                        href={`/search?store=${store.slug}`}
                                        key={store._id}
                                        className="flex items-center gap-2 group cursor-pointer"
                                    >
                                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${params.store === store.slug ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-500'}`}>
                                            {params.store === store.slug && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <span className={`text-sm ${params.store === store.slug ? 'text-blue-600 font-medium' : 'text-slate-600 group-hover:text-blue-500'}`}>{store.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Type Filter */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-4">Explore</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Exclusive Coupons', value: 'exclusive' },
                                    { label: 'Verified Coupons', value: 'verified' }
                                ].map((type) => (
                                    <Link
                                        href={`/search?type=${type.value}`}
                                        key={type.value}
                                        className="flex items-center gap-2 group cursor-pointer"
                                    >
                                        <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${params.type === type.value ? 'bg-blue-600 border-blue-600' : 'border-slate-300 group-hover:border-blue-500'}`}>
                                            {params.type === type.value && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <span className={`text-sm ${params.type === type.value ? 'text-blue-600 font-medium' : 'text-slate-600 group-hover:text-blue-500'}`}>{type.label}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-xl font-bold text-slate-800">
                                {params.query ? `Results for "${params.query}"` :
                                    params.category ? `${categories.find((c: any) => c.slug === params.category)?.name} Coupons` :
                                        params.store ? `${stores.find((s: any) => s.slug === params.store)?.name} Coupons` :
                                            'All Coupons'}
                            </h1>
                            <span className="text-sm text-slate-500">{coupons.length} Results Found</span>
                        </div>

                        <div className="space-y-4">
                            {coupons.map((coupon: any) => (
                                <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                            ))}
                            {coupons.length === 0 && (
                                <div className="bg-white p-12 rounded-xl text-center border border-slate-100">
                                    <p className="text-slate-500 text-lg">No coupons found matching your criteria.</p>
                                    <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">Go back home</Link>
                                </div>
                            )}
                        </div>

                        {/* Pagination Placeholder */}
                        {coupons.length > 0 && (
                            <div className="flex justify-center mt-12 gap-2">
                                <button className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold shadow-md">1</button>
                                <button className="w-10 h-10 rounded-full bg-white text-slate-600 hover:bg-slate-50 border border-slate-200">2</button>
                                <button className="w-10 h-10 rounded-full bg-white text-slate-600 hover:bg-slate-50 border border-slate-200">3</button>
                                <span className="flex items-center justify-center w-10 h-10 text-slate-400">...</span>
                                <button className="w-10 h-10 rounded-full bg-white text-slate-600 hover:bg-slate-50 border border-slate-200">11</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
