declare global {
  namespace Express {
    interface Request {
      user: {
        investor_id: string;
        email: string;
      };
    }
  }
}

export {};