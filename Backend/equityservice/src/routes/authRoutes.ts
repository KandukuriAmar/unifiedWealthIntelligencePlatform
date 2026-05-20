import { Router } from 'express';
import * as authController from '../controllers/authController';
import validateRequestMiddleware from '../middleware/validateRequestMiddleware';
import authMiddleware from '../middleware/authMiddleware';
import { registerValidation, loginValidation } from '../validations/authValidation';

const router = Router();

router.post('/register', registerValidation, validateRequestMiddleware, authController.register);
router.post('/login', loginValidation, validateRequestMiddleware, authController.login);
router.post('/logout', authController.logout);

router.get('/profile', authMiddleware, authController.getProfile);
router.put('/profile', authMiddleware, authController.updateProfile);
router.get('/users', authMiddleware, authController.getUsers);
router.get('/admins', authMiddleware, authController.getAdmins);
router.post('/create-user', authMiddleware, authController.createUser);
router.post('/create-admin', authMiddleware, authController.createAdmin);
router.post('/assign', authMiddleware, authController.assignUser);
router.get('/assignments', authMiddleware, authController.getAssignments);

export default router;
