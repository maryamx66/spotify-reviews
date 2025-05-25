import jwt from "jsonwebtoken";

const jwt_secret = process.env.JWT_SECRET;

// Takes an object and returns a JWT (string)
export const create_jwt = (payload) => {
  return jwt.sign(payload, jwt_secret, {
    expiresIn: "7d",
  });
};

// Takes a JWT (string) and returns token data if valid, null if not
export const verify_jwt = (token) => {
  try {
    return jwt.verify(token, jwt_secret);
  } catch (_) {
    return null;
  }
};
