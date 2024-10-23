import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '../redux/user/userSlice.js';
import CollegeLinks from '../components/Links/CollegeLinks';
import Collegelink2 from '../components/Links/CollegeLink2';
import { API_BASE_URL, API_KEY } from '../config/apiConfiguration';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';

const CommunityPage = () => {
    const { collegeName } = useParams();
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [commentContent, setCommentContent] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [likedComments, setLikedComments] = useState([]);
    const [showComment, setshowComment] = useState(false);
    const [showCom, setshowCom] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.user.currentUser);
    const ownerId = currentUser?._id;

    const colleges = [
        { id: '66cb9952a9c088fc11800714', name: 'Integral University' },
        { id: '66cba84ce0e3a7e528642837', name: 'MPEC Kanpur' },
        { id: '66d08aff784c9f07a53507b9', name: 'GCET Noida' },
        { id: '66d40833ec7d66559acbf24c', name: 'KMC UNIVERSITY' },
    ];

    const capitalizeWords = (str) => {
        return str
            .split('-')
            .map(
                (word) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            )
            .join(' ');
    };

    // Fetch posts from backend API
    const fetchPosts = async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/community/posts`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                }
            );
            const data = await response.json();
            setPosts(LatestFirst(data));
            setLoading(false);
        } catch (err) {
            console.error('Error fetching posts:', err);
            toast.error('Error fetching posts');
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLogout = () => {
        dispatch(signOut());
        navigate('/sign-in');
    };

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

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

    // Add a new post with the extracted college
    const addPost = async () => {
        if (newPostContent.trim()) {
            const selectedCollegeObject = colleges.find(
                (college) =>
                    college.name.toLowerCase().replace(/\s+/g, '-') ===
                    collegeName
            );

            const college = selectedCollegeObject
                ? selectedCollegeObject.id
                : null;

            if (college) {
                try {
                    const response = await fetch(
                        `${API_BASE_URL}/api/community/posts`,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-api-key': API_KEY,
                            },
                            credentials: 'include',
                            body: JSON.stringify({
                                content: newPostContent,
                                isAnonymous,
                                college,
                            }),
                        }
                    );

                    if (response.ok) {
                        fetchPosts();
                        setNewPostContent('');
                        closeModal();
                        toast.success('Post Added Successfully');
                    } else if (response.status === 401) {
                        toast.error(
                            'Your session has expired. Please log in again.'
                        );
                        handleLogout();
                    } else {
                        const errorData = await response.json();
                        toast.error(
                            `Failed to add product: ${errorData.message}`
                        );
                    }
                } catch (err) {
                    console.error('Error adding post:', err);
                    toast.error('Error adding post');
                }
            } else {
                console.error('College not found');
                toast.error('College not found');
            }
        }
    };

    // Delete a post
    const deletePost = async (postId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/community/posts/${postId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                }
            );

            if (response.ok) {
                fetchPosts();
                toast.success('Post Deleted Successfully');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            toast.error('Error deleting post');
        }
    };

    // Edit a post
    const editPost = async () => {
        if (editedContent.trim() && editingPostId) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/community/posts/${editingPostId}`,
                    {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                        credentials: 'include',
                        body: JSON.stringify({ content: editedContent }),
                    }
                );

                if (response.ok) {
                    setEditingPostId(null);
                    fetchPosts();
                    setEditedContent('');
                    closeEditModal();
                    toast.success('Post Updated Successfully');
                }
            } catch (err) {
                console.error('Error editing post:', err);
                toast.error('Error editing post');
            }
        }
    };

    // Add a new comment to a post
    const addComment = async (postId) => {
        const content = commentContent[postId];
        if (content && content.trim()) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/community/posts/${postId}/comments`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                        credentials: 'include',
                        body: JSON.stringify({ content }),
                    }
                );

                if (response.ok) {
                    fetchPosts();
                    setCommentContent({ ...commentContent, [postId]: '' });
                    toast.success('Comment Added !');
                }
            } catch (err) {
                console.error('Error adding comment:', err);
                toast.error('Error adding comment ');
            }
        }
    };

    const likePost = async (postId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/community/posts/${postId}/like`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                }
            );

            if (response.ok) {
                fetchPosts();
            }
        } catch (err) {
            console.error('Error liking/unliking post:', err);
            toast.error('Error liking/unliking post');
        }
    };

    useEffect(() => {
        const storedLikes =
            JSON.parse(localStorage.getItem('likedComments')) || [];
        setLikedComments(storedLikes);
    }, []);

    const likeComment = async (postId, commentId) => {
        if (!likedComments.includes(commentId)) {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/community/posts/${postId}/comments/${commentId}/like`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-api-key': API_KEY,
                        },
                        credentials: 'include',
                    }
                );

                if (response.ok) {
                    fetchPosts();

                    // Update the likedComments in both state and localStorage
                    const updatedLikes = [...likedComments, commentId];
                    setLikedComments(updatedLikes);
                    localStorage.setItem(
                        'likedComments',
                        JSON.stringify(updatedLikes)
                    );
                }
            } catch (err) {
                console.error('Error liking comment:', err);
                toast.error('Error liking comment');
            }
        }
    };

    // Delete a comment
    const deleteComment = async (postId, commentId) => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/community/posts/${postId}/comments/${commentId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': API_KEY,
                    },
                    credentials: 'include',
                }
            );

            if (response.ok) {
                fetchPosts();
                toast.success('Comment Deleted Successfully');
            } else {
                toast.error('Error Deleting Comment');
            }
            setshowCom((prevCom) =>
                prevCom.filter((comment) => comment._id !== commentId)
            );
            console.log(showCom);
        } catch (err) {
            console.error('Error deleting comment:', err);
            toast.error('Error deleting comment ');
        }
    };
    const LatestFirst = (data) => {
        let reversedArray = [];
        const collegeId = localStorage.getItem('id');
        for (let i = data.length - 1; i >= 0; i--) {
            if (data[i].college._id === collegeId) {
                reversedArray.push(data[i]);
            }
        }
        return reversedArray;
    };

    return (
        <div className="container bg-gradient-to-t from-sky-200 to bg-white min-h-screen min-w-full">
            {/* <Header /> */}
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-3xl font-bold text-center mb-5">
                    Community - {capitalizeWords(collegeName)}
                </h1>
                <p className="italic text-center">
                    "Connect, share, and ask your questions and doubts through
                    the community."
                </p>
                <br />
                <div className="mb-5 text-center">
                    <button
                        onClick={openModal}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Add Post
                    </button>
                </div>
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
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setNewPostContent(data);
                                    }}
                                />{' '}
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
                                        className="sr-only peer "
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
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    Submit Post
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {posts.length > 0 ? (
                    <div>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {posts.map((post) => (
                                <div
                                    key={post._id}
                                    className="block max-w-sm p-6 w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
                                >
                                    <div className="flex justify-between">
                                        <h2 className="text-xl font-semibold">
                                            {post.isAnonymous
                                                ? 'Anonymous'
                                                : post.author.username}
                                        </h2>
                                        <div className="space-x-2">
                                            {post.author._id === ownerId && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            openEditModal(post)
                                                        }
                                                        className="text-blue-500 px-2 border-2 border-sky-500 rounded-lg"
                                                    >
                                                        Edit
                                                    </button>
                                                    {showEditModal && (
                                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                                                            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                                                                <h2 className="text-xl mb-4">
                                                                    Edit Post
                                                                </h2>
                                                                <div
                                                                    style={{
                                                                        maxHeight:
                                                                            '500px',
                                                                        overflowY:
                                                                            'auto',
                                                                    }}
                                                                >
                                                                    <CKEditor
                                                                        editor={
                                                                            ClassicEditor
                                                                        }
                                                                        data={
                                                                            editedContent
                                                                        }
                                                                        onChange={(
                                                                            event,
                                                                            editor
                                                                        ) => {
                                                                            const data =
                                                                                editor.getData();
                                                                            setEditedContent(
                                                                                data
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="flex justify-end mt-4">
                                                                    <button
                                                                        onClick={
                                                                            closeEditModal
                                                                        }
                                                                        className="mr-2 px-4 py-2 bg-gray-300 text-black rounded-md"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                    <button
                                                                        onClick={
                                                                            editPost
                                                                        }
                                                                        className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                                                    >
                                                                        Save
                                                                        Changes
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() =>
                                                            deletePost(post._id)
                                                        }
                                                        className="text-red-500 px-2 border-2 border-sky-500 rounded-lg"
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {editingPostId === post._id ? (
                                        <div className="mt-3">
                                            <textarea
                                                value={editedContent}
                                                onChange={(e) =>
                                                    setEditedContent(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full p-2 border rounded-md"
                                            />
                                            <button
                                                onClick={() =>
                                                    editPost(post._id)
                                                }
                                                className="mt-2 mx-2 px-4 py-2 bg-green-500 text-white rounded-md"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingPostId(null)
                                                }
                                                className="mt-2 mx-2 px-4 py-2 bg-gray-500 text-white rounded-md"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : null}

                                    <div className="mt-3">
                                        <div className="bg-sky-100 px-4 rounded-lg my-4 text-lg overflow-x-hidden overflow-y-scroll max-h-48 md:h-48">
                                            <p className="mt-3">
                                                <div
                                                    className="post-content"
                                                    dangerouslySetInnerHTML={{
                                                        __html: post.content,
                                                    }}
                                                />
                                            </p>
                                        </div>
                                        <button
                                            className={`mt-1 px-3 border-2 border-sky-500 rounded-lg ${
                                                post.likes.includes(ownerId)
                                                    ? 'text-white bg-sky-500'
                                                    : 'text-black'
                                            }`}
                                            onClick={() => likePost(post._id)}
                                        >
                                            <i className="fa-regular fa-heart"></i>{' '}
                                            ({post.likes.length})
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
                                                    onClick={() => {
                                                        setshowCom(
                                                            post.comments
                                                        );
                                                        setshowComment(true);
                                                    }}
                                                >
                                                    Show All
                                                </button>
                                            )}
                                        </h3>

                                        <ul>
                                            {post.comments.length > 0 && (
                                                <li
                                                    key={
                                                        post.comments[
                                                            post.comments
                                                                .length - 1
                                                        ]._id
                                                    }
                                                >
                                                    <p className="line-clamp-1">
                                                        {
                                                            post.comments[
                                                                post.comments
                                                                    .length - 1
                                                            ].content
                                                        }
                                                    </p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <button
                                                            className={`text-blue-500 ${
                                                                likedComments.includes(
                                                                    post
                                                                        .comments[
                                                                        post
                                                                            .comments
                                                                            .length -
                                                                            1
                                                                    ]._id
                                                                )
                                                                    ? 'opacity-50 cursor-not-allowed'
                                                                    : ''
                                                            }`}
                                                            onClick={() =>
                                                                likeComment(
                                                                    post._id,
                                                                    post
                                                                        .comments[
                                                                        post
                                                                            .comments
                                                                            .length -
                                                                            1
                                                                    ]._id
                                                                )
                                                            }
                                                            disabled={likedComments.includes(
                                                                post.comments[
                                                                    post
                                                                        .comments
                                                                        .length -
                                                                        1
                                                                ]._id
                                                            )}
                                                        >
                                                            <i className="fa-regular fa-heart"></i>{' '}
                                                            (
                                                            {
                                                                post.comments[
                                                                    post
                                                                        .comments
                                                                        .length -
                                                                        1
                                                                ].likes
                                                            }
                                                            )
                                                        </button>
                                                        {post.comments[
                                                            post.comments
                                                                .length - 1
                                                        ].author._id ===
                                                            ownerId && (
                                                            <button
                                                                className="text-red-500"
                                                                onClick={() =>
                                                                    deleteComment(
                                                                        post._id,
                                                                        post
                                                                            .comments[
                                                                            post
                                                                                .comments
                                                                                .length -
                                                                                1
                                                                        ]._id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </li>
                                            )}
                                        </ul>

                                        {showComment && (
                                            <div className="text-center">
                                                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50 bg-opacity-95 px-2 py-5 lg:p-5">
                                                    <p
                                                        className="absolute right-0 top-0 px-4 py-2 m-4 bg-red-300 cursor-pointer rounded-lg"
                                                        onClick={() =>
                                                            setshowComment(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        X
                                                    </p>
                                                    <ul className="lg:w-1/3 m-4 bg-slate-300 p-4 rounded-lg text-left overflow-scroll max-h-full my-4">
                                                        {showCom.length > 0 ? (
                                                            showCom.map(
                                                                (comment) => (
                                                                    <li
                                                                        key={
                                                                            comment._id
                                                                        }
                                                                        className="bg-slate-200 p-3 my-1 rounded-lg"
                                                                    >
                                                                        <>
                                                                            <strong>
                                                                                <span>
                                                                                    {
                                                                                        comment
                                                                                            .author
                                                                                            .username
                                                                                    }
                                                                                </span>
                                                                            </strong>
                                                                            <p className="mt-3">
                                                                                <div
                                                                                    className="post-content"
                                                                                    dangerouslySetInnerHTML={{
                                                                                        __html: comment.content,
                                                                                    }}
                                                                                />
                                                                            </p>
                                                                        </>
                                                                        <div className="flex items-center justify-between mt-2">
                                                                            <button
                                                                                className={`text-blue-500 ${
                                                                                    likedComments.includes(
                                                                                        comment._id
                                                                                    )
                                                                                        ? 'opacity-50 cursor-not-allowed'
                                                                                        : ''
                                                                                }`}
                                                                                onClick={() =>
                                                                                    likeComment(
                                                                                        post._id,
                                                                                        comment._id
                                                                                    )
                                                                                }
                                                                                disabled={likedComments.includes(
                                                                                    comment._id
                                                                                )}
                                                                            >
                                                                                Like
                                                                                (
                                                                                {
                                                                                    comment.likes
                                                                                }

                                                                                )
                                                                            </button>
                                                                            {comment
                                                                                .author
                                                                                ._id ===
                                                                                ownerId && (
                                                                                <button
                                                                                    className="text-red-500"
                                                                                    onClick={() =>
                                                                                        deleteComment(
                                                                                            post._id,
                                                                                            comment._id
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Delete
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                )
                                                            )
                                                        ) : (
                                                            <li>
                                                                No comments
                                                                available.
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-3">
                                            <textarea
                                                value={
                                                    commentContent[post._id] ||
                                                    ''
                                                }
                                                onChange={(e) =>
                                                    setCommentContent({
                                                        ...commentContent,
                                                        [post._id]:
                                                            e.target.value,
                                                    })
                                                }
                                                className="w-full p-2 border rounded-md"
                                                placeholder="Add a comment..."
                                            />
                                            <button
                                                onClick={() =>
                                                    addComment(post._id)
                                                }
                                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                                            >
                                                Comment
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="col-span-4 flex justify-center items-center py-10 w-full">
                        {loading ? (
                            <div className="text-center">
                                <svg
                                    aria-hidden="true"
                                    className="inline w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90. 9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                                <p className="text-gray-200  dark:text-gray-600 mt-3">
                                    Loading...
                                </p>
                            </div>
                        ) : (
                            <p className="text-gray-200  dark:text-gray-600 text-center">
                                No Post to show.
                            </p>
                        )}
                    </div>
                )}
            </div>
            <Collegelink2 />
            {/* <Footer /> */}
        </div>
    );
};

export default CommunityPage;
