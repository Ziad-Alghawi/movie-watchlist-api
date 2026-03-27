import jwt from "jsonwebtoken";
import { prisma } from "../config/db.js";

// Read the Token from the request 
// check if toke is valid
//next only for middleware to pass control to the next middleware or route handler if authentication is successful
export const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer") ){
    token = req.headers.authorization.split(" ")[1]; // [0, 1] so the token is the second part after "Bearer"
  }
  else if (req.cookies?.jwt){
    token = req.cookies.jwt;
  }

  if(!token){
    return res.status(401).json({ error: "Not authorized, no token" });
  }

  try {
    //verify token and extract user id from it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ error: "User no longer exists" });
    }

    req.user = user;// Attach user to the request object for use in route handlers
    next(); 
  } catch (err) {
    return res.status(401).json({ error: "Not authorized, token failed" });
  }
}