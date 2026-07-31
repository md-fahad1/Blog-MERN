import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/ScrollToTop";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import CreateTravelPost from "./pages/CreateTravelPost";
import UpdateTravel from "./pages/UpdateTravel";
import PostPage from "./pages/PostPage";
import Search from "./pages/Search";
import Projects from "./pages/Projects";
import TravelPost from "./pages/TravelPost";
import DashFb from "./Components/DashFb";
import CreateFb from "./pages/CreateFb";
import VerifyToken from "./Components/VerifyToken";
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/search" element={<Search />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
        <Route path="/travel/:travelId" element={<TravelPost />} />

        {/* Protected User Routes */}
        <Route
          path="/dashboard"
          element={
            <VerifyToken>
              <Dashboard />
            </VerifyToken>
          }
        />
        <Route
          path="/create-travelpost"
          element={
            <VerifyToken>
              <CreateTravelPost />
            </VerifyToken>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          element={
            <VerifyToken>
              <OnlyAdminPrivateRoute />
            </VerifyToken>
          }
        >
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
          <Route path="/update-travel/:travelId" element={<UpdateTravel />} />
          <Route path="/fb" element={<DashFb />} />
          <Route path="/create-fb" element={<CreateFb />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
