
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createCoupon } from '@/actions/coupon';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
};

export default function ClientForm({ stores, categories }: { stores: any[], categories: any[] }) {
    // @ts-ignore
    const [state, formAction] = useActionState(createCoupon, initialState);

    // Filter subcategories based on selected category could be done here with state,
    // but for simplicity we might just show all or require manual selection. 
    // Screenshot shows "Sub Category", implies dependent dropdown.
    // For now, I'll just list all categories as options or if I had proper subcategory logic.
    // I'll filter `categories` where parentCategory is NOT null for subcategories, and IS null for main.

    const mainCategories = categories.filter(c => !c.parentCategory);
    const subCategories = categories.filter(c => c.parentCategory);

    return (
        <form action={formAction} className="pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/coupons" className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New Coupon</h1>
                    <div className="h-1 w-10 bg-violet-600 rounded-full mt-1"></div>
                </div>
            </div>

            {state?.message && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
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
                                name="title"
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                            {state?.errors?.title && <p className="text-red-500 text-xs">{state.errors.title[0]}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea
                                name="description"
                                rows={4}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>

                        {/* Tag Line */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Tag Line</label>
                            <input
                                name="tagLine"
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>

                        {/* Selectors Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Category <span className="text-red-500">*</span></label>
                                <select name="categoryId" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all">
                                    <option value="">Select Category</option>
                                    {mainCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                                {state?.errors?.categoryId && <p className="text-red-500 text-xs">{state.errors.categoryId[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Sub Category</label>
                                <select name="subCategoryId" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all">
                                    <option value="">Select Sub Category</option>
                                    {subCategories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Store <span className="text-red-500">*</span></label>
                                <select name="storeId" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all">
                                    <option value="">Select Store</option>
                                    {stores.map(store => (
                                        <option key={store._id} value={store._id}>{store.name}</option>
                                    ))}
                                </select>
                                {state?.errors?.storeId && <p className="text-red-500 text-xs">{state.errors.storeId[0]}</p>}
                            </div>
                        </div>

                        {/* Code & Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Code <span className="text-red-500">*</span></label>
                                <input
                                    name="code"
                                    type="text"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                                {state?.errors?.code && <p className="text-red-500 text-xs">{state.errors.code[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Start Date</label>
                                <div className="relative">
                                    <input
                                        name="startDate"
                                        type="date"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Expire Date</label>
                                <div className="relative">
                                    <input
                                        name="expiryDate"
                                        type="date"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tracking & Type */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Tracking Link <span className="text-red-500">*</span></label>
                                <input
                                    name="trackingLink"
                                    type="url"
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                                />
                                {state?.errors?.trackingLink && <p className="text-red-500 text-xs">{state.errors.trackingLink[0]}</p>}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Coupon Type</label>
                                <select
                                    name="couponType"
                                    defaultValue="Code"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                                >
                                    <option value="Code">Codes</option>
                                    <option value="Deal">Deal</option>
                                </select>
                            </div>
                        </div>

                        {/* Toggles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Featured</label>
                                <select name="isFeatured" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Verify</label>
                                <select name="isVerified" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all">
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Exclusive</label>
                                <select name="isExclusive" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all">
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
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Meta Description</label>
                            <textarea
                                name="seoDescription"
                                rows={3}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">Status</h3>
                        <select name="isActive" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all">
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">Image</h3>
                        {/* Fallback to URL input for now */}
                        <div className="space-y-2">
                            <input
                                name="imageUrl"
                                type="url"
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                            />
                            <p className="text-xs text-slate-400">Coupon Image URL</p>
                        </div>

                        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-50 pointer-events-none">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                <Upload size={20} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-600 mb-1">Choose File</span>
                            <span className="text-xs text-slate-400">Recommended Size: 650 x 350</span>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors shadow-lg">
                        <Save size={18} className="inline mr-2" />
                        Save Changes
                    </button>

                    {/* Visual spacer for mobile */}
                    <div className="h-12 md:hidden"></div>
                </div>
            </div>
        </form>
    );
}
