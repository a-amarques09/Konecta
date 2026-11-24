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
        const productData = await prisma.product.findUnique({
            where: { slug },
            include: {
                seller: {
                    include: {
                        sellerProfile: true,
                    },
                },
                category: true,
                images: true,
            },
        });

        if (!productData) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Increment view count
        await prisma.product.update({
            where: { id: productData.id },
            data: { views: productData.views + 1 },
        });

        const images = [...productData.images].sort(
            (a: any, b: any) => Number(b.isPrimary) - Number(a.isPrimary)
        );

        return res.status(200).json({ ...productData, images });
    } catch (error: any) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
