// components/CategoryCard.tsx
interface CategoryCardProps {
    name: string;
    image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image }) => {
    return (
        <div className="bg-[#F5F7FA] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-[#101B35]">{name}</h3>
            </div>
        </div>
    );
};

export default CategoryCard;