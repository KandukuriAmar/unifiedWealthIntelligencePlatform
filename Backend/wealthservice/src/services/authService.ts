import axios from "axios";

<<<<<<< HEAD
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
=======
export const loginUser =
async (
  email: string,
  password: string
) => {

  if (
    email === "admin@gmail.com" &&
    password === "1234"
  ) {

    const token = jwt.sign(
      {
        email,
        role: "ADMIN",

        investor_id: "INV1001"
      },
      "secretkey",
      {
        expiresIn: "1d"
>>>>>>> e71cf39bbdf103cb602b3d8bd49a8f81ba74ac3f
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
<<<<<<< HEAD
  
  throw new Error("Invalid Credentials");
=======

  throw new Error(
    "Invalid Credentials"
  );
>>>>>>> e71cf39bbdf103cb602b3d8bd49a8f81ba74ac3f
};