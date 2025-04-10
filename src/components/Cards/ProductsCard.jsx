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

    const renderProductActions = (product) => {
        if (!loadingStates || product.owner !== ownerId) return null;

        return (
            <div className="absolute top-2 right-2 flex gap-2 bg-white bg-opacity-80 rounded-lg p-1.5 shadow-sm">
                <button
                    className="text-yellow-600 hover:text-yellow-500 transition-colors duration-200"
                    onClick={(e) => {
                        e.preventDefault();
                        handleEdit(product);
                    }}
                    aria-label="Edit product"
                >
                    <i className="fa-regular fa-pen-to-square text-xl"></i>
                </button>
                <button
                    className="text-red-600 hover:text-red-500 transition-colors duration-200"
                    onClick={(e) => {
                        e.preventDefault();
                        handleDelete(product._id);
                    }}
                    disabled={loadingStates[product._id]}
                    aria-label="Delete product"
                >
                    {loadingStates[product._id] ? (
                        <i className="fa fa-spinner fa-spin text-xl"></i>
                    ) : (
                        <i className="fa-solid fa-trash text-xl"></i>
                    )}
                </button>
            </div>
        );
    };

    const renderSocialLinks = (product) => {
        const socialLinks = [];

        if (product.whatsapp) {
            const isAvailable = product.available === true;
            socialLinks.push(
                <a
                    key="whatsapp"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-1.5 text-green-600 hover:text-green-500 transition-colors duration-200 bg-green-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${!isAvailable ? 'cursor-not-allowed pointer-events-none' : ''}`}
                    href={
                        isAvailable
                            ? `https://api.whatsapp.com/send?phone=${encodeURIComponent(
                                product.whatsapp.startsWith('+')
                                    ? product.whatsapp
                                    : `+91${product.whatsapp}`
                            )}&text=${encodeURIComponent(
                                `Hey, I came from Student Senior about listed ${product.name}. Can you provide more details?`
                            )}`
                            : '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Contact on WhatsApp"
                >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    <span className="text-xs font-medium hidden sm:inline">WhatsApp</span>
                </a>
            );
        }

        if (product.telegram) {
            const isAvailable = product.available === true;

            socialLinks.push(
                <a
                    href={isAvailable ? `https://t.me/+91${product.telegram}` : '#'}
                    className={`flex items-center gap-1.5 text-blue-600 hover:text-blue-500 transition-colors duration-200 bg-blue-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full ${!isAvailable ? 'cursor-not-allowed pointer-events-none' : ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label="Contact on Telegram"
                >
                    <i className="fa-brands fa-telegram text-lg"></i>
                    <span className="text-xs font-medium hidden sm:inline">Telegram</span>
                </a>

            );
        }


        return socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-2">{socialLinks}</div>
        ) : null;
    };

    const renderProductCard = (product) => {
        const isAvailable = product.available;
        const productLink = `/college/${collegeName}/store/${product.slug}`;

        return (
            <div className="h-full">
                <div
                    className={`flex flex-col h-full relative rounded-xl overflow-hidden bg-white border border-gray-100 transition-all duration-300 ${isAvailable
                        ? 'hover:shadow-lg hover:border-gray-200'
                        : 'opacity-80 grayscale-[30%]'
                        }`}
                >
                    {/* Admin actions */}
                    {renderProductActions(product)}

                    {/* Image container - fixed height */}
                    <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden bg-gray-100">
                        <img
                            src={product.image.url}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                        />


                        {/* Availability badge */}
                        {!isAvailable && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                                <div className="bg-black bg-opacity-75 text-white font-semibold py-2 px-4 rounded-lg transform rotate-12">
                                    SOLD OUT
                                </div>
                            </div>
                        )}

                        {/* Price tag */}
                        <div className="absolute bottom-3 left-3 bg-white px-2 sm:px-3 py-1 rounded-full shadow-md">
                            <span className="font-bold text-gray-900 text-sm sm:text-base">₹{product.price}</span>
                        </div>
                    </div>

                    {/* Content area - flex grow to fill available space */}
                    <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-grow">
                        {/* Product name - fixed height with ellipsis */}
                        <h3 className="font-medium text-gray-800 text-base sm:text-lg mb-1 line-clamp-1 h-6 sm:h-7">
                            {product.name}
                        </h3>

                        {/* Description - fixed height with ellipsis */}
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 h-8 sm:h-10">
                            {product.description}
                        </p>

                        {/* Spacer to push footer to bottom */}
                        <div className="flex-grow"></div>

                        {/* Bottom area - fixed position at bottom */}
                        <div className="flex flex-col gap-2 sm:gap-3 mt-auto">
                            {/* Social links */}
                            <div className="min-h-8 sm:min-h-10">
                                {renderSocialLinks(product)}
                            </div>

                            {/* View details button */}
                            <div className="h-8 sm:h-10">
                                {isAvailable && (
                                    <Link
                                        to={productLink}
                                        className="flex justify-center items-center w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg transition-colors duration-200 font-medium text-xs sm:text-sm"
                                    >
                                        View Details
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (loadingFetch) {
            return (
                <div className="col-span-full flex justify-center items-center py-12 w-full">
                    <div className="text-center">
                        <i className="fas fa-spinner fa-pulse fa-3x text-blue-600 mb-4"></i>
                        <p className="text-gray-600">Loading products...</p>
                    </div>
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <div className="col-span-full flex justify-center items-center py-8 sm:py-12 bg-gray-50 rounded-xl w-full">
                    <div className="text-center px-4">
                        <div className="text-gray-400 text-4xl sm:text-5xl mb-3 sm:mb-4">
                            <i className="fa-solid fa-box-open"></i>
                        </div>
                        <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-1 sm:mb-2">No Products Found</h3>
                        <p className="text-sm text-gray-500">There are currently no products available in this section.</p>
                    </div>
                </div>
            );
        }

        return products.map((product) => (
            <div key={product._id} className="w-full h-full">
                {renderProductCard(product)}
            </div>
        ));
    };

    return renderContent();
}

export default ProductsCard;