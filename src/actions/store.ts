
'use server';

import StoreModel from '@/models/Store';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const StoreSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
    description: z.string().optional(),
    affiliateLink: z.string().optional().or(z.literal('')),
    url: z.string().optional().or(z.literal('')),
    country: z.string().optional(),
    network: z.string().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    logoUrl: z.string().optional(),
});

async function handleFileUpload(imageFile: File | null) {
    if (!imageFile || imageFile.size === 0) return null;
    if (imageFile.size > MAX_FILE_SIZE) throw new Error('Image size exceeds 3MB limit');

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = imageFile.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'stores');

    try {
        await mkdir(uploadDir, { recursive: true });
        const path = join(uploadDir, fileName);
        await writeFile(path, buffer);
        return `/uploads/stores/${fileName}`;
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error('Failed to upload image');
    }
}

export async function createStore(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    let slug = formData.get('slug') as string;
    if (!slug && formData.get('name')) {
        slug = (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    try {
        const logoUrl = await handleFileUpload(formData.get('imageFile') as File | null);

        const validatedFields = StoreSchema.safeParse({
            name: formData.get('name'),
            slug: slug,
            description: formData.get('description'),
            affiliateLink: formData.get('affiliateLink'),
            url: formData.get('url'),
            country: formData.get('country'),
            network: formData.get('network'),
            isFeatured: formData.get('isFeatured') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            seoTitle: formData.get('seoTitle'),
            seoDescription: formData.get('seoDescription'),
            logoUrl: logoUrl || undefined,
        });

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;
        await connectToDatabase();

        const existing = await StoreModel.findOne({ slug: data.slug });
        if (existing) {
            return { errors: { slug: ['Slug already exists'] } };
        }

        await StoreModel.create({
            ...data,
            isActive: data.isActive !== undefined ? data.isActive : true,
        });

        revalidatePath('/admin/stores');
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to create store' };
    }

    redirect('/admin/stores');
}

export async function updateStore(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    const id = formData.get('id') as string;
    if (!id) return { message: 'Store ID is required' };

    try {
        await connectToDatabase();
        const existingStore = await StoreModel.findById(id);
        if (!existingStore) return { message: 'Store not found' };

        const logoUrl = await handleFileUpload(formData.get('imageFile') as File | null);

        const validatedFields = StoreSchema.safeParse({
            name: formData.get('name'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            affiliateLink: formData.get('affiliateLink'),
            url: formData.get('url'),
            country: formData.get('country'),
            network: formData.get('network'),
            isFeatured: formData.get('isFeatured') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            seoTitle: formData.get('seoTitle'),
            seoDescription: formData.get('seoDescription'),
            logoUrl: logoUrl || existingStore.logoUrl,
        });

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;

        // Check if slug is taken by another store
        const slugCheck = await StoreModel.findOne({ slug: data.slug, _id: { $ne: id } });
        if (slugCheck) {
            return { errors: { slug: ['Slug already exists'] } };
        }

        await StoreModel.findByIdAndUpdate(id, data);

        revalidatePath('/admin/stores');
        revalidatePath(`/admin/stores/edit/${id}`);
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to update store' };
    }

    redirect('/admin/stores');
}

export async function deleteStore(id: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') { // Only Admin can delete
        return { message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await StoreModel.findByIdAndDelete(id);
        revalidatePath('/admin/stores');
        return { message: 'Store deleted' };
    } catch (error) {
        return { message: 'Error deleting store' };
    }
}
