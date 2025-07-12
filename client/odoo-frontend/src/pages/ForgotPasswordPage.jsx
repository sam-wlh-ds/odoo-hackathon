import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Button } from '../components/ui/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    // Mock logic: In a real app, send reset email
    if (email) {
      setMessage('If an account with that email exists, a password reset link has been sent.');
      setEmail('');
    } else {
      setMessage('Please enter your email.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>Enter your email to reset your password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full">Reset Password</Button>
            {message && <p className="text-sm text-green-600">{message}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex-col">
          <Link to="/login" className="text-sm text-blue-600 hover:underline mt-2">Back to Login</Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;