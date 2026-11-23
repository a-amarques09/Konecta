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
        return res.status(401).json({ error: 'Você precisa estar logado para anunciar produtos' });
    }

    const {
        name,
        description,
        price,
        categoryId,
        condition,
        location,
        city,
        stock,
        images,
    } = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
        name: string;
        description: string;
        price: string;
        categoryId: string;
        condition: string;
        location: string;
        city: string;
        stock: string;
        images: Array<{ name: string }>;
    };

    if (!categoryId) {
        return res.status(400).json({ error: 'Selecione uma categoria' });
    }
    if (!images || images.length === 0) {
        return res.status(400).json({ error: 'Pelo menos uma imagem é obrigatória' });
    }

    try {
        const db = getDb();

        const sellerProfile = await db.orm.public.SellerProfile
            .where({ userId: session.user.id })
            .first();

        if (!sellerProfile) {
            return res.status(400).json({ error: 'Você precisa se cadastrar como vendedor primeiro' });
        }

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-+$/, '');

        const product = await db.orm.public.Product.create({
            name,
            slug,
            description,
            price: String(parseFloat(price)),
            currency: 'KZ',
            stock: parseInt(stock, 10) || 0,
            condition: condition as any,
            location,
            city,
            country: 'Angola',
            sellerId: session.user.id,
            categoryId,
            isActive: true,
            images: (i: any) =>
                i.create(
                    images.map((file, index) => ({
                        url: `/uploads/${file.name}`,
                        alt: name,
                        isPrimary: index === 0,
                    }))
                ),
        });

        return res.status(200).json({ slug: product.slug });
    } catch (error: any) {
        console.error('Error creating product:', error);
        return res.status(500).json({ error: 'Erro ao criar produto. Tente novamente.' });
    }
}
