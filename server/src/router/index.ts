import express from "express";

import authentication from "./authentication";
import users from "./users";
import realEstate from "./realEstate";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  realEstate(router);

  return router;
};
