import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/prisma';
import { getAuthOptions } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, getAuthOptions());
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const db = getDb();

        const profile = await db.orm.public.SellerProfile
            .where({ userId: session.user.id })
            .include('user', (u) =>
                u.include('products', (p) =>
                    p.include('orderItems', (oi) => oi.count())
                )
            )
            .first();

        if (!profile) {
            return res.status(200).json(null);
        }

        const userProducts = (profile.user as any).products ?? [];

        return res.status(200).json({
            ...profile,
            rating: Number(profile.rating),
            user: {
                ...(profile.user as any),
                products: userProducts.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    isActive: p.isActive,
                    createdAt: p.createdAt,
                    _count: { orderItems: p.orderItems },
                })),
            },
        });
    } catch (error) {
        console.error('Error loading seller data:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
