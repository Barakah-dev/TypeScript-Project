import mongoose, { Model, Document, Types } from "mongoose";
import bcrypt from "bcrypt";
import config from "config";

// Extend the Mongoose Document type to include the comparePassword method
export interface UserDocument extends Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the schema for the User model
const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Pre-save hook to hash the password before saving
UserSchema.pre("save", async function (this: UserDocument) {
  // Cast `this` to UserDocument
  const user = this;

  // Only hash the password if it has been modified
  if (!user.isModified("password")) return;

  const saltWorkFactor = config.get<number>("saltWorkFactor");
  const salt = await bcrypt.genSalt(saltWorkFactor);
  user.password = await bcrypt.hash(user.password, salt);
});

// Define the comparePassword instance method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;
  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

// Create the User model with the UserDocument type
const User: Model<UserDocument> = mongoose.model<UserDocument>("User", UserSchema);

export default User;
