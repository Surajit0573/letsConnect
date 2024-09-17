import Navbar from "./Navbar";
import Body from './Home/Body';
import Footer from "./footer";
export default function Home() {
    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen">
            <Navbar />
            <Body />
            <Footer />
        </div>
    );
}
