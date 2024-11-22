
import { get } from "lodash";
import { Request, Response, NextFunction } from "express";
import { decode } from "../utils/jwtUtils";
import { reIssueAccessToken } from "../service/sessionService";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, "headers.x-refresh");

  if (!accessToken) return next();

  const { decoded, expired } = decode(accessToken);

  if (decoded) {
    req.user = decoded;
    return next();
  }

  if (expired && typeof refreshToken === "string") {
    try {
      const newAccessToken = await reIssueAccessToken({ refreshToken });

      if (newAccessToken) {
        res.setHeader("x-access-token", newAccessToken);

        const { decoded } = decode(newAccessToken);
        req.user = decoded;
      }
    } catch (error) {
      res.status(500).send({ message: "Could not refresh token." });
      return;
    }
    return next();
  }

  res.status(401).send({ message: "Unauthorized" });
  return;
};

export default deserializeUser;

