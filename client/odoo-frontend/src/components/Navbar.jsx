import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mockApi } from "../api/mockApi";
import { sendRequest } from "../helper/requestController";
import { Button } from "./ui/Button";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("Authorization");

  // Fetch current user if token exists but currentUser isn't in localStorage
  useEffect(() => {
    const init = async () => {
      const storedUser = localStorage.getItem("currentUser");

      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
        }
      } else if (isLoggedIn) {
        try {
          const res = await sendRequest({}, "user");
          if (res?.user) {
            setCurrentUser(res.user);
            localStorage.setItem("currentUser", JSON.stringify(res.user));
          }
        } catch (err) {
          console.error("Failed to fetch user from token:", err);
        }
      }
    };
    init();
  }, [isLoggedIn]);

  // Notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (currentUser && isLoggedIn) {
        const notifs = await mockApi.getNotifications(currentUser._id);
        setNotifications(notifs);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [currentUser, isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("Authorization");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  const handleNotificationClick = async (notifId) => {
    await mockApi.markNotificationAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) =>
        n.notificationId === notifId ? { ...n, isRead: true } : n
      )
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className="bg-[#14213d] p-4 text-white shadow-md">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <div className="flex justify-between w-full md:w-auto">
          <Link to="/" className="text-2xl font-bold text-[#fca311]">
            DnyanSetu
          </Link>
          <button
            className="text-white md:hidden"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            ☰
          </button>
        </div>

        <div
          className={`w-full md:flex md:items-center md:w-auto ${
            showNotifications ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 w-full md:w-auto mt-4 md:mt-0 space-y-2 md:space-y-0">
            <Link to="/browse" className="hover:text-[#fca311]">
              Browse Skills
            </Link>

            {isLoggedIn && currentUser ? (
              <>
                <Link to="/dashboard" className="hover:text-[#fca311]">
                  Dashboard
                </Link>
                <Link to="/profile" className="hover:text-[#fca311]">
                  Profile
                </Link>
                <Link to="/requests" className="hover:text-[#fca311]">
                  Swap Requests
                </Link>

                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative px-2 py-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 20 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-10 text-gray-800">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-2 text-sm text-gray-500">
                          No new notifications
                        </p>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.notificationId}
                            className={`px-4 py-2 text-sm ${
                              notif.isRead
                                ? "text-gray-500"
                                : "font-semibold text-gray-800"
                            } hover:bg-gray-100 cursor-pointer`}
                            onClick={() =>
                              handleNotificationClick(notif.notificationId)
                            }
                          >
                            {notif.message}
                            <span className="block text-xs text-gray-400">
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <Button onClick={handleLogout} variant="destructive">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-[#fca311]">
                  Login
                </Link>
                <Link to="/register" className="hover:text-[#fca311]">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;