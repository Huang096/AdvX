
          // import Swiper core and required modules
          import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';

          import { Swiper, SwiperSlide } from 'swiper/react';
          import ban2 from '../../../../assets/banner1.jpg'
          import ban3 from '../../../../assets/banner2.jpg'
          import ban4 from '../../../../assets/banner-4.jpg'
        
          
          // Import Swiper styles
          import 'swiper/css';
          import 'swiper/css/navigation';
          import 'swiper/css/pagination';
          import 'swiper/css/scrollbar';

import bannerBg from '../../../../assets/banner-4.jpg'; // 我们暂时使用一张现有的图片

const Banner = () => {
    return (
        <div 
            className="hero min-h-screen" 
            style={{ backgroundImage: `url(${bannerBg})` }}
            id="hero-section"
        >
            <div className="hero-overlay bg-opacity-60"></div>
            <div className="hero-content text-center text-neutral-content">
                <div className="max-w-md">
                    <h1 className="mb-5 text-5xl font-bold">嘿，有只狗狗长得好像你！</h1>
                    <p className="mb-5">通过 AI 摄像头，我们为你匹配最像你的流浪毛孩，开启一段奇妙的云养之旅，直至把它带回家。</p>
                    <button 
                        className="btn btn-primary"
                        onClick={() => {
                            const matchingSection = document.getElementById('ai-matching-section');
                            if (matchingSection) {
                                matchingSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}
                    >
                        开启匹配之旅
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Banner;