import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import supabase from "./utils/supabase";

import LoginPage from "./pages/LoginPage";
import RoleSelection from "./pages/RoleSelection";
import RecruiterFormWizard from "./pages/RecruiterForm";
import SwipeDeck from "./pages/SwipeDeck";
import ChatRoom from "./pages/ChatRoom";
import Network from "./pages/Network";
import Discover from "./pages/Discover";
import ProfilePage from "./pages/Profile";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./components/Layout";
import SplashScreen from "./pages/SplashScreen"; // ✅ re-enable splash
import PostSignupScreen from "./pages/PostSignupScreen";
import StudentFormWizard from "./pages/StudentForm";
import MatchBanner from "./pages/MatchBanner";
import ChatStation from "./pages/ChatStation";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [loading, setLoading] = useState(true); // splashscreen
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Check if splash has already been shown
    const hasSeenSplash = localStorage.getItem("hasSeenSplash");

    if (!hasSeenSplash) {
      // Show splash for 3s, then mark it as seen
      const timer = setTimeout(() => {
        setLoading(false);
        localStorage.setItem("hasSeenSplash", "true");
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      // Skip splash immediately
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Auth session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen w-full bg-gradient-to-b from-jobless-white to-jobless-blue/40">
        <Routes>
          {/* Auth routes */}
          <Route
            path="/login"
            element={session ? <Navigate to="/people" /> : <LoginPage />}
          />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/post-signup" element={<PostSignupScreen />} />

          {/* Onboarding */}
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/student-form" element={<StudentFormWizard />} />
          <Route path="/recruiter-form" element={<RecruiterFormWizard />} />
          <Route path="/match-banner" element={<MatchBanner />} />

          {/* Protected (requires login) */}
          <Route element={session ? <Layout /> : <Navigate to="/login" />}>
            <Route path="/people" element={<SwipeDeck />} />
            <Route path="/network" element={<Network />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/chat" element={<ChatStation />} />
          </Route>

          {/* Fullscreen chat */}
          <Route
            path="/chat/:matchId"
            element={session ? <ChatRoom /> : <Navigate to="/login" />}
          />

          {/* Default route */}
          <Route
            path="*"
            element={<Navigate to={session ? "/people" : "/login"} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
