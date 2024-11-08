import { useState, useEffect } from 'react';
import { api } from '../config/apiConfiguration';
import { toast } from 'react-toastify';

import useApiRequest from '../hooks/useApiRequest';

const usePosts = () => {
    const [likedComments, setLikedComments] = useState([]);
    const [commentContent, setCommentContent] = useState({});
    const [loadingStates, setLoadingStates] = useState({
        likePost: {},
        addComment: {},
        deleteComment: {},
        deletePost: {},
    });

    const { apiRequest, loading } = useApiRequest();
    const url = api.community;

    const likePost = async (postId) => {
        setLoadingStates((prev) => ({
            ...prev,
            likePost: { ...prev.likePost, [postId]: true },
        }));
        try {
            await apiRequest(`${url}/${postId}/like`, 'POST');
        } catch (err) {
            console.error('Error liking/unliking post:', err);
            toast.error('Error liking/unliking post');
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                likePost: { ...prev.likePost, [postId]: false },
            }));
        }
    };

    const deletePost = async (postId) => {
        setLoadingStates((prev) => ({
            ...prev,
            deletePost: { ...prev.deletePost, [postId]: true },
        }));
        try {
            await apiRequest(`${url}/${postId}`, 'DELETE');
            toast.success('Post Deleted Successfully');
        } catch (err) {
            console.error('Error deleting post:', err);
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                deletePost: { ...prev.deletePost, [postId]: false },
            }));
        }
    };

    const addComment = async (postId) => {
        const content = commentContent[postId];
        if (content && content.trim()) {
            setLoadingStates((prev) => ({
                ...prev,
                addComment: { ...prev.addComment, [postId]: true },
            }));
            try {
                await apiRequest(`${url}/${postId}/comments`, 'POST', {
                    content,
                });
                setCommentContent((prev) => ({
                    ...prev,
                    [postId]: '',
                }));

                toast.success('Comment Added!');
            } catch (err) {
                console.error('Error adding comment:', err);
                toast.error('Error adding comment');
            } finally {
                setLoadingStates((prev) => ({
                    ...prev,
                    addComment: { ...prev.addComment, [postId]: false },
                }));
            }
        }
    };

    const likeComment = async (postId, commentId) => {
        if (!likedComments.includes(commentId)) {
            try {
                await apiRequest(
                    `${url}/${postId}/comments/${commentId}/like`,
                    'POST'
                );

                const updatedLikes = [...likedComments, commentId];
                setLikedComments(updatedLikes);
                localStorage.setItem(
                    'likedComments',
                    JSON.stringify(updatedLikes)
                );
            } catch (err) {
                console.error('Error liking comment:', err);
                toast.error('Error liking comment');
            }
        }
    };

    const deleteComment = async (postId, commentId) => {
        setLoadingStates((prev) => ({
            ...prev,
            deleteComment: {
                ...prev.deleteComment,
                [`${postId}-${commentId}`]: true,
            },
        }));
        try {
            await apiRequest(
                `${url}/${postId}/comments/${commentId}`,
                'DELETE'
            );
            toast.success('Comment Deleted Successfully');
        } catch (err) {
            console.error('Error deleting comment:', err);
            toast.error('Error deleting comment');
        } finally {
            setLoadingStates((prev) => ({
                ...prev,
                deleteComment: {
                    ...prev.deleteComment,
                    [`${postId}-${commentId}`]: false,
                },
            }));
        }
    };

    return {
        likePost,
        deletePost,
        addComment,
        likeComment,
        deleteComment,
        loadingStates,
        likedComments,
        commentContent,
        setCommentContent,
    };
};

export default usePosts;
