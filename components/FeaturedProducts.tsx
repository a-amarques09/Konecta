import ProductCard from './ProductCard';

const products = [
    {
        name: 'Smartphone Samsung Z Flip 8',
        price: '150,000 Kz',
        location: 'Luanda',
        seller: 'TechStore Angola',
        image: '/images/smartphone.jpg',
    },
    {
        name: 'Lamborghini Urus 2021',
        price: '8,500,000 Kz',
        location: 'Benguela',
        seller: 'AutoPrime',
        image: '/images/car.jpg',
    },
    {
        name: 'Apartamento T3 - Talatona',
        price: '25,000,000 Kz',
        location: 'Luanda',
        seller: 'Imóveis Premium',
        image: '/images/apartment.jpg',
    },
    {
        name: 'Relógio Rolex Submariner',
        price: '3,000,000 Kz',
        location: 'Huambo',
        seller: 'Luxury Timepieces',
        image: '/images/watch.jpg',
    },
];

const FeaturedProducts: React.FC = () => {
    return (
        <section className="bg-[#F5F7FA] py-16 px-6">
            <h2 className="text-3xl font-bold text-[#101B35] text-center mb-8">
                Produtos em Destaque
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        name={product.name}
                        price={product.price}
                        location={product.location}
                        seller={product.seller}
                        image={product.image}
                    />
                ))}
            </div>
        </section>
    );
};

export default FeaturedProducts;