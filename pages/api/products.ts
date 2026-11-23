import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/prisma';
import { or } from '@prisma/orm-postgres/orm-client';

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
        const db = getDb();

        let col = db.orm.public.Product.where({ isActive: true });

        if (search) {
            col = col.where((p) => or(
                p.name.ilike(`%${search}%`),
                p.description.ilike(`%${search}%`),
            ));
        }
        if (category) {
            col = col.where({ categoryId: category });
        }
        if (condition) {
            col = col.where({ condition: condition as any });
        }
        if (minPrice) {
            col = col.where((p) => p.price.gte(String(parseFloat(minPrice))));
        }
        if (maxPrice) {
            col = col.where((p) => p.price.lte(String(parseFloat(maxPrice))));
        }
        if (city) {
            col = col.where((p) => p.city.ilike(`%${city}%`));
        }

        const [productData, totalCount] = await Promise.all([
            col
                .include('seller', (s) => s.include('sellerProfile'))
                .include('category')
                .include('images', (img) => img.where({ isPrimary: true }).limit(1))
                .orderBy((p) => p.createdAt.desc())
                .offset((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .all(),
            col.aggregate((a) => ({ total: a.count() })),
        ]);

        const totalPages = Math.ceil(totalCount.total / ITEMS_PER_PAGE);

        return res.status(200).json({
            products: productData.map((p: any) => ({
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
