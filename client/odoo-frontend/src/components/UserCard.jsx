import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

const UserCard = ({ user, currentUser, onSwapRequest }) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/user/${user.username}`);
  };

  return (
    <Card className="p-6 flex flex-col items-center text-center text-white shadow-md hover:shadow-lg transition-shadow duration-200">
      <img
        src={user.profilePhotoURL}
        alt={user.name}
        className="w-24 h-24 rounded-full object-cover mb-4"
        onError={(e) => e.target.src = `https://placehold.co/100x100/ADD8E6/000000?text=${user.name.charAt(0)}`}
      />
      <h3 className="text-xl font-semibold mb-1">{user.name}</h3>
      {user.location && <p className="text-sm text-gray-500 mb-2">{user.location}</p>}
      <div className="mb-4 text-left w-full">
        <p className="font-medium">Skills Offered:</p>
        <div className="flex flex-wrap gap-1">
          {user.skillsOffered?.map(skill => (
            <span key={skill._id} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{skill.name}</span>
          ))}
        </div>
        <p className="font-medium mt-2">Skills Wanted:</p>
        <div className="flex flex-wrap gap-1">
          {user.skillsWanted?.map(skill => (
            <span key={skill._id} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">{skill.name}</span>
          ))}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleViewProfile} variant="default">View Profile</Button>
        {currentUser && currentUser._id !== user._id && (
          <Button onClick={() => onSwapRequest(user)}>Request Swap</Button>
        )}
      </div>
    </Card>
  );
};

export default UserCard;