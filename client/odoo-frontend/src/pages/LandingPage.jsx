import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { Button } from '../components/ui/Button';

const LandingPage = () => {
  const { currentUser } = useAuth();
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white p-8">
      <h1 className="text-5xl font-extrabold mb-6 text-center">SkillSwap Platform</h1>
      <p className="text-xl text-center max-w-2xl mb-10 opacity-90">
        Exchange your unused skills for new ones! Connect with a community of learners and experts.
      </p>
      <div className="flex space-x-4">
        {!currentUser && (
          <>
            <Link to="/register">
              <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 shadow-lg">
                Create Profile
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 shadow-lg">
                Login
              </Button>
            </Link>
          </>
        )}
        <Link to="/browse">
          <Button variant="secondary" className="bg-blue-700 text-white hover:bg-blue-800 text-lg px-8 py-3 shadow-lg">
            Browse Skills
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;