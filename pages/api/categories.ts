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

        const cats = await db.orm.public.Category
            .where((c) => c.parentId.isNull())
            .include('children', (ch) => ch.include('products', (p) => p.count()))
            .include('products', (p) => p.count())
            .orderBy((c) => c.name.asc())
            .all();

        const formatted = cats.map((c: any) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            image: c.image,
            parentId: c.parentId,
            _count: { products: c.products },
            children: (c.children ?? []).map((ch: any) => ({
                id: ch.id,
                name: ch.name,
                slug: ch.slug,
                description: ch.description,
                image: ch.image,
                parentId: ch.parentId,
                _count: { products: ch.products },
            })),
        }));

        return res.status(200).json(formatted);
    } catch (error: any) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
