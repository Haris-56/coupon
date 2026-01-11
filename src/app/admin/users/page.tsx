
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { Search, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getUsers() {
    await connectToDatabase();
    const users = await User.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
}

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Users</h1>
                    <div className="h-1 w-10 bg-blue-600 rounded-full mt-1"></div>
                </div>

                <Link href="/admin/users/create" className="bg-[#2c3e50] hover:bg-[#34495e] text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/10">
                    + ADD NEW
                </Link>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-500 font-medium">Show</span>
                        <select className="border border-slate-300 rounded-md text-sm p-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                            <option>10</option>
                            <option>25</option>
                            <option>50</option>
                        </select>
                        <span className="text-sm text-slate-500 font-medium">entries</span>
                    </div>

                    <div className="relative w-full md:w-auto">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs uppercase tracking-wider">Search:</span>
                        <input className="w-full md:w-64 pl-16 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-[#fafbfc] border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4">Id</th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4 text-center">Verified</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user: any, index: number) => (
                                <tr key={user._id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-400">#{index + 1}</td>
                                    <td className="px-6 py-4 font-medium text-slate-800">{user.name}</td>
                                    <td className="px-6 py-4 text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${user.role === 'ADMIN'
                                            ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                                            : 'bg-slate-100 text-slate-600 border-slate-200'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <CheckCircle className="text-emerald-500 w-5 h-5 fill-emerald-50" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-center">
                                            <CheckCircle className="text-emerald-500 w-5 h-5 fill-emerald-50" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="px-3 py-1.5 bg-slate-500 hover:bg-slate-600 text-white rounded text-xs font-medium transition-colors shadow-sm">
                                                Edit
                                            </button>
                                            <button className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded text-xs font-medium transition-colors shadow-sm">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50/30">
                    <span>Showing 1 to {users.length} of {users.length} entries</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50">First</button>
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50">Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded bg-[#2c3e50] text-white">1</button>
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50">Next</button>
                        <button className="px-3 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-50">Last</button>
                    </div>
                </div>

            </div>
        </div>
    );
}
