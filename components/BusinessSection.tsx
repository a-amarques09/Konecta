import Image from 'next/image';

const businesses = [
    {
        name: 'Tech Solutions Angola',
        description: 'Especialistas em desenvolvimento de software e soluções digitais.',
        location: 'Luanda',
        image: '/images/business1.jpg',
    },
    {
        name: 'Construções Premium',
        description: 'Empresa líder em construção civil e arquitetura.',
        location: 'Benguela',
        image: '/images/business2.jpg',
    },
    {
        name: 'Design Studio 360',
        description: 'Profissionais de design gráfico e branding.',
        location: 'Huambo',
        image: '/images/business3.jpg',
    },
    {
        name: 'Consultores Financeiros',
        description: 'Consultoria financeira para empresas e indivíduos.',
        location: 'Lubango',
        image: '/images/business4.jpg',
    },
];

const BusinessSection: React.FC = () => {
    return (
        <section className="bg-white py-16 px-6">
            <h2 className="text-3xl font-bold text-[#101B35] text-center mb-8">
                Descubra Empresas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {businesses.map((business, index) => (
                    <div
                        key={index}
                        className="bg-[#F5F7FA] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    >
                        <div className="relative h-40 overflow-hidden rounded-t-lg bg-gray-200">
                            <Image
                                src={business.image}
                                alt={business.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 24vw, 12vw"
                                priority={false}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AD//2Q=="
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-[#101B35]">
                                {business.name}
                            </h3>
                            <p className="text-gray-500 mb-2">{business.description}</p>
                            <p className="text-gray-500">Localização: {business.location}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default BusinessSection;
