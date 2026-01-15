
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStores() {
    await connectToDatabase();
    const stores = await StoreModel.find({ isActive: true }).select('name slug logoUrl').sort({ name: 1 });
    return JSON.parse(JSON.stringify(stores));
}

export default async function StoresPage(props: { searchParams: Promise<{ char?: string }> }) {
    const searchParams = await props.searchParams;
    const stores = await getStores();
    const alphabet = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const selectedChar = (searchParams.char || '').toUpperCase();

    const filteredStores = selectedChar
        ? stores.filter((store: any) => {
            const firstChar = store.name.charAt(0).toUpperCase();
            if (selectedChar === '#') return /^\d/.test(firstChar);
            return firstChar === selectedChar;
        })
        : stores;

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-primary-600 py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Stores</h1>
                    <div className="h-1 w-16 bg-white rounded-full"></div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 space-y-8">
                {/* Search & Filter */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {/* Search Bar */}
                    <div className="max-w-md mx-auto relative mb-8">
                        <input
                            type="text"
                            placeholder="Search your favorite store..."
                            className="w-full pl-12 pr-4 py-3 border border-secondary-200 rounded-full focus:outline-none focus:border-primary-500 transition-all font-medium text-secondary-800"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    </div>

                    {/* A-Z Filter */}
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link
                            href="/stores"
                            className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all",
                                !selectedChar
                                    ? "bg-primary-600 text-white shadow-md"
                                    : "bg-secondary-100 text-secondary-600 hover:bg-white hover:shadow-md hover:text-primary-600"
                            )}
                        >
                            ALL
                        </Link>
                        {alphabet.map((char) => (
                            <Link
                                key={char}
                                href={`/stores?char=${char}`}
                                className={cn(
                                    "w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-all",
                                    selectedChar === char
                                        ? "bg-primary-600 text-white shadow-md"
                                        : "bg-secondary-100 text-secondary-600 hover:bg-white hover:shadow-md hover:text-primary-600"
                                )}
                            >
                                {char}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Stores Grid */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="space-y-12">
                        {/* Group by Letter just for visuals, or just list them if filtered */}
                        {selectedChar ? (
                            <div>
                                <h2 className="text-2xl font-bold text-secondary-800 mb-6 border-b border-secondary-100 pb-2">{selectedChar}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                    {filteredStores.map((store: any) => (
                                        <Link
                                            href={`/store/${store.slug}`}
                                            key={store._id}
                                            className="flex items-center gap-3 group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-xs font-bold text-secondary-500 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                {store.logoUrl ? <img src={store.logoUrl} className="w-full h-full object-cover rounded-full" /> : store.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-secondary-600 group-hover:text-primary-600 transition-colors">{store.name}</span>
                                        </Link>
                                    ))}
                                    {filteredStores.length === 0 && <p className="text-secondary-400 italic">No stores found.</p>}
                                </div>
                            </div>
                        ) : (
                            // Show all grouped by letter
                            alphabet.filter(char => char !== '#').map(char => {
                                const charStores = stores.filter((s: any) => s.name.charAt(0).toUpperCase() === char);
                                if (charStores.length === 0) return null;
                                return (
                                    <div key={char}>
                                        <h2 className="text-2xl font-bold text-secondary-800 mb-6 border-b border-secondary-100 pb-2">{char}</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                            {charStores.map((store: any) => (
                                                <Link
                                                    href={`/store/${store.slug}`}
                                                    key={store._id}
                                                    className="flex items-center gap-3 group"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-secondary-100 flex items-center justify-center text-xs font-bold text-secondary-500 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                                        {store.logoUrl ? <img src={store.logoUrl} className="w-full h-full object-cover rounded-full" /> : store.name.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-medium text-secondary-600 group-hover:text-primary-600 transition-colors">{store.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
