import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();
const userController = new UserController();

// Register
router.post('/register', userController.createUser);

// Login User
router.post('/login', userController.loginUser);

export default router;
