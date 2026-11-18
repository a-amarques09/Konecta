import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/ProductCard';

describe('ProductCard Component', () => {
    const mockProduct = {
        id: '1',
        name: 'Smartphone Samsung',
        description: 'Um smartphone moderno',
        price: 50000,
        condition: 'NEW',
        city: 'Luanda',
        images: [{ url: '/images/smartphone.jpg' }],
        seller: {
            id: 'seller-1',
            name: 'João Silva',
            businessName: 'Tech Store',
            isVerified: true,
        },
        category: { name: 'Eletrônicos' },
        createdAt: new Date(),
    };

    it('renders product name and price', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText('Smartphone Samsung')).toBeInTheDocument();
        expect(screen.getByText(/50.000/)).toBeInTheDocument();
    });

    it('renders seller information', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText('Tech Store')).toBeInTheDocument();
        expect(screen.getByText('Luanda')).toBeInTheDocument();
    });

    it('shows verified badge for verified sellers', () => {
        render(<ProductCard product={mockProduct} />);
        expect(screen.getByText('Verificado')).toBeInTheDocument();
    });
});