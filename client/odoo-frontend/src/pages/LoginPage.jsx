import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';
import { loginAndGetToken } from '../helper/requestController';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log("Here");
    const result = await loginAndGetToken(username, password);
    if (result) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" placeholder="john_doe" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col">
          <p className="text-sm text-center text-gray-600">
            Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register</Link>
          </p>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline mt-2">Forgot Password?</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;