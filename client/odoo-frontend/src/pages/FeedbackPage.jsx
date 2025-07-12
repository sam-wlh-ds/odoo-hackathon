import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { mockApi } from '../api/mockApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';

const FeedbackPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { swapId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [feedbackGiven, setFeedbackGiven] = useState([]);
  const [feedbackReceived, setFeedbackReceived] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    const fetchFeedback = async () => {
      setLoadingFeedback(true);
      const allFeedback = await mockApi.getFeedbackForUser(currentUser._id);
      setFeedbackGiven(allFeedback.filter(f => f.fromUserId === currentUser._id));
      setFeedbackReceived(allFeedback.filter(f => f.toUserId === currentUser._id));
      setLoadingFeedback(false);
    };
    fetchFeedback();
  }, [currentUser, navigate]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (rating === 0) {
      setError('Please provide a rating.');
      return;
    }
    if (!swapId) {
      setError('Swap ID is missing. Cannot submit feedback without a specific swap.');
      return;
    }

    const swap = mockApi.getSwapRequests(currentUser._id).then(requests =>
      requests.find(s => s.swapId === swapId)
    );

    if (!swap) {
      setError('Swap not found.');
      return;
    }
    const toUserId = swap.fromUserId === currentUser._id ? swap.toUserId : swap.fromUserId;

    if (comment.length > 300) {
      setError('Comment cannot exceed 300 characters.');
      return;
    }

    try {
      const result = await mockApi.submitFeedback({
        swapId,
        fromUserId: currentUser._id,
        toUserId: toUserId,
        rating,
        comment,
      });
      if (result.success) {
        setMessage('Feedback submitted successfully!');
        setRating(0);
        setComment('');
        const allFeedback = await mockApi.getFeedbackForUser(currentUser._id);
        setFeedbackGiven(allFeedback.filter(f => f.fromUserId === currentUser._id));
        setFeedbackReceived(allFeedback.filter(f => f.toUserId === currentUser._id));
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to submit feedback.');
      console.error(err);
    }
  };

  const renderFeedbackCard = (feedback, type) => (
    <Card key={feedback.feedbackId} className="p-4 shadow-sm">
      <p className="text-sm text-gray-500">{new Date(feedback.createdAt).toLocaleDateString()}</p>
      <div className="flex items-center mt-2">
        <span className="text-xl font-bold mr-2">{feedback.rating}/5</span>
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`h-5 w-5 ${i < feedback.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.538 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.783.565-1.838-.197-1.538-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.92 8.72c-.783-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <p className="mt-2 text-gray-700">{feedback.comment || 'No comment provided.'}</p>
      <p className="text-sm text-gray-600 mt-2">
        {type === 'given' ? `To: ${mockApi.getUser(feedback.toUserId).then(u => u?.name)}` : `From: ${mockApi.getUser(feedback.fromUserId).then(u => u?.name)}`}
      </p>
    </Card>
  );

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Feedback & Ratings</h1>

      {message && <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{message}</div>}
      {error && <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4">{error}</div>}

      {swapId && (
        <Card className="p-6 mb-8">
          <CardHeader>
            <CardTitle>Give Feedback for Swap ID: {swapId}</CardTitle>
            <CardDescription>Rate your experience and leave a comment.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div>
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value) || 0)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="comment">Comment (Optional, max 300 characters)</Label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength="300"
                  className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g., Very cooperative and talented."
                ></textarea>
                <p className="text-xs text-gray-500 text-right">{comment.length}/300</p>
              </div>
              <Button type="submit">Submit Feedback</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="received" className="w-full">
        <TabsList>
          <TabsTrigger value="received">Feedback Received ({feedbackReceived.length})</TabsTrigger>
          <TabsTrigger value="given">Feedback Given ({feedbackGiven.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
          <h2 className="text-2xl font-bold mb-4 mt-4">Feedback Received</h2>
          {loadingFeedback ? (
            <p className="text-center">Loading feedback...</p>
          ) : feedbackReceived.length === 0 ? (
            <p className="text-gray-600">No feedback received yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackReceived.map(f => renderFeedbackCard(f, 'received'))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="given">
          <h2 className="text-2xl font-bold mb-4 mt-4">Feedback Given</h2>
          {loadingFeedback ? (
            <p className="text-center">Loading feedback...</p>
          ) : feedbackGiven.length === 0 ? (
            <p className="text-gray-600">No feedback given yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackGiven.map(f => renderFeedbackCard(f, 'given'))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackPage;