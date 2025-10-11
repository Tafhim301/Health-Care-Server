import jwt, { SignOptions, Secret } from "jsonwebtoken";

const generateToken = (payload: any, secret: Secret, expiresIn: string) => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn: expiresIn,
  } as SignOptions);

  return token;
};

export const jwtHelper = {
  generateToken,
};
