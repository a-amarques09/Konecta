import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

const ITEMS_PER_PAGE = 12;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { search, category, condition, minPrice, maxPrice, city } = req.query as Record<string, string>;
    const page = Math.max(parseInt(String(req.query.page ?? '1'), 10) || 1, 1);

    try {
        const where: any = { isActive: true };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.categoryId = category;
        }
        if (condition) {
            where.condition = condition;
        }
        if (minPrice) {
            where.price = { ...where.price, gte: parseFloat(minPrice) };
        }
        if (maxPrice) {
            where.price = { ...where.price, lte: parseFloat(maxPrice) };
        }
        if (city) {
            where.city = { contains: city, mode: 'insensitive' };
        }

        const [products, totalCount] = await Promise.all([
            prisma.product.findMany({
                where,
                include: {
                    seller: {
                        include: {
                            sellerProfile: true,
                        },
                    },
                    category: true,
                    images: {
                        where: { isPrimary: true },
                        take: 1,
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * ITEMS_PER_PAGE,
                take: ITEMS_PER_PAGE,
            }),
            prisma.product.count({ where }),
        ]);

        const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

        return res.status(200).json({
            products: products.map((p: any) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: Number(p.price),
                currency: p.currency,
                condition: p.condition,
                city: p.city,
                country: p.country,
                isActive: p.isActive,
                images: p.images,
                seller: {
                    id: p.seller.id,
                    name: p.seller.name,
                    sellerProfile: p.seller.sellerProfile,
                },
                category: p.category,
            })),
            totalPages,
        });
    } catch (error: any) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
