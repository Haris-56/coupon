'use client';

import { useActionState } from 'react';
import { createCategory } from '@/actions/category';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
};

export default function ClientForm() {
    // @ts-ignore
    const [state, formAction] = useActionState(createCategory, initialState);

    return (
        <form action={formAction} className="pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/categories" className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New Category</h1>
                    <div className="h-1 w-10 bg-blue-600 rounded-full mt-1"></div>
                </div>
            </div>

            {state?.message && (
                <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 ${state.success ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                    <AlertCircle size={20} />
                    {state.message}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                        {/* Title */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Title <span className="text-red-500">*</span></label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                            />
                            {state?.errors?.name && <p className="text-red-500 text-xs">{state.errors.name[0]}</p>}
                        </div>

                        {/* Slug - Auto/Optional */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Slug <span className="text-slate-400 font-normal normal-case">(Auto-generated if empty)</span></label>
                            <input
                                name="slug"
                                type="text"
                                placeholder="custom-slug-url"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all font-mono"
                            />
                            {state?.errors?.slug && <p className="text-red-500 text-xs">{state.errors.slug[0]}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Icon Selector */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                Icon <span className="text-xs text-blue-500 font-normal normal-case cursor-pointer hover:underline">Select Icon 🔗</span>
                            </label>
                            <input
                                name="icon"
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="fa-solid fa-home"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Show in Menu</label>
                                <select name="isShowInMenu" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Featured</label>
                                <select name="isFeatured" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                        </div>

                        {/* SEO Divider */}
                        <div className="relative pt-4">
                            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-start">
                                <span className="pr-2 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">SEO</span>
                            </div>
                        </div>

                        {/* SEO Fields */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Meta Title</label>
                            <input
                                name="seoTitle"
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Meta Description</label>
                            <textarea
                                name="seoDescription"
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">Status</h3>
                        <select name="isActive" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">Image <span className="text-red-500">*</span></h3>

                        {/* We use a real file input but styled */}
                        <div className="relative group">
                            <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition-all">
                                <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                    <Upload size={20} className="text-slate-400" />
                                </div>
                                <span className="text-sm font-bold text-slate-600 mb-1">Choose File</span>
                                <span className="text-xs text-slate-400">Recommended Size: 350 x 350</span>
                            </div>
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    </div>

                    <button className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-white py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors shadow-lg">
                        Save Changes
                    </button>
                </div>
            </div>
        </form>
    );
}
