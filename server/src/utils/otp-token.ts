import * as speakeasy from "speakeasy";

export const generateOTP = (): {
  secret: speakeasy.GeneratedSecret;
  token: string;
} => {
  // Generate a new secret
  const secret: speakeasy.GeneratedSecret = speakeasy.generateSecret({
    length: 20,
  });

  // To get the OTP token
  const token: string = speakeasy.totp({
    secret: secret.base32,
    encoding: "base32",
  });

  console.log("OTP token & secret:", token);

  return { secret, token };
};

export const verifyToken = (
  secret: speakeasy.GeneratedSecret,
  userToken: string
): boolean => {
  // You can verify the token later using the same secret
  return speakeasy.totp.verify({
    secret: secret.base32,
    encoding: "base32",
    token: userToken,
  });
};
