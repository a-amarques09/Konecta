import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getSession({ req });

    if (!session) {
        return res.status(401).json({ error: 'Não autorizado' });
    }

    if (req.method === 'POST') {
        try {
            const { title, description, category, location, city, country, budget } = req.body;

            if (!title || !description || !category || !location || !city) {
                return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
            }

            const request = await prisma.request.create({
                data: {
                    title,
                    description,
                    category,
                    location,
                    city,
                    country: country || 'Angola',
                    budget: budget ? parseFloat(budget) : null,
                    userId: session.user.id,
                },
            });

            return res.status(201).json(request);
        } catch (error) {
            console.error('Error creating request:', error);
            return res.status(500).json({ error: 'Erro ao criar procura' });
        }
    }

    if (req.method === 'GET') {
        try {
            const requests = await prisma.request.findMany({
                where: { isActive: true },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            });

            return res.status(200).json(requests);
        } catch (error) {
            console.error('Error fetching requests:', error);
            return res.status(500).json({ error: 'Erro ao buscar procuras' });
        }
    }

    return res.status(405).json({ error: 'Método não permitido' });
}