import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import OtherUserProfilePage from './pages/OtherUserProfilePage';
import BrowseSearchPage from './pages/BrowseSearchPage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import FeedbackPage from './pages/FeedbackPage';
import { Footer } from './components/Footer';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 font-inter">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/user/:userId" element={<OtherUserProfilePage />} />
              <Route path="/browse" element={<BrowseSearchPage />} />
              <Route path="/requests" element={<SwapRequestsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/feedback/:swapId" element={<FeedbackPage />} />
            </Routes>
          </main>
          <Footer/>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;


