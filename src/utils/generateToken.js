import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  const payload = { id: userId };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  //////////////////////////////////////////////
  // Set token in HTTP-only cookie>> why? 
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict",
    maxAge: (1000 * 60 * 60 * 24)*7, // 7 days 
  })
  return token;
}