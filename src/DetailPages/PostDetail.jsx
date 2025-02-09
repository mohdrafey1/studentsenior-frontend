import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useApiFetch from '../hooks/useApiFetch';
import { api } from '../config/apiConfiguration';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import usePosts from '../hooks/usePosts';
import Dialog from '../utils/Dialog';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DetailPageNavbar from './DetailPageNavbar';
import { originalHandleShare } from '../utils/handleShare';
import Seo from '../components/SEO/Seo';
import { capitalizeWords } from '../utils/Capitalize';

function PostDetail() {
    const { collegeName, id } = useParams();
    const [post, setPost] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const commentsRef = useRef(null);
    const commentInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { useFetch, loadingFetch } = useApiFetch();
    const {
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
    } = usePosts();

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const scrollToComments = () => {
        if (commentsRef.current) {
            commentsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };

    const url = `${api.community}/${id}`;

    const fetchPost = async () => {
        try {
            const data = await useFetch(url);
            setPost(data);
            // console.log(data);
        } catch (err) {
            console.error('Error fetching post:', err.message);
            toast.error(err.message);
        }
    };

    const handleCommentClick = () => {
        commentInputRef.current?.focus();
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    useEffect(() => {
        if (post && location.state?.scrollToComments) {
            setTimeout(scrollToComments, 100);
        }
    }, [post, location.state]);

    const openEditModal = (post) => {
        setEditingPostId(post._id);
        setEditedContent(post.content);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setEditingPostId(null);
        setEditedContent('');
        setShowEditModal(false);
    };

    const handleEditPost = async () => {
        await editPost(editingPostId, editedContent);
        fetchPost();
        closeEditModal();
    };

    const handleLikePost = async (postId) => {
        setPost((prevPost) => {
            const isLiked = prevPost.likes.includes(ownerId);
            return {
                ...prevPost,
                likes: isLiked
                    ? prevPost.likes.filter((id) => id !== ownerId)
                    : [...prevPost.likes, ownerId],
            };
        });

        await likePost(postId);
    };

    const handleDeleteClick = (postId) => {
        setPostIdToDelete(postId);
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (postIdToDelete) {
            await handleDeletePost(postIdToDelete);
            setShowDeleteDialog(false);
            setPostIdToDelete(null);
        }
    };

    const handleDeletePost = async (postId) => {
        await deletePost(postId);
        navigate(`/college/${collegeName}/community`);
    };

    const handleCloseDialog = () => setShowDeleteDialog(false);

    const handleAddComment = async (postId) => {
        await addComment(post._id);
        await fetchPost();
    };

    const handleLikeComment = async (commentId) => {
        setPost((prevPost) => {
            const updatedComments = prevPost.comments.map((comment) => {
                if (comment._id === commentId) {
                    return {
                        ...comment,
                        likes: likedComments.includes(commentId)
                            ? comment.likes - 1
                            : comment.likes + 1,
                    };
                }
                return comment;
            });
            return { ...prevPost, comments: updatedComments };
        });
        await likeComment(post._id, commentId);
    };

    const handleDeleteComment = async (postId, commentId) => {
        await deleteComment(postId, commentId);
        await fetchPost();
    };

    if (loadingFetch) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Post Not Found !
                </h1>
                <Link
                    to={`/college/${collegeName}/community`}
                    className="mt-6 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                    See Other Posts
                </Link>
            </div>
        );
    }

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative">
            <DetailPageNavbar path={`college/${collegeName}/community`} />
            <Seo title={`Post Details - ${capitalizeWords(collegeName)}`} desc={post.content.slice(0, 100)} />
            <div className="main">
                <div className="content  sm:w-4/5 sm:mx-auto">
                    <div className="profile-section m-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full">
                            {post.isAnonymous ? (
                                <div className="flex items-center justify-center rounded-full w-16 h-16 bg-gray-300 text-white font-bold">
                                    A
                                </div>
                            ) : (
                                <img
                                    src={post.author.profilePicture}
                                    alt="Author Profile"
                                    className="w-16 h-16 rounded-full"
                                />
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold">
                                {post.isAnonymous
                                    ? 'Anonymous'
                                    : post.author.username}
                            </h3>
                            <p>{post.college?.name}</p>
                        </div>
                    </div>

                    <div
                        className="post-content m-4"
                        dangerouslySetInnerHTML={{
                            __html: post.content || 'No content available',
                        }}
                    />
                </div>
                <hr />
                <div className="tool-section shadow-md flex items-center justify-evenly h-20">
                    <button
                        onClick={() => handleLikePost(post._id)}
                        className={`mt-1 px-3 rounded-lg ${
                            post.likes.includes(ownerId)
                                ? ' text-sky-500'
                                : 'text-black'
                        }`}
                        disabled={hookLoadingStates.likePost[post._id]}
                    >
                        {hookLoadingStates.likePost[post._id] ? (
                            <i className="fa fa-spinner fa-spin fa-2xl"></i>
                        ) : (
                            <>
                                <i className="fa-regular fa-thumbs-up fa-2xl"></i>
                                <p>Like ({post.likes.length})</p>
                            </>
                        )}
                    </button>
                    <div
                        className="text-center hover:text-blue-300"
                        onClick={handleCommentClick}
                    >
                        <i className="fa-regular fa-comment-dots fa-2xl"></i>
                        <p>Comment</p>
                    </div>
                    <div
                        className="text-center hover:text-blue-300"
                        onClick={originalHandleShare}
                    >
                        <i className="fa-regular fa-share-from-square fa-2xl"></i>
                        <p>Share</p>
                    </div>
                    {post.author._id === ownerId && (
                        <>
                            <button
                                onClick={() => openEditModal(post)}
                                className="text-yellow-500 px-2 rounded-lg"
                                title="Edit Post"
                            >
                                <i className="fa-regular fa-pen-to-square fa-2xl"></i>
                            </button>
                            {showEditModal && (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                        <h2 className="text-xl mb-4">
                                            Edit Post
                                        </h2>
                                        <div
                                            style={{
                                                maxHeight: '500px',
                                                overflowY: 'auto',
                                            }}
                                        >
                                            <CKEditor
                                                editor={ClassicEditor}
                                                data={editedContent}
                                                onChange={(event, editor) => {
                                                    const data =
                                                        editor.getData();
                                                    setEditedContent(data);
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <button
                                                onClick={closeEditModal}
                                                className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-md"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleEditPost}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <i className="fa fa-spinner fa-spin"></i>
                                                ) : (
                                                    'Update Post'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                onClick={() => handleDeleteClick(post._id)}
                                className="text-red-500 px-2  rounded-lg"
                                title="Delete Post"
                            >
                                <i className="fa-solid fa-trash fa-2xl"></i>
                            </button>
                            {/* Delete Confirmation Dialog */}
                            <Dialog
                                isOpen={showDeleteDialog}
                                onClose={handleCloseDialog}
                                title="Delete Confirmation"
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
                                            disabled={
                                                hookLoadingStates.deletePost[
                                                    postIdToDelete
                                                ]
                                            }
                                        >
                                            {hookLoadingStates.deletePost[
                                                postIdToDelete
                                            ] ? (
                                                <i className="fa fa-spinner fa-spin"></i>
                                            ) : (
                                                <>
                                                    <span>Confirm</span>
                                                    &nbsp;
                                                    <i className="fa-solid fa-trash fa-2xl"></i>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                }
                            >
                                <p>
                                    Are you sure you want to delete this item?
                                </p>
                                <p className="text-sm text-gray-500">
                                    This action cannot be undone.
                                </p>
                            </Dialog>
                        </>
                    )}
                </div>
                <hr />
                <div
                    ref={commentsRef}
                    className="comment-section p-4 my-4  sm:w-4/5 sm:mx-auto"
                >
                    <h3 className="text-2xl text-center mb-6 font-bold">
                        Comments
                    </h3>
                    {post?.comments?.length > 0 ? (
                        post.comments.map((comment) => (
                            <div
                                key={comment._id}
                                className="flex items-start gap-4 mb-6 border-b"
                            >
                                <div className="profile-photo w-14 h-12 sm:h-14 rounded-full overflow-hidden">
                                    <img
                                        src={
                                            comment.author?.profilePicture ||
                                            '/default-avatar.png'
                                        }
                                        alt="Comment author profile"
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                </div>
                                <div className="w-full">
                                    <div className="comment-content bg-white rounded-md p-4">
                                        <div className="name font-semibold mb-2">
                                            {comment.author?.username ||
                                                'Anonymous'}
                                        </div>
                                        <div className="content text-gray-700">
                                            {comment.content ||
                                                'No comment text'}
                                        </div>
                                    </div>
                                    <div className="my-3 flex gap-4 items-center">
                                        <button
                                            onClick={() =>
                                                handleLikeComment(comment._id)
                                            }
                                            className={`hover:text-blue-500 ${
                                                likedComments.includes(
                                                    comment._id
                                                )
                                                    ? 'text-sky-500'
                                                    : 'text-gray-600'
                                            }`}
                                            disabled={likedComments.includes(
                                                comment._id
                                            )}
                                        >
                                            <p className="flex items-center gap-1">
                                                <i className="fa-regular fa-heart"></i>
                                                <span>Like</span>
                                                <span>({comment.likes})</span>
                                            </p>
                                        </button>

                                        {comment.author._id === ownerId && (
                                            <button
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() =>
                                                    handleDeleteComment(
                                                        post._id,
                                                        comment._id
                                                    )
                                                }
                                                disabled={
                                                    hookLoadingStates
                                                        .deleteComment[
                                                        `${post._id}-${comment._id}`
                                                    ]
                                                }
                                            >
                                                {hookLoadingStates
                                                    .deleteComment[
                                                    `${post._id}-${comment._id}`
                                                ] ? (
                                                    <i className="fa fa-spinner fa-spin"></i>
                                                ) : (
                                                    <i className="fa-solid fa-trash"></i>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 mt-4">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </div>
            {/* Fixed input section */}
            <div className="fixed bottom-0 left-0 w-full bg-sky-100 py-2 px-1">
                <div className="rounded-3xl border border-gray-400 shadow-lg flex gap-2 h-16 items-center px-2">
                    <div className="rounded-full h-10 w-14 sm:h-12 bg-gray-500 flex items-center justify-center text-white overflow-hidden">
                        {currentUser ? (
                            <img
                                src={currentUser.profilePicture}
                                alt="User Profile"
                                className="rounded-full w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-lg">A</span>
                        )}
                    </div>
                    <div className="w-full">
                        <input
                            ref={commentInputRef}
                            className="w-full h-full p-4 rounded-3xl border border-gray-300"
                            type="text"
                            placeholder="Leave your thoughts here..."
                            value={commentContent[post._id] || ''}
                            onChange={(e) =>
                                setCommentContent({
                                    ...commentContent,
                                    [post._id]: e.target.value,
                                })
                            }
                        />
                    </div>
                    <button
                        className="flex items-center gap-1 bg-blue-400 text-white rounded-2xl px-2 py-3"
                        onClick={() => handleAddComment(post._id)}
                        disabled={hookLoadingStates.addComment[post._id]}
                    >
                        {hookLoadingStates.addComment[post._id] ? (
                            <i className="fa fa-spinner fa-spin"></i>
                        ) : (
                            <>
                                <p>Send</p>
                                <i className="fa-regular fa-paper-plane"></i>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostDetail;
