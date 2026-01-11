
import {
    Users,
    Store,
    Ticket,
    TrendingUp
} from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';

async function getStats() {
    await connectToDatabase();
    const userCount = await User.countDocuments();
    const storeCount = await StoreModel.countDocuments();
    const couponCount = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });

    return {
        userCount,
        storeCount,
        couponCount,
        activeCoupons
    }
}

export default async function AdminDashboard() {
    const stats = await getStats();

    const cards = [
        {
            title: 'Total Users',
            value: stats.userCount,
            icon: Users,
            color: 'bg-blue-500',
        },
        {
            title: 'Active Stores',
            value: stats.storeCount,
            icon: Store,
            color: 'bg-emerald-500',
        },
        {
            title: 'Total Coupons',
            value: stats.couponCount,
            icon: Ticket,
            color: 'bg-purple-500',
        },
        {
            title: 'Active Coupons',
            value: stats.activeCoupons,
            icon: TrendingUp,
            color: 'bg-orange-500',
        },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                        >
                            <div className={`${card.color} p-4 rounded-lg text-white`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{card.title}</p>
                                <h3 className="text-2xl font-bold text-slate-800">{card.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Placeholder for recent activity or charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400">
                    Recent Stores (Coming Soon)
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-64 flex items-center justify-center text-slate-400">
                    Recent Coupons (Coming Soon)
                </div>
            </div>
        </div>
    );
}
