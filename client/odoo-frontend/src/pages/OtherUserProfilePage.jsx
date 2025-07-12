import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { mockApi } from '../api/mockApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/Select';
import { Label } from '../components/ui/Label';

const OtherUserProfilePage = () => {
  const { userId } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [swapMessage, setSwapMessage] = useState('');
  const [swapError, setSwapError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      const fetchedUser = await mockApi.getUser(userId);
      if (fetchedUser) {
        if (!fetchedUser.isPublic && currentUser?._id !== fetchedUser._id) {
          setError('This profile is private.');
          setUser(null);
        } else {
          setUser(fetchedUser);
        }
      } else {
        setError('User not found.');
      }
      setLoading(false);
    };
    fetchUser();
  }, [userId, currentUser]);

  const handleRequestSwap = () => {
    if (!currentUser) {
      alert('Please log in to send a swap request.');
      return;
    }
    setOfferedSkill(currentUser.skillsOffered && currentUser.skillsOffered.length > 0 ? currentUser.skillsOffered[0].name : '');
    setRequestedSkill(user.skillsWanted && user.skillsWanted.length > 0 ? user.skillsWanted[0].name : '');
    setSwapMessage('');
    setSwapError('');
    setIsModalOpen(true);
  };

  const handleSubmitSwapRequest = async () => {
    if (!offeredSkill || !requestedSkill) {
      setSwapError('Please select both an offered and a wanted skill.');
      return;
    }
    if (offeredSkill === requestedSkill) {
      setSwapError('Offered skill cannot be the same as requested skill.');
      return;
    }

    try {
      const result = await mockApi.createSwapRequest({
        fromUserId: currentUser._id,
        toUserId: user._id,
        offeredSkill: offeredSkill,
        requestedSkill: requestedSkill,
      });
      if (result.success) {
        setSwapMessage('Swap request sent successfully!');
        setIsModalOpen(false);
      } else {
        setSwapError(result.message);
      }
    } catch (error) {
      setSwapError('Failed to send swap request.');
      console.error('Swap request error:', error);
    }
  };

  if (loading) return <p className="text-center p-4">Loading user profile...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;
  if (!user) return <p className="text-center p-4">User data not available.</p>;

  return (
    <div className="container mx-auto p-8">
      <Card className="p-8 flex flex-col items-center">
        <img
          src={user.profilePhotoURL}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-blue-500"
          onError={(e) => e.target.src = `https://placehold.co/100x100/ADD8E6/000000?text=${user.name.charAt(0)}`}
        />
        <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
        {user.location && <p className="text-lg text-gray-600 mb-4">{user.location}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Skills Offered</h2>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.length > 0 ? (
                user.skillsOffered.map(skill => (
                  <span key={skill._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg">{skill.name}</span>
                ))
              ) : (
                <p className="text-gray-500">No skills offered yet.</p>
              )}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-3">Skills Wanted</h2>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.length > 0 ? (
                user.skillsWanted.map(skill => (
                  <span key={skill._id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-lg">{skill.name}</span>
                ))
              ) : (
                <p className="text-gray-500">No skills wanted yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-3">Availability</h2>
          <div className="flex flex-wrap gap-2">
            {user.availability.length > 0 ? (
              user.availability.map(day => (
                <span key={day} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </span>
              ))
            ) : (
              <p className="text-gray-500">Availability not specified.</p>
            )}
          </div>
        </div>

        {currentUser && currentUser._id !== user._id && (
          <Button onClick={handleRequestSwap} className="mt-8 text-lg px-6 py-3">
            Request Swap
          </Button>
        )}
      </Card>

      {/* Request Swap Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader>
          <DialogTitle>Request Swap with {user?.name}</DialogTitle>
          <DialogDescription>
            Choose which skill you want to offer and which skill you want from them.
          </DialogDescription>
        </DialogHeader>
        <DialogContent>
          {swapError && <p className="text-red-500 text-sm">{swapError}</p>}
          {swapMessage && <p className="text-green-600 text-sm">{swapMessage}</p>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="offeredSkill" className="text-right">
                Your Skill
              </Label>
              <Select
                id="offeredSkill"
                value={offeredSkill}
                onValueChange={setOfferedSkill}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectContent>
                    {currentUser?.skillsOffered && currentUser.skillsOffered.length > 0 ? (
                      currentUser.skillsOffered.map(skill => (
                        <SelectItem key={skill._id} value={skill.name}>{skill.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No skills offered</SelectItem>
                    )}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requestedSkill" className="text-right">
                Their Skill
              </Label>
              <Select
                id="requestedSkill"
                value={requestedSkill}
                onValueChange={setRequestedSkill}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectContent>
                    {user?.skillsWanted && user.skillsWanted.length > 0 ? (
                      user.skillsWanted.map(skill => (
                        <SelectItem key={skill._id} value={skill.name}>{skill.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No skills wanted</SelectItem>
                    )}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitSwapRequest}>Send Request</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default OtherUserProfilePage;