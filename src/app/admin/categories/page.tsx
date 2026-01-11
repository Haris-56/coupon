
import { connectToDatabase } from '@/lib/db';
import Category from '@/models/Category';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getCategories() {
    await connectToDatabase();
    const categories = await Category.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(categories));
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Categories</h1>
                <button disabled className="bg-slate-200 text-slate-500 px-4 py-2 rounded-lg font-medium cursor-not-allowed">
                    Add Category (Coming Soon)
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-slate-50/50">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input placeholder="Search..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm" />
                    </div>
                </div>
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Slug</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {categories.map((cat: any) => (
                            <tr key={cat._id}>
                                <td className="px-6 py-4 font-medium">{cat.name}</td>
                                <td className="px-6 py-4 font-mono text-xs">{cat.slug}</td>
                            </tr>
                        ))}
                        {categories.length === 0 && <tr><td colSpan={2} className="px-6 py-8 text-center text-slate-400">No categories found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
