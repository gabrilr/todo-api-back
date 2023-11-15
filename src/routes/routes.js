import { Router } from "express";
import { registerUser } from "../controllers/auth.user.controller.js";
import { registerProject, allProjects } from "../controllers/project.controller.js";
import { registerTicket } from "../controllers/ticket.controller.js";

const router = Router();


//router.post('/login', login);
router.post('/user/register', registerUser);
router.post('/project/register/:id', registerProject);
router.get('/project/all', allProjects);
router.post('/ticket/register/:id', registerTicket);

export default router;