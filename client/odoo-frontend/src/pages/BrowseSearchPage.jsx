import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthContext';
import { mockApi } from '../api/mockApi';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import UserCard from '../components/UserCard';

const BrowseSearchPage = () => {
  const { currentUser } = useAuth();
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

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const fetchUsers = async (filters = {}) => {
    setLoading(true);
    const fetchedUsers = await mockApi.getUsers(filters);
    setUsers(fetchedUsers);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers({
      skill: searchTerm,
      availability: filterAvailability,
      location: filterLocation,
    });
  };

  const handleAvailabilityChange = (day) => {
    setFilterAvailability(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleRequestSwap = (user) => {
    if (!currentUser) {
      alert('Please log in to send a swap request.'); // Using alert for simplicity, replace with custom modal
      return;
    }
    setSelectedUserForSwap(user);
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
        toUserId: selectedUserForSwap._id,
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

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Browse & Search Skills</h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="searchSkill">Search by Skill</Label>
            <Input
              id="searchSkill"
              placeholder="e.g., Photoshop, Excel"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="searchLocation">Filter by Location (Optional)</Label>
            <Input
              id="searchLocation"
              placeholder="e.g., London"
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
            />
          </div>
          <div>
            <Label>Filter by Availability</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {daysOfWeek.map(day => (
                <Checkbox
                  key={day}
                  id={`avail-${day}`}
                  checked={filterAvailability.includes(day)}
                  onCheckedChange={() => handleAvailabilityChange(day)}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Checkbox>
              ))}
            </div>
          </div>
        </div>
        <Button onClick={handleSearch} className="w-full">Search Users</Button>
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No users found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {users.map(user => (
            <UserCard key={user._id} user={user} currentUser={currentUser} onSwapRequest={handleRequestSwap} />
          ))}
        </div>
      )}

      {/* Request Swap Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogHeader>
          <DialogTitle>Request Swap with {selectedUserForSwap?.name}</DialogTitle>
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
                    {selectedUserForSwap?.skillsWanted && selectedUserForSwap.skillsWanted.length > 0 ? (
                      selectedUserForSwap.skillsWanted.map(skill => (
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
          <Button variant="default" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmitSwapRequest}>Send Request</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default BrowseSearchPage;