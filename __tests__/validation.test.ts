import { registerSchema, loginSchema, productSchema, categorySchema } from '@/lib/validation';

describe('Validation Schemas', () => {
    describe('registerSchema', () => {
        it('should validate a valid registration', () => {
            const validData = {
                name: 'João Silva',
                email: 'joao@example.com',
                password: 'Senha123!',
                confirmPassword: 'Senha123!',
            };
            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject short name', () => {
            const invalidData = {
                name: 'J',
                email: 'joao@example.com',
                password: 'Senha123!',
                confirmPassword: 'Senha123!',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject invalid email', () => {
            const invalidData = {
                name: 'João Silva',
                email: 'invalid-email',
                password: 'Senha123!',
                confirmPassword: 'Senha123!',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject weak password', () => {
            const invalidData = {
                name: 'João Silva',
                email: 'joao@example.com',
                password: '123',
                confirmPassword: '123',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject mismatched passwords', () => {
            const invalidData = {
                name: 'João Silva',
                email: 'joao@example.com',
                password: 'Senha123!',
                confirmPassword: 'OutraSenha123!',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('loginSchema', () => {
        it('should validate valid login credentials', () => {
            const validData = {
                email: 'joao@example.com',
                password: 'Senha123!',
            };
            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject empty password', () => {
            const invalidData = {
                email: 'joao@example.com',
                password: '',
            };
            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('productSchema', () => {
        it('should validate a valid product', () => {
            const validData = {
                name: 'Smartphone Samsung',
                description: 'Um smartphone moderno com ótima câmera',
                price: '50000',
                categoryId: 'cat-1',
                condition: 'NEW',
                location: 'Luanda',
                city: 'Luanda',
                stock: '10',
            };
            const result = productSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject negative price', () => {
            const invalidData = {
                name: 'Produto',
                description: 'Descrição do produto',
                price: '-100',
                categoryId: 'cat-1',
                condition: 'NEW',
                location: 'Luanda',
                city: 'Luanda',
                stock: '10',
            };
            const result = productSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('categorySchema', () => {
        it('should validate a valid category', () => {
            const validData = {
                name: 'Eletrônicos',
                slug: 'eletronicos',
                description: 'Produtos eletrônicos',
            };
            const result = categorySchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject short name', () => {
            const invalidData = {
                name: 'E',
                slug: 'eletronicos',
            };
            const result = categorySchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});