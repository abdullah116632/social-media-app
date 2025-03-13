import {Navigate, Outlet, Route, Routes, useLocation} from "react-router-dom"
import {useSelector} from "react-redux";
import { Home, Login, Profile, Register, ResetPassword, ForgetPassword } from "./pages";
import Modal from "./components/Modal"
import NotFoundPage from "./pages/NotFoundPage";
import SearchResult from "./pages/SearchResult";
import { FriendsCard } from "./components";
import FriendRequest from "./components/FriendRequest";
import SuggestedFriends from "./components/SuggestedFriends";

function Layout(){
  const {user} = useSelector((state) => state.user);
  const location = useLocation();
  
  return (
    user?.token ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{from: location}} replace />
    )
  )
}

function App() {
  const {theme} = useSelector((state) => state.theme)
  const { user } = useSelector((state) => state.user);
  const {openResultBox} = useSelector((state) => state.search);
  return (
    <div data-theme={theme} className="w-full min-h-[100vh]">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
        </Route>

        <Route path="/friends" element={<FriendsCard friends={user?.friends} />} />
        <Route path="/friend-request" element={<FriendRequest />} />
        <Route path="/friend-suggestion" element={<SuggestedFriends />} />
        {/* <Route path="/reset-password" element */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      {openResultBox && <SearchResult />}
      <Modal />
    </div>
  );
}

export default App;
