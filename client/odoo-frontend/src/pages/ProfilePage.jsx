import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import { mockApi } from '../api/mockApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Checkbox } from '../components/ui/Checkbox';

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(currentUser?.name || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [profilePhotoURL, setProfilePhotoURL] = useState(currentUser?.profilePhotoURL || '');
  const [isPublic, setIsPublic] = useState(currentUser?.isPublic || true);
  const [skillsOffered, setSkillsOffered] = useState(currentUser?.skillsOffered?.map(s => s.name).join(', ') || '');
  const [skillsWanted, setSkillsWanted] = useState(currentUser?.skillsWanted?.map(s => s.name).join(', ') || '');
  const [availability, setAvailability] = useState(currentUser?.availability || []);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (name.length < 2 || name.length > 40) {
      setError('Name must be between 2 and 40 characters.');
      return;
    }
    const parsedSkillsOffered = skillsOffered.split(',').map(s => s.trim()).filter(s => s !== '');
    const parsedSkillsWanted = skillsWanted.split(',').map(s => s.trim()).filter(s => s !== '');

    if (parsedSkillsOffered.length === 0) {
      setError('You must offer at least one skill.');
      return;
    }
    if (parsedSkillsOffered.length > 10 || parsedSkillsWanted.length > 10) {
      setError('You can list a maximum of 10 skills for each category.');
      return;
    }
    if (new Set(parsedSkillsOffered).size !== parsedSkillsOffered.length) {
      setError('Offered skills must be unique.');
      return;
    }
    if (new Set(parsedSkillsWanted).size !== parsedSkillsWanted.length) {
      setError('Wanted skills must be unique.');
      return;
    }

    const updates = {
      name,
      location,
      profilePhotoURL,
      isPublic,
      skillsOffered: parsedSkillsOffered, // Frontend sends names, mockApi handles conversion
      skillsWanted: parsedSkillsWanted,   // Frontend sends names, mockApi handles conversion
      availability,
    };

    try {
      const result = await mockApi.updateUser(currentUser._id, updates);
      if (result.success) {
        setCurrentUser(result.user);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
        setMessage('Profile updated successfully!');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    }
  };

  const handleAvailabilityChange = (day) => {
    setAvailability(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  if (!currentUser) return null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Your Profile</h1>
      <Card className="p-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="location">Location (Optional)</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="profilePhotoURL">Profile Photo URL (Optional)</Label>
            <Input id="profilePhotoURL" value={profilePhotoURL} onChange={(e) => setProfilePhotoURL(e.target.value)} placeholder="e.g., https://example.com/your-photo.jpg" />
            {profilePhotoURL && <img src={profilePhotoURL} alt="Profile Preview" className="mt-2 w-24 h-24 rounded-full object-cover" onError={(e) => e.target.src = `https://placehold.co/100x100/ADD8E6/000000?text=${name.charAt(0)}`} />}
          </div>
          <div>
            <Label htmlFor="skillsOffered">Skills Offered (comma-separated, max 10)</Label>
            <Input id="skillsOffered" value={skillsOffered} onChange={(e) => setSkillsOffered(e.target.value)} placeholder="e.g., Photoshop, Guitar, Cooking" />
          </div>
          <div>
            <Label htmlFor="skillsWanted">Skills Wanted (comma-separated, max 10)</Label>
            <Input id="skillsWanted" value={skillsWanted} onChange={(e) => setSkillsWanted(e.target.value)} placeholder="e.g., Excel, Photography, Spanish" />
          </div>
          <div>
            <Label>Availability</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
              {daysOfWeek.map(day => (
                <Checkbox
                  key={day}
                  id={day}
                  checked={availability.includes(day)}
                  onCheckedChange={() => handleAvailabilityChange(day)}
                >
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Checkbox>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublic"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            >
              Make Profile Public
            </Checkbox>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <Button type="submit">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;