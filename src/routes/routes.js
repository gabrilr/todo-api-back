import { Router } from "express";
import { registerUser, updateUser } from "../controllers/auth.user.controller.js";
import { registerProject, allProjects, allColabProject, addNewColabProject } from "../controllers/project.controller.js";
import { allTickets, registerTicket } from "../controllers/ticket.controller.js";

const router = Router();

//router.post('/login', login);
router.post('/user/register', registerUser);
router.put('/user/update', updateUser);

router.post('/project/register', registerProject);
router.get('/project/all', allProjects);
router.post('/project/add/colab', addNewColabProject);
router.post('/project/colab/all', allColabProject);

router.post('/ticket/register/:id', registerTicket);
router.post('/project/ticket/all', allTickets);
//router.post('/ticket/update/:id', updateTicket);
//router.post('/ticket/add/comment/:id', addCommentToTicket);

export default router;