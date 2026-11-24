import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const products = await prisma.product.findMany({
            where: { isActive: true, isFeatured: true },
            include: {
                seller: {
                    include: {
                        sellerProfile: true,
                    },
                },
                images: {
                    where: { isPrimary: true },
                    take: 1,
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 8,
        });

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
