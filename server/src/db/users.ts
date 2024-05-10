import mongoose, { Schema } from "mongoose";
import { User, Profile } from "interfaces/db/index";

// User Config
const UserSchema: Schema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    sessionToken: { type: String, select: false },
  },
  // users: { type: [GamerModel.schema], required: false },
  dateRules: { type: Array<String>, required: false },
  profiles: { type: Array<Profile>, required: false },
  activated: { type: Boolean, required: false, default: false },
});

export const UserModel = mongoose.model<User>("User", UserSchema);

// User Actions
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByUsername = (username: string) =>
  UserModel.findOne({ username });
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });
export const deleteUserByEmail = (email: string) =>
  UserModel.findOneAndDelete({ email: email });
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
