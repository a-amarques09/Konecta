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
        const sellers = await prisma.user.findMany({
            where: {
                role: 'SELLER',
                sellerProfile: {
                    isNot: null,
                },
            },
            include: {
                sellerProfile: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        const formattedSellers = sellers.map((s: any) => ({
            id: s.id,
            name: s.name,
            email: s.email,
            businessName: s.sellerProfile?.businessName || '',
            businessType: s.sellerProfile?.businessType || '',
            description: s.sellerProfile?.description || '',
            city: s.sellerProfile?.city || '',
            country: s.sellerProfile?.country || '',
            phone: s.sellerProfile?.phone || '',
            image: s.sellerProfile?.image || null,
            rating: s.sellerProfile?.rating ? Number(s.sellerProfile.rating) : 0,
            totalSales: s.sellerProfile?.totalSales || 0,
            isVerified: s.sellerProfile?.isVerified || false,
            createdAt: s.createdAt,
        }));

        return res.status(200).json(formattedSellers);
    } catch (error: any) {
        console.error('Error fetching sellers:', error);
        return res.status(500).json({ error: 'Erro ao carregar vendedores' });
    }
}