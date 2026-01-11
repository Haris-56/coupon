
'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';

export function CouponsClientConfig() {
    return (
        <Link
            href="/admin/coupons/create"
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm shadow-violet-200"
        >
            <Plus size={18} />
            Add Coupon
        </Link>
    );
}
