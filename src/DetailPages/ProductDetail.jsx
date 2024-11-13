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

    useEffect(() => {
        fetchProduct();
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
            <div className="main">
                <div>sabar karo aur cheezon ke liye</div>
            </div>
        </div>
    );
}

export default ProductDetail;
