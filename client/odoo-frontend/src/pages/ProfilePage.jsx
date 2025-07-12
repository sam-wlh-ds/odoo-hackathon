import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { sendRequest } from '../helper/requestController';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const res = await sendRequest({}, 'user');
        if (res?.user) {
          setUser(res.user);
        } else {
          setError('Could not load user profile.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch user profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  if (loading) return <p className="text-center p-4">Loading profile...</p>;
  if (error) return <p className="text-center p-4 text-red-500">{error}</p>;
  if (!user) return <p className="text-center p-4">User not found.</p>;

  return (
    <div className="w-full min-h-screen p-8 bg-[#14213d]">
      <Card className="p-8 flex flex-col items-center border border-white text-white">
        <img
          src={user.profilePhotoURL}
          alt={user.name}
          className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-blue-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = `https://placehold.co/100x100/ADD8E6/000000?text=${user.name.charAt(0)}`;
          }}
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
      </Card>
    </div>
  );
};

export default ProfilePage;
