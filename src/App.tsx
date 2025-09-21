import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import RoleSelection from "./pages/RoleSelection";
import RecruiterFormWizard from "./pages/RecruiterForm";
import SwipeDeck from "./pages/SwipeDeck";
import ChatRoom from "./pages/ChatRoom";
import Network from "./pages/Network";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./components/Layout";
import SplashScreen from "./pages/SplashScreen";
import PostSignupScreen from "./pages/PostSignupScreen";
import StudentFormWizard from "./pages/StudentForm";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      {/* 🌟 Global background applied here */}
      <div className="min-h-screen w-full bg-gradient-to-b from-jobless-white to-jobless-blue/40">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/post-signup" element={<PostSignupScreen />} />

          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/student-form" element={<StudentFormWizard />} />
          <Route path="/recruiter-form" element={<RecruiterFormWizard />} />

          {/* Layout-wrapped routes */}
          <Route element={<Layout />}>
            <Route path="/" element={<SwipeDeck />} />
            <Route path="/network" element={<Network />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Chat remains separate (full screen) */}
          <Route path="/chat/:matchId" element={<ChatRoom />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
