
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import CategoryModel from '@/models/Category';
import CreateCouponForm from './client'; // Moving client logic to a separate file for cleaner separation if preferred, but I'll write the client form here and the page wrapper.
// Actually, to make it easier to read/write, I'll put everything in page.tsx if it's small, or separate client.
// I will create a Client Component file called `Form.tsx` in the same directory and use it here.
// But first, let me define the page which fetches data.

export const dynamic = 'force-dynamic';

async function getData() {
    await connectToDatabase();
    const [stores, categories] = await Promise.all([
        StoreModel.find({ isActive: true }).select('name _id').sort({ name: 1 }),
        CategoryModel.find({ isActive: true }).select('name _id parentCategory').sort({ name: 1 })
    ]);

    // Process subcategories if needed in future, but for now passing raw
    return {
        stores: JSON.parse(JSON.stringify(stores)),
        categories: JSON.parse(JSON.stringify(categories))
    };
}

import ClientForm from './ClientForm';

export default async function CreateCouponPage() {
    const { stores, categories } = await getData();

    return <ClientForm stores={stores} categories={categories} />;
}
