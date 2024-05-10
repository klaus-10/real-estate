import express from "express";
import { merge, get } from "lodash";

import { verifyJwtToken } from "../utils/jwt-token";

export const parseJwtToken = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.headers.authorization) return res.status(401).send("Unauthorized");
  const token = req.headers.authorization.includes("Bearer")
    ? req.headers.authorization.split(" ")[1]
    : req.headers.authorization;

  if (token == null) return res.sendStatus(401);

  try {
    const user = await verifyJwtToken(token);

    merge(req.body, { user: user });

    next();
  } catch (err) {
    return res.status(401).send("Token expires...");
  }
};
