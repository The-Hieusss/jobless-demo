import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RoleSelection from "./pages/RoleSelection";
import StudentForm from "./pages/StudentForm";
import RecruiterForm from "./pages/RecruiterForm";
import SwipeDeck from "./pages/SwipeDeck";
import ChatRoom from "./pages/ChatRoom";
import Network from "./pages/Network";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import SignUpPage from "./pages/SignUpPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/recruiter-form" element={<RecruiterForm />} />

        {/* Layout-wrapped routes */}
        <Route element={<Layout />}>
          <Route path="/swipe" element={<SwipeDeck />} />
          <Route path="/network" element={<Network />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Chat remains separate (full screen) */}
        <Route path="/chat/:matchId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
