
import Link from 'next/link';
import { Plus, Search, MoreHorizontal, ExternalLink } from 'lucide-react';
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import { StoreModal } from '@/components/admin/StoreModal'; // We need a client wrapper for the modal logic actually
import { StoresClientConfig } from './client'; // Splitting client logic

export const dynamic = 'force-dynamic';

async function getStores() {
    await connectToDatabase();
    // Using .lean() or JSON parse/stringify is often needed for passing to client components if they were pure props,
    // but here we render simple server components or pass to a client list wrapper.
    // For simplicity, we'll map the docs.
    const stores = await StoreModel.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(stores));
}

export default async function StoresPage() {
    const stores = await getStores();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Store Management</h1>
                <StoresClientConfig />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            placeholder="Search stores..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="text-sm text-slate-500">
                        Total: <span className="font-bold text-slate-800">{stores.length}</span>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-xs border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Slug</th>
                                <th className="px-6 py-4 text-center">Featured</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {stores.map((store: any) => (
                                <tr key={store._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                {store.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            {store.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{store.slug}</td>
                                    <td className="px-6 py-4 text-center">
                                        {store.isFeatured ? (
                                            <span className="inline-block w-2 h-2 rounded-full bg-amber-500" title="Featured"></span>
                                        ) : (
                                            <span className="inline-block w-2 h-2 rounded-full bg-slate-200" title="Standard"></span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {store.isActive ? (
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

                            {stores.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No stores found. Click "Add Store" to create one.
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
