
'use server';

import Coupon from '@/models/Coupon';
import StoreModel from '@/models/Store';
import CategoryModel from '@/models/Category';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

const CouponSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    code: z.string().optional(), // 'Code' might be empty if it's a 'Deal'
    tagLine: z.string().optional(),
    description: z.string().optional(),
    storeId: z.string().min(1, 'Store is required'),
    categoryId: z.string().min(1, 'Category is required'),
    subCategoryId: z.string().optional(),
    startDate: z.string().optional().or(z.literal('')),
    expiryDate: z.string().optional().or(z.literal('')),
    trackingLink: z.string().min(1, 'Tracking Link is required').url('Invalid URL'),
    couponType: z.enum(['Code', 'Deal']),
    isExclusive: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    isActive: z.boolean().optional(),
    discountValue: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    imageUrl: z.string().optional(),
});

export async function createCoupon(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    // Prepare data handling checkboxes and selects
    const rawData = {
        title: formData.get('title'),
        code: formData.get('code') || '',
        tagLine: formData.get('tagLine'),
        description: formData.get('description'),
        storeId: formData.get('storeId'),
        categoryId: formData.get('categoryId'),
        subCategoryId: formData.get('subCategoryId'),
        startDate: formData.get('startDate'),
        expiryDate: formData.get('expiryDate'),
        trackingLink: formData.get('trackingLink'),
        couponType: formData.get('couponType') as 'Code' | 'Deal', // Form sends "Code" or "Deal"
        isExclusive: formData.get('isExclusive') === 'yes',
        isFeatured: formData.get('isFeatured') === 'yes',
        isVerified: formData.get('isVerified') === 'yes',
        isActive: formData.get('isActive') === 'enabled',
        discountValue: formData.get('discountValue'), // Might extract from title or manual input if added
        seoTitle: formData.get('seoTitle'),
        seoDescription: formData.get('seoDescription'),
        imageUrl: formData.get('imageUrl'),
    };

    const validatedFields = CouponSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;

    try {
        await connectToDatabase();

        // Verify store exists
        const store = await StoreModel.findById(data.storeId);
        if (!store) {
            return { message: 'Selected store does not exist' };
        }

        // Verify category exists
        const category = await CategoryModel.findById(data.categoryId);
        if (!category) {
            return { message: 'Selected category does not exist' };
        }

        await Coupon.create({
            title: data.title,
            code: data.code,
            tagLine: data.tagLine,
            description: data.description,
            store: data.storeId,
            category: data.categoryId,
            subCategory: data.subCategoryId || undefined,
            startDate: data.startDate ? new Date(data.startDate) : undefined,
            expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
            trackingLink: data.trackingLink,
            couponType: data.couponType,
            isExclusive: data.isExclusive || false,
            isFeatured: data.isFeatured || false,
            isVerified: data.isVerified || false,
            isActive: data.isActive || true,
            discountValue: data.discountValue,
            seoTitle: data.seoTitle,
            seoDescription: data.seoDescription,
            imageUrl: data.imageUrl,
        });

        revalidatePath('/admin/coupons');
    } catch (error) {
        console.error(error);
        return { message: 'Failed to create coupon' };
    }

    redirect('/admin/coupons');
}

export async function deleteCoupon(id: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await Coupon.findByIdAndDelete(id);
        revalidatePath('/admin/coupons');
        return { message: 'Coupon deleted' };
    } catch (error) {
        return { message: 'Error deleting coupon' };
    }
}
