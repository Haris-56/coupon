'use client';

import { useActionState } from 'react';
import { createStore } from '@/actions/store';
import { ArrowLeft, Save, Upload, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const initialState = {
    message: '',
    errors: {} as Record<string, string[]>,
};

export default function CreateStorePage() {
    // @ts-ignore
    const [state, formAction] = useActionState(createStore, initialState);

    return (
        <form action={formAction} className="pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/stores" className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Add New Store</h1>
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
                                name="name"
                                type="text"
                                required
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                            {state?.errors?.name && <p className="text-red-500 text-xs">{state.errors.name[0]}</p>}
                        </div>

                        {/* Slug (Optional / Auto-generated) */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Slug (auto-generated if empty)</label>
                            <input
                                name="slug"
                                type="text"
                                placeholder="custom-slug-url"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all font-mono"
                            />
                            {state?.errors?.slug && <p className="text-red-500 text-xs">{state.errors.slug[0]}</p>}
                        </div>


                        {/* Description */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                            <textarea
                                name="description"
                                rows={6}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>

                        {/* Tracking Link */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Tracking Link</label>
                            <input
                                name="affiliateLink"
                                type="url"
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>

                        {/* URL/Link */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Url / Link</label>
                            <input
                                name="url"
                                type="url"
                                placeholder="https://store.com"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>

                        {/* Network & Country */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Country</label>
                                <select
                                    name="country"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                                >
                                    <option value="Global">Global</option>
                                    <option value="US">United States</option>
                                    <option value="UK">United Kingdom</option>
                                    <option value="CA">Canada</option>
                                    <option value="AU">Australia</option>
                                    <option value="DE">Germany</option>
                                    <option value="FR">France</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Network</label>
                                <select
                                    name="network"
                                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                                >
                                    <option value="">Other / None</option>
                                    <option value="Impact">Impact</option>
                                    <option value="CJ">CJ Affiliate</option>
                                    <option value="Awin">Awin</option>
                                    <option value="Rakuten">Rakuten</option>
                                    <option value="ShareASale">ShareASale</option>
                                    <option value="FlexOffers">FlexOffers</option>
                                    <option value="Partnerize">Partnerize</option>
                                </select>
                            </div>
                        </div>

                        {/* Featured */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Featured</label>
                            <select
                                name="isFeatured"
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                            >
                                <option value="no">No</option>
                                <option value="yes">Yes</option>
                            </select>
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
                            <label className="text-xs font-bold text-slate-500 uppercase">SEO Title</label>
                            <input
                                name="seoTitle"
                                type="text"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">SEO Description</label>
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
                        <select
                            name="isActive"
                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-violet-500 transition-all"
                        >
                            <option value="enabled">Enabled</option>
                            <option value="disabled">Disabled</option>
                        </select>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">Image / Logo</h3>
                        {/* Fallback to URL input for now as we don't have file upload service */}
                        <div className="space-y-2">
                            <input
                                name="logoUrl"
                                type="url"
                                placeholder="https://example.com/logo.png"
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                            />
                            <p className="text-xs text-slate-400">Enter direct image URL</p>
                        </div>

                        {/* Visual placeholder for "Upload" look */}
                        <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center opacity-50 pointer-events-none">
                            <div className="bg-white p-3 rounded-full shadow-sm mb-3">
                                <Upload size={20} className="text-slate-400" />
                            </div>
                            <span className="text-sm font-bold text-slate-600 mb-1">Upload (Coming Soon)</span>
                            <span className="text-xs text-slate-400">Use URL above for now</span>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors shadow-lg">
                        <Save size={18} className="inline mr-2" />
                        Save Store
                    </button>

                    {/* Visual spacer for mobile bottom navbar if exists */}
                    <div className="h-12 md:hidden"></div>
                </div>
            </div>
        </form>
    );
}
