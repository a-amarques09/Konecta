// components/ProductCard.tsx
import Image from 'next/image';

interface ProductCardProps {
    name: string;
    price: string;
    location: string;
    seller: string;
    image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, location, seller, image }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
            <div className="relative h-40 overflow-hidden rounded-t-lg bg-gray-200">
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
            <div className="p-4">
                <h3 className="text-lg font-semibold text-[#101B35]">{name}</h3>
                <p className="text-[#2563EB] font-bold">{price}</p>
                <p className="text-gray-500">{location}</p>
                <p className="text-gray-500">Vendedor: {seller}</p>
                <button className="mt-4 bg-[#2563EB] text-white px-4 py-2 rounded hover:bg-[#101B35]">
                    Contactar
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
