import express from "express";

import { getAllUsers, deleteUser, updateUser } from "../controllers/users";
import { parseJwtToken } from "../middlewares";

export default (router: express.Router) => {
  // #swagger.tags = ['Users']
  router.get("/users", parseJwtToken, getAllUsers);
  router
    .route("/users/:id") // Include the base path in the route
    .all(parseJwtToken)
    .delete(deleteUser)
    .put(updateUser);
};
