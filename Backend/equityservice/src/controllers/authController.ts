import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/apiResponse';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.registerUser(req.body);
    sendSuccess(res, 'Registration successful', data);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.loginUser(req.body);
    sendSuccess(res, 'Login successful', data);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.logoutUser(req.body.refresh_token);
    sendSuccess(res, 'Logout successful', data);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const investorId = (req as any).user?.investor_id;
    const data = await authService.getProfile(investorId);
    sendSuccess(res, 'Profile retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const investorId = (req as any).user?.investor_id;
    const data = await authService.updateProfile(investorId, req.body);
    sendSuccess(res, 'Profile updated successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.getAllUsers();
    sendSuccess(res, 'Users retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAdmins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.getAllAdmins();
    sendSuccess(res, 'Admins retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.registerUser(req.body, 'INV');
    sendSuccess(res, 'User created successfully', data);
  } catch (error) {
    next(error);
  }
};

export const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.registerUser(req.body, 'ADM');
    sendSuccess(res, 'Admin created successfully', data);
  } catch (error) {
    next(error);
  }
};

export const assignUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { investor_id, advisor_id } = req.body;
    const data = await authService.assignUserToAdvisor(investor_id, advisor_id);
    sendSuccess(res, 'User assigned successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getAssignments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = await authService.getAssignments();
    sendSuccess(res, 'Assignments retrieved successfully', data);
  } catch (error) {
    next(error);
  }
};
