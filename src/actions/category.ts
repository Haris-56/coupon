
'use server';

import Category from '@/models/Category';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const CategorySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().optional(),
    icon: z.string().optional(),
    isShowInMenu: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    imageUrl: z.string().optional(),
});

export async function createCategory(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    // Handle File Upload
    let imageUrl = '';
    const file = formData.get('image') as File;
    if (file && file.size > 0) {
        try {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filename = `${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase()}`;
            const uploadDir = path.join(process.cwd(), 'public', 'uploads');

            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true });

            await writeFile(path.join(uploadDir, filename), buffer);
            imageUrl = `/uploads/${filename}`;
        } catch (error) {
            console.error('File upload failed:', error);
            // Continue without image or return error? 
            // We'll continue but maybe set a warning? For now just log.
        }
    }

    // Auto-generate slug if empty
    let slug = formData.get('slug') as string;
    if (!slug && formData.get('name')) {
        slug = (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

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
        imageUrl: imageUrl,
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;

    try {
        await connectToDatabase();
        await Category.create(data);
        revalidatePath('/admin/categories');
        return { message: 'Category created', success: true };
    } catch (error) {
        console.error(error);
        return { message: 'Failed to create category' };
    }
}
