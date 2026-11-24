import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const profile = await prisma.sellerProfile.findUnique({
            where: { userId: session.user.id },
            include: {
                user: {
                    include: {
                        products: {
                            include: {
                                orderItems: true,
                            },
                        },
                    },
                },
            },
        });

        if (!profile) {
            return res.status(200).json(null);
        }

        return res.status(200).json({
            ...profile,
            rating: Number(profile.rating),
            user: {
                ...profile.user,
                products: profile.user.products.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    isActive: p.isActive,
                    createdAt: p.createdAt,
                    _count: { orderItems: p.orderItems.length },
                })),
            },
        });
    } catch (error) {
        console.error('Error loading seller data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
