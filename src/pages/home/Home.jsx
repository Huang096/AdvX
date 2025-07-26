
import Navbar from '../../shared/navbar/Navbar';
import Banner from './homeComponents/banner/Banner';
import Footer from '../../shared/footer/Footer';
import AIMatching from './homeComponents/AIMatching';
import SimilarityMarquee from './homeComponents/SimilarityMarquee';
// import OurMission from './homeComponents/OurMission'; // OurMission will be merged into Banner

const Home = () => {
    
    return (
        <div>
            <Navbar></Navbar>
            <Banner></Banner>
            <SimilarityMarquee />
            <AIMatching />
            {/* <OurMission /> */}
            <Footer></Footer>
        </div>
    );
};

export default Home;