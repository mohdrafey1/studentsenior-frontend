import React, { useState, useEffect } from 'react';
import useApiFetch from '../../hooks/useApiFetch';
import { capitalizeWords } from '../../utils/Capitalize.js';
import { useCollegeId } from '../../hooks/useCollegeId';
import { api } from '../../config/apiConfiguration';
import { toast } from 'react-toastify';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../Cards/ProductsCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/slices/productSlice.js';

const FeaturedSeniors = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);

    const dispatch = useDispatch();
    const {
        products,
        loading: loadingProducts,
        error: productError,
    } = useSelector((state) => state.products || {});

    const fake = [{ no: 1 }, { no: 2 }, { no: 3 }, { no: 4 }];

    useEffect(() => {
        dispatch(fetchProducts(collegeId));
    }, []);

    return (
        <section className="container mx-auto ">
            <div className="flex flex-col md:flex-row justify-center items-center text-2xl text-center p-2">
                <h3 className="sm:text-3xl font-medium">
                    Product for sale in {capitalizeWords(collegeName)}
                </h3>
            </div>
            <div className="container mx-auto px-5 xl:px-40">
                <div className="main-card">
                    <div className="mobile-card cards flex gap-2 md:gap-6 w-full lg:justify-center md:justify-center">
                        {productError && (
                            <div className="text-red-500 text-center">
                                Failed to load Products: {productError}
                            </div>
                        )}
                        {products.length > 0 ? (
                            <ProductCard products={products.slice(0, 4)} />
                        ) : (
                            <div className="col-span-4 flex justify-center items-center py-10 w-full">
                                {loadingProducts ? (
                                    <div className="w-full flex gap-5">
                                        {fake.map((item, index) => {
                                            return (
                                                <div className="bg-white shadow-md rounded-3xl overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl dark:bg-slate-300 w-full lg:h-56 flex flex-col">
                                                    <div className="h-20 w-20 rounded-full bg-gray-400 m-auto animate-ping"></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 mt-5">
                                        No Senior found in your college
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {loadingProducts ? (
                    <></>
                ) : (
                    <div className="text-center my-5">
                        <Link
                            to={`/college/${collegeName}/store`}
                            className="bg-sky-500 text-white py-2 px-4 rounded-xl hover:bg-sky-600"
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
