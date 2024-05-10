import { Document } from "mongoose";

export interface User extends Document {
  email: string;
  username: string;
  name: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken: string;
  };
  dateRules?: string[];
  profiles?: any[];
  activated: Boolean;
}
