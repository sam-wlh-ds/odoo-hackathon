import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '../components/ui/Dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger
} from '../components/ui/Select';
import { Label } from '../components/ui/Label';
import { sendRequest } from '../helper/requestController';

const OtherUserProfilePage = () => {
  const { userId } = useParams();

  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [swapMessage, setSwapMessage] = useState('');
  const [swapError, setSwapError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const currentUserData = await sendRequest({}, 'user');
        const otherUserData = await sendRequest({}, `user/${userId}`);

        if (!otherUserData || !otherUserData.user) {
          setError('User not found');
          return;
        }

        if (!otherUserData.user.isPublic && currentUserData?.user?._id !== otherUserData.user._id) {
          setError('This profile is private.');
          return;
        }

        setCurrentUser(currentUserData.user);
        setUser(otherUserData.user);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleRequestSwap = () => {
    if (!currentUser) {
      alert('Please log in to send a swap request.');
      return;
    }

    setOfferedSkill(currentUser.skillsOffered?.[0]?.name || '');
    setRequestedSkill(user.skillsWanted?.[0]?.name || '');
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
      const res = await sendRequest({
        fromUserId: currentUser._id,
        toUserId: user._id,
        offeredSkill,
        requestedSkill
      }, 'swap/request');

      if (res?.success) {
        setSwapMessage('Swap request sent successfully!');
        setIsModalOpen(false);
      } else {
        setSwapError(res?.message || 'Failed to send request.');
      }
    } catch (err) {
      console.error('Swap request error:', err);
      setSwapError('Failed to send swap request.');
    }
  };

  if (loading) return <p className="text-center p-4">Loading user profile...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;
  if (!user) return <p className="text-center p-4">User not found.</p>;

  return (
    <div className="w-full min-h-screen p-8 bg-[#14213d]">
      <Card className="p-8 flex flex-col items-center border border-white text-white">
        <img
          src={user.profilePhotoURL}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-blue-500"
          onError={(e) => e.target.src = `https://placehold.co/100x100/ADD8E6/000000?text=${user.name.charAt(0)}`}
        />
        <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
        {user.location && <p className="text-lg text-white-600 mb-4">{user.location}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Skills Offered</h2>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered?.length > 0 ? (
                user.skillsOffered.map(skill => (
                  <span key={skill._id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-lg">{skill.name}</span>
                ))
              ) : (
                <p className="text-gray-500">No skills offered.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Skills Wanted</h2>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted?.length > 0 ? (
                user.skillsWanted.map(skill => (
                  <span key={skill._id} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-lg">{skill.name}</span>
                ))
              ) : (
                <p className="text-gray-500">No skills wanted.</p>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Availability</h2>
            <div className="flex flex-wrap gap-2">
              {user.availability?.length > 0 ? (
                user.availability.map(day => (
                  <span key={day} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No availability set.</p>
              )}
            </div>
          </div>
        </div>

        {currentUser && currentUser._id !== user._id && (
          <Button onClick={handleRequestSwap} className="mt-8 text-lg px-6 py-3">
            Request Swap
          </Button>
        )}
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader>
          <DialogTitle>Request Swap with {user?.name}</DialogTitle>
          <DialogDescription>Select a skill to offer and one to request.</DialogDescription>
        </DialogHeader>
        <DialogContent>
          {swapError && <p className="text-red-500 text-sm">{swapError}</p>}
          {swapMessage && <p className="text-green-600 text-sm">{swapMessage}</p>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="offeredSkill" className="text-right">Your Skill</Label>
              <Select id="offeredSkill" value={offeredSkill} onValueChange={setOfferedSkill} className="col-span-3">
                <SelectTrigger>
                  <SelectContent>
                    {currentUser?.skillsOffered?.length > 0 ? (
                      currentUser.skillsOffered.map(skill => (
                        <SelectItem key={skill._id} value={skill.name}>{skill.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No skills</SelectItem>
                    )}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requestedSkill" className="text-right">Their Skill</Label>
              <Select id="requestedSkill" value={requestedSkill} onValueChange={setRequestedSkill} className="col-span-3">
                <SelectTrigger>
                  <SelectContent>
                    {user?.skillsWanted?.length > 0 ? (
                      user.skillsWanted.map(skill => (
                        <SelectItem key={skill._id} value={skill.name}>{skill.name}</SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>No skills</SelectItem>
                    )}
                  </SelectContent>
                </SelectTrigger>
              </Select>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitSwapRequest}>Send Request</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default OtherUserProfilePage;