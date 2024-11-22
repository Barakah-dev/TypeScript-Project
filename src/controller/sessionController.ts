import config from "config";
import { get } from "lodash";
import { UserDocument } from "../model/userModel";
import { Request, Response } from "express";
import { validatePassword } from "../service/userService";
import {
  createSession,
  createAccessToken,
  updateSession,
  findSessions,
} from "../service/sessionService";
import { sign } from "../utils/jwtUtils";

export async function createUserSessionHandler(req: Request, res: Response): Promise<void> {
  try {
    // Validate the email and password
    const user = await validatePassword(req.body);

    if (!user) {
      res.status(401).send("Invalid username or password");
      return;
    }

    const userId = user._id.toString();

    // Create a session
    const session = await createSession(userId, req.get("user-agent") || "");

    // Create access token
    const accessToken = createAccessToken({ user, session });

    // Create refresh token
    const refreshToken = sign(session, {
      expiresIn: config.get("refreshTokenTtl"),
    });

    // Send refresh & access token back
    res.send({ accessToken, refreshToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while creating the session");
  }
}

export async function invalidateUserSessionHandler(req: Request, res: Response): Promise<void> {
  try {
    const sessionId = get(req, "user.session");

    if (!sessionId) {
      res.status(400).send("Session ID is missing");
      return;
    }

    // Invalidate the session
    await updateSession({ _id: sessionId }, { valid: false });

    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while invalidating the session");
  }
}

export async function getUserSessionsHandler(req: Request, res: Response): Promise<void> {
  try {
    const userId = get(req, "user._id");

    if (!userId) {
      res.status(400).send("User ID is missing");
      return;
    }

    // Find active sessions for the user
    const sessions = await findSessions({ user: userId, valid: true });

    if (!sessions.length) {
      res.status(404).send("No active sessions found");
      return;
    }

    res.send(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching sessions");
  }
}
