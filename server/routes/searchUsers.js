import { Router } from "express";
import { searchUsers } from "../db/queryDB.js"; 

const searchUsersRouter = Router();

// Format: /api/search-users?skill=Guitar&location=Delhi&availability=Monday&availability=Friday
searchUsersRouter.get('/', async (req, res, next) => {
  try {
    const { skill, location, availability } = req.query;

    const availabilityArray = availability
      ? Array.isArray(availability)
        ? availability
        : [availability]
      : [];

    const result = await searchUsers({
      skill,
      location,
      availability: availabilityArray
    });

    res.status(result.success ? 200 : 400).json(result).end();
  } catch (error) {
    next(error);
  }
});

export default searchUsersRouter;
