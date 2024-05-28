import express from "express";

import { deleteUserById, getUsers, getUserByUsername } from "../db/users";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  // #swagger.tags = ['users']
  // #swagger.summary = 'Get all users from db'
  // #swagger.description = 'Get all users from db'
  // #swagger.deprecated = false
  // #swagger.ignore = false
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  // #swagger.tags = ['users']
  // #swagger.summary = 'Delete sepcific user based on id'
  // #swagger.description = 'Delete sepcific user based on id''
  // #swagger.deprecated = false
  // #swagger.ignore = false

  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};

export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  // #swagger.tags = ['users']
  // #swagger.summary = 'Update sepcific user based on id'
  // #swagger.description = 'Update sepcific user based on id''
  // #swagger.deprecated = false
  // #swagger.ignore = false
  try {
    const { username, gamer } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserByUsername(username);

    user.username = username;
    user.profiles = [...user.profiles, gamer];
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
