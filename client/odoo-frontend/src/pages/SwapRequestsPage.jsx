import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { mockApi } from '../api/mockApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/Tabs';

const SwapRequestsPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [swapRequests, setSwapRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const fetchRequests = async () => {
      setLoading(true);
      const requests = await mockApi.getSwapRequests(currentUser._id);
      setSwapRequests(requests);
      setLoading(false);
    };
    fetchRequests();
  }, [currentUser, navigate]);

  const handleUpdateStatus = async (swapId, status) => {
    setMessage('');
    setError('');
    try {
      await mockApi.updateSwapRequestStatus(swapId, status);
      setMessage(`Swap request ${status} successfully!`);
      const updatedRequests = await mockApi.getSwapRequests(currentUser._id);
      setSwapRequests(updatedRequests);
    } catch (err) {
      setError('Failed to update swap request status.');
      console.error(err);
    }
  };

  const handleDeleteRequest = async (swapId) => {
    setMessage('');
    setError('');
    try {
      await mockApi.deleteSwapRequest(swapId);
      setMessage('Swap request deleted successfully!');
      const updatedRequests = await mockApi.getSwapRequests(currentUser._id);
      setSwapRequests(updatedRequests);
    } catch (err) {
      setError('Failed to delete swap request.');
      console.error(err);
    }
  };

  const renderSwapRequestCard = (req) => {
    const isIncoming = req.toUserId === currentUser._id;
    const canAcceptOrReject = isIncoming && req.status === 'pending';
    const canDelete = req.fromUserId === currentUser._id && req.status === 'pending';

    return (
      <Card key={req.swapId} className="p-4 shadow-sm">
        <p className="text-sm text-gray-500">Requested on: {new Date(req.createdAt).toLocaleDateString()}</p>
        <p className="font-semibold text-lg mt-2">
          {isIncoming ? (
            <>
              <span className="text-blue-600">{req.fromUserName}</span> wants to swap their <span className="text-green-600">{req.offeredSkill}</span>
              {' '}for your <span className="text-purple-600">{req.requestedSkill}</span>.
            </>
          ) : (
            <>
              You requested <span className="text-purple-600">{req.requestedSkill}</span> from <span className="text-blue-600">{req.toUserName}</span>
              {' '}offering your <span className="text-green-600">{req.offeredSkill}</span>.
            </>
          )}
        </p>
        <p className={`mt-2 text-md font-medium ${
          req.status === 'pending' ? 'text-yellow-600' :
          req.status === 'accepted' ? 'text-green-600' : 'text-red-600'
        }`}>
          Status: {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
        </p>
        <div className="mt-4 flex space-x-2">
          {canAcceptOrReject && (
            <>
              <Button onClick={() => handleUpdateStatus(req.swapId, 'accepted')}>Accept</Button>
              <Button variant="destructive" onClick={() => handleUpdateStatus(req.swapId, 'rejected')}>Reject</Button>
            </>
          )}
          {canDelete && (
            <Button variant="outline" onClick={() => handleDeleteRequest(req.swapId)}>Delete</Button>
          )}
          {req.status === 'accepted' && (
            <Link to={`/feedback/${req.swapId}`}>
              <Button variant="secondary">Give Feedback</Button>
            </Link>
          )}
        </div>
      </Card>
    );
  };

  const pendingRequests = swapRequests.filter(req => req.status === 'pending');
  const acceptedRequests = swapRequests.filter(req => req.status === 'accepted');
  const rejectedCancelledRequests = swapRequests.filter(req => req.status === 'rejected' || req.status === 'cancelled');

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Your Swap Requests</h1>

      {message && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">{error}</div>}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
          <TabsTrigger value="accepted">Accepted ({acceptedRequests.length})</TabsTrigger>
          <TabsTrigger value="history">History ({rejectedCancelledRequests.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          {loading ? (
            <p className="text-center mt-4">Loading pending requests...</p>
          ) : pendingRequests.length === 0 ? (
            <p className="text-gray-600 mt-4">No pending swap requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {pendingRequests.map(renderSwapRequestCard)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="accepted">
          {loading ? (
            <p className="text-center mt-4">Loading accepted requests...</p>
          ) : acceptedRequests.length === 0 ? (
            <p className="text-gray-600 mt-4">No accepted swap requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {acceptedRequests.map(renderSwapRequestCard)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="history">
          {loading ? (
            <p className="text-center mt-4">Loading history...</p>
          ) : rejectedCancelledRequests.length === 0 ? (
            <p className="text-gray-600 mt-4">No rejected or cancelled swap requests.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {rejectedCancelledRequests.map(renderSwapRequestCard)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SwapRequestsPage;