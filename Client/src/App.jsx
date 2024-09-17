// import './style/App.css';
import Home from './Component/Home.jsx';
import {Routes,Route} from 'react-router-dom';
import SignUp from './Component/SignUp.jsx';
import Login from './Component/Login.jsx';
import Profile from './Component/profile.jsx';
import DashBoard from './Component/dashboard.jsx';
import UpdateAccount from './Component/Dashboard/updateAccount.jsx';
import VerifyEmail from './Component/VerifyEmail.jsx';
import FriendsPage from './Component/Pages/friendsPage.jsx';
import SentRequest from './Component/Pages/sentRequest.jsx';
import ReceiveRequest from './Component/Pages/receivedRequest.jsx';
import Recommendation from './Component/Pages/recommendation.jsx';
function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/friends" element={<FriendsPage/>} />
      <Route path="/friend-requests" element={<ReceiveRequest/>} />
      <Route path="/sent-requests" element={<SentRequest/>} />
      <Route path='/recommendations' element={<Recommendation/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route path="/profile/:username" element={<Profile/>} />
      <Route path="/verifyEmail" element={<VerifyEmail />} />
      <Route path="/dashboard" element={<DashBoard/>} />
      <Route path="/dashboard/account" element={<UpdateAccount />} />
      <Route path="*" element={<h1>Page Not Found</h1>} />
    </Routes>
    </>
  )
}

export default App
