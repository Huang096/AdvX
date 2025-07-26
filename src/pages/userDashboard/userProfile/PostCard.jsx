import React from 'react';

const PostCard = ({ post, onClick }) => {
    return (
        <div 
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer"
            onClick={() => onClick(post)}
        >
            <img src={post.image} alt="Pet post" className="w-full h-auto object-cover" />
        </div>
    );
};

export default PostCard; 