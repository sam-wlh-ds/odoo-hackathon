import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { mockApi } from '../api/mockApi';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchRequests = async () => {
        setLoading(true);
        const requests = await mockApi.getSwapRequests(currentUser._id);
        setSwapRequests(requests);
        setLoading(false);
      };
      fetchRequests();
    }
  }, [currentUser]);

  if (!currentUser) return <p className="p-4 text-center">Please log in to view your dashboard.</p>;

  const pendingIncoming = swapRequests.filter(req => req.toUserId === currentUser._id && req.status === 'pending').length;
  const pendingOutgoing = swapRequests.filter(req => req.fromUserId === currentUser._id && req.status === 'pending').length;
  const acceptedSwaps = swapRequests.filter(req => req.status === 'accepted').length;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
            <CardDescription>Your profile visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              {currentUser.isPublic ? 'Public' : 'Private'}
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/profile">
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Swaps</CardTitle>
            <CardDescription>Overview of your swap requests</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">Incoming Pending: <span className="font-semibold">{pendingIncoming}</span></p>
            <p className="text-lg">Outgoing Pending: <span className="font-semibold">{pendingOutgoing}</span></p>
            <p className="text-lg">Accepted Swaps: <span className="font-semibold">{acceptedSwaps}</span></p>
          </CardContent>
          <CardFooter>
            <Link to="/requests">
              <Button>View All Requests</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>Navigate quickly</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col space-y-2">
            <Link to="/browse" className="text-blue-600 hover:underline">Browse Users</Link>
            <Link to="/requests" className="text-blue-600 hover:underline">View Swap Requests</Link>
            <Link to="/feedback" className="text-blue-600 hover:underline">Give/View Feedback</Link>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Your Recent Activity</h2>
          {swapRequests.length === 0 ? (
            <p className="text-gray-600">No recent swap requests. Start Browse to find skills!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {swapRequests.slice(0, 4).map(req => (
                <Card key={req.swapId} className="p-4">
                  <p className="text-sm text-gray-500">Requested on: {new Date(req.createdAt).toLocaleDateString()}</p>
                  <p className="font-semibold">
                    {req.fromUserId === currentUser._id ? 'You requested' : `${req.fromUserName} requested`}
                    {' '}
                    <span className="text-blue-600">{req.requestedSkill}</span>
                    {' '}
                    from {req.fromUserId === currentUser._id ? req.toUserName : 'you'}
                    {' '}
                    offering <span className="text-blue-600">{req.offeredSkill}</span>.
                  </p>
                  <p className={`text-sm mt-1 ${req.status === 'pending' ? 'text-yellow-600' : req.status === 'accepted' ? 'text-green-600' : 'text-red-600'}`}>
                    Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;