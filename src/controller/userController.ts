import { Request, Response } from "express";
import { omit } from "lodash";
import { createUser } from "../service/userService";
import log from "../logger";

export async function createUserHandler(req: Request, res: Response): Promise<void> {
  try {
    const user = await createUser(req.body);
    res.send(omit(user.toJSON(), "password"));
  } catch (e: unknown) {
    if (e instanceof Error) {
      log.error(e);
      res.status(409).send(e.message);
    } else {
      log.error('An unexpected error occurred');
      res.status(500).send('An unexpected error occurred');
    }
  }
}
