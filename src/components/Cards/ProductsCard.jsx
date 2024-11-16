import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProductsCard({
    products = [],
    loadingFetch,
    loadingStates,
    handleDelete,
    handleEdit,
}) {
    const { collegeName } = useParams();
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    return (
        <>
            {products.length > 0 ? (
                products.map((product) => (
                    <Link
                        to={`/college/${collegeName}/store/${product._id}`}
                        key={product._id}
                    >
                        <div className="border my-3 border-gray-200 rounded-lg shadow-md p-0 bg-white dark:bg-gray-800 overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl">
                            <img
                                src={product.image.url}
                                alt={product.name}
                                className="bg-white shadow-md h-36 max-h-60 w-full rounded-sm overflow-hidden transform transition duration-300 hover:scale-105"
                            />
                            <div className="p-4 ">
                                <h5 className="lg:text-lg text-sm tracking-tight text-gray-700 dark:text-gray-300">
                                    {product.name}
                                </h5>
                                <p>
                                    <span className="text-base lg:text-2xl font-bold text-gray-700 dark:text-gray-300">
                                        ₹{product.price}
                                    </span>
                                </p>
                                <div className="overflow-y-scroll overflow-x-hidden h-32">
                                    <div>
                                        <p className="text-gray-800 text-xs lg:text-sm dark:text-gray-400 mt-2">
                                            College: {product.college.name}
                                        </p>
                                    </div>
                                    <div className="flex my-2 justify-between">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="text-green-600 hover:text-green-500 transition"
                                            >
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={`https://wa.me/${product.whatsapp}`}
                                                    aria-label="WhatsApp"
                                                >
                                                    <i className="fa-brands fa-whatsapp text-2xl"></i>
                                                </a>
                                            </button>
                                            <button
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                className="text-blue-600 hover:text-blue-500 transition"
                                            >
                                                <a
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    href={`https://t.me/+91${product.telegram}`}
                                                    aria-label="Telegram"
                                                >
                                                    <i className="fa-brands fa-telegram text-2xl"></i>
                                                </a>
                                            </button>
                                        </div>
                                        {loadingStates ? (
                                            <>
                                                {product.owner === ownerId && (
                                                    <div className="flex gap-3">
                                                        <button
                                                            className="text-yellow-600 text-2xl sm:text-3xl rounded mr-2 transition hover:text-yellow-300 "
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleEdit(
                                                                    product
                                                                );
                                                            }}
                                                        >
                                                            <i className="fa-regular fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            className="text-2xl sm:text-3xl text-red-600 rounded transition hover:text-red-300 "
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleDelete(
                                                                    product._id
                                                                );
                                                            }}
                                                            disabled={
                                                                loadingStates[
                                                                    product._id
                                                                ]
                                                            }
                                                        >
                                                            {loadingStates[
                                                                product._id
                                                            ] ? (
                                                                <i className="fa fa-spinner fa-spin"></i>
                                                            ) : (
                                                                <i className="fa-solid fa-trash"></i>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>

                                    <p className="text-gray-600 italic overflow-hidden dark:text-gray-200 text-xs lg:text-base">
                                        {product.description.length > 100
                                            ? `${product.description.substring(
                                                  0,
                                                  100
                                              )}...`
                                            : product.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="col-span-4 flex justify-center items-center w-full">
                    {loadingFetch ? (
                        <i className="fas fa-spinner fa-pulse fa-5x"></i>
                    ) : (
                        <p>No Products Found</p>
                    )}
                </div>
            )}
        </>
    );
}

export default ProductsCard;
