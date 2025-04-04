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
      <div className="flex gap-3">
        <button
          className="text-yellow-600 text-2xl sm:text-3xl rounded mr-2 transition hover:text-yellow-300"
          onClick={(e) => {
            e.preventDefault();
            handleEdit(product);
          }}
        >
          <i className="fa-regular fa-pen-to-square"></i>
        </button>
        <button
          className="text-2xl sm:text-3xl text-red-600 rounded transition hover:text-red-300"
          onClick={(e) => {
            e.preventDefault();
            handleDelete(product._id);
          }}
          disabled={loadingStates[product._id]}
        >
          {loadingStates[product._id] ? (
            <i className="fa fa-spinner fa-spin"></i>
          ) : (
            <i className="fa-solid fa-trash"></i>
          )}
        </button>
      </div>
    );
  };

  const renderSocialLinks = (product) => {
    const socialLinks = [];

    if (product.whatsapp) {
      socialLinks.push(
        <button
          key="whatsapp"
          onClick={(e) => e.stopPropagation()}
          className="text-green-600 hover:text-green-500 transition"
        >
          <a
            href={`https://api.whatsapp.com/send?phone=${encodeURIComponent(
              product.whatsapp.startsWith('+')
                ? product.whatsapp
                : `+91${product.whatsapp}`,
            )}&text=${encodeURIComponent(
              `Hey, I came from Student Senior about listed ${product.name}. Can you provide more details?`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa-brands fa-whatsapp text-2xl"></i>
          </a>
        </button>,
      );
    }

    if (product.telegram) {
      socialLinks.push(
        <button
          key="telegram"
          onClick={(e) => e.stopPropagation()}
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
        </button>,
      );
    }

    return socialLinks.length > 0 ? (
      <div className="flex gap-3">{socialLinks}</div>
    ) : null;
  };

  const renderProductCard = (product) => {
    const isAvailable = product.available;
    const productLink = `/college/${collegeName}/store/${product.slug}`;

    return (
      <div
        key={product._id}
        className={`min-w-40 my-4 w-full relative ${
          !isAvailable && 'opacity-50 cursor-not-allowed'
        }`}
      >
        {!isAvailable && (
          <div className="z-50 absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Sold Out
          </div>
        )}
        <Link
          to={productLink}
          className={`h-full block border border-gray-200 rounded-2xl shadow-md p-0 bg-white dark:bg-gray-800 overflow-hidden transform transition duration-300 ${
            isAvailable ? 'hover:scale-105 hover:shadow-xl' : ''
          }`}
          onClick={(e) => {
            if (!isAvailable) e.preventDefault();
          }}
        >
          <img
            src={product.image.url}
            alt={product.name}
            className="bg-white shadow-md h-40 max-h-60 w-full rounded-t-lg overflow-hidden transform transition duration-300 hover:scale-105"
          />
          <div className="p-4">
            <h5 className="lg:text-lg text-sm tracking-tight text-gray-700 dark:text-gray-300">
              {product.name}
            </h5>
            <p>
              <span className="text-base lg:text-2xl font-bold text-gray-700 dark:text-gray-300">
                ₹{product.price}
              </span>
            </p>
            <div className="my-2">
              <div className="flex justify-between">
                {renderSocialLinks(product)}
                {renderProductActions(product)}
              </div>
              <p className="text-gray-600 italic overflow-hidden dark:text-gray-200 text-xs lg:text-base">
                {product.description.length > 50
                  ? `${product.description.substring(0, 50)}...`
                  : product.description}
              </p>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  const renderContent = () => {
    if (loadingFetch) {
      return (
        <div className="col-span-4 flex justify-center items-center w-full">
          <i className="fas fa-spinner fa-pulse fa-5x"></i>
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="col-span-4 flex justify-center items-center w-full">
          <p>No Products Found</p>
        </div>
      );
    }

    return products.map((product) => renderProductCard(product));
  };

<<<<<<< HEAD
  return <>{renderContent()}</>;
=======
        return socialLinks.length > 0 ? (
            <div className="flex gap-3">{socialLinks}</div>
        ) : null;
    };

    const renderProductCard = (product) => {
        const isAvailable = product.available;
        const productLink = `/college/${collegeName}/store/${product.slug}`;

        return (
            <div className="w-full my-4 relative">
                <div className={`relative rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 ${isAvailable ? 'hover:shadow-lg' : 'opacity-70'}`}>
                    {/* Image container */}
                    <div className="relative h-48 overflow-hidden">
                        <img
                            src={product.image.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />

                        {/* Availability badge */}
                        {!isAvailable && (
                            <div className="absolute top-0 right-0 left-0 bg-black bg-opacity-60 text-white text-sm font-medium py-1.5 text-center">
                                Sold Out
                            </div>
                        )}

                        {/* Quick action buttons */}
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                            {renderProductActions(product)}
                        </div>
                    </div>

                    {/* Content area */}
                    <div className="p-4">
                        {/* Product name */}
                        <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">
                            {product.name}
                        </h3>

                        {/* Price */}
                        <div className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                            ₹{product.price}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                            {product.description}
                        </p>

                        {/* Social links */}
                        <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                                {renderSocialLinks(product)}
                            </div>

                            {/* View details button */}
                            {isAvailable && (
                                <Link
                                    to={productLink}
                                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    View Details
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderContent = () => {
        if (loadingFetch) {
            return (
                <div className="col-span-4 flex justify-center items-center w-full">
                    <i className="fas fa-spinner fa-pulse fa-5x"></i>
                </div>
            );
        }

        if (products.length === 0) {
            return (
                <div className="col-span-4 flex justify-center items-center w-full">
                    <p>No Products Found</p>
                </div>
            );
        }

        return products.map((product) => renderProductCard(product));
    };

    return <>{renderContent()}</>;
>>>>>>> 81caa9540474d85015bef0d185d0a79b7f7e7782
}

export default ProductsCard;
