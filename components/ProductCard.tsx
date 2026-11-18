// components/ProductCard.tsx
interface ProductCardProps {
    name: string;
    price: string;
    location: string;
    seller: string;
    image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, price, location, seller, image }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover rounded-t-lg"
            />
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