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
      .lean(); // optional: returns plain JS object

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    delete user.password;

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error('Fetch user error:', error);
    return {
      success: false,
      message: 'Failed to fetch user data'
    };
  }
}


export {getUserById, getUserWithSkills};