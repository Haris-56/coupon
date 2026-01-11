
import { Search, MoreHorizontal, Ticket } from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import { CouponsClientConfig } from './client';

export const dynamic = 'force-dynamic';

async function getData() {
    await connectToDatabase();
    const coupons = await Coupon.find().populate('store').sort({ createdAt: -1 });
    const stores = await StoreModel.find({ isActive: true }).select('name _id');
    return {
        coupons: JSON.parse(JSON.stringify(coupons)),
        stores: JSON.parse(JSON.stringify(stores))
    };
}

export default async function CouponsPage() {
    const { coupons, stores } = await getData();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Coupon Management</h1>
                <CouponsClientConfig stores={stores} />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Search coupons..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="text-sm text-slate-500">
                        Total: <span className="font-bold text-slate-800">{coupons.length}</span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Title / Code</th>
                                <th className="px-6 py-4">Store</th>
                                <th className="px-6 py-4 text-center">Discount</th>
                                <th className="px-6 py-4 text-center">Tags</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {coupons.map((coupon: any) => (
                                <tr key={coupon._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 line-clamp-1 max-w-[200px]">{coupon.title}</span>
                                            <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-blue-600 w-fit mt-1 border border-slate-200">{coupon.code}</code>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {coupon.store?.name || 'Unknown Store'}
                                    </td>
                                    <td className="px-6 py-4 text-center text-emerald-600 font-medium">
                                        {coupon.discountValue || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex gap-1 justify-center">
                                            {coupon.isFeatured && <span className="w-2 h-2 rounded-full bg-amber-500" title="Featured"></span>}
                                            {coupon.isExclusive && <span className="w-2 h-2 rounded-full bg-purple-500" title="Exclusive"></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {coupon.isActive ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                Inactive
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {coupons.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                        <Ticket className="mx-auto mb-2 opacity-50" />
                                        No coupons found. Click "Add Coupon" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
