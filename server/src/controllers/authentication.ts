import express from "express";
const bycrypt = require("bcryptjs");

import {
  getUserByEmail,
  createUser,
  getUserByUsername,
  deleteUserById,
  deleteUserByEmail,
} from "../db/users";
import { generateOTP, verifyToken } from "../utils/otp-token";
import {
  addCacheValue,
  addStaticCacheValue,
  deleteCacheValue,
  getCacheValue,
} from "../utils/cache-op";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyJwtToken,
} from "../utils/jwt-token";
import { Profile } from "interfaces/db";
import { ProfileRequest } from "interfaces/request";
import { createProfile, getProfileByDeviceAndUsername } from "../db/profiles";
import { sendVerificationAccountEmail } from "../utils/email";

export const login = async (req: express.Request, res: express.Response) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'User login'
  // #swagger.description = 'User login'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select("+authentication.password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user.activated) {
      return res.status(404).send("User account not activated");
    }

    const validPass = await bycrypt.compare(
      password,
      user.authentication.password
    );
    if (!validPass) return res.status(400).send("Invalid password");

    // generate token
    const access_token = generateAccessToken({ username: user.username });
    const refresh_token = generateRefreshToken({ username: user.username });

    console.log(access_token);
    console.log(await verifyJwtToken(access_token));
    // res.cookie("auth_token", user.authentication.sessionToken, {
    //   domain: "localhost",
    //   path: "/",
    // });

    return res
      .status(200)
      .send({ access_token: access_token, refresh_token: refresh_token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const register = async (req: express.Request, res: express.Response) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'User registration'
  // #swagger.description = 'User registration'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  let { email, password, username } = req.body;
  try {
    if (!email || !password || !username) {
      return res.status(400).send("email || pw || usenrame incorrect");
    }
    email = email.toLowerCase();
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).send("User registered");
    }

    const existingUserByUsername = await getUserByUsername(username);

    if (existingUserByUsername) {
      return res.status(400).send("Username already exist");
    }

    const salt = await bycrypt.genSalt(10);
    const hashPassword = await bycrypt.hash(password, salt);

    let user = await createUser({
      email,
      username,
      authentication: {
        password: hashPassword,
      },
    });

    // const access_token = generateAccessToken({ username: user.username });
    // const refresh_token = generateRefreshToken({ username: user.username });

    // save token into cache

    // enable https
    // res.cookie("auth_token", user.authentication.sessionToken, {
    //   domain: "localhost",
    //   path: "/",
    // });

    // generate token
    let { secret, token } = generateOTP();

    // add to cache
    addStaticCacheValue(username, secret);

    // send validation email
    await sendVerificationAccountEmail(email, token);

    return res.status(200).send({ status: 200, message: "ok" });
  } catch (error) {
    console.log(error);

    // delete user
    await deleteUserByEmail(email);

    // delete token
    await deleteCacheValue(username);

    return res.sendStatus(500);
  }
};

export const validateAccount = async (
  req: express.Request,
  res: express.Response
) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'User validate account'
  // #swagger.description = 'User validate account after registration'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  try {
    const { username, email, otp_token } = req.body;

    const existingUser = await getUserByUsername(username);

    if (!existingUser || existingUser?.email != email) {
      return res
        .status(400)
        .send({ status: 400, message: "User not registered or email wrong" });
    }

    if (existingUser.activated)
      return res
        .status(400)
        .send({ status: 400, message: "User already registered" });

    if (!getCacheValue(username) == otp_token)
      return res.status(400).send("Token not valid");

    existingUser.activated = true;

    existingUser.save();

    return res.status(200).send({ status: 200, message: "ok" });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export const resendRegisterEmail = async (
  req: express.Request,
  res: express.Response
) => {
  // const { email } = req.body;
  // try {
  //   const existingUser = await getUserByEmail(email);
  //   if(!existingUser || existingUser.activated) return res.status(400).send("User not registered or already activated");
  //   // send validation email
  //   await sendVerificationAccountEmail(email, token);
  //   return res
  //     .status(200)
  //     .send({ access_token: access_token, refresh_token: refresh_token });
  // } catch(error) {
  //   console.log(error);
  //   return res.sendStatus(500);
  // }
};

export const askAssociationUserWithWindowsProfile = async (
  req: express.Request,
  res: express.Response
) => {
  // #swagger.tags = ['auth']
  // #swagger.summary = 'User request profile creation'
  // #swagger.description = 'User request profile creation with the generation of otp token to insert inside the windows/xbox profile account'
  // #swagger.deprecated = false
  // #swagger.ignore = false

  try {
    // retrive username from jwtToken or from the generated token (da decidere)
    // let username = req.body.user;
    const { username } = req.body.user;

    // console.log("username: ", username);
    // console.log("body: ", req);

    // generate token
    let { secret, token } = generateOTP();

    // save secret to cache
    // console.log("Add to cache");
    addCacheValue(username + "_profile", secret);
    // console.log("Added...");

    // send token to the user -> the token stored should be with the user to associate
    return res.status(200).send({ otp_token: token });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const associateUserWithWindowsProfile = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    let { token, device, profileUsername, dateRules } = req.body;
    let { username } = req.body.user;
    const user = await getUserByUsername(username);

    if (!user) {
      return res.status(404).send("User not found...");
    }

    let secret = await getCacheValue(username + "_profile");

    if (!secret) {
      return res.status(500).send("Profile token expired...");
    }

    if (!verifyToken(secret, token)) {
      return res.status(500).send("Token wrong...");
    }

    // check profile
    const profileExist = await getProfileByDeviceAndUsername(
      device,
      profileUsername,
      username
    );

    if (profileExist) return res.status(404).send("Profile already registered");

    const profile: ProfileRequest = {
      device: device,
      username: profileUsername,
      dateRules: dateRules,
      admin: username,
    };
    const profileDb = await createProfile(profile);
    user.profiles.push(profileDb._id);
    await user.save();

    return res.status(200).send({ status: 200, message: "ok" });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};
