const jwt = require("jsonwebtoken");

//generate a token for a specific user passed as input with an expiration time
export const generateAccessToken = (user: any): string => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};
export const generateRefreshToken = (user: any): string => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

export const verifyJwtToken = async (token: string): Promise<any> => {
  try {
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return user;
  } catch (err) {
    console.error("Token verification error:", err);
    throw new Error("Token verification failed");
  }
};
