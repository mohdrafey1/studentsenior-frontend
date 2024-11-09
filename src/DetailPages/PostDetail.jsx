import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useApiFetch from '../hooks/useApiFetch';
import { api } from '../config/apiConfiguration';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import usePosts from '../hooks/usePosts';

function PostDetail() {
    const { collegeName, id } = useParams();
    const [post, setPost] = useState(null);
    const commentsRef = useRef(null);
    const commentInputRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const { useFetch, loadingFetch } = useApiFetch();
    const {
        likePost,
        deletePost,
        addComment,
        likeComment,
        deleteComment,
        hookLoadingStates,
        likedComments,
        commentContent,
        setCommentContent,
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

    const handleShare = () => {
        const postUrl = window.location.href;
        if (navigator.share) {
            navigator
                .share({ title: post.title, url: postUrl })
                .catch((error) => console.log('Share failed:', error));
        } else {
            navigator.clipboard
                .writeText(postUrl)
                .then(() => toast.success('Link copied to clipboard!'))
                .catch(() => toast.error('Failed to copy link.'));
        }
    };

    const url = `${api.community}/${id}`;

    const fetchPost = async () => {
        try {
            const data = await useFetch(url);
            setPost(data);
            console.log(data);
        } catch (err) {
            console.error('Error fetching post:', err);
            toast.error('Error fetching post');
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

    const handleDeletePost = async (postId) => {
        await deletePost(post._id);
        navigate(`/college/${collegeName}/community`);
    };

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

    if (!post) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <i className="fas fa-spinner fa-pulse fa-5x"></i>
            </div>
        );
    }

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full relative">
            <div className="main">
                <div className="fixed top-0 left-0 z-30 w-full bg-white z-100 top-panel shadow-md h-16 flex items-center justify-between px-10">
                    <div className="text-gray-600">
                        <Link to={`/college/${collegeName}/community`}>
                            <i className="fa-solid fa-arrow-left-long fa-2xl"></i>
                        </Link>
                    </div>
                    <div className="flex gap-4">
                        {post.author._id === ownerId && (
                            <>
                                <button className="">
                                    <i className="fa-regular fa-pen-to-square fa-xl"></i>
                                </button>
                                <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className="text-red-500 rounded-lg"
                                    disabled={
                                        hookLoadingStates.deletePost[post._id]
                                    }
                                >
                                    {hookLoadingStates.deletePost[post._id] ? (
                                        <i className="fa fa-spinner fa-spin"></i>
                                    ) : (
                                        <i className="fa-solid fa-trash fa-xl "></i>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <div className="profile-section m-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full">
                        <img
                            className="w-16 h-16 rounded-full"
                            src={post.author?.profilePicture}
                            alt="profile"
                        />
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
                        onClick={handleShare}
                    >
                        <i className="fa-regular fa-share-from-square fa-2xl"></i>
                        <p>Share</p>
                    </div>
                </div>
                <hr />
                <div ref={commentsRef} className="comment-section p-4 my-4">
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
                        className="flex items-center gap-1 bg-blue-400 text-white rounded-xl px-2 py-3"
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
