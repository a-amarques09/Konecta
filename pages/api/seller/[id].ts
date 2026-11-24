import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query as { id: string };

    try {
        const profile = await prisma.sellerProfile.findUnique({
            where: { id },
            include: {
                user: {
                    include: {
                        products: {
                            where: { isActive: true },
                            include: {
                                images: {
                                    where: { isPrimary: true },
                                    take: 1,
                                },
                            },
                            orderBy: { createdAt: 'desc' },
                        },
                    },
                },
            },
        });

        if (!profile) {
            return res.status(404).json({ error: 'Vendedor não encontrado' });
        }

        return res.status(200).json({
            id: profile.id,
            businessName: profile.businessName,
            businessType: profile.businessType,
            description: profile.description,
            address: profile.address,
            city: profile.city,
            country: profile.country,
            phone: profile.phone,
            email: profile.email,
            website: profile.website,
            isVerified: profile.isVerified,
            rating: Number(profile.rating),
            totalSales: profile.totalSales,
            createdAt: profile.createdAt,
            user: {
                id: profile.user.id,
                name: profile.user.name,
                email: profile.user.email,
                image: profile.user.image,
                products: profile.user.products.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    description: p.description,
                    isActive: p.isActive,
                    images: p.images,
                })),
            },
        });
    } catch (error) {
        console.error('Error loading seller profile:', error);
        return res.status(500).json({ error: 'Erro ao carregar perfil do vendedor' });
    }
}
