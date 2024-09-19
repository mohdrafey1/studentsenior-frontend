import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AddProductModal from '../components/StoreModal/AddProductModal';
import EditProductModal from '../components/StoreModal/EditProductModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        whatsapp: '',
        telegram: '',
        college: '',
        image: null,
        available: true,
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPGI Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const currentUser = useSelector((state) => state.user.currentUser);

    const ownerId = currentUser?._id;

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/store`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
            });
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            console.error('Error fetching products:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (editingProduct) {
                setEditingProduct({ ...editingProduct, [name]: checked });
            } else {
                setNewProduct({ ...newProduct, [name]: checked });
            }
        } else {
            if (editingProduct) {
                setEditingProduct({ ...editingProduct, [name]: value });
            } else {
                setNewProduct({ ...newProduct, [name]: value });
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, image: file });
        } else {
            setNewProduct({ ...newProduct, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('price', newProduct.price);
        formData.append('description', newProduct.description);
        formData.append('whatsapp', newProduct.whatsapp);
        formData.append('telegram', newProduct.telegram);
        formData.append('college', newProduct.college);
        formData.append('image', newProduct.image);
        formData.append('available', newProduct.available);
        // formData.append('owner', ownerId);

        try {
            const response = await fetch(`${API_BASE_URL}/api/store`, {
                method: 'POST',
                headers: {
                    'x-api-key': API_KEY,
                },
                credentials: 'include',
                body: formData,
            });
            if (response.ok) {
                fetchProducts(); // Refresh products list
                setIsModalOpen(false);
            }
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('price', editingProduct.price);
        formData.append('description', editingProduct.description);
        formData.append('whatsapp', editingProduct.whatsapp);
        formData.append('telegram', editingProduct.telegram);
        formData.append('college', editingProduct.college);
        formData.append('image', editingProduct.image);
        formData.append('available', editingProduct.available);
        formData.append('status', 'true');

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/store/${editingProduct._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                    body: formData,
                }
            );
            if (response.ok) {
                fetchProducts(); // Refresh products list
                setIsModalOpen(false);
                setEditingProduct(null);
            }
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/store/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                }
            );
            if (response.ok) {
                fetchProducts();
            }
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <Header />
            <CollegeLinks />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-4">Store</h1>
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Product
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                        <div key={product._id} className="border p-4 rounded">
                            <img
                                src={product.image.url}
                                alt={product.name}
                                className="w-80 h-80 mt-2"
                            />
                            <h3 className="text-lg font-bold mb-2">
                                {product.name}
                            </h3>
                            <p>Price: ${product.price}</p>
                            <p>{product.description}</p>
                            <p>WhatsApp: {product.whatsapp}</p>
                            <p>Telegram: {product.telegram}</p>
                            <p>
                                College:{' '}
                                {
                                    colleges.find(
                                        (college) =>
                                            college.id === product.college
                                    )?.name
                                }
                            </p>
                            <div className="flex justify-end mt-4">
                                {product.owner === ownerId && (
                                    <>
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            onClick={() =>
                                                handleDelete(product._id)
                                            }
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen &&
                (editingProduct ? (
                    <EditProductModal
                        editingProduct={editingProduct}
                        handleInputChange={handleInputChange}
                        handleFileChange={handleFileChange}
                        handleUpdate={handleUpdate}
                        setIsModalOpen={setIsModalOpen}
                        colleges={colleges}
                    />
                ) : (
                    <AddProductModal
                        newProduct={newProduct}
                        handleInputChange={handleInputChange}
                        handleFileChange={handleFileChange}
                        handleSubmit={handleSubmit}
                        setIsModalOpen={setIsModalOpen}
                        colleges={colleges}
                    />
                ))}
            <Footer />
        </div>
    );
};

export default StorePage;
