import { get } from "lodash";
import { Request, Response, NextFunction } from "express";

const requiresUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const user = get(req, "user");

  if (!user) {
    res.sendStatus(403);
    return;
  }

  return next();
};

export default requiresUser;
