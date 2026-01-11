
'use client';

import { useState } from 'react';
import { ArrowLeft, Save, Send } from 'lucide-react';
import Link from 'next/link';

export default function EditEmailTemplatePage() {
    return (
        <div className="pb-20">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/email-templates" className="bg-white border border-slate-200 p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Edit</h1>
                    <div className="h-1 w-10 bg-blue-600 rounded-full mt-1"></div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                        <h2 className="text-lg font-bold text-slate-700 pb-2 border-b border-slate-100">New User Registered (Welcome Email)</h2>

                        {/* From Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">From Name</label>
                            <input defaultValue="SavingCouponsHub" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>

                        {/* Plain Text & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Send as Plain Text</label>
                                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                                    <option value="no">No</option>
                                    <option value="yes">Yes</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                                <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500 transition-all">
                                    <option value="enabled">Enabled</option>
                                    <option value="disabled">Disabled</option>
                                </select>
                            </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Subject</label>
                            <input defaultValue="Welcome to {SITE_NAME}" type="text" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        </div>

                        {/* Rich Text Editor Simulation */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase">Message</label>
                            <div className="border border-slate-200 rounded-lg overflow-hidden">
                                {/* Toolbar */}
                                <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
                                    {['File', 'Edit', 'View', 'Insert', 'Format', 'Tools'].map(tool => (
                                        <span key={tool} className="text-xs font-medium text-slate-600 px-2 py-1 rounded hover:bg-slate-200 cursor-pointer">{tool}</span>
                                    ))}
                                </div>
                                <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-3 text-slate-600">
                                    <span className="font-bold cursor-pointer hover:text-black">B</span>
                                    <span className="italic cursor-pointer hover:text-black">I</span>
                                    <span className="underline cursor-pointer hover:text-black">U</span>
                                </div>

                                {/* Mock Content */}
                                <div className="p-4 bg-white min-h-[400px] text-sm text-slate-700 font-sans" contentEditable>
                                    <div className="text-center mb-8">
                                        <div className="w-32 h-16 bg-slate-100 mx-auto rounded flex items-center justify-center text-slate-400 font-bold mb-4 border border-dashed border-slate-300">LOGO_URL</div>
                                        <h1 className="text-2xl font-bold text-slate-800">Welcome!</h1>
                                    </div>
                                    <p>Hello {'{USER_NAME}'}!</p>
                                    <br />
                                    <p>Thank you for signing up. We are really happy to have you! Click the link below to login to your account:</p>
                                    <br />
                                    <div className="text-center my-6">
                                        <span className="inline-block bg-[#333] text-white px-6 py-3 rounded font-bold">Login to Your Account</span>
                                    </div>
                                    <br />
                                    <p>Cheers,<br />{'{SITE_NAME}'}</p>
                                </div>

                                <div className="bg-slate-50 border-t border-slate-200 p-1 text-[10px] text-right text-slate-400">
                                    POWERED BY TINY
                                </div>
                            </div>
                        </div>

                        <button className="bg-[#2c3e50] hover:bg-[#34495e] text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-colors shadow-lg">
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Sidebar - Available Fields & Test */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
                        <h3 className="text-sm font-bold text-slate-700 mb-4">Available Fields</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Logo', code: '{LOGO_URL}' },
                                { label: 'Site Domain', code: '{SITE_DOMAIN}' },
                                { label: 'Site Name', code: '{SITE_NAME}' },
                                { label: 'User Name', code: '{USER_NAME}' },
                                { label: 'User Email', code: '{USER_EMAIL}' },
                                { label: 'Sign In URL', code: '{SIGNIN_URL}' },
                            ].map((field) => (
                                <div key={field.code} className="flex items-center justify-between text-sm group cursor-pointer">
                                    <span className="text-slate-600">{field.label}</span>
                                    <code className="text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded text-xs group-hover:bg-blue-100 transition-colors">{field.code}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 space-y-4">
                        <h3 className="text-sm font-bold text-slate-700">Send a Test Email</h3>
                        <input type="email" placeholder="example@email.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">You must save before sending a test email</p>

                        <button className="w-full bg-[#34495e] hover:bg-[#2c3e50] text-white py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-2">
                            <Send size={14} /> Send Email
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
