import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AddProductModal from '../components/StoreModal/AddProductModal';
import EditProductModal from '../components/StoreModal/EditProductModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';

const StorePage = () => {
    const { collegeName } = useParams();
    const [products, setProducts] = useState([]);
    const [affiliateproducts, setAffiliateProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoading2, setIsLoading2] = useState(false);
    const [isLoading3, setIsLoading3] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
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

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/store`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY,
                },
            });
            const data = await response.json();
            setProducts(LatestFirst(data));
            setIsLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
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

    const fetchAffiliateProducts = async () => {
        setIsLoading3(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/store/affiliate`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                }
            );
            const data = await response.json();

            setAffiliateProducts(data);
            setIsLoading3(false);
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

    const handleLogout = () => {
        dispatch(signOut());
        navigate('/sign-in');
    };

    const handleSubmit = async (e) => {
        setIsLoading2(true);

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
            setIsLoading2(false);

            if (response.ok) {
                fetchProducts();
                setIsModalOpen(false);
                alert(
                    'Your request has been received, and the item will be displayed once it has been approved.'
                );
            } else if (response.status === 401) {
                setIsModalOpen(false);
                alert('Your session has expired. Please log in again.');
                handleLogout();
            } else {
                const errorData = await response.json();
                alert(`Failed to add product: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error adding product:', err);
        }
    };

    const handleUpdate = async (e) => {
        setIsLoading2(true);
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
            setIsLoading2(false);

            if (response.ok) {
                fetchProducts(); // Refresh products list
                setIsModalOpen(false);
                setEditingProduct(null);
                alert('Your request has been updated.');
            } else if (response.status === 401) {
                setIsModalOpen(false);
                alert('Your session has expired. Please log in again.');
                handleLogout();
            } else {
                const errorData = await response.json();
                alert(`Failed to Update product: ${errorData.message}`);
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
        setIsLoading2(true);
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
            setIsLoading2(false);
            if (response.ok) {
                fetchProducts();
                alert('Your request has been deleted successfully');
            } else if (response.status === 401) {
                setIsModalOpen(false);
                alert('Your session has expired. Please log in again.');
                handleLogout();
            } else {
                const errorData = await response.json();
                // alert(`Failed to Delete product: ${errorData.message}`);
            }
        } catch (err) {
            console.error('Error deleting product:', err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchAffiliateProducts();
    }, []);

    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <div className={`${isLoading2 ? 'block' : 'hidden'} text-center `}>
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-50">
                    <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-blue-500"></div>
                </div>
            </div>
            {/* <Header /> */}
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
                                        className="border  h-96 lg:h-min my-3 border-gray-200 rounded-lg shadow-md p-0 bg-white dark:bg-gray-800 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        <img
                                            src={product.image.url}
                                            alt={product.name}
                                            className="bg-white shadow-md h-36 lg:h-2/5 max-h-60 w-full rounded-sm overflow-hidden transform transition duration-300 hover:scale-105"
                                        />
                                        <div className="p-4 ">
                                            <h5 className="lg:text-lg text-sm tracking-tight text-gray-700 dark:text-gray-300">
                                                {product.name}
                                            </h5>
                                            <p>
                                                <span className="text-base lg:text-2xl font-bold text-gray-700 dark:text-gray-300">
                                                    {' '}
                                                    ₹{product.price}
                                                </span>
                                            </p>
                                            <div className="overflow-y-scroll h-28">
                                                <p className="text-gray-800 text-xs lg:text-sm dark:text-gray-400 mt-2">
                                                    College:{' '}
                                                    {
                                                        colleges.find(
                                                            (college) =>
                                                                college.id ===
                                                                product.college
                                                        )?.name
                                                    }
                                                </p>
                                                <div className="flex items-center mt-2 gap-3">
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

                                                <p className="text-gray-600 italic overflow-hidden dark:text-gray-200 text-xs lg:text-base">
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="flex justify-center mt-4">
                                                {product.owner === ownerId && (
                                                    <>
                                                        <button
                                                            className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 transition hover:bg-yellow-600 text-xs lg:text-base"
                                                            onClick={() =>
                                                                handleEdit(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="bg-red-500 text-white px-4 py-2 rounded transition hover:bg-red-600 text-xs lg:text-base"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 flex justify-center items-center w-full">
                                    {isLoading ? (
                                        <div className="text-center">
                                            <svg
                                                aria-hidden="true"
                                                className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                            <p className="text-gray-200  dark:text-gray-600 mt-3">
                                                Loading...
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-gray-200  dark:text-gray-600 text-center">
                                                No Product Found in{' '}
                                                {capitalizeWords(collegeName)}.
                                            </p>
                                            <br />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <br />
                        <h1 className="text-3xl font-bold mb-5 text-center">
                            Affiliate Product
                        </h1>
                        <br />
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl min-h-screen">
                            {affiliateproducts.length > 0 ? (
                                affiliateproducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="border h-80 lg:h-96  border-gray-200 rounded-lg shadow-md p-0 bg-white dark:bg-gray-800 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="bg-white shadow-md lg:h-2/5 h-36 w-full rounded-sm overflow-hidden transform transition duration-300 hover:scale-105"
                                        />
                                        <div className="p-4">
                                            <h5 className="text-sm lg:text-lg tracking-tight text-gray-700 dark:text-gray-300">
                                                {product.name}
                                            </h5>
                                            <p>
                                                <span className="text-lg lg:text-2xl font-bold text-gray-700 dark:text-gray-300">
                                                    {' '}
                                                    ₹{product.price}
                                                </span>
                                            </p>

                                            <div className="overflow-y-scroll h-24 lg:h-32">
                                                <p className="text-gray-600  italic text-[9px] lg:text-base dark:text-gray-200">
                                                    {product.description}
                                                </p>
                                                <a
                                                    target="blank"
                                                    href={product.link}
                                                >
                                                    <button
                                                        type="button"
                                                        className="text-white w-3/4 mx-4 my-3 p-1 lg:text-lg text-sm bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-xl dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                    >
                                                        Buy Now
                                                    </button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-4 flex justify-center items-center w-full">
                                    {isLoading3 ? (
                                        <div className="text-center">
                                            <svg
                                                aria-hidden="true"
                                                className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                viewBox="0 0 100 101"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                    fill="currentColor"
                                                />
                                                <path
                                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                    fill="currentFill"
                                                />
                                            </svg>
                                            <p className="text-gray-200  dark:text-gray-600 mt-3">
                                                Loading...
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-200  dark:text-gray-600 text-center">
                                            No Product Found.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
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
            </div>
            {/* <Footer /> */}
            <Collegelink2 />
        </div>
    );
};

export default StorePage;
