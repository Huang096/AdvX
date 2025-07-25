import React, { useState } from 'react'; // 1. Import useState
import { FaHeart, FaComment, FaImage } from 'react-icons/fa';
import strayDogImage from '../../assets/stray-dog.png'; 

// PostCard is now more complex, handling its own state via props
const PostCard = ({ post, onLike, onComment, userPoints }) => {
    const likeCost = 1;
    const commentCost = 2;

    const handleLike = () => {
        if (userPoints >= likeCost && !post.isLiked) {
            onLike(post.id, likeCost);
        } else if (post.isLiked) {
            // Optional: Implement unlike logic if needed
        } else {
            alert("积分不足，无法点赞！");
        }
    };
    
    // We'll just simulate the comment action
    const handleComment = () => {
        if (userPoints >= commentCost) {
            onComment(post.id, commentCost);
             alert("评论成功！(扣除2积分)");
        } else {
            alert("积分不足，无法评论！");
        }
    };

    return (
        <div className="card bg-base-100 shadow-xl mb-6">
            <figure><img src={post.image} alt="Pet post" className="w-full h-64 object-cover" /></figure>
            <div className="card-body">
                <div className="flex items-center gap-4 mb-2">
                    <div className="avatar">
                        <div className="w-10 rounded-full">
                            <img src={post.authorAvatar} alt={post.author} />
                        </div>
                    </div>
                    <div>
                        <p className="font-bold">{post.author}</p>
                        <p className="text-xs">{post.timestamp}</p>
                    </div>
                </div>
                <p>{post.content}</p>
                <div className="card-actions justify-end mt-4 items-center">
                    <span className="text-sm mr-2">{post.likes} 人喜欢</span>
                    <button 
                        className={`btn btn-ghost btn-sm ${post.isLiked ? 'text-red-500' : ''}`}
                        onClick={handleLike}
                        disabled={post.isLiked}
                    >
                        <FaHeart />
                        {post.isLiked ? '已赞' : '点赞 (-1 积分)'}
                    </button>
                    <button 
                        className="btn btn-ghost btn-sm"
                        onClick={handleComment}
                    >
                        <FaComment />
                        评论 (-2 积分)
                    </button>
                </div>
            </div>
        </div>
    );
};


const CreatePost = () => (
    <div className="card bg-base-200 shadow p-4 mb-8">
        <textarea className="textarea textarea-bordered w-full" placeholder="分享 小黄 的新鲜事..."></textarea>
        <div className="flex justify-end mt-2">
            <button className="btn btn-primary btn-sm">
                <FaImage />
                上传图片
            </button>
            <button className="btn btn-primary btn-sm ml-2">发布</button>
        </div>
    </div>
);

const ContentPlaza = ({ userType, userPoints, setUserPoints }) => { // Receive props
    // Mock data now includes likes and isLiked state
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
        }
    ];

    const [posts, setPosts] = useState(initialPosts);

    const handleLikePost = (postId, cost) => {
        setUserPoints(currentPoints => currentPoints - cost);
        setPosts(currentPosts => 
            currentPosts.map(post => 
                post.id === postId 
                    ? { ...post, likes: post.likes + 1, isLiked: true } 
                    : post
            )
        );
    };

    const handleCommentPost = (postId, cost) => {
        setUserPoints(currentPoints => currentPoints - cost);
        // Here you might want to open a comment modal or something similar.
        // For now, we just deduct points.
    };

    return (
        <div>
            {userType === 2 && <CreatePost />}
            <div>
                {posts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        onLike={handleLikePost}
                        onComment={handleCommentPost}
                        userPoints={userPoints}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContentPlaza; 