import React, { useEffect, useState } from 'react';
import useApiFetch from '../hooks/useApiFetch';
import { toast } from 'react-toastify';
import { api } from '../config/apiConfiguration';
import { useParams, Link } from 'react-router-dom';
import DetailPageNavbar from './DetailPageNavbar';
import ProductsCard from '../components/Cards/ProductsCard';
import { useCollegeId } from '../hooks/useCollegeId';
import Seo from '../components/SEO/Seo';
import { capitalizeWords } from '../utils/Capitalize.js';


function ProductDetail() {
    const { collegeName, slug } = useParams();
    const collegeId = useCollegeId(collegeName);
    const { useFetch, loadingFetch } = useApiFetch();
    const [product, setProduct] = useState(null);
    const [suggestedProduct, setSuggestedProduct] = useState([]);

    const url = `${api.store}/${slug}`;

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
            const data = await useFetch(
                `${api.store}/suggested/${collegeId}/${slug}`
            );
            setSuggestedProduct(data);
        } catch (error) {
            toast.error(error.message);
            console.error(error);
        }
    };

    useEffect(() => {
        fetchProduct();
        fetchSuggestedProduct();
    }, [slug]);

    if (loadingFetch) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Product Not Found!
                </h1>
                <Link
                    to={`/college/${collegeName}/store`}
                    className="mt-6 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    See Other Products
                </Link>
            </div>
        );
    }

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative">
            <DetailPageNavbar path={`college/${collegeName}/store`} />

            <div className="grid gap-6 lg:grid-cols-8 sm:grid-cols-2 mt-6 lg:h-screen">
                <div className="p-4 rounded-lg shadow-lg lg:col-span-3 flex justify-center items-center">
                    <div className="rounded-xl">
                        <img
                            src={product?.image?.url}
                            alt={product.name}
                            className="rounded-3xl h-96"
                        />
                    </div>
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
                    <Seo title={`${product.name} - ${capitalizeWords(collegeName)}`} description={product.description} />
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

                <div className="p-4 rounded-lg shadow-lg sm:col-span-5 lg:col-span-2 overflow-y-auto">
                    <h2 className="text-center text-xl font-bold mb-2">
                        Suggested Products
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 justify-center">
                        <ProductsCard
                            products={suggestedProduct}
                            loadingFetch={loadingFetch}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
