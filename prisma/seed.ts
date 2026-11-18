import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create categories
    const categories = await Promise.all([
        prisma.category.create({
            data: {
                name: 'Eletrônicos',
                slug: 'eletronicos',
                description: 'Smartphones, laptops, acessórios e mais',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Moda',
                slug: 'moda',
                description: 'Roupas, calçados e acessórios',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Casa e Decoração',
                slug: 'casa-decoracao',
                description: 'Móveis, decoração e utensílios domésticos',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Automóveis',
                slug: 'automoveis',
                description: 'Carros, motos e peças',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Imóveis',
                slug: 'imoveis',
                description: 'Casas, apartamentos e terrenos',
            },
        }),
        prisma.category.create({
            data: {
                name: 'Serviços Profissionais',
                slug: 'servicos-profissionais',
                description: 'Serviços de profissionais autônomos',
            },
        }),
    ]);

    console.log(`✅ Created ${categories.length} categories`);

    // Create admin user
    const adminUser = await prisma.user.create({
        data: {
            name: 'Administrador',
            email: 'admin@konecta.ao',
            password: '$2a$12$LQv3c1yqBWVhxEgwL5fOi.PQpR.qVrFhZ8G8J8J8J8J8J8J8J8J8J', // hashed 'admin123'
            role: 'ADMIN',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Created admin user');

    // Create sample sellers
    const sellers = await Promise.all([
        prisma.user.create({
            data: {
                name: 'João Silva',
                email: 'joao@konecta.ao',
                password: '$2a$12$LQv3c1yqBWVhxEgwL5fOi.PQpR.qVrFhZ8G8J8J8J8J8J8J8J8J8J', // hashed 'seller123'
                role: 'SELLER',
                emailVerified: new Date(),
                sellerProfile: {
                    create: {
                        businessName: 'Tech Store Angola',
                        businessType: 'Eletrônicos',
                        description: 'Loja especializada em eletrônicos e acessórios em Luanda',
                        address: 'Rua Major Kanhangulo, 123',
                        city: 'Luanda',
                        phone: '+244 923 456 789',
                        email: 'joao@konecta.ao',
                        website: 'https://techstore.ao',
                        isVerified: true,
                    },
                },
            },
            include: { sellerProfile: true },
        }),
        prisma.user.create({
            data: {
                name: 'Maria Santos',
                email: 'maria@konecta.ao',
                password: '$2a$12$LQv3c1yqBWVhxEgwL5fOi.PQpR.qVrFhZ8G8J8J8J8J8J8J8J8J8J', // hashed 'seller123'
                role: 'SELLER',
                emailVerified: new Date(),
                sellerProfile: {
                    create: {
                        businessName: 'Moda & Estilo',
                        businessType: 'Vestuário',
                        description: 'Roupas e acessórios de moda para toda a família',
                        address: 'Avenida 4 de Fevereiro, 456',
                        city: 'Luanda',
                        phone: '+244 934 567 890',
                        email: 'maria@konecta.ao',
                        website: '',
                        isVerified: false,
                    },
                },
            },
            include: { sellerProfile: true },
        }),
    ]);

    console.log(`✅ Created ${sellers.length} sellers`);

    // Create sample products
    const products = await Promise.all([
        prisma.product.create({
            data: {
                name: 'Smartphone Samsung Galaxy S23',
                description: 'Smartphone novo com 128GB de armazenamento, câmera de 50MP e bateria de longa duração',
                price: 85000,
                condition: 'NEW',
                location: 'Luanda',
                city: 'Luanda',
                stock: 5,
                slug: 'smartphone-samsung-galaxy-s23',
                categoryId: categories[0].id,
                sellerId: sellers[0].id,
                images: {
                    create: [
                        { url: '/images/smartphone.jpg', isPrimary: true },
                        { url: '/images/electronics.jpg', isPrimary: false },
                    ],
                },
            },
        }),
        prisma.product.create({
            data: {
                name: 'Vestido de Verão Feminino',
                description: 'Vestido leve e confortável para o verão, tamanho M, cor azul',
                price: 3500,
                condition: 'NEW',
                location: 'Luanda',
                city: 'Luanda',
                stock: 20,
                slug: 'vestido-verao-feminino',
                categoryId: categories[1].id,
                sellerId: sellers[1].id,
                images: {
                    create: [
                        { url: '/images/fashion.jpg', isPrimary: true },
                    ],
                },
            },
        }),
        prisma.product.create({
            data: {
                name: 'Mesa de Jantar em Madeira',
                description: 'Mesa de jantar em madeira maciça para 6 pessoas, excelente estado',
                price: 45000,
                condition: 'USED',
                location: 'Luanda',
                city: 'Luanda',
                stock: 1,
                slug: 'mesa-jantar-madeira',
                categoryId: categories[2].id,
                sellerId: sellers[0].id,
                images: {
                    create: [
                        { url: '/images/home-decor.jpg', isPrimary: true },
                    ],
                },
            },
        }),
        prisma.product.create({
            data: {
                name: 'Toyota Corolla 2018',
                description: 'Carro em excelente estado, revisado, com documento em dia',
                price: 2500000,
                condition: 'USED',
                location: 'Luanda',
                city: 'Luanda',
                stock: 1,
                slug: 'toyota-corolla-2018',
                categoryId: categories[3].id,
                sellerId: sellers[0].id,
                images: {
                    create: [
                        { url: '/images/car.jpg', isPrimary: true },
                    ],
                },
            },
        }),
    ]);

    console.log(`✅ Created ${products.length} products`);

    // Create sample customer
    const customer = await prisma.user.create({
        data: {
            name: 'Cliente Exemplo',
            email: 'cliente@konecta.ao',
            password: '$2a$12$LQv3c1yqBWVhxEgwL5fOi.PQpR.qVrFhZ8G8J8J8J8J8J8J8J8J8J', // hashed 'customer123'
            role: 'CUSTOMER',
            emailVerified: new Date(),
        },
    });

    console.log('✅ Created customer user');

    console.log('🎉 Database seed completed successfully!');
    console.log('\n📋 Test Accounts:');
    console.log('  Admin:    admin@konecta.ao / admin123');
    console.log('  Seller 1: joao@konecta.ao / seller123');
    console.log('  Seller 2: maria@konecta.ao / seller123');
    console.log('  Customer: cliente@konecta.ao / customer123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });