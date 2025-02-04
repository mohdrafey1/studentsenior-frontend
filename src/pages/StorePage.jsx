import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AddProductModal from '../components/StoreModal/AddProductModal';
import EditProductModal from '../components/StoreModal/EditProductModal';
import CollegeLinks from '../components/Links/CollegeLinks';
import { api } from '../config/apiConfiguration.js';
import Collegelink2 from '../components/Links/CollegeLink2.jsx';
import { capitalizeWords } from '../utils/Capitalize.js';
import { toast } from 'react-toastify';
import useApiRequest from '../hooks/useApiRequest.js';
import ProductsCard from '../components/Cards/ProductsCard.jsx';
import { useCollegeId } from '../hooks/useCollegeId.js';
import Dialog from '../utils/Dialog.jsx';
import { fetchProducts } from '../redux/slices/productSlice.js';
import useRequireLogin from '../hooks/useRequireLogin.js';

const StorePage = () => {
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const [loadingStates, setLoadingStates] = useState({});
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [productIdtoDelete, setProductIdtoDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        price: '',
        description: '',
        whatsapp: '',
        telegram: '',
        college: '',
        image: null,
        available: true,
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('add');

    const dispatch = useDispatch();
    const { apiRequest, loading } = useApiRequest();

    const {
        products,
        loading: loadingProducts,
        error,
    } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts(collegeId));
    }, [collegeId]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (editingProduct) {
                setEditingProduct({ ...editingProduct, [name]: checked });
            } else {
                setNewProduct({ ...newProduct, [name]: checked });
            }
        } else {
            if (editingProduct) {
                setEditingProduct({ ...editingProduct, [name]: value });
            } else {
                setNewProduct({ ...newProduct, [name]: value });
            }
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, image: file });
        } else {
            setNewProduct({ ...newProduct, image: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        requireLogin(async () => {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('price', newProduct.price);
            formData.append('description', newProduct.description);
            formData.append('whatsapp', newProduct.whatsapp);
            formData.append('telegram', newProduct.telegram);
            formData.append('college', collegeId);
            formData.append('image', newProduct.image);
            formData.append('available', newProduct.available);

            try {
                await apiRequest(`${api.store}`, 'POST', formData, true);
                setIsModalOpen(false);
                toast.success(
                    'Your request has been received. The item will display once approved.',
                    { autoClose: 10000 }
                );
            } catch (err) {
                console.error('Error adding product:', err);
            }
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editingProduct.name);
        formData.append('price', editingProduct.price);
        formData.append('description', editingProduct.description);
        formData.append('whatsapp', editingProduct.whatsapp);
        formData.append('telegram', editingProduct.telegram);
        formData.append('college', collegeId);
        formData.append('image', editingProduct.image);
        formData.append('available', editingProduct.available);
        formData.append('status', 'true');

        try {
            await apiRequest(
                `${api.store}/${editingProduct._id}`,
                'PUT',
                formData,
                true
            );

            dispatch(fetchProducts(collegeId));
            setIsModalOpen(false);
            setEditingProduct(null);
            toast.success('Your request has been updated.');
        } catch (err) {
            console.error('Error updating product:', err);
        }
    };

    const handleAddProduct = () => {
        setNewProduct({
            name: '',
            price: '',
            description: '',
            whatsapp: '',
            telegram: '',
            college: '',
            image: null,
            available: true,
        });
        setEditingProduct(null);
        setModalType('add');
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setModalType('edit');
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId) => {
        setProductIdtoDelete(productId);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setDeleteLoading(true);
        try {
            await apiRequest(`${api.store}/${productIdtoDelete}`, 'DELETE');
            dispatch(fetchProducts(collegeId));
            toast.success('Your request has been deleted successfully');
            setShowDeleteDialog(false);
            setProductIdtoDelete(null);
            setDeleteLoading(false);
        } catch (err) {
            console.error('Error deleting product:', err);
            toast.error('Error deleting product');
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleCloseDialog = () => setShowDeleteDialog(false);

    return (
        <div className="bg-gradient-to-t from-sky-200 to bg-white">
            <CollegeLinks />
            <div className="container mx-auto px-4 py-5">
                <div className="flex flex-col justify-center items-center">
                    <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                        Product Store - {capitalizeWords(collegeName)}
                    </h1>
                    <p className="italic text-center text-xs sm:text-base">
                        "Buy and sell your stationery and gadgets easily to your
                        juniors."
                    </p>
                    <br />
                </div>
                <div className="flex justify-center mb-4">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={handleAddProduct}
                    >
                        Add Product
                    </button>
                </div>

                <div className="flex justify-center items-center py-1">
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-6 w-full max-w-7xl h-fit ">
                        <ProductsCard
                            products={products}
                            loadingFetch={loadingProducts}
                            loadingStates={loadingStates}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                        <br />
                        <Dialog
                            isOpen={showDeleteDialog}
                            onClose={handleCloseDialog}
                            title="Product Delete Confirmation"
                            footer={
                                <div className="flex py-4 gap-3 lg:justify-end justify-center">
                                    <button
                                        className="p-1 py-2 bg-white rounded-lg px-4 border-gray-400 text-sm ring-1 ring-inset ring-gray-300 cursor-pointer"
                                        onClick={handleCloseDialog}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="p-1 py-2 bg-red-600 rounded-lg px-4 text-sm font-semibold text-white cursor-pointer"
                                        onClick={handleConfirmDelete}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? (
                                            <i className="fa fa-spinner fa-spin"></i>
                                        ) : (
                                            <>
                                                <span>Confirm</span>
                                                &nbsp;
                                                <i className="fa-solid fa-trash fa-xl"></i>
                                            </>
                                        )}
                                    </button>
                                </div>
                            }
                        >
                            <p>Are you sure you want to delete this item?</p>
                            <p className="text-sm text-gray-500">
                                This action cannot be undone.
                            </p>
                        </Dialog>
                    </div>
                </div>
                {isModalOpen &&
                    (modalType === 'edit' ? (
                        <EditProductModal
                            editingProduct={editingProduct}
                            handleInputChange={handleInputChange}
                            handleFileChange={handleFileChange}
                            handleUpdate={handleUpdate}
                            setIsModalOpen={setIsModalOpen}
                            loading={loading}
                        />
                    ) : (
                        <AddProductModal
                            newProduct={newProduct}
                            handleInputChange={handleInputChange}
                            handleFileChange={handleFileChange}
                            handleSubmit={handleSubmit}
                            setIsModalOpen={setIsModalOpen}
                            loading={loading}
                        />
                    ))}
            </div>
            <Collegelink2 />
        </div>
    );
};

export default StorePage;
