import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCollegeId } from '../../hooks/useCollegeId';
import { fetchProducts } from '../../redux/slices/productSlice.js';
import { capitalizeWords } from '../../utils/Capitalize.js';
import ProductCard from '../Cards/ProductsCard';

const FeaturedSeniors = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const dispatch = useDispatch();

    const {
        products,
        loading: loadingProducts,
        error: productError,
    } = useSelector((state) => state.products || {});

    const fake = [1, 2, 3, 4];

    useEffect(() => {
        dispatch(fetchProducts(collegeId));
    }, [collegeId]);

    return (
        <section className="bg-white py-5">
            <div className="container mx-auto px-4">
                <h3 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
                    Products for Sale in {capitalizeWords(collegeName)}
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 justify-center items-center">
                    {products.length > 0 ? (
                        <ProductCard products={products.slice(0, 4)} />
                    ) : loadingProducts ? (
                        fake.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-md rounded-3xl overflow-hidden w-full h-48 flex items-center justify-center animate-pulse"
                            >
                                <div className="h-20 w-20 rounded-full bg-gray-300"></div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 text-center py-10 text-gray-500">
                            No Senior found in your college.
                        </div>
                    )}
                </div>

                {!loadingProducts && products.length > 0 && (
                    <div className="text-center mt-6">
                        <Link
                            to={`/college/${collegeName}/store`}
                            className="bg-sky-500 hover:bg-sky-600 text-white py-2 px-5 rounded-xl transition"
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
