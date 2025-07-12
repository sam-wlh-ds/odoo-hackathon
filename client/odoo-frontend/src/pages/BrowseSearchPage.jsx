import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/Select';
import UserCard from '../components/UserCard';
import { sendRequest } from '../helper/requestController.js';

const BrowseSearchPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState([]);
  const [filterLocation, setFilterLocation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserForSwap, setSelectedUserForSwap] = useState(null);
  const [offeredSkill, setOfferedSkill] = useState('');
  const [requestedSkill, setRequestedSkill] = useState('');
  const [swapMessage, setSwapMessage] = useState('');
  const [swapError, setSwapError] = useState('');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        if (data.success) setCurrentUser(data.user);
      } catch (err) {
        console.error('User fetch error', err);
      }
    };

    fetchUser();
    fetchUsers();
  }, []);

 const fetchUsers = async (filters = {}) => {
  setLoading(true);
  try {
    const query = new URLSearchParams();
    if (filters.skill) query.append('skill', filters.skill);
    if (filters.location) query.append('location', filters.location);
    if (filters.availability?.length > 0) {
      filters.availability.forEach(day => query.append('availability', day));
    }

    const result = await sendRequest({}, `browse?${query.toString()}`);
    if (result && result.success) {
      setUsers(result.users || []);
    } else {
      setUsers([]);
    }
  } catch (err) {
    console.error('Fetch users failed:', err);
    setUsers([]);
  } finally {
    setLoading(false);
  }
};

  const handleSearch = () => {
    fetchUsers({
      skill: searchTerm,
      location: filterLocation,
      availability: filterAvailability,
    });
  };

  const handleAvailabilityChange = (day) => {
    setFilterAvailability((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleRequestSwap = (user) => {
    if (!currentUser) {
      alert('Please log in to send a swap request.');
      return;
    }
    setSelectedUserForSwap(user);
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
      // TODO: Replace with your real POST endpoint
      console.log('Submitting swap request', {
        fromUser: currentUser._id,
        toUser: selectedUserForSwap._id,
        offeredSkill,
        requestedSkill,
      });
      setSwapMessage('Swap request sent!');
      setIsModalOpen(false);
    } catch (err) {
      setSwapError('Failed to send swap request.');
    }
  };

  return (
    <div className="w-full min-h-screen p-8 bg-[#14213d]">
      <h1 className="text-3xl font-bold mb-6 text-[#fca311]">Browse & Search Skills</h1>

      <div className="bg-[#14213d] p-6 rounded-lg shadow-md mb-8 border border-white">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="searchSkill" className="text-white">Search by Skill</Label>
            <Input
              id="searchSkill"
              placeholder="e.g., Photoshop, Excel"
              className="placeholder-white text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="searchLocation" className="text-white">Filter by Location</Label>
            <Input
              id="searchLocation"
              placeholder="e.g., Delhi"
              className="placeholder-white text-white"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-white">Availability</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {daysOfWeek.map((day) => (
                <label key={day} className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterAvailability.includes(day)}
                    onChange={() => handleAvailabilityChange(day)}
                    className="peer hidden"
                  />
                  <div className="h-5 w-5 flex items-center justify-center rounded-md border border-white bg-[#212121] peer-checked:bg-[#fca311] transition">
                    <svg className="w-4 h-4 stroke-white" viewBox="0 0 24 24" fill="none">
                      <path d="M4 12.6111L8.92308 17.5L20 6.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button onClick={handleSearch}>Search Users</Button>
          <Button
            onClick={() => {
              setSearchTerm('');
              setFilterLocation('');
              setFilterAvailability([]);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-lg text-white">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-lg text-gray-300">No users found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              currentUser={currentUser}
              onSwapRequest={handleRequestSwap}
            />
          ))}
        </div>
      )}

      {/* Swap Request Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader>
          <DialogTitle>Request Swap with {selectedUserForSwap?.name}</DialogTitle>
          <DialogDescription>Choose the skills for this swap</DialogDescription>
        </DialogHeader>
        <DialogContent>
          {swapError && <p className="text-red-500 text-sm">{swapError}</p>}
          {swapMessage && <p className="text-green-600 text-sm">{swapMessage}</p>}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Your Skill</Label>
              <Select value={offeredSkill} onValueChange={setOfferedSkill}>
                <SelectTrigger className="col-span-3" />
                <SelectContent>
                  {currentUser?.skillsOffered?.length > 0 ? (
                    currentUser.skillsOffered.map((skill) => (
                      <SelectItem key={skill._id} value={skill.name}>{skill.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No skills</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Their Skill</Label>
              <Select value={requestedSkill} onValueChange={setRequestedSkill}>
                <SelectTrigger className="col-span-3" />
                <SelectContent>
                  {selectedUserForSwap?.skillsWanted?.length > 0 ? (
                    selectedUserForSwap.skillsWanted.map((skill) => (
                      <SelectItem key={skill._id} value={skill.name}>{skill.name}</SelectItem>
                    ))
                  ) : (
                    <SelectItem disabled>No skills</SelectItem>
                  )}
                </SelectContent>
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

export default BrowseSearchPage;