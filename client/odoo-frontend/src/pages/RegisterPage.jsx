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

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [offeredSkill, setOfferedSkill] = useState('');
  const [wantedSkill, setWantedSkill] = useState('');
  const [skillsOffered, setSkillsOffered] = useState([]);
  const [skillsWanted, setSkillsWanted] = useState([]);

  const addOfferedSkill = () => {
    if (offeredSkill.trim() && !skillsOffered.includes(offeredSkill.trim())) {
      setSkillsOffered([...skillsOffered, offeredSkill.trim()]);
      setOfferedSkill('');
    }
  };

  const addWantedSkill = () => {
    if (wantedSkill.trim() && !skillsWanted.includes(wantedSkill.trim())) {
      setSkillsWanted([...skillsWanted, wantedSkill.trim()]);
      setWantedSkill('');
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

    const formattedOffered = skillsOffered.map(name => ({ name }));
    const formattedWanted = skillsWanted.map(name => ({ name }));

    try {
      const result = await axios.post('http://localhost:3000/register', {
        name,
        username,
        email,
        password,
        location: '',
        profilePhotoURL: '',
        isPublic: true,
        availability: [],
        skillsOffered: formattedOffered,
        skillsWanted: formattedWanted
      });

      if (result.data.success) {
        navigate('/dashboard');
      } else {
        setError(result.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Create your new SkillSwap account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            {/* Skills Offered */}
            <div>
              <Label>Skills You Can Offer</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Python"
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                />
                <Button type="button" onClick={addOfferedSkill}>+</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {skillsOffered.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>

            {/* Skills Wanted */}
            <div>
              <Label>Skills You Want</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. Guitar"
                  value={wantedSkill}
                  onChange={(e) => setWantedSkill(e.target.value)}
                />
                <Button type="button" onClick={addWantedSkill}>+</Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {skillsWanted.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">{skill}</span>
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col">
          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;