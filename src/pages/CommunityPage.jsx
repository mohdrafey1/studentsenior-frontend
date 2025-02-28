import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { api } from '../config/apiConfiguration';
import { capitalizeWords } from '../utils/Capitalize';
import useApiRequest from '../hooks/useApiRequest';
import Dialog from '../utils/Dialog';
import usePosts from '../hooks/usePosts';
import { useCollegeId } from '../hooks/useCollegeId';
import { fetchPosts } from '../redux/slices/postSlice';
import useRequireLogin from '../hooks/useRequireLogin';
import Seo from '../components/SEO/Seo';
import Button from '../ui/Button';

const CommunityPage = () => {
    const navigate = useNavigate();
    const { collegeName } = useParams();
    const collegeId = useCollegeId(collegeName);
    const requireLogin = useRequireLogin();
    const dispatch = useDispatch();
    const { apiRequest, loading } = useApiRequest();
    const url = api.community;

    // State management
    const [newPostContent, setNewPostContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [likedComments, setLikedComments] = useState([]);
    const [editLoading, setEditLoading] = useState(false);

    // Redux state
    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;
    const {
        posts,
        loading: postLoading,
        error: postError,
    } = useSelector((state) => state.posts || {});

    // Custom hooks
    const {
        likePost,
        deletePost,
        addComment,
        deleteComment,
        editPost,
        hookLoadingStates,
        setCommentContent,
        commentContent,
    } = usePosts();

    // Fetch posts on component mount or collegeId change
    useEffect(() => {
        dispatch(fetchPosts(collegeId));
    }, [collegeId, dispatch]);

    // Load liked comments from localStorage
    useEffect(() => {
        const storedLikes =
            JSON.parse(localStorage.getItem('likedComments')) || [];
        setLikedComments(storedLikes);
    }, []);

    // Modal handlers
    const openModal = () => requireLogin(() => setShowModal(true));
    const closeModal = () => setShowModal(false);

    const openEditModal = (post) => {
        setEditingPostId(post._id);
        setEditedContent(post.content);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setEditingPostId(null);
        setEditedContent('');
        setShowEditModal(false);
        setEditLoading(false);
    };

    // Delete post handlers
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

    const handleCloseDialog = () => setShowDeleteDialog(false);

    // Add a new post
    const addPost = async () => {
        if (newPostContent.trim()) {
            try {
                await apiRequest(url, 'POST', {
                    content: newPostContent,
                    isAnonymous,
                    college: collegeId,
                });
                dispatch(fetchPosts(collegeId));
                setNewPostContent('');
                closeModal();
                toast.success('Post Added Successfully');
            } catch (err) {
                console.error('Error adding post:', err);
                toast.error('Failed to add post');
            }
        }
    };

    // Delete a post
    const handleDeletePost = async (postId) => {
        await deletePost(postId);
        dispatch(fetchPosts(collegeId));
    };

    // Edit a post
    const handleEditPost = async () => {
        setEditLoading(true);
        await editPost(editingPostId, editedContent);
        dispatch(fetchPosts(collegeId));
        closeEditModal();
        setEditLoading(false);
    };

    // Add a comment
    const handleAddComment = async (postId) => {
        requireLogin(async () => {
            try {
                await addComment(postId);
                dispatch(fetchPosts(collegeId));
            } catch (error) {
                console.error('Error adding comment:', error);
            }
        });
    };

    // Like a post
    const handleLikePost = async (postId) => {
        requireLogin(async () => {
            try {
                await likePost(postId);
                dispatch(fetchPosts(collegeId));
            } catch (error) {
                console.error('Error liking post:', error);
            }
        });
    };

    // Like a comment
    const likeComment = async (postId, commentId) => {
        if (!likedComments.includes(commentId)) {
            try {
                await apiRequest(
                    `${url}/${postId}/comments/${commentId}/like`,
                    'POST'
                );
                dispatch(fetchPosts(collegeId));

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

    // Delete a comment
    const handleDeleteComment = async (postId, commentId) => {
        await deleteComment(postId, commentId);
        dispatch(fetchPosts(collegeId));
    };

    // Share a post
    const handleShare = (postId) => {
        const postUrl = `${window.location.href}/post/${postId}`;
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

    // Navigate to post details
    const handleShowComments = (postId) => {
        navigate(`/college/${collegeName}/community/post/${postId}`, {
            state: { scrollToComments: true },
        });
    };

    return (
        <div className="container bg-gradient-to-t from-sky-200 to-white min-h-screen min-w-full">
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-lg sm:text-3xl font-bold mb-2 text-center">
                    Community - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center text-xs sm:text-base">
                    "Connect, share, and ask your questions and doubts through
                    the community."
                </p>
                <Seo
                    title={`Community - ${capitalizeWords(collegeName)}`}
                    desc="Connect, share, and ask your questions and doubts through the community."
                />
                <br />
                <div className="mb-5 text-center">
                    <Button onClick={openModal}>Add Post</Button>
                </div>

                {/* Add Post Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-xl mb-4">Create New Post</h2>
                            <div
                                style={{
                                    maxHeight: '500px',
                                    overflowY: 'auto',
                                }}
                            >
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={newPostContent}
                                    onChange={(event, editor) =>
                                        setNewPostContent(editor.getData())
                                    }
                                />
                            </div>
                            <div className="mt-4 flex gap-4">
                                <p>Post As Anonymous</p>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isAnonymous}
                                        onChange={(e) =>
                                            setIsAnonymous(e.target.checked)
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-6 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700"></div>
                                </label>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={closeModal}
                                    className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addPost}
                                    className="px-4 py-2 bg-sky-500 text-white rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                        'Add Post'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Posts List */}
                {posts.length > 0 ? (
                    <div className="flex flex-wrap gap-4 justify-center">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                ownerId={ownerId}
                                collegeName={collegeName}
                                onEdit={() => openEditModal(post)}
                                onDelete={() => handleDeleteClick(post._id)}
                                onLike={() => handleLikePost(post._id)}
                                onShare={() => handleShare(post._id)}
                                onShowComments={() =>
                                    handleShowComments(post._id)
                                }
                                onAddComment={() => handleAddComment(post._id)}
                                onLikeComment={(commentId) =>
                                    likeComment(post._id, commentId)
                                }
                                onDeleteComment={(commentId) =>
                                    handleDeleteComment(post._id, commentId)
                                }
                                likedComments={likedComments}
                                hookLoadingStates={hookLoadingStates}
                                commentContent={commentContent}
                                setCommentContent={setCommentContent}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="col-span-4 flex justify-center items-center py-10 w-full">
                        {postLoading ? (
                            <i className="fas fa-spinner fa-pulse fa-5x"></i>
                        ) : (
                            <p className="text-gray-200 dark:text-gray-600 text-center">
                                No Post to show.
                            </p>
                        )}
                    </div>
                )}

                {/* Edit Post Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <h2 className="text-xl mb-4">Edit Post</h2>
                            <div
                                style={{
                                    maxHeight: '500px',
                                    overflowY: 'auto',
                                }}
                            >
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={editedContent}
                                    onChange={(event, editor) =>
                                        setEditedContent(editor.getData())
                                    }
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
                                    className="px-4 py-2 bg-sky-500 text-white rounded-md"
                                    disabled={editLoading}
                                >
                                    {editLoading ? (
                                        <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                        'Update Post'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
                                    hookLoadingStates.deletePost[postIdToDelete]
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
            <Collegelink2 />
        </div>
    );
};

// PostCard Component
const PostCard = ({
    post,
    ownerId,
    collegeName,
    onEdit,
    onDelete,
    onLike,
    onShare,
    onShowComments,
    onAddComment,
    onLikeComment,
    onDeleteComment,
    likedComments,
    hookLoadingStates,
    commentContent,
    setCommentContent,
}) => {
    const latestComment = post.comments[post.comments.length - 1];

    return (
        <div className="block max-w-sm p-6 w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    {post.isAnonymous ? (
                        <div className="flex items-center justify-center rounded-full w-8 h-8 bg-gray-300 text-white font-bold">
                            A
                        </div>
                    ) : (
                        <img
                            src={post.author.profilePicture}
                            alt="Author Profile"
                            className="rounded-full w-8 h-8"
                        />
                    )}
                    <h2 className="text-lg font-semibold">
                        {post.isAnonymous
                            ? 'Anonymous'
                            : post.author.username.length >
                              (post.author._id === ownerId ? 8 : 20)
                            ? post.author.username.slice(
                                  0,
                                  post.author._id === ownerId ? 8 : 20
                              ) + '...'
                            : post.author.username}
                    </h2>
                </div>

                <div className="space-x-2">
                    {post.author._id === ownerId && (
                        <>
                            <button
                                onClick={onEdit}
                                className="text-yellow-500 px-2 rounded-lg"
                                title="Edit Post"
                            >
                                <i className="fa-regular fa-pen-to-square fa-xl"></i>
                            </button>
                            <button
                                onClick={onDelete}
                                className="text-red-500 px-2 rounded-lg"
                                title="Delete Post"
                            >
                                <i className="fa-solid fa-trash fa-xl"></i>
                            </button>
                        </>
                    )}
                    <button
                        className="text-center text-blue-400 hover:text-blue-300"
                        onClick={onShare}
                        title="Share Post"
                    >
                        <i className="fa-regular fa-share-from-square fa-xl"></i>
                    </button>
                </div>
            </div>

            <div className="mt-3">
                <Link to={`/college/${collegeName}/community/post/${post._id}`}>
                    <PostPreview post={post} />
                </Link>
                <button
                    className={`mt-1 px-3 border-2 border-sky-500 rounded-lg ${
                        post.likes.includes(ownerId)
                            ? 'text-white bg-sky-500'
                            : 'text-black'
                    }`}
                    onClick={onLike}
                    disabled={hookLoadingStates.likePost[post._id]}
                >
                    {hookLoadingStates.likePost[post._id] ? (
                        <i className="fa fa-spinner fa-spin"></i>
                    ) : (
                        <>
                            <i className="fa-regular fa-heart"></i> (
                            {post.likes.length})
                        </>
                    )}
                </button>
            </div>

            <div className="mt-1">
                <h3 className="text-lg font-semibold">
                    Comments{' '}
                    {post.comments.length > 0
                        ? `(${post.comments.length})`
                        : null}{' '}
                    {post.comments.length > 0 && (
                        <button
                            className="text-sm p-1 rounded-md text-sky-500"
                            onClick={onShowComments}
                        >
                            Show All
                        </button>
                    )}
                </h3>

                {latestComment && (
                    <ul>
                        <li key={latestComment._id}>
                            <p className="line-clamp-1">
                                {latestComment.content}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                                <button
                                    className={`text-blue-500 ${
                                        likedComments.includes(
                                            latestComment._id
                                        )
                                            ? 'opacity-50 cursor-not-allowed'
                                            : ''
                                    }`}
                                    onClick={() =>
                                        onLikeComment(latestComment._id)
                                    }
                                    disabled={likedComments.includes(
                                        latestComment._id
                                    )}
                                >
                                    <i className="fa-regular fa-heart"></i> (
                                    {latestComment.likes})
                                </button>
                                {latestComment.author._id === ownerId && (
                                    <button
                                        className="text-red-500"
                                        onClick={() =>
                                            onDeleteComment(latestComment._id)
                                        }
                                        disabled={
                                            hookLoadingStates.deleteComment[
                                                post._id
                                            ]
                                        }
                                    >
                                        {hookLoadingStates.deleteComment[
                                            post._id
                                        ] ? (
                                            <i className="fa fa-spinner fa-spin"></i>
                                        ) : (
                                            <i className="fa-solid fa-trash"></i>
                                        )}
                                    </button>
                                )}
                            </div>
                        </li>
                    </ul>
                )}

                <div className="mt-3">
                    <textarea
                        value={commentContent[post._id] || ''}
                        onChange={(e) =>
                            setCommentContent({
                                ...commentContent,
                                [post._id]: e.target.value,
                            })
                        }
                        className="w-full p-2 border rounded-md"
                        placeholder="Add a comment..."
                    />
                    {commentContent[post._id]?.trim() && (
                        <button
                            onClick={onAddComment}
                            className="mt-2 px-4 py-2 bg-sky-500 text-white rounded-md"
                            disabled={hookLoadingStates.addComment[post._id]}
                        >
                            {hookLoadingStates.addComment[post._id] ? (
                                <i className="fa fa-spinner fa-spin"></i>
                            ) : (
                                'Comment'
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// PostPreview Component
const PostPreview = ({ post }) => {
    const { collegeName } = useParams();

    const getPreviewText = (content, charLimit = 230) => {
        return content.length > charLimit
            ? content.slice(0, charLimit) + '...'
            : content;
    };

    const previewContent = getPreviewText(post.content);

    return (
        <div className="bg-sky-100 px-4 pt-2 pb-8 sm:pb-2 rounded-lg my-4 text-lg md:h-60 overflow-hidden relative">
            <div className="post-content">
                <p
                    className="break-words"
                    style={{
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 7,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxHeight: '16rem',
                    }}
                >
                    <span
                        dangerouslySetInnerHTML={{ __html: previewContent }}
                    />
                </p>

                {post.content.length > 200 && (
                    <Link
                        to={`/college/${collegeName}/community/post/${post._id}`}
                        className="text-blue-500 underline absolute bottom-2 right-2"
                    >
                        Read More
                    </Link>
                )}
            </div>
        </div>
    );
};

export default CommunityPage;
