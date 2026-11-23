import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as {
        name: string;
        email: string;
        password: string;
        phone?: string;
    };

    try {
        const db = getDb();

        const existingUser = await db.orm.public.User
            .where((u) => u.email.eq(body.email))
            .first();

        if (existingUser) {
            return res.status(400).json({ error: 'Este email já está cadastrado' });
        }

        const hashedPassword = await bcrypt.hash(body.password, 12);

        await db.orm.public.User.create({
            name: body.name,
            email: body.email,
            password: hashedPassword,
            phone: body.phone || null,
            role: 'CUSTOMER' as never,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ error: 'Erro ao criar conta. Tente novamente.' });
    }
}
