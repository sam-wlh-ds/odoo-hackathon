import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { sendRequest } from "../helper/requestController.js";

const DashboardPage = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await sendRequest({}, "user"); // hits /user route
        if (data?.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.log("Error fetching user:", err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading || currentUser === undefined) {
    return <p className="p-4 text-center">Loading dashboard...</p>;
  }

  if (!currentUser) {
    return (
      <p className="p-4 text-center">Please log in to view your dashboard.</p>
    );
  }
  console.log(currentUser);
  return (
    <div className="w-full  p-8 bg-[#14213d] text-white">
      <h1 className="text-3xl font-bold mb-6">Welcome, {currentUser.name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Basic Info</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Username:</strong> {currentUser.username}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>Location:</strong> {currentUser.location || "N/A"}
            </p>
            <p>
              <strong>Profile:</strong>{" "}
              {currentUser.isPublic ? "Public" : "Private"}
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/profile">
              <Button variant="default">Edit Profile</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Offered</CardTitle>
            <CardDescription>
              Total: {currentUser.skillsOffered.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser.skillsOffered.length === 0 ? (
              <p>No skills offered yet.</p>
            ) : (
              <ul className="list-disc list-inside">
                {currentUser.skillsOffered.map((skill, i) => (
                  <li key={skill._id || i}>
                    <span className="font-medium">{skill.name}</span> —{" "}
                    {skill.category}, <em>{skill.level}</em>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills Wanted</CardTitle>
            <CardDescription>
              Total: {currentUser.skillsWanted.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser.skillsWanted.length === 0 ? (
              <p>No skills wanted yet.</p>
            ) : (
              <ul className="list-disc list-inside">
                {currentUser.skillsWanted.map((skill, i) => (
                  <li key={skill._id || i}>
                    <span className="font-medium">{skill.name}</span> —{" "}
                    {skill.category}, <em>{skill.level}</em>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent>
            {currentUser.availability.length > 0 ? (
              <p>{currentUser.availability.join(", ")}</p>
            ) : (
              <p>No availability set</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              Total: {currentUser.feedback.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentUser.feedback.length === 0 ? (
              <p>No feedback yet.</p>
            ) : (
              <ul className="list-disc list-inside">
                {currentUser.feedback.map((fb, i) => (
                  <li key={i}>
                    {fb.rating}/5 – {fb.comment}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="flex flex-col gap-2">
          <Link to="/browse" className="text-blue-600 hover:underline">
            Browse Users
          </Link>
          <Link to="/requests" className="text-blue-600 hover:underline">
            View Swap Requests
          </Link>
          <Link to="/feedback" className="text-blue-600 hover:underline">
            Give/View Feedback
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
