import React from 'react';
import Marquee from "react-fast-marquee";
import similar1 from '../../../assets/similar1.png';
import similar2 from '../../../assets/similar2.png';
import similar3 from '../../../assets/similar3.png';
import similar4 from '../../../assets/similar4.png';
import similar5 from '../../../assets/similar5.png';

const images = [similar1, similar2, similar3, similar4, similar5];

const SimilarityMarquee = () => {
    return (
        <div className="py-2 bg-base-100">
            <Marquee pauseOnHover={true} speed={50}>
                {images.map((src, index) => (
                    <div key={index} className="mx-4">
                        <img 
                            src={src} 
                            alt={`Funny similarity ${index + 1}`} 
                            className="h-40 w-auto object-cover rounded-lg shadow-md"
                        />
                    </div>
                ))}
            </Marquee>
        </div>
    );
};

export default SimilarityMarquee; 