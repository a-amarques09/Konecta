import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { slug } = req.query as { slug: string };

    try {
        const cat = await prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    where: { isActive: true },
                    include: {
                        images: {
                            where: { isPrimary: true },
                            take: 1,
                        },
                        seller: {
                            include: {
                                sellerProfile: true,
                            },
                        },
                    },
                    orderBy: { createdAt: 'desc' },
                },
                children: {
                    include: {
                        products: true,
                    },
                },
                parent: true,
            },
        });

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
            products: cat.products.map((p: any) => ({
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
            children: cat.children.map((ch: any) => ({
                id: ch.id,
                name: ch.name,
                slug: ch.slug,
                _count: { products: ch.products.length },
            })),
            parent: cat.parent,
        });
    } catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
