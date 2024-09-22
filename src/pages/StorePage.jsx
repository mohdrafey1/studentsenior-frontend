import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice.js';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AddProductModal from '../components/StoreModal/AddProductModal';
import EditProductModal from '../components/StoreModal/EditProductModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration.js';

const StorePage = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
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
        { id: '66cba84ce0e3a7e528642837', name: 'MPGI Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

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
            setProducts(data);
            setIsLoading(false);
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
                fetchProducts();
                setIsModalOpen(false);
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
    }, []);

    return (
        <div className='bg-sky-100'>
            <Header />
            <CollegeLinks />
            <div className="container mx-auto px-4 py-5">
            <div className="flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-5">Product Store</h1>
            </div>
            <div className="flex justify-end mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Product
                    </button>
                </div>
               
                <div className="flex justify-center items-center py-1">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl h-full ">
    {products.length > 0 ? (
      products.map((product) => (
        <div key={product._id} className="border lg:h-3/4 h-max border-gray-200 rounded-lg shadow-md p-0 bg-white dark:bg-gray-800 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
          <img
            src={product.image.url}
            alt={product.name}
            className="bg-white shadow-md lg:h-2/5 max-h-80 w-full rounded-sm overflow-hidden transform transition duration-300 hover:scale-105"
          />
       <div className='p-4'>
       <h5 class="text-lg tracking-tight text-gray-700 dark:text-gray-300">{product.name}</h5>
          <p>
        <span class="text-2xl font-bold text-gray-700 dark:text-gray-300"> ₹{product.price}</span>
        </p>
        <p className="text-gray-800 dark:text-gray-400 mt-2">
            College: {colleges.find((college) => college.id === product.college)?.name}
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
          
          
          <p className="text-gray-600 italic overflow-hidden dark:text-gray-200">{product.description}</p>

          <div className="flex justify-end mt-4">
            {product.owner === ownerId && (
              <>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 transition hover:bg-yellow-600">
                  Edit
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded transition hover:bg-red-600" onClick={() => handleDelete(product._id)}>
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
            <p className="text-gray-200  dark:text-gray-600 mt-3">Loading...</p>
          </div>
        ) : (
          <p className="text-gray-200  dark:text-gray-600 text-center">No Product Found.</p>
        )}
      </div>
    )}
  </div>

                {/* </div> */}
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
            <Footer />
        </div>
        
    );
};

export default StorePage;
