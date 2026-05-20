import jwt from "jsonwebtoken";

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
        role: "ADMIN"
      },
      "secretkey",
      {
        expiresIn: "1d"
      }
    );

    return {
      token
    };
  }

  throw new Error("Invalid Credentials");
};