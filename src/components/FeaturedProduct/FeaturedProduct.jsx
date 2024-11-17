import React, { useState, useEffect } from 'react';
import useApiFetch from '../../hooks/useApiFetch';
import { capitalizeWords } from '../../utils/Capitalize.js';
import { useCollegeId } from '../../hooks/useCollegeId';
import { api } from '../../config/apiConfiguration';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../Cards/ProductsCard';

const FeaturedSeniors = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const [products, setProducts] = useState([]);
    const { useFetch, loadingFetch } = useApiFetch();

    const fetchProducts = async () => {
        try {
            const data = await useFetch(`${api.store}/college/${collegeId}`);
            setProducts(data);
        } catch (err) {
            console.error('Error fetching seniors:', err);
            toast.error('Error fetching seniors');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <section className="container mx-auto ">
            <div className="flex flex-col md:flex-row justify-center items-center text-2xl text-center p-2">
                <h3 className="sm:text-3xl sm:font-medium">
                    Product for sale in {capitalizeWords(collegeName)}
                </h3>
            </div>
            <div className="container mx-auto px-5 xl:px-40">
                <div className="main-card">
                    <div className="mobile-card cards flex gap-2 md:gap-6 w-full lg:justify-center md:justify-center">
                        <ProductCard products={products} />
                    </div>
                </div>
                {loadingFetch ? (
                    <></>
                ) : (
                    <div className="text-center my-5">
                        <Link
                            to={`/college/${collegeName}/store`}
                            className="bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600"
                        >
                            View All
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default FeaturedSeniors;
