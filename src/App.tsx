import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import NavigationBar from "./components/NavigationBar";
import FollowingPosts from "./pages/followingPosts";
import Posts from "./pages/Posts";
import ProfilePage from "./pages/profilePage";

function App() {
  const location = useLocation();

  const hideNavbarPaths = ["/"];
  const shouldShowNavBar = !hideNavbarPaths.includes(location.pathname);
  return(
    <>
      {shouldShowNavBar && <NavigationBar/>}
      <main className={shouldShowNavBar ? "pt-20px" : ""}>
        <Routes>
          <Route path="/" element={<LoginPage/>}/>
          <Route path="/Dashboard" element={<HomePage/>}/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/following" element={<FollowingPosts/>}/>
          <Route path="/Posts" element={<Posts/>}/>
          <Route path="/Profile" element={<ProfilePage/>}/>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
