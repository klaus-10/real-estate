import mongoose from "mongoose";

// User Config
const ProfileSchema = new mongoose.Schema({
  device: { type: String, required: true },
  username: { type: String, required: true },
  superUser: { type: String, required: true },
});

export const ProfileModel = mongoose.model("Profile", ProfileSchema);

// User Actions
export const getProfiles = () => ProfileModel.find();
export const getProfileByDeviceAndUsername = (
  device: string,
  username: string,
  superUser: string
) =>
  ProfileModel.findOne({
    device: device,
    username: username,
    superUser: superUser,
  });
export const getProfileById = (id: string) => ProfileModel.findById(id);
export const createProfile = (values: Record<string, any>) =>
  new ProfileModel(values).save().then((profile) => profile.toObject());
export const deleteUserById = (id: string) =>
  ProfileModel.findOneAndDelete({ _id: id });
export const updateUserById = (id: string, values: Record<string, any>) =>
  ProfileModel.findByIdAndUpdate(id, values);
