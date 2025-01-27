import jwt from "jsonwebtoken";
import config from "config";

const privateKey = config.get<string>("privateKey");

export function sign(object: Object, options?: jwt.SignOptions): string {
  return jwt.sign(object, privateKey, options);
}

export function decode(token: string) {
  try {
    const decoded = jwt.verify(token, privateKey);

    return { valid: true, expired: false, decoded };
  } catch (error) {
    if (error instanceof Error) {
      return {
        valid: false,
        expired: error.message === "jwt expired",
        decoded: null,
      };
    }

    return {
      valid: false,
      expired: false,
      decoded: null,
    };
  }
}

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import config from "config";

// const privateKey = config.get<string>("privateKey");

// export function authenticate(req: Request, res: Response, next: NextFunction) {
//   const token = req.header("Authorization")?.replace("Bearer ", "");

//   if (!token) {
//     return res.status(401).send({ message: "Access denied" });
//   }

//   try {
//     const decoded = jwt.verify(token, privateKey);
//     req.user = decoded; // Attach decoded token to the request object
//     next();
//   } catch (error) {
//     return res.status(400).send({ message: "Invalid token" });
//   }
// }

