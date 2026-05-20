import axios from "axios";

export const loginUser = async (email: string, password: string) => {
  try {
    const equityServiceUrl = process.env.EQUITY_SERVICE_URL || "http://localhost:3001";
    const response = await axios.post(`${equityServiceUrl}/auth/login`, {
      email,
      password
    });
    
    if (response.data && response.data.success) {
      const data = response.data.data;
      
      // Determine role from investor_id
      const investorId = data.investor.investor_id;
      const role = investorId.startsWith('SUP') ? 'SUPERADMIN' : investorId.startsWith('ADM') ? 'ADMIN' : 'USER';
      
      if (role !== 'ADMIN' && role !== 'SUPERADMIN') {
        throw new Error("Access Denied: Only Admins or Superadmins can log in here.");
      }
      
      return {
        token: data.access_token,
        user: {
          id: investorId,
          name: data.investor.full_name,
          email: data.investor.email,
          role: role
        }
      };
    }
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Invalid Credentials");
  }
  
  throw new Error("Invalid Credentials");
};