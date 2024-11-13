import { toast } from 'react-toastify';
import { API_KEY_URL } from '../config/apiConfiguration';

export const shortnerHandleShare = async (setLoading) => {
    const postUrl = window.location.href;
    setLoading(true);
    try {
        const response = await fetch(
            'https://ssurl.studentsenior.com/api/shorten',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': API_KEY_URL,
                },
                body: JSON.stringify({ originalUrl: postUrl }),
            }
        );

        if (response.ok) {
            const data = await response.json();
            const shortUrl = data.shortUrl;
            setLoading(false);
            if (navigator.share) {
                navigator
                    .share({ title: 'Student Senior', url: shortUrl })
                    .catch((error) => console.log('Share failed:', error));
            } else {
                navigator.clipboard
                    .writeText(shortUrl)
                    .then(() =>
                        toast.success('Shortened link copied to clipboard!')
                    )
                    .catch(() => alert('Failed to copy link.'));
            }
        } else {
            toast.error('Failed to shorten the URL.');
        }
    } catch (error) {
        console.log('Error shortening the URL:', error);
        toast.error('Failed to shorten the URL.');
    } finally {
        setLoading(false);
    }
};

export const originalHandleShare = () => {
    const postUrl = window.location.href;
    if (navigator.share) {
        navigator
            .share({ title: 'Student Senior Community Post', url: postUrl })
            .catch((error) => console.log('Share failed:', error));
    } else {
        navigator.clipboard
            .writeText(postUrl)
            .then(() => toast.success('Link copied to clipboard!'))
            .catch(() => toast.error('Failed to copy link.'));
    }
};
