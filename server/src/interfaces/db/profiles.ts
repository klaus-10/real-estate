import { Document } from "mongoose";

export interface Profile extends Document {
  device: string;
  username: string;
  dateRules?: string[];
  superUser: string;
  // gameTime: string;
  // gameCredit: string;
  // enabled: Boolean;
}
