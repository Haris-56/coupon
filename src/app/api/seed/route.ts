
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import StoreModel from '@/models/Store';
import Coupon from '@/models/Coupon';
import Category from '@/models/Category';
import bcrypt from 'bcryptjs';
import User from '@/models/User';

export async function GET() {
    try {
        await connectToDatabase();

        // 0. Create Admin User
        const adminEmail = 'admin@gmail.com';
        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            const passwordHash = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'Admin User',
                email: adminEmail,
                passwordHash,
                role: 'ADMIN'
            });
        }

        // 1. Create Categories
        const categoriesData = [
            { name: 'Fashion', slug: 'fashion', icon: 'fa-tshirt' },
            { name: 'Electronics', slug: 'electronics', icon: 'fa-laptop' },
            { name: 'Travel', slug: 'travel', icon: 'fa-plane' }
        ];

        const categoriesMap: Record<string, any> = {};

        for (const catData of categoriesData) {
            let cat = await Category.findOne({ slug: catData.slug });
            if (!cat) {
                cat = await Category.create({
                    name: catData.name,
                    slug: catData.slug,
                    description: `Best deals on ${catData.name}`,
                    isActive: true,
                    isFeatured: true,
                    imageUrl: catData.icon
                });
            }
            categoriesMap[cat.name] = cat;
        }

        // 2. Create Stores
        const storesData = [
            {
                name: 'Nike',
                slug: 'nike',
                cat: 'Fashion',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png',
                desc: 'Just Do It. Innovative sportswear and footwear.',
                url: 'https://nike.com'
            },
            {
                name: 'Amazon',
                slug: 'amazon',
                cat: 'Electronics',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
                desc: 'Earth\'s biggest selection of books, electronics, apparel & more.',
                url: 'https://amazon.com'
            },
            {
                name: 'Expedia',
                slug: 'expedia',
                cat: 'Travel',
                logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Expedia_2024_logo.svg/2560px-Expedia_2024_logo.svg.png',
                desc: 'Plan your next trip with Expedia.',
                url: 'https://expedia.com'
            }
        ];

        const storesMap: Record<string, any> = {};

        for (const storeData of storesData) {
            let store = await StoreModel.findOne({ slug: storeData.slug });
            if (!store) {
                store = await StoreModel.create({
                    name: storeData.name,
                    slug: storeData.slug,
                    description: storeData.desc,
                    logoUrl: storeData.logo,
                    url: storeData.url,
                    affiliateLink: storeData.url + '?ref=demo',
                    isActive: true,
                    isFeatured: true
                });
            }
            storesMap[storeData.name] = store;
        }

        // 3. Create Coupons
        const couponsData = [
            // Nike
            {
                title: '20% Off All Running Shoes',
                code: 'RUN20',
                store: 'Nike',
                cat: 'Fashion',
                desc: 'Get 20% off exclusively on running shoes. Limited time offer.',
                isExclusive: true,
                isFeatured: true,
                discount: '20% OFF'
            },
            {
                title: 'Free Shipping on Orders Over $100',
                code: 'SHIPFREE',
                store: 'Nike',
                cat: 'Fashion',
                desc: 'Enjoy free standard shipping on all qualifying orders.',
                isExclusive: false,
                isFeatured: false,
                discount: 'Free Shipping'
            },
            // Amazon
            {
                title: '$50 Off New Kindle Paperwhite',
                code: 'KINDLE50',
                store: 'Amazon',
                cat: 'Electronics',
                desc: 'Save big on the latest e-reader.',
                isExclusive: true,
                isFeatured: true,
                discount: '$50 OFF'
            },
            {
                title: 'Lightning Deal: Up to 70% Off Electronics',
                code: '', // Deal
                store: 'Amazon',
                cat: 'Electronics',
                desc: 'Check out the daily lightning deals section.',
                isExclusive: false,
                isFeatured: true,
                discount: 'UP TO 70%'
            },
            // Expedia
            {
                title: '10% Off Hotel Bookings',
                code: 'HOTEL10',
                store: 'Expedia',
                cat: 'Travel',
                desc: 'Valid on select hotels worldwide.',
                isExclusive: true,
                isFeatured: true,
                discount: '10% OFF'
            },
            {
                title: 'Save $100 on Flight + Hotel Packages',
                code: 'BUNDLE100',
                store: 'Expedia',
                cat: 'Travel',
                desc: 'Book together and save more on your vacation.',
                isExclusive: false,
                isFeatured: false,
                discount: '$100 OFF'
            }
        ];

        let createdCount = 0;
        for (const data of couponsData) {
            const exists = await Coupon.findOne({ code: data.code, store: storesMap[data.store]._id });
            if (!exists || (data.code === '' && !exists)) {
                await Coupon.create({
                    title: data.title,
                    code: data.code,
                    description: data.desc,
                    store: storesMap[data.store]._id,
                    category: categoriesMap[data.cat]?._id,
                    discountValue: data.discount,
                    isActive: true,
                    isExclusive: data.isExclusive,
                    isFeatured: data.isFeatured,
                    isVerified: true
                });
                createdCount++;
            }
        }

        return NextResponse.json({ success: true, message: `Seeding complete. Created ${createdCount} new coupons.` });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
