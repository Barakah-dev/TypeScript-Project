import { HydratedDocument, FilterQuery } from "mongoose";
import { omit } from "lodash";
import User, { UserDocument } from "../model/userModel";

export async function createUser(input: HydratedDocument<Omit<UserDocument, "createdAt" | "updatedAt">>) {
  try {
    return await User.create(input);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Error creating user: ${errorMessage}`);
  }
}

export async function findUser(query: FilterQuery<UserDocument>) {
  try {
    return await User.findOne(query).lean();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Error finding user: ${errorMessage}`);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: UserDocument["email"];
  password: string;
}) {
  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return false;
    }

    // Compare password
    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return false;
    }

    // Return user object without the password field
    return omit(user.toJSON(), "password") as Omit<UserDocument, "password">;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Error validating password: ${errorMessage}`);
  }
}
