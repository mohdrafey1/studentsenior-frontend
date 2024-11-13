import React, { useEffect, useState } from 'react';
import useApiFetch from '../hooks/useApiFetch';
import { toast } from 'react-toastify';
import { api } from '../config/apiConfiguration';
import { useParams, Link } from 'react-router-dom';
import DetailPageNavbar from './DetailPageNavbar';
import { originalHandleShare } from '../utils/handleShare';

function ProductDetail() {
    const { collegeName, id } = useParams();
    const { useFetch, loadingFetch } = useApiFetch();
    const [product, setProduct] = useState(null);
    const [suggestedProduct, setSuggestedProduct] = useState(null);

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

    const url = `${api.store}/${id}`;

    const fetchProduct = async () => {
        try {
            const data = await useFetch(url);
            setProduct(data);
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    const fetchSuggestedProduct = async () => {
        try {
            const data = await useFetch(`${api.store}/suggested/${collegeId}`);
            setSuggestedProduct(data);
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchSuggestedProduct();
    }, [id]);

    if (!product) {
        return (
            <div>
                {loadingFetch ? (
                    <>
                        <div className="flex justify-center items-center min-h-screen">
                            <i className="fas fa-spinner fa-pulse fa-5x"></i>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-col items-center justify-center h-screen text-center">
                            <h1 className="text-2xl font-semibold text-gray-800">
                                Product Not Found !
                            </h1>
                            <Link
                                to={`/college/${collegeName}/store`}
                                className="mt-6 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            >
                                See Other Product
                            </Link>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative">
            <DetailPageNavbar
                path={'store'}
                handleShare={originalHandleShare}
            />

            <div className="grid gap-6 lg:grid-cols-8 sm:grid-cols-2 mt-6">
                <div className="p-4 rounded-lg shadow-lg lg:col-span-3">
                    <img
                        src={product.image.url}
                        alt={product.name}
                        className="rounded-md object-cover max-h-96 w-full"
                    />
                </div>

                <div className=" p-6 rounded-lg shadow-lg lg:col-span-3 flex flex-col">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">
                            {product.name}
                        </h1>
                        <p className="text-2xl text-gray-800 mb-4">
                            ₹{product.price}
                        </p>
                        <p className="text-gray-700 mb-4">
                            {product.description}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-6">
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://wa.me/${product.whatsapp}`}
                            aria-label="WhatsApp"
                            className="text-green-600 hover:text-green-500 transition text-3xl"
                        >
                            <i className="fa-brands fa-whatsapp"></i>
                        </a>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href={`https://t.me/+91${product.telegram}`}
                            aria-label="Telegram"
                            className="text-blue-600 hover:text-blue-500 transition text-3xl"
                        >
                            <i className="fa-brands fa-telegram"></i>
                        </a>
                    </div>
                </div>

                <div className="p-4 rounded-lg shadow-lg lg:col-span-2 overflow-y-auto">
                    <h2 className="text-center text-xl font-bold mb-4">
                        Suggested Products
                    </h2>
                    {suggestedProduct?.length > 0 ? (
                        suggestedProduct.map((product) => (
                            <Link
                                to={`/college/${collegeName}/store/${product._id}`}
                                key={product._id}
                                className="block mb-4"
                            >
                                <div className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition p-2 bg-white overflow-hidden">
                                    <img
                                        src={product.image.url}
                                        alt={product.name}
                                        className="w-full h-36 object-cover rounded-md mb-2"
                                    />
                                    <div className="p-2">
                                        <h5 className="text-lg font-bold text-gray-800">
                                            {product.name}
                                        </h5>
                                        <p className="text-gray-700 text-lg font-semibold">
                                            ₹{product.price}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            College: {product.college.name}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <button
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`https://wa.me/${product.whatsapp}`}
                                                aria-label="WhatsApp"
                                                className="text-green-600 hover:text-green-500 transition"
                                            >
                                                <i className="fa-brands fa-whatsapp text-2xl"></i>
                                            </button>
                                            <button
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={`https://t.me/+91${product.telegram}`}
                                                aria-label="Telegram"
                                                className="text-blue-600 hover:text-blue-500 transition"
                                            >
                                                <i className="fa-brands fa-telegram text-2xl"></i>
                                            </button>
                                        </div>
                                        <p className="text-gray-600 text-sm italic mt-2 line-clamp-3">
                                            {product.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            {loadingFetch ? (
                                <i className="fas fa-spinner fa-pulse fa-3x"></i>
                            ) : (
                                <p className="text-gray-600">
                                    No Products Found
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
