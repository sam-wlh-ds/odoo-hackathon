import mongoose from 'mongoose';
import UserModel from '../models/UserModel.js';
import SkillModel from '../models/SkillsModel.js';

async function getUserById(id) {
  try {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw new Error(error.message || "Failed to fetch user");
  }
}

async function getUserWithSkills(username) {
  try {
    const user = await UserModel.findOne({ username })
      .populate('skillsOffered')
      .populate('skillsWanted')
      .lean();

    if (!user) return { success: false, message: 'User not found' };

    delete user.password;
    return { success: true, user };
  } catch (error) {
    console.error('Fetch user error:', error);
    return { success: false, message: 'Failed to fetch user data' };
  }
}

async function searchUsers({ skill, location, availability = [] }) {
  try {
    let skillIds = [];
    if (skill) {
      const skillRegex = new RegExp(skill, 'i');
      const matchedSkills = await SkillModel.find({ name: skillRegex }, '_id');
      skillIds = matchedSkills.map(s => s._id);
    }

    const query = {};

    if (location) {
      query.location = location;
    }

    if (availability.length > 0) {
      query.availability = { $all: availability };
    }

    if (skillIds.length > 0) {
      query.$or = [
        { skillsOffered: { $in: skillIds } },
        { skillsWanted: { $in: skillIds } }
      ];
    }

    const users = await UserModel.find(query)
      .populate('skillsOffered')
      .populate('skillsWanted')
      .select('-password')
      .lean();

    return { success: true, users };
  } catch (err) {
    console.error('searchUsers error:', err);
    return { success: false, message: 'Failed to search users' };
  }
}

export {getUserById, getUserWithSkills, searchUsers};