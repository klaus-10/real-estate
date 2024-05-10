import express from "express";

import {
  login,
  register,
  validateAccount,
  askAssociationUserWithWindowsProfile,
  associateUserWithWindowsProfile,
} from "../controllers/authentication";
import { parseJwtToken } from "../middlewares";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/validateAccount", validateAccount);
  // router.post("/auth/resendRegisterEmail", resendRegisterEmail);
  router.post("/auth/login", login);
  router.get(
    "/auth/otp-request",
    parseJwtToken,
    askAssociationUserWithWindowsProfile
  );
  router.post(
    "/auth/otp-associate",
    parseJwtToken,
    associateUserWithWindowsProfile
  );
};
