import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { getDb } from '@/lib/prisma';
import { getAuthOptions } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, getAuthOptions());
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Você precisa estar logado para se cadastrar como vendedor' });
    }

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as Record<string, string>;

    try {
        const db = getDb();

        const existingSeller = await db.orm.public.SellerProfile
            .where({ userId: session.user.id })
            .first();

        if (existingSeller) {
            return res.status(400).json({ error: 'Você já possui um perfil de vendedor cadastrado' });
        }

        await db.orm.public.SellerProfile.create({
            userId: session.user.id,
            businessName: body.businessName,
            businessType: body.businessType,
            description: body.description,
            address: body.address,
            city: body.city,
            country: 'Angola',
            phone: body.phone,
            email: body.email,
            website: body.website || null,
            isVerified: false,
        });

        await db.orm.public.User
            .where({ id: session.user.id })
            .update({ role: 'SELLER' as never });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error creating seller profile:', error);
        return res.status(500).json({ error: 'Erro ao criar perfil de vendedor. Tente novamente.' });
    }
}
