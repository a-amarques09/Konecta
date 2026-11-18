import Image from 'next/image';

const professionals = [
    {
        name: 'João Silva',
        title: 'Desenvolvedor Web',
        location: 'Luanda',
        image: '/images/professional-services.jpg',
    },
    {
        name: 'Maria Costa',
        title: 'Designer Gráfico',
        location: 'Benguela',
        image: '/images/professional-services.jpg',
    },
    {
        name: 'Carlos Mendes',
        title: 'Arquiteto',
        location: 'Huambo',
        image: '/images/professional-services.jpg',
    },
    {
        name: 'Ana Ferreira',
        title: 'Consultora Financeira',
        location: 'Lubango',
        image: '/images/professional-services.jpg',
    },
];

const FeaturedProfessionals: React.FC = () => {
    return (
        <section className="bg-[#F5F7FA] py-16 px-6">
            <h2 className="text-3xl font-bold text-[#101B35] text-center mb-8">
                Profissionais em Destaque
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {professionals.map((professional, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                    >
                        <div className="relative h-40 overflow-hidden rounded-t-lg bg-gray-200">
                            <Image
                                src={professional.image}
                                alt={professional.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 24vw, 12vw"
                                priority={false}
                                loading="lazy"
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AD//2Q=="
                            />
                        </div>
                        <div className="p-4 text-center">
                            <h3 className="text-lg font-semibold text-[#101B35] mb-1">
                                {professional.name}
                            </h3>
                            <p className="text-[#2563EB] font-medium text-sm mb-2">
                                {professional.title}
                            </p>
                            <p className="text-gray-500 text-sm">
                                {professional.location}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedProfessionals;
