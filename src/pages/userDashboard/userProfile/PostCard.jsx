import React from 'react';

const PostCard = ({ post, onClick }) => {
    // Mapping of category to an emoji logo
    const categoryLogos = {
        '互动深度': '💖', // Deep Interaction
        '忠实用户': '🏆', // Loyal User
        '活跃一致性': '🔄', // Consistent Activity
    };

    // Mapping of category to a short label
    const categoryLabels = {
        '互动深度': '多人互动',
        '忠实用户': '忠实用户',
        '活跃一致性': '持续更新',
    };

    return (
        <div 
            className="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer relative"
            onClick={() => onClick(post)}
        >
            <figure className="relative">
                <img src={post.image} alt="Pet post" className="w-full h-48 object-cover" />
                {post.category && (
                    <div className="absolute top-2 right-2 badge badge-primary gap-2 p-3">
                        <span className="text-xl">{categoryLogos[post.category]}</span>
                        {categoryLabels[post.category]}
                    </div>
                )}
            </figure>
            <div className="card-body">
                <p className="text-gray-600 truncate">{post.content}</p>
                <div className="card-actions justify-end items-center mt-2">
                    <div className="avatar">
                        <div className="w-8 rounded-full">
                            <img src={post.authorAvatar} alt={post.author} />
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">{post.author}</div>
                </div>
            </div>
        </div>
    );
};

export default PostCard; 