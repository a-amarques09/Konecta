import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
        return res.status(401).json({ error: 'Você precisa estar logado para se cadastrar como vendedor' });
    }

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as Record<string, string>;

    try {
        const existingSeller = await prisma.sellerProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (existingSeller) {
            return res.status(400).json({ error: 'Você já possui um perfil de vendedor cadastrado' });
        }

        await prisma.sellerProfile.create({
            data: {
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
            },
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: { role: 'SELLER' },
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error creating seller profile:', error);
        return res.status(500).json({ error: 'Erro ao criar perfil de vendedor. Tente novamente.' });
    }
}
