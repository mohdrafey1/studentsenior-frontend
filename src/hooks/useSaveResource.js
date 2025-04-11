import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { api } from '../config/apiConfiguration';
import { fetchSavedCollection } from '../redux/slices/savedCollectionSlice';

export const useSaveResource = () => {
    const dispatch = useDispatch();

    const saveResource = async (resourceType, resourceId) => {
        try {
            const endpoint =
                resourceType === 'pyq'
                    ? `${api.savedData.savePyq}/${resourceId}`
                    : `${api.savedData.saveNote}/${resourceId}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            toast.success(data.message);
            dispatch(fetchSavedCollection());
        } catch (err) {
            console.error(`Error saving ${resourceType}:`, err);
            toast.error(`Failed to save ${resourceType}`);
        }
    };

    const unsaveResource = async (resourceType, resourceId) => {
        try {
            const endpoint =
                resourceType === 'pyq'
                    ? `${api.savedData.unsavePyq}/${resourceId}`
                    : `${api.savedData.unsaveNote}/${resourceId}`;

            const response = await fetch(endpoint, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            toast.success(data.message);
            dispatch(fetchSavedCollection());
        } catch (err) {
            console.error(`Error unsaving ${resourceType}:`, err);
            toast.error(`Failed to unsave ${resourceType}`);
        }
    };

    return { saveResource, unsaveResource };
};
