
'use client';

import { Search as SearchIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm() {
    const router = useRouter();
    const [query, setQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/search?query=${encodeURIComponent(query)}`);
        }
    };

    return (
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-xl">
                <SearchIcon className="ml-6 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for stores like 'Nike', 'Amazon'..."
                    className="w-full py-4 px-4 rounded-full focus:outline-none text-slate-700 placeholder:text-slate-400"
                />
                <button type="submit" className="mr-2 my-2 bg-violet-600 text-white px-8 py-2 rounded-full font-bold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/30">
                    Search Offers
                </button>
            </div>
        </form>
    );
}
