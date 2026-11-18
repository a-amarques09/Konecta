import CategoryCard from './CategoryCard';

const categories = [
    { name: 'Eletrónicos', image: '/images/electronics.jpg' },
    { name: 'Automóveis', image: '/images/cars.jpg' },
    { name: 'Imóveis', image: '/images/real-estate.jpg' },
    { name: 'Moda', image: '/images/fashion.jpg' },
    { name: 'Casa e decoração', image: '/images/home-decor.jpg' },
    { name: 'Alimentação', image: '/images/food.jpg' },
    { name: 'Construção', image: '/images/construction.jpg' },
    { name: 'Serviços profissionais', image: '/images/professional-services.jpg' },
];

const CategoriesSection: React.FC = () => {
    return (
        <section className="bg-white py-16 px-6">
            <h2 className="text-3xl font-bold text-[#101B35] text-center mb-8">
                Categorias
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                    <CategoryCard key={index} name={category.name} image={category.image} />
                ))}
            </div>
        </section>
    );
};

export default CategoriesSection;