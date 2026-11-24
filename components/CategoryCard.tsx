// components/CategoryCard.tsx
import Image from 'next/image';

interface CategoryCardProps {
    name: string;
    image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image }) => {
    return (
        <div className="bg-[#F5F7FA] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
            <div className="relative h-32 sm:h-40 overflow-hidden rounded-t-lg bg-gray-200">
                <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 48vw, (max-width: 1024px) 24vw, 12vw"
                    priority={false}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAVAQEBAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/AD//2Q=="
                />
            </div>
            <div className="p-3 sm:p-4 text-center">
                <h3 className="text-base sm:text-lg font-semibold text-[#101B35]">{name}</h3>
            </div>
        </div>
    );
};

export default CategoryCard;
