import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config/apiConfiguration';

export const handleConfirmPurchaseUtil = async (
    selectedItem,
    apiEndpoint,
    navigate,
    onClose,
    navigatePath
) => {
    try {
        const response = await fetch(
            `${apiEndpoint}/purchase/${selectedItem._id}`,
            {
                method: 'POST',
                credentials: 'include',
            }
        );
        const data = await response.json();

        toast.success(data.message || 'Purchase successful');
        onClose();
        if (navigatePath) {
            navigate(navigatePath);
        }
    } catch (error) {
        console.error('Error purchasing item:', error);
        toast.error('Failed to complete purchase');
    }
};

export const handleOnlinePaymentUtil = async (
    selectedItem,
    apiRequest,
    currentUrl,
    purchaseType
) => {
    if (!selectedItem) {
        toast.error('No item selected.');
        return;
    }

    const body = {
        amount: selectedItem.price / 5,
        purchaseItemId: selectedItem._id,
        typeOfPurchase: purchaseType || 'item_purchase',
        redirectBackUrl: currentUrl,
    };

    try {
        const response = await apiRequest(
            `${API_BASE_URL}/api/phonepe/initiate`,
            'POST',
            body
        );

        if (response.success) {
            window.location.href = response.redirectUrl;
        } else {
            toast.error('Payment initiation failed. Please try again.');
        }
    } catch (err) {
        console.error('Payment Error:', err);
        toast.error('Something went wrong!');
    }
};
