import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { slug } = req.query as { slug: string };

    try {
        const db = getDb();

        const cat = await db.orm.public.Category
            .where({ slug })
            .include('products', (p) =>
                p
                    .where({ isActive: true })
                    .include('images', (img) =>
                        img.where({ isPrimary: true }).limit(1)
                    )
                    .include('seller', (s) => s.include('sellerProfile'))
                    .orderBy((pr) => pr.createdAt.desc())
            )
            .include('children', (ch) => ch.include('products', (p) => p.count()))
            .include('parent')
            .first();

        if (!cat) {
            return res.status(404).json({ error: 'Categoria não encontrada' });
        }

        return res.status(200).json({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            image: cat.image,
            parentId: cat.parentId,
            products: (cat.products as any[]).map((p) => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                price: Number(p.price),
                description: p.description,
                location: p.location,
                city: p.city,
                isActive: p.isActive,
                images: p.images,
                seller: {
                    id: p.seller.id,
                    name: p.seller.name,
                    sellerProfile: p.seller.sellerProfile,
                },
            })),
            children: (cat.children as any[]).map((ch) => ({
                id: ch.id,
                name: ch.name,
                slug: ch.slug,
                _count: { products: ch.products },
            })),
            parent: cat.parent,
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
