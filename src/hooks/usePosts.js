import { useState, useEffect } from 'react';
import { api } from '../config/apiConfiguration';
import { toast } from 'react-toastify';

import useApiRequest from '../hooks/useApiRequest';

const usePosts = () => {
    const [likedComments, setLikedComments] = useState([]);
    const [commentContent, setCommentContent] = useState({});
    const [hookLoadingStates, setHookLoadingStates] = useState({
        likePost: {},
        addComment: {},
        deleteComment: {},
        deletePost: {},
    });

    const { apiRequest, loading } = useApiRequest();
    const url = api.community;

    // Edit a post
    const editPost = async (editingPostId, editedContent) => {
        if (editedContent.trim() && editingPostId) {
            try {
                await apiRequest(`${url}/${editingPostId}`, 'PUT', {
                    content: editedContent,
                });
                toast.success('Post Updated Successfully');
            } catch (err) {
                console.error('Error editing post:', err);
            }
        }
    };

    const likePost = async (postId) => {
        setHookLoadingStates((prev) => ({
            ...prev,
            likePost: { ...prev.likePost, [postId]: true },
        }));
        try {
            await apiRequest(`${url}/${postId}/like`, 'POST');
        } catch (err) {
            console.error('Error liking/unliking post:', err);
            toast.error('Error liking/unliking post');
        } finally {
            setHookLoadingStates((prev) => ({
                ...prev,
                likePost: { ...prev.likePost, [postId]: false },
            }));
        }
    };

    const deletePost = async (postId) => {
        setHookLoadingStates((prev) => ({
            ...prev,
            deletePost: { ...prev.deletePost, [postId]: true },
        }));
        try {
            await apiRequest(`${url}/${postId}`, 'DELETE');
            toast.success('Post Deleted Successfully');
        } catch (err) {
            console.error('Error deleting post:', err);
        } finally {
            setHookLoadingStates((prev) => ({
                ...prev,
                deletePost: { ...prev.deletePost, [postId]: false },
            }));
        }
    };

    const addComment = async (postId) => {
        const content = commentContent[postId];
        if (content && content.trim()) {
            setHookLoadingStates((prev) => ({
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
                setHookLoadingStates((prev) => ({
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
        setHookLoadingStates((prev) => ({
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
            setHookLoadingStates((prev) => ({
                ...prev,
                deleteComment: {
                    ...prev.deleteComment,
                    [`${postId}-${commentId}`]: false,
                },
            }));
        }
    };

    return {
        editPost,
        likePost,
        deletePost,
        addComment,
        likeComment,
        deleteComment,
        hookLoadingStates,
        likedComments,
        commentContent,
        setCommentContent,
        loading,
    };
};

export default usePosts;
