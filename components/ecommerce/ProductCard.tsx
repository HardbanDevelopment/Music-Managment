import React from 'react';
import { Product } from '../../types';
import Card from '../ui/Card';

interface ProductCardProps {
    product: Product;
}

const CategoryBadge: React.FC<{ category: Product['category'] }> = ({ category }) => {
    const colorClasses = {
        Apparel: 'bg-blue-500/20 text-blue-400',
        Accessory: 'bg-purple-500/20 text-purple-400',
        Digital: 'bg-green-500/20 text-green-400',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colorClasses[category]}`}>
            {category}
        </span>
    );
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <Card className="overflow-hidden group">
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                </div>
                <div className="absolute top-4 right-4">
                     <CategoryBadge category={product.category} />
                </div>
            </div>
            <div className="p-4 bg-dark-bg/50 grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-lg font-semibold text-white">${product.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-400">Sales</p>
                    <p className="text-lg font-semibold text-white">{product.sales.toLocaleString()}</p>
                </div>
            </div>
        </Card>
    );
};

export default ProductCard;