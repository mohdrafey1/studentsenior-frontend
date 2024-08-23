import React, { useState } from 'react';
import Header from '../components/Header/Header';
import CollegeLinks from '../components/Links/CollegeLinks';
import Footer from '../components/Footer/Footer';

const initialProducts = [
    {
        id: 1,
        title: 'Used Laptop',
        description:
            'Dell Inspiron 15, in a very good condition, Best for student.',
        age: '2 years',
        price: '₹25,000',
        payOnDelivery: true,
        whatsapp: 'https://wa.me/9123456789',
        photo: 'https://images.jdmagicbox.com/quickquotes/images_main/dell-laptops-11-06-2021-002-227393979-p9c7w.jpg',
    },
    {
        id: 2,
        title: 'Engineering Books',
        description: 'Collection of 10 books for Mechanical Engineering.',
        age: '1 year',
        price: '₹3,000',
        payOnDelivery: false,
        whatsapp: 'https://wa.me/9876543210',
        photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScOHChvU9bsCVkUjH1CRRd_nS_NJVf5nvHSA&s',
    },
];

const StorePage = () => {
    const [products, setProducts] = useState(initialProducts);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newProduct, setNewProduct] = useState({
        title: '',
        description: '',
        age: '',
        price: '',
        payOnDelivery: false,
        whatsapp: '',
        photo: '',
    });

    const handleAddProduct = () => {
        setProducts([...products, { id: products.length + 1, ...newProduct }]);
        setShowAddForm(false);
    };

    const handleDeleteProduct = (id) => {
        const updatedProducts = products.filter((product) => product.id !== id);
        setProducts(updatedProducts);
    };

    return (
        <div className="container bg-sky-100 min-h-screen min-w-full">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-3xl font-bold mb-5 text-center">Store</h1>
                <div className="flex justify-center mb-5">
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className="px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                        {showAddForm ? 'Close Add Product Form' : 'Add Product'}
                    </button>
                </div>
                {showAddForm && (
                    <div className="mb-5 p-5 bg-white shadow-md rounded-md">
                        <h2 className="text-xl font-bold mb-3">
                            Add Your Product
                        </h2>
                        <input
                            type="text"
                            placeholder="Title"
                            value={newProduct.title}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    title: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        />
                        <textarea
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    description: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        ></textarea>
                        <input
                            type="text"
                            placeholder="Age"
                            value={newProduct.age}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    age: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Price"
                            value={newProduct.price}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    price: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        />
                        <label className="block mb-3">
                            <input
                                type="checkbox"
                                checked={newProduct.payOnDelivery}
                                onChange={(e) =>
                                    setNewProduct({
                                        ...newProduct,
                                        payOnDelivery: e.target.checked,
                                    })
                                }
                                className="mr-2"
                            />
                            Pay on Delivery
                        </label>
                        <input
                            type="text"
                            placeholder="WhatsApp Link"
                            value={newProduct.whatsapp}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    whatsapp: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        />
                        <input
                            type="text"
                            placeholder="Photo URL"
                            value={newProduct.photo}
                            onChange={(e) =>
                                setNewProduct({
                                    ...newProduct,
                                    photo: e.target.value,
                                })
                            }
                            className="p-2 border rounded-md mb-3 w-full"
                        />
                        <button
                            onClick={handleAddProduct}
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                            Submit
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white p-5 shadow-md rounded-md"
                        >
                            <img
                                src={product.photo}
                                alt={product.title}
                                className="mb-3 w-full h-40 object-cover rounded-md"
                            />
                            <h3 className="text-xl font-bold mb-2">
                                {product.title}
                            </h3>
                            <p className="mb-2">{product.description}</p>
                            <p className="mb-2">
                                <strong>Age:</strong> {product.age}
                            </p>
                            <p className="mb-2">
                                <strong>Price:</strong> {product.price}
                            </p>
                            <p className="mb-2">
                                <strong>Pay on Delivery:</strong>{' '}
                                {product.payOnDelivery ? 'Yes' : 'No'}
                            </p>
                            <a
                                href={product.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-center mb-3 px-4 py-2 bg-blue-500 text-white rounded-md"
                            >
                                Contact
                            </a>
                            <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="block w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default StorePage;
