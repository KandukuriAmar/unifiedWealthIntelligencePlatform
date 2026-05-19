import { Router } from 'express';
import * as authController from '../controllers/authController';
import validateRequestMiddleware from '../middleware/validateRequestMiddleware';
import { registerValidation, loginValidation, logoutValidation } from '../validations/authValidation';

const router = Router();

router.post('/register', registerValidation, validateRequestMiddleware, authController.register);
router.post('/login', loginValidation, validateRequestMiddleware, authController.login);
router.post('/logout', logoutValidation, validateRequestMiddleware, authController.logout);

export default router;