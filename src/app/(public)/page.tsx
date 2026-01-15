
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import Category from '@/models/Category';
import { CouponCard } from '@/components/CouponCard';
import { Search } from 'lucide-react';
import Link from 'next/link';
import SearchForm from '@/components/SearchForm';

export const dynamic = 'force-dynamic';

async function getHomeData() {
    await connectToDatabase();

    const [featuredCoupons, exclusiveCoupons, popularStores, categories] = await Promise.all([
        Coupon.find({ isFeatured: true, isActive: true }).populate('store').limit(6).sort({ updatedAt: -1 }),
        Coupon.find({ isExclusive: true, isActive: true }).populate('store').limit(8).sort({ updatedAt: -1 }),
        StoreModel.find({ isFeatured: true, isActive: true }).limit(20), // Increased limit for text list
        Category.find({ isFeatured: true, isActive: true }).limit(6)
    ]);

    return {
        featuredCoupons: JSON.parse(JSON.stringify(featuredCoupons)),
        exclusiveCoupons: JSON.parse(JSON.stringify(exclusiveCoupons)),
        popularStores: JSON.parse(JSON.stringify(popularStores)),
        categories: JSON.parse(JSON.stringify(categories)),
    };
}

export default async function HomePage() {
    const { featuredCoupons, exclusiveCoupons, popularStores, categories } = await getHomeData();

    return (
        <div className="space-y-16 pb-16">
            {/* Hero Section */}
            <section className="relative bg-secondary-900 overflow-hidden py-24 lg:py-32">
                <div className="absolute inset-0 overflow-hidden">
                    {/* Modern Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-sm">
                        Shop Today's Trending <span className="text-primary-500">Coupons</span> and Save Big
                    </h1>
                    <p className="text-lg md:text-xl text-secondary-200 mb-10 max-w-2xl mx-auto font-medium">
                        Over 20,000+ Coupons. Grab one now!
                    </p>

                    <SearchForm />
                </div>
            </section>

            {/* Exclusive Coupons */}
            {exclusiveCoupons.length > 0 && (
                <section className="container mx-auto px-4">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-secondary-200 -z-10"></div>
                        <h2 className="text-xl font-bold text-white bg-primary-600 px-6 py-2 transform -skew-x-12 inline-block shadow-md">
                            <span className="block transform skew-x-12">Exclusive Coupons</span>
                        </h2>
                        <Link href="/search?filter=exclusive" className="text-secondary-500 hover:text-primary-600 bg-white px-4 py-1 text-sm font-medium border border-secondary-200 rounded-full transition-colors">View All &gt;</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {exclusiveCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} layout="horizontal" />
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Coupons */}
            {featuredCoupons.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[1px] bg-secondary-200 -z-10"></div>
                        <h2 className="text-xl font-bold text-secondary-900 bg-primary-100 px-6 py-2 transform -skew-x-12 inline-block shadow-sm border border-primary-200">
                            <span className="block transform skew-x-12">Featured Coupons</span>
                        </h2>
                        <Link href="/search?filter=featured" className="text-secondary-500 hover:text-primary-600 bg-white px-4 py-1 text-sm font-medium border border-secondary-200 rounded-full transition-colors">View All &gt;</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredCoupons.map((coupon: any) => (
                            <CouponCard key={coupon._id} coupon={coupon} />
                        ))}
                    </div>
                </section>
            )}

            {/* Featured Categories (Icon Grid) */}
            {categories.length > 0 && (
                <section className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-secondary-800">Featured Categories</h2>
                        <Link href="/categories" className="text-primary-600 hover:text-primary-700 font-medium text-sm">View All &gt;</Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {categories.map((category: any) => (
                            <Link
                                href={`/search?category=${category.slug}`}
                                key={category._id}
                                className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group border border-transparent hover:border-primary-100"
                            >
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                                    {category.imageUrl && !category.imageUrl.startsWith('http') ? (
                                        <i className={`text-secondary-700 group-hover:text-primary-600 ${category.imageUrl}`}></i>
                                    ) : category.imageUrl ? (
                                        <img src={category.imageUrl} alt={category.name} className="w-10 h-10 object-contain" />
                                    ) : (
                                        <span className="text-3xl">✈️</span>
                                    )}
                                </div>
                                <span className="font-bold text-secondary-700 group-hover:text-primary-600 text-center text-sm">{category.name}</span>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Popular Stores */}
            {popularStores.length > 0 && (
                <section className="bg-white py-16 border-t border-secondary-100">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8 border-b border-secondary-100 pb-4">
                            <h2 className="text-2xl font-bold text-secondary-800">Featured Stores</h2>
                            <Link href="/stores" className="text-primary-600 hover:text-primary-700 font-medium text-sm">View All &gt;</Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
                            {popularStores.map((store: any) => (
                                <Link
                                    href={`/store/${store.slug}`}
                                    key={store._id}
                                    className="text-sm font-medium text-secondary-500 hover:text-primary-600 transition-colors"
                                >
                                    {store.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
