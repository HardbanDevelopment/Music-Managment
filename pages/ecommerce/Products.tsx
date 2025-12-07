import React, { useEffect, useState, useContext } from 'react';
import { getProducts, addProduct } from '../../services/api';
import { Product, ProductCategory } from '../../types';
import ProductCard from '../../components/ecommerce/ProductCard';
import ResourceListPage from '../../components/common/ResourceListPage';
import { ToastContext } from '../../context/AuthContext';

const AddProductForm: React.FC<{ onProductAdded: (product: Product) => void, onClose: () => void }> = ({ onProductAdded, onClose }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState<ProductCategory>('Apparel');
    const { addToast } = useContext(ToastContext);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newProduct = await addProduct({ name, price, stock, category });
            onProductAdded(newProduct);
            addToast('Product created successfully!', 'success');
            onClose();
        } catch (err: any) {
            addToast(`Nie udało się utworzyć produktu: ${err.message || err}`, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} placeholder="Price" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <input type="number" value={stock} onChange={e => setStock(Number(e.target.value))} placeholder="Stock" className="w-full bg-dark-bg border-dark-border rounded-md p-3" />
            <select value={category} onChange={e => setCategory(e.target.value as any)} className="w-full bg-dark-bg border-dark-border rounded-md p-3">
                <option>Apparel</option>
                <option>Accessory</option>
                <option>Digital</option>
            </select>
            <div className="flex justify-end pt-4">
                <button type="submit" className="bg-primary-purple py-2 px-6 rounded-lg">Add Product</button>
            </div>
        </form>
    );
};

const Products: React.FC = () => {
    const { addToast } = useContext(ToastContext);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const data = await getProducts();
                if (mounted) setProducts(data);
            } catch (e: unknown) {
                const message = e instanceof Error ? e.message : String(e);
                addToast(`Nie udało się pobrać produktów: ${message}`, 'error');
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [addToast]);

    const handleProductAdded = (newProduct: Product) => {
        setProducts(prev => [newProduct, ...prev]);
    };

    if (loading) {
        return <div className="h-48 w-full flex items-center justify-center text-gray-300">Ładowanie produktów...</div>;
    }
    return (
        <ResourceListPage<Product>
            items={products}
            renderItem={(product) => <ProductCard product={product} />}
            searchKeys={['name', 'category']}
            searchPlaceholder="Search products..."
            addNewButtonText="Add Product"
            addModalTitle="Add New Product"
            addModalContent={(onClose) => (
                <AddProductForm 
                    onProductAdded={handleProductAdded}
                    onClose={onClose}
                />
            )}
            emptyState={{
                icon: <>👕</>,
                title: "Stock Your Store",
                description: "No merchandise found. Add products like apparel, accessories, or digital downloads to start selling to your fans.",
                ctaText: "+ Add New Product",
            }}
            gridCols="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        />
    );
};

export default Products;
