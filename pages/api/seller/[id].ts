import { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query as { id: string };

    try {
        const db = getDb();

        const profile = await db.orm.public.SellerProfile
            .where({ id })
            .include('user', (u) =>
                u.include('products', (p) =>
                    p
                        .where({ isActive: true })
                        .include('images', (img) =>
                            img.where({ isPrimary: true }).limit(1)
                        )
                        .orderBy((pr) => pr.createdAt.desc())
                )
            )
            .first();

        if (!profile) {
            return res.status(404).json({ error: 'Vendedor não encontrado' });
        }

        const user = profile.user as any;

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
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                products: user.products.map((p: any) => ({
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
