import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs"; 
import { generateToken } from "../utils/generateToken.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  //check if user already exists
  const userExists = await prisma.user.findUnique({
    where: { email: email }, 
  });

  if (userExists) {
    return res
    .status(400)
    .json({ error : "User already exists"});
  }

  // Hash the password before saving to the database 
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create the user in the database
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Generate JWT token (optional, can be implemented later)
  const token = generateToken(user.id, res);

  res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id, 
        name: name, 
        email: email,
      },
      token,
  }})
};
// Login function to authenticate users
const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return res.status(401)
    .json({ error: "Invalid email or password" });
  }

  //verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

// If password is invalid, return an error response
  if (!isPasswordValid) {
    return res.status(401)
    .json({ error: "Invalid email or password" });
  }

  // Generate JWT token (optional, can be implemented later)
  const token = generateToken(user.id, res);


   res.status(201).json({
    status: "success",
    data: {
      user: {
        id: user.id, 
        email: email,
      },
      token,
  }})

};

// Logout function to clear the JWT cookie
// logout concept in backend is removing the cookie with the jwt token, so the client will no longer have access to it and will be considered logged out.
const logout = (req, res) => {
  res.cookie("jwt", "", {
    expires: new Date(0), // Set the cookie to expire now
  });
  res.status(200).json({
    status: "success",
    message: "User logged out successfully",
  });
}

export { register, login, logout };