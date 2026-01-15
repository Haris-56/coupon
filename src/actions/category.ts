
'use server';

import Category from '@/models/Category';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import crypto from 'crypto';
import { redirect } from 'next/navigation';

const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB

const CategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be kebab-case'),
    description: z.string().optional(),
    icon: z.string().optional(),
    isShowInMenu: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    imageUrl: z.string().optional(),
});

async function handleFileUpload(imageFile: File | null) {
    if (!imageFile || imageFile.size === 0) return null;
    if (imageFile.size > MAX_FILE_SIZE) throw new Error('Image size exceeds 3MB limit');

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const fileExtension = imageFile.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'categories');

    try {
        await mkdir(uploadDir, { recursive: true });
        const path = join(uploadDir, fileName);
        await writeFile(path, buffer);
        return `/uploads/categories/${fileName}`;
    } catch (error) {
        console.error('File upload error:', error);
        throw new Error('Failed to upload image');
    }
}

export async function createCategory(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    let slug = formData.get('slug') as string;
    if (!slug && formData.get('name')) {
        slug = (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    try {
        const imageUrl = await handleFileUpload(formData.get('image') as File | null);

        const validatedFields = CategorySchema.safeParse({
            name: formData.get('name'),
            slug: slug,
            description: formData.get('description'),
            icon: formData.get('icon'),
            isShowInMenu: formData.get('isShowInMenu') === 'yes',
            isFeatured: formData.get('isFeatured') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            seoTitle: formData.get('seoTitle'),
            seoDescription: formData.get('seoDescription'),
            imageUrl: imageUrl || undefined,
        });

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;
        await connectToDatabase();

        const existing = await Category.findOne({ slug: data.slug });
        if (existing) {
            return { errors: { slug: ['Slug already exists'] } };
        }

        await Category.create(data);
        revalidatePath('/admin/categories');
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to create category' };
    }

    redirect('/admin/categories');
}

export async function updateCategory(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    const id = formData.get('id') as string;
    if (!id) return { message: 'Category ID is required' };

    try {
        await connectToDatabase();
        const existingCategory = await Category.findById(id);
        if (!existingCategory) return { message: 'Category not found' };

        const imageUrl = await handleFileUpload(formData.get('image') as File | null);

        const validatedFields = CategorySchema.safeParse({
            name: formData.get('name'),
            slug: formData.get('slug'),
            description: formData.get('description'),
            icon: formData.get('icon'),
            isShowInMenu: formData.get('isShowInMenu') === 'yes',
            isFeatured: formData.get('isFeatured') === 'yes',
            isActive: formData.get('isActive') === 'enabled',
            seoTitle: formData.get('seoTitle'),
            seoDescription: formData.get('seoDescription'),
            imageUrl: imageUrl || existingCategory.imageUrl,
        });

        if (!validatedFields.success) {
            return { errors: validatedFields.error.flatten().fieldErrors };
        }

        const data = validatedFields.data;

        // Check if slug is taken
        const slugCheck = await Category.findOne({ slug: data.slug, _id: { $ne: id } });
        if (slugCheck) return { errors: { slug: ['Slug already exists'] } };

        await Category.findByIdAndUpdate(id, data);

        revalidatePath('/admin/categories');
        revalidatePath(`/admin/categories/edit/${id}`);
    } catch (error: any) {
        console.error(error);
        return { message: error.message || 'Failed to update category' };
    }

    redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
    const session = await verifySession();
    if (!session.isAuth || session.role !== 'ADMIN') {
        return { message: 'Unauthorized' };
    }

    try {
        await connectToDatabase();
        await Category.findByIdAndDelete(id);
        revalidatePath('/admin/categories');
        return { message: 'Category deleted' };
    } catch (error) {
        return { message: 'Error deleting category' };
    }
}
