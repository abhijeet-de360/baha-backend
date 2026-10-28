import jwt from "jsonwebtoken";

interface JWTPayload {
  _id: string;
  type: string;
}

// Generate JWT token function
export function generateJWTToken(
  payload: JWTPayload,
  expiresIn: number | string = "365d",
) {
  const token = jwt.sign(payload, process.env.BH_JWT_SECRET as string, {
    expiresIn: expiresIn as any,
  });
  return token;
}

// Verify JWT token function
export function verifyJWTToken(token: string) {
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.BH_JWT_SECRET as string,
    ) as JWTPayload;
    return decodedToken;
  } catch (error) {
    throw error;
  }
}
