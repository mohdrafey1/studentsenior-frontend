import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddProductModal from '../components/StoreModal/AddProductModal';
import EditProductModal from '../components/StoreModal/EditProductModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { api } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest.js';
import useApiFetch from '../hooks/useApiFetch.js';

const StorePage = () => {
    const { collegeName } = useParams();
    const [products, setProducts] = useState([]);
    const [loadingStates, setLoadingStates] = useState({});
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
        { id: '66cba84ce0e3a7e528642837', name: 'MPEC Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const selectedCollegeObject = colleges.find(
        (college) =>
            college.name.toLowerCase().replace(/\s+/g, '-') === collegeName
    );

    const collegeId = selectedCollegeObject.id;

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;
    const { useFetch, loadingFetch } = useApiFetch();
    const { apiRequest, loading } = useApiRequest();

    const fetchProducts = async () => {
        try {
            const data = await useFetch(api.store);
            setProducts(LatestFirst(data));
        } catch (err) {
            console.error('Error fetching products:', err);
            toast.error('Error fetching products:');
        }
    };

    const LatestFirst = (data) => {
        let reversedArray = [];
        const collegeId = localStorage.getItem('id');
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].college === collegeId) {
                reversedArray.push(data[i]);
            }
        }
        return reversedArray;
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
        formData.append('college', collegeId);
        formData.append('image', newProduct.image);
        formData.append('available', newProduct.available);

        try {
            await apiRequest(`${api.store}`, 'POST', formData, true);
            fetchProducts();
            setIsModalOpen(false);
            toast.success(
                'Your request has been received. The item will display once approved.',
                { autoClose: 10000 }
            );
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
        formData.append('college', collegeId);
        formData.append('image', editingProduct.image);
        formData.append('available', editingProduct.available);
        formData.append('status', 'true');

        try {
            await apiRequest(
                `${api.store}/${editingProduct._id}`,
                'PUT',
                formData,
                true
            );

            fetchProducts();
            setIsModalOpen(false);
            setEditingProduct(null);
            toast.success('Your request has been updated.');
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId) => {
        setLoadingStates((prev) => ({ ...prev, [productId]: true }));
        try {
            await apiRequest(`${api.store}/${productId}`, 'DELETE');
            fetchProducts();
            toast.success('Your request has been deleted successfully');
        } catch (err) {
            console.error('Error deleting product:', err);
            toast.error('Error deleting product');
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                [productId]: false,
            }));
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <CollegeLinks />
            <div className="container mx-auto px-4 py-5">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-3xl font-bold mb-5 text-center">
                        Product Store - {capitalizeWords(collegeName)}
                    </h1>
                    <p className="italic text-center">
                        "Buy and sell your stationery and gadgets easily to your
                        juniors."
                    </p>
                    <br />
                </div>
                <div className="flex justify-center mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Product
                    </button>
                </div>

                <div className="flex justify-center items-center py-1">
                    <div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 w-full max-w-7xl h-fit ">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <div
                                        key={product._id}
                                        className="border my-3 border-gray-200 rounded-lg shadow-md p-0 bg-white dark:bg-gray-800 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        <img
                                            src={product.image.url}
                                            alt={product.name}
                                            className="bg-white shadow-md h-36 max-h-60 w-full rounded-sm overflow-hidden transform transition duration-300 hover:scale-105"
                                        />
                                        <div className="p-4 ">
                                            <h5 className="lg:text-lg text-sm tracking-tight text-gray-700 dark:text-gray-300">
                                                {product.name}
                                            </h5>
                                            <p>
                                                <span className="text-base lg:text-2xl font-bold text-gray-700 dark:text-gray-300">
                                                    ₹{product.price}
                                                </span>
                                            </p>
                                            <div className="overflow-y-scroll h-32">
                                                <div>
                                                    <p className="text-gray-800 text-xs lg:text-sm dark:text-gray-400 mt-2">
                                                        College:
                                                        {
                                                            colleges.find(
                                                                (college) =>
                                                                    college.id ===
                                                                    product.college
                                                            )?.name
                                                        }
                                                    </p>
                                                </div>
                                                <div className="flex my-2 justify-between">
                                                    <div className="flex gap-3">
                                                        <a
                                                            target="_blank"
                                                            href={`https://wa.me/${product.whatsapp}`}
                                                            aria-label="WhatsApp"
                                                            className="text-green-600 hover:text-green-500 transition"
                                                        >
                                                            <i className="fa-brands fa-whatsapp text-2xl sm:text-3xl"></i>
                                                        </a>
                                                        <a
                                                            target="_blank"
                                                            href={`https://t.me/+91${product.telegram}`}
                                                            aria-label="Telegram"
                                                            className="text-blue-600 hover:text-blue-500 transition"
                                                        >
                                                            <i className="fa-brands fa-telegram text-2xl sm:text-3xl"></i>
                                                        </a>
                                                    </div>
                                                    {product.owner ===
                                                        ownerId && (
                                                        <div className="flex gap-3">
                                                            <button
                                                                className="text-yellow-600 text-2xl sm:text-3xl rounded mr-2 transition hover:text-yellow-300 "
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        product
                                                                    )
                                                                }
                                                            >
                                                                <i className="fa-regular fa-pen-to-square"></i>
                                                            </button>
                                                            <button
                                                                className="text-2xl sm:text-3xl text-red-600 rounded transition hover:text-red-300 "
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        product._id
                                                                    )
                                                                }
                                                                disabled={
                                                                    loadingStates[
                                                                        product
                                                                            ._id
                                                                    ]
                                                                }
                                                            >
                                                                {loadingStates[
                                                                    product._id
                                                                ] ? (
                                                                    <i className="fa fa-spinner fa-spin"></i>
                                                                ) : (
                                                                    <i className="fa-solid fa-trash"></i>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                <p className="text-gray-600 italic overflow-hidden dark:text-gray-200 text-xs lg:text-base">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 flex justify-center items-center w-full">
                                    {loadingFetch ? (
                                        <i className="fas fa-spinner fa-pulse fa-5x"></i>
                                    ) : (
                                        <p>No Products Found</p>
                                    )}
                                </div>
                            )}
                        </div>
                        <br />
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
                            loading={loading}
                        />
                    ) : (
                        <AddProductModal
                            newProduct={newProduct}
                            handleInputChange={handleInputChange}
                            handleFileChange={handleFileChange}
                            handleSubmit={handleSubmit}
                            setIsModalOpen={setIsModalOpen}
                            loading={loading}
                        />
                    ))}
            </div>
            <Collegelink2 />
        </div>
    );
};

export default StorePage;
