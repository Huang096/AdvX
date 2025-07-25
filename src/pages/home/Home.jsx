
import Navbar from '../../shared/navbar/Navbar';
import Banner from './homeComponents/banner/Banner';
import Footer from '../../shared/footer/Footer';
import AIMatching from './homeComponents/AIMatching';

const Home = () => {
    
    return (
        <div>
            <Navbar></Navbar>
            <Banner></Banner>
            <AIMatching />
            <Footer></Footer>
        </div>
    );
};

export default Home;