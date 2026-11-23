import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const db = getDb();

        const products = await db.orm.public.Product
            .where({ isActive: true, isFeatured: true })
            .include('seller', (s) => s.include('sellerProfile'))
            .include('images', (img) => img.where({ isPrimary: true }).limit(1))
            .orderBy((p) => p.createdAt.desc())
            .limit(8)
            .all();

        const formattedProducts = products.map((p: any) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
            currency: p.currency,
            city: p.city,
            country: p.country,
            slug: p.slug,
            images: p.images,
            seller: {
                id: p.seller.id,
                name: p.seller.name,
                sellerProfile: p.seller.sellerProfile,
            },
        }));

        return res.status(200).json(formattedProducts);
    } catch (error: any) {
        console.error('Error fetching featured products:', error);
        const status = error?.status || 500;
        return res.status(status).json({
            error: error?.message || 'Internal server error',
            ...(process.env.NODE_ENV === 'development' && {
                details: error?.stack,
                status,
            }),
        });
    }
}
