import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';

const categories = [
  "Programming", "Music", "Art", "Language", "Fitness", "Cooking", "Productivity", "Design"
];

const levels = ["Beginner", "Intermediate", "Expert"];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [availability, setAvailability] = useState([]);
  const [offeredSkill, setOfferedSkill] = useState({ name: '', category: '', level: '' });
  const [wantedSkill, setWantedSkill] = useState({ name: '', category: '', level: '' });
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);

  const toggleDay = (day) => {
    if (availability.includes(day)) {
      setAvailability(availability.filter(d => d !== day));
    } else {
      setAvailability([...availability, day]);
    }
  };

  const addOfferedSkill = () => {
    const { name, category, level } = offeredSkill;
    if (name && category && level) {
      setSkillsOffered([...skillsOffered, offeredSkill]);
      setOfferedSkill({ name: '', category: '', level: '' });
    }
  };

  const addWantedSkill = () => {
    const { name, category, level } = wantedSkill;
    if (name && category && level) {
      setSkillsWanted([...skillsWanted, wantedSkill]);
      setWantedSkill({ name: '', category: '', level: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.length < 2 || name.length > 40) {
      setError('Name must be between 2 and 40 characters.');
      return;
    }
    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!email.includes('@') || password.length < 6) {
      setError('Please enter a valid email and a password of at least 6 characters.');
      return;
    }

    try {
      const result = await axios.post('http://localhost:3000/register', {
        name,
        username,
        email,
        password,
        location: '',
        profilePhotoURL: '',
        isPublic: true,
        availability,
        skillsOffered,
        skillsWanted
      });

      if (result.data.success) {
        navigate('/login');
      } else {
        setError(result.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-900 p-4">
      <Card className="w-full max-w-md bg-[#14213d] text-white">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your SkillSwap account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label>Username</Label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* Availability Days */}
            <div>
              <Label>Availability</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                {daysOfWeek.map((day, i) => (
                  <label key={i} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={availability.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Skills Offered */}
            <div>
              <Label>Skills You Can Offer</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Skill"
                  value={offeredSkill.name}
                  onChange={(e) => setOfferedSkill({ ...offeredSkill, name: e.target.value })}
                />
                <select
                  value={offeredSkill.category}
                  onChange={(e) => setOfferedSkill({ ...offeredSkill, category: e.target.value })}
                  className="rounded-md p-2 text-black"
                >
                  <option value="">Category</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                <select
                  value={offeredSkill.level}
                  onChange={(e) => setOfferedSkill({ ...offeredSkill, level: e.target.value })}
                  className="rounded-md p-2 text-black"
                >
                  <option value="">Level</option>
                  {levels.map((l, i) => <option key={i} value={l}>{l}</option>)}
                </select>
              </div>
              <Button type="button" onClick={addOfferedSkill} className="mt-2">Add Skill</Button>
              <div className="mt-2 flex flex-wrap gap-2">
                {skillsOffered.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    {skill.name} ({skill.category}, {skill.level})
                  </span>
                ))}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <Label>Skills You Want</Label>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  placeholder="Skill"
                  value={wantedSkill.name}
                  onChange={(e) => setWantedSkill({ ...wantedSkill, name: e.target.value })}
                />
                <select
                  value={wantedSkill.category}
                  onChange={(e) => setWantedSkill({ ...wantedSkill, category: e.target.value })}
                  className="rounded-md p-2 text-black"
                >
                  <option value="">Category</option>
                  {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
                </select>
                <select
                  value={wantedSkill.level}
                  onChange={(e) => setWantedSkill({ ...wantedSkill, level: e.target.value })}
                  className="rounded-md p-2 text-black"
                >
                  <option value="">Level</option>
                  {levels.map((l, i) => <option key={i} value={l}>{l}</option>)}
                </select>
              </div>
              <Button type="button" onClick={addWantedSkill} className="mt-2">Add Skill</Button>
              <div className="mt-2 flex flex-wrap gap-2">
                {skillsWanted.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                    {skill.name} ({skill.category}, {skill.level})
                  </span>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#fca311]">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col">
          <p className="text-sm text-center text-gray-400">
            Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;