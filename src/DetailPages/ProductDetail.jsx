import React, { useEffect, useState } from 'react';
import useApiFetch from '../hooks/useApiFetch';
import { toast } from 'react-toastify';
import { api } from '../config/apiConfiguration';
import { useParams, Link } from 'react-router-dom';
import DetailPageNavbar from './DetailPageNavbar';
import ProductsCard from '../components/Cards/ProductsCard';
import { useCollegeId } from '../hooks/useCollegeId';
import Seo from '../components/SEO/Seo';
import { capitalizeWords } from '../utils/Capitalize';
import { StudentSeniorSpinner } from '../ui/Spinner';

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

    const renderSocialLinks = (product) => {
        const socialLinks = [];

        if (product.whatsapp) {
            socialLinks.push(
                <a
                    key='whatsapp'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
                        product.whatsapp.startsWith('+')
                            ? product.whatsapp
                            : `+91${product.whatsapp}`
                    )}&text=${encodeURIComponent(
                        `Hey , I came from Student senior about this product ${product.name}. Can you provide more details ?`
                    )}`}
                    aria-label='WhatsApp'
                    className='text-green-600 hover:text-green-500 transition text-3xl'
                >
                    <i className='fa-brands fa-whatsapp'></i>
                </a>
            );
        }

        if (product.telegram) {
            socialLinks.push(
                <a
                    key='telegram'
                    target='_blank'
                    rel='noopener noreferrer'
                    href={`https://t.me/+91${product.telegram}`}
                    aria-label='Telegram'
                    className='text-blue-600 hover:text-blue-500 transition text-3xl'
                >
                    <i className='fa-brands fa-telegram'></i>
                </a>
            );
        }

        return socialLinks.length > 0 ? (
            <div className='flex items-center gap-4 mt-6'>{socialLinks}</div>
        ) : null;
    };

    if (loadingFetch) {
        return <StudentSeniorSpinner />;
    }

    if (!product) {
        return (
            <div className='flex flex-col items-center justify-center h-screen text-center'>
                <h1 className='text-2xl font-semibold text-gray-800'>
                    Product Not Found!
                </h1>
                <Link
                    to={`/college/${collegeName}/store`}
                    className='mt-6 px-4 py-2 text-white bg-sky-500 rounded hover:bg-sky-600'
                >
                    See Other Products
                </Link>
            </div>
        );
    }

    return (
        <div className='container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative'>
            <Seo
                title={`${product.name} - ${capitalizeWords(collegeName)}`}
                description={product.description}
            />
            <DetailPageNavbar path={`college/${collegeName}/store`} />

            <div className='grid gap-6 lg:grid-cols-8 sm:grid-cols-2 mt-6 lg:h-screen'>
                {/* Product Image Section */}
                <div className='p-4 rounded-lg shadow-lg lg:col-span-3 flex justify-center items-center'>
                    <div className='rounded-xl'>
                        <img
                            src={product?.image?.url}
                            alt={product.name}
                            className='rounded-3xl h-96'
                        />
                    </div>
                </div>

                {/* Product Details Section */}
                <div className='p-6 rounded-lg shadow-lg lg:col-span-3 flex flex-col'>
                    <h1 className='text-3xl font-bold mb-2'>{product.name}</h1>
                    <p className='text-2xl text-gray-800 mb-4'>
                        ₹{product.price}
                    </p>
                    <p className='text-gray-700 mb-4'>{product.description}</p>
                    {renderSocialLinks(product)}
                </div>

                {/* Suggested Products Section */}
                <div className='p-4 rounded-lg shadow-lg sm:col-span-5 lg:col-span-2 overflow-y-auto'>
                    <h2 className='text-center text-xl font-bold mb-2'>
                        Suggested Products
                    </h2>
                    <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2 justify-center'>
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
