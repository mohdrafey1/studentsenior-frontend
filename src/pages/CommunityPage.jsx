import React, { useState } from 'react';
import CollegeLinks from '../components/Links/CollegeLinks';
import Header from '../components/Header/Header';

const CommunityPage = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            author: 'Mohd Rafey',
            content: 'How to get started with Web Development?',
            upvotes: 10,
            downvotes: 2,
            comments: [
                'Start with HTML, CSS, and JavaScript!',
                'Practice daily!',
            ],
        },
        {
            id: 2,
            author: 'Najmus Sahar',
            content: 'What are the best resources for learning UI/UX Design?',
            upvotes: 15,
            downvotes: 1,
            comments: ['Check out DesignLab!', 'Look into Coursera courses.'],
        },
        {
            id: 3,
            author: 'Muskan Khatoon',
            content: 'What are the best resources for learning UI/UX Design?',
            upvotes: 15,
            downvotes: 1,
            comments: ['Check out DesignLab!', 'Look into Coursera courses.'],
        },
    ]);

    const [newPostContent, setNewPostContent] = useState('');
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');

    const addPost = () => {
        if (newPostContent.trim()) {
            const newPost = {
                id: posts.length + 1,
                author: 'You',
                content: newPostContent,
                upvotes: 0,
                downvotes: 0,
                comments: [],
            };
            setPosts([...posts, newPost]);
            setNewPostContent('');
        }
    };

    const deletePost = (postId) => {
        setPosts(posts.filter((post) => post.id !== postId));
    };

    const startEditingPost = (postId, content) => {
        setEditingPostId(postId);
        setEditedContent(content);
    };

    const editPost = (postId) => {
        setPosts(
            posts.map((post) =>
                post.id === postId ? { ...post, content: editedContent } : post
            )
        );
        setEditingPostId(null);
        setEditedContent('');
    };

    return (
        <div className="container bg-sky-100 min-h-screen">
            <Header />
            <CollegeLinks />
            <div className="max-w-7xl mx-auto p-5">
                <h1 className="text-3xl font-bold text-center mb-5">
                    Community
                </h1>
                <div className="mb-5 text-center">
                    <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="w-full p-3 border rounded-md"
                        placeholder="Share something with the community..."
                    />
                    <button
                        onClick={addPost}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                        Add Post
                    </button>
                </div>
                <div>
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white p-5 rounded-md shadow-md mb-4"
                        >
                            <div className="flex justify-between">
                                <h2 className="text-xl font-semibold">
                                    {post.author}
                                </h2>
                                <div className="space-x-2">
                                    <button
                                        onClick={() =>
                                            startEditingPost(
                                                post.id,
                                                post.content
                                            )
                                        }
                                        className="text-blue-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deletePost(post.id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            {editingPostId === post.id ? (
                                <div className="mt-3">
                                    <textarea
                                        value={editedContent}
                                        onChange={(e) =>
                                            setEditedContent(e.target.value)
                                        }
                                        className="w-full p-2 border rounded-md"
                                    />
                                    <button
                                        onClick={() => editPost(post.id)}
                                        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md"
                                    >
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <p className="mt-3">{post.content}</p>
                            )}
                            <div className="mt-3 flex space-x-4">
                                <button className="text-green-500">
                                    Upvote ({post.upvotes})
                                </button>
                                <button className="text-red-500">
                                    Downvote ({post.downvotes})
                                </button>
                            </div>
                            <div className="mt-3">
                                <h3 className="text-lg font-semibold">
                                    Comments
                                </h3>
                                <ul className="list-disc ml-5">
                                    {post.comments.map((comment, index) => (
                                        <li key={index}>{comment}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CommunityPage;
