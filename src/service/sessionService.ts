import { FlattenMaps, FilterQuery, UpdateQuery } from "mongoose";
import config from "config";
import { get} from "lodash";
import { UserDocument } from "../model/userModel";
import Session, { SessionDocument } from "../model/sessionModel";
import { sign, decode } from "../utils/jwtUtils";
import { findUser } from "./userService";

export async function createSession(userId: string, userAgent: string) {
  try {
    const session = await Session.create({ user: userId, userAgent });
    return session.toJSON();
  } catch (error) {
    throw new Error(`Error creating session: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export function createAccessToken({
  user,
  session,
}: {
  user:
    | Omit<UserDocument, "password">
    | FlattenMaps<Omit<UserDocument, "password">>;
  session:
    | Omit<SessionDocument, "password">
    | FlattenMaps<Omit<SessionDocument, "password">>;
}) {
  try {
    // Build and return the new access token
    const accessToken = sign(
      { ...user, session: session._id },
      { expiresIn: config.get<string>("accessTokenTtl") }
    );

    return accessToken;
  } catch (error) {
    throw new Error(`Error creating access token: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  try {
    // Decode the refresh token
    const { decoded } = decode(refreshToken);

    // Ensure `decoded` is valid and has a session ID
    if (!decoded || typeof decoded !== "object" || !get(decoded, "_id")) {
      return false;
    }

    // Get the session
    const session = await Session.findById(get(decoded, "_id"));

    // Make sure the session is still valid
    if (!session || !session.valid) {
      return false;
    }

    // Find the user
    const user = await findUser({ _id: session.user });

    if (!user) {
      return false;
    }

    // Generate and return a new access token
    const accessToken = createAccessToken({ user: user as Omit<UserDocument, "password">, session });

    return accessToken;
  } catch (error) {
    throw new Error(`Error reissuing access token: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function updateSession(
  query: FilterQuery<SessionDocument>,
  update: UpdateQuery<SessionDocument>
) {
  try {
    return await Session.updateOne(query, update);
  } catch (error) {
    throw new Error(`Error updating session: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
  try {
    return await Session.find(query).lean();
  } catch (error) {
    throw new Error(`Error finding sessions: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
