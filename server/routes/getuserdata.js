import { Router } from "express";
import { getUserWithSkills } from "../db/queryDB.js";

const getUserDataRouter = Router();

getUserDataRouter.get('/:username', async (req,res,next) => {
    try {
        const data = await getUserWithSkills(req.params.username);
        res.status(200).json(data).end();
    } catch (error) {
        next(error);
    }
});

getUserDataRouter.get('/', async (req,res,next) => {
    try {
        const data = await getUserWithSkills(req.user.username);
        res.status(200).json(data).end();
    } catch (error) {
        next(error);
    }
});

export default getUserDataRouter;