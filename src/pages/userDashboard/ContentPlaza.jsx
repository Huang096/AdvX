import React, { useState } from 'react';
import { FaHeart, FaComment, FaImage, FaTimes } from 'react-icons/fa';
import strayDogImage from '../../assets/stray-dog.png';
import PostCard from './userProfile/PostCard';

// Import new dog images
import dog1 from '../../assets/dog1.png';
import dog2 from '../../assets/dog2.png';
import dog3 from '../../assets/dog3.png';
import dog4 from '../../assets/dog4.png';
import dog5 from '../../assets/dog5.png';
import dog6 from '../../assets/dog6.png';
import dog7 from '../../assets/dog7.png';
import dog8 from '../../assets/dog8.png';

const dogImages = [strayDogImage, dog1, dog2, dog3, dog4, dog5, dog6, dog7, dog8];
const categories = ['互动深度', '忠实用户', '活跃一致性'];

const PostDetailModal = ({ post, onClose, onLike, onComment, userPoints }) => {
    if (!post) return null;

    const [commentText, setCommentText] = useState('');
    const likeCost = 1;
    const commentCost = 2;

    const handleLike = () => {
        if (userPoints >= likeCost && !post.isLiked) {
            onLike(post.id, likeCost);
        }
    };
    
    const handleSendComment = () => {
        if (userPoints < commentCost) {
            alert("积分不足，无法评论！");
            return;
        }
        if (commentText.trim() === '') {
            alert("评论内容不能为空！");
            return;
        }
        onComment(post.id, commentCost, commentText);
        setCommentText(''); // Clear input after sending
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose} // Click on overlay to close
        >
            <div 
                className="bg-base-100 rounded-lg shadow-2xl flex flex-col md:flex-row max-w-4xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to overlay
            >
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                    <img src={post.image} alt="Pet post" className="w-full h-full object-cover" />
                </div>
                
                {/* Content Section */}
                <div className="w-full md:w-1/2 flex flex-col p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="avatar">
                            <div className="w-12 rounded-full">
                                <img src={post.authorAvatar} alt={post.author} />
                            </div>
                        </div>
                        <div>
                            <p className="font-bold text-lg">{post.author}</p>
                            <p className="text-sm text-gray-500">{post.timestamp}</p>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-grow overflow-y-auto mb-4 pr-2">
                        <p className="mb-4">{post.content}</p>

                        {/* Comments Section */}
                        <div className="border-t pt-4">
                            <h4 className="font-bold text-sm mb-2">共 {post.comments?.length || 0} 条评论</h4>
                            <div className="space-y-4">
                                {post.comments && post.comments.map(comment => (
                                    <div key={comment.id} className="flex items-start gap-3">
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                                                <span>{comment.author.charAt(0)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{comment.author}</p>
                                            <p>{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                                {!post.comments || post.comments.length === 0 && (
                                     <p className="text-sm text-gray-500 text-center py-4">还没有评论，快来抢沙发吧！</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Action Bar */}
                    <div className="flex-shrink-0">
                        <div className="flex items-center text-sm mb-4">
                            <FaHeart className="text-red-500 mr-2" />
                            <span>{post.likes} 人喜欢</span>
                        </div>
                        {/* Action Buttons */}
                        <div className="border-t pt-4">
                             <div className="flex justify-around items-center mb-4">
                                <button 
                                    className={`btn btn-ghost w-full ${post.isLiked ? 'text-red-500' : ''}`}
                                    onClick={handleLike}
                                    disabled={post.isLiked}
                                >
                                    <FaHeart />
                                    {post.isLiked ? '已赞' : `点赞 (-${likeCost})`}
                                </button>
                                <span className="text-gray-300">|</span>
                                <div className="btn btn-ghost w-full cursor-default">
                                    <FaComment />
                                    <span>评论 (-{commentCost})</span>
                                </div>
                            </div>
                            {/* New Comment Input */}
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text"
                                    placeholder="说点什么..."
                                    className="input input-bordered w-full rounded-full"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button onClick={handleSendComment} className="btn btn-primary rounded-full">发送</button>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 text-white md:text-gray-800 text-2xl hover:text-red-500 transition-colors">
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};


const CreatePost = () => (
    <div className="card bg-base-200 shadow p-4 mb-8 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
        <textarea className="textarea textarea-bordered w-full" placeholder="分享 小黄 的新鲜事..."></textarea>
        <div className="flex justify-between items-center mt-2">
            <button className="btn btn-primary btn-sm">
                <FaImage className="mr-2" />
                上传图片
            </button>
            <button className="btn btn-primary btn-sm">发布</button>
        </div>
    </div>
);

const ContentPlaza = ({ userType, userPoints, setUserPoints }) => {
    const initialPosts = [
        { 
            id: 1, 
            author: "阳光救助站", 
            authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
            content: "今天天气真好，小黄在草地上打滚晒太阳，舒服得都快睡着啦！", 
            image: strayDogImage,
            timestamp: "2小时前",
            likes: 15,
            isLiked: false,
            category: '互动深度',
        },
        { 
            id: 2, 
            author: "爱心之家", 
            authorAvatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e",
            content: "给大家看看我们新来的小伙伴，它叫‘咖啡’，是不是很可爱？", 
            image: "https://placedog.net/640/480?id=5",
            timestamp: "昨天",
            likes: 32,
            isLiked: false,
            comments: [
                { id: 3, author: '铲屎官-C', text: '太萌了，想抱走！' }
            ],
            category: '忠实用户',
        },
        // Add more posts with random categories and images
        ...Array.from({ length: 10 }, (_, i) => ({
            id: i + 3,
            author: `流浪动物守护者${i+1}`,
            authorAvatar: `https://i.pravatar.cc/150?u=a${i}`,
            content: `这是我们救助的第${i+3}只小可爱，它现在需要一个温暖的家。`,
            image: dogImages[(i + 1) % dogImages.length],
            timestamp: `${i+1}天前`,
            likes: Math.floor(Math.random() * 100),
            isLiked: false,
            category: i % 4 === 0 ? categories[i % categories.length] : undefined, // Randomly assign a category, or none
            comments: Math.random() > 0.5 ? [{id: Date.now(), author: '路人甲', text: '好可爱！'}] : []
        }))
    ];

    const [posts, setPosts] = useState(initialPosts);
    const [selectedPost, setSelectedPost] = useState(null);

    const handleLikePost = (postId, cost) => {
        // Optimistic UI update
        const updatedPosts = posts.map(p => 
            p.id === postId ? { ...p, likes: p.likes + 1, isLiked: true } : p
        );
        setPosts(updatedPosts);
        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(prev => ({ ...prev, likes: prev.likes + 1, isLiked: true }));
        }

        // Simulate successful API call and update points
        setUserPoints(currentPoints => currentPoints - cost);
        
        // The fetch call is commented out to prevent errors during frontend dev
        /*
        fetch(`/api/posts/${postId}/like`, { method: 'POST' })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setUserPoints(data.newUserPoints);
            })
            .catch(error => {
                console.error('Error liking post:', error);
                alert('点赞失败，请稍后再试。');
                // Revert UI on error
                setPosts(originalPosts);
                if (selectedPost && selectedPost.id === postId) {
                    setSelectedPost(originalPosts.find(p => p.id === postId));
                }
            });
        */
    };

    const handleCommentPost = (postId, cost, commentText) => {
        const newComment = {
            id: Date.now(), // Using timestamp for a simple unique ID
            author: '我', // This should be replaced with the actual current user's name
            text: commentText,
        };

        const updatePostWithComment = (p) => {
            if (p.id === postId) {
                const existingComments = p.comments || [];
                return { ...p, comments: [newComment, ...existingComments] }; // Add to the top
            }
            return p;
        };
        
        // Optimistically update the UI
        const updatedPosts = posts.map(updatePostWithComment);
        setPosts(updatedPosts);
        if (selectedPost && selectedPost.id === postId) {
            setSelectedPost(updatePostWithComment);
        }

        // Simulate successful API call and update points
        setUserPoints(currentPoints => currentPoints - cost);
        
        // The fetch call is commented out to prevent errors during frontend dev
        /*
        fetch(`/api/posts/${postId}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ comment: commentText }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                setUserPoints(data.newUserPoints);
                alert('评论成功！');
                // Here you would also add the new comment to the state
            })
            .catch(error => {
                console.error('Error commenting on post:', error);
                alert('评论失败，请稍后再试。');
            });
        */
    };

    const handleOpenModal = (post) => {
        setSelectedPost(post);
    };

    const handleCloseModal = () => {
        setSelectedPost(null);
    };

    return (
        <div className="p-4">
            {userType === 2 && <CreatePost />}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {posts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onClick={handleOpenModal}
                    />
                ))}
            </div>
            <PostDetailModal 
                post={selectedPost}
                onClose={handleCloseModal}
                onLike={handleLikePost}
                onComment={handleCommentPost}
                userPoints={userPoints}
            />
        </div>
    );
};

export default ContentPlaza; 