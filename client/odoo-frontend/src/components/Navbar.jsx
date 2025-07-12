import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { mockApi } from '../api/mockApi';
import { Button } from './ui/Button';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (currentUser) {
      const fetchNotifications = async () => {
        const notifs = await mockApi.getNotifications(currentUser._id);
        setNotifications(notifs);
      };
      fetchNotifications();
      // Simulate real-time updates (in a real app, use WebSockets)
      const interval = setInterval(fetchNotifications, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = async (notifId) => {
    await mockApi.markNotificationAsRead(notifId);
    setNotifications(prev => prev.map(n => n.notificationId === notifId ? { ...n, isRead: true } : n));
  };

  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">SkillSwap</Link>
        <div className="flex items-center space-x-4">
          <Link to="/browse" className="hover:text-gray-300">Browse Skills</Link>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <Link to="/requests" className="hover:text-gray-300">Swap Requests</Link>
              <div className="relative">
                <Button variant="ghost" onClick={() => setShowNotifications(!showNotifications)} className="relative px-2 py-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 20 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">{unreadCount}</span>
                  )}
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                    {notifications.length === 0 ? (
                      <p className="px-4 py-2 text-sm text-gray-500">No new notifications</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.notificationId}
                          className={`px-4 py-2 text-sm ${notif.isRead ? 'text-gray-500' : 'font-semibold text-gray-800'} hover:bg-gray-100 cursor-pointer`}
                          onClick={() => handleNotificationClick(notif.notificationId)}
                        >
                          {notif.message}
                          <span className="block text-xs text-gray-400">{new Date(notif.createdAt).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
              <Button onClick={handleLogout} variant="destructive">Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;