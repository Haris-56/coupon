
'use server';

import StoreModel from '@/models/Store';
import { connectToDatabase } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';

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

export async function createStore(prevState: any, formData: FormData) {
    const session = await verifySession();
    if (!session.isAuth || (session.role !== 'ADMIN' && session.role !== 'EDITOR')) {
        return { message: 'Unauthorized' };
    }

    // Rough slug generation if not provided (though form usually requires it)
    let slug = formData.get('slug') as string;
    if (!slug && formData.get('name')) {
        slug = (formData.get('name') as string).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    const validatedFields = StoreSchema.safeParse({
        name: formData.get('name'),
        slug: slug,
        description: formData.get('description'),
        affiliateLink: formData.get('affiliateLink'),
        url: formData.get('url'),
        country: formData.get('country'),
        network: formData.get('network'),
        isFeatured: formData.get('isFeatured') === 'yes', // Form sends "yes"/"no" or checkbox "on"
        isActive: formData.get('isActive') === 'enabled', // Form sends "enabled"
        seoTitle: formData.get('seoTitle'),
        seoDescription: formData.get('seoDescription'),
        logoUrl: formData.get('logoUrl'), // We might need to handle file upload separately or assume URL for now.
    });

    if (!validatedFields.success) {
        return { errors: validatedFields.error.flatten().fieldErrors };
    }

    const data = validatedFields.data;

    try {
        await connectToDatabase();

        // Check for unique slug
        const existing = await StoreModel.findOne({ slug: data.slug });
        if (existing) {
            // Append random string to make unique if auto-generated, or error if manual
            return { errors: { slug: ['Slug already exists'] } };
        }

        await StoreModel.create({
            ...data,
            isActive: data.isActive !== undefined ? data.isActive : true, // Default true
        });

        revalidatePath('/admin/stores');
    } catch (error) {
        console.error(error);
        return { message: 'Failed to create store' };
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
