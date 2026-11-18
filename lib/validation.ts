import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z
        .string()
        .min(8, 'Senha deve ter pelo menos 8 caracteres')
        .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
        .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
        .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
        .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
});

export const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
});

export const sellerProfileSchema = z.object({
    businessName: z.string().min(2, 'Nome do negócio deve ter pelo menos 2 caracteres'),
    businessType: z.string().min(1, 'Tipo de negócio é obrigatório'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    address: z.string().min(5, 'Endereço deve ter pelo menos 5 caracteres'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    phone: z.string().min(8, 'Telefone deve ter pelo menos 8 caracteres'),
    email: z.string().email('Email inválido'),
    website: z.string().url('URL inválida').optional().or(z.literal('')),
});

export const productSchema = z.object({
    name: z.string().min(3, 'Nome do produto deve ter pelo menos 3 caracteres'),
    description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
    price: z.string().refine(
        (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
        'Preço deve ser um número válido maior que zero'
    ),
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
    condition: z.enum(['NEW', 'USED', 'REFURBISHED']),
    location: z.string().min(2, 'Localização deve ter pelo menos 2 caracteres'),
    city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
    stock: z.string().refine(
        (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
        'Estoque deve ser um número válido'
    ),
});

export const categorySchema = z.object({
    name: z.string().min(2, 'Nome da categoria deve ter pelo menos 2 caracteres'),
    slug: z.string().min(2, 'Slug deve ter pelo menos 2 caracteres'),
    description: z.string().optional(),
    parentId: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SellerProfileInput = z.infer<typeof sellerProfileSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;