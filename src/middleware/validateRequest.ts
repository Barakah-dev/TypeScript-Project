import { AnySchema } from "yup";
import { Request, Response, NextFunction } from "express";
import log from "../logger";

const validate = (schema: AnySchema) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      { abortEarly: false }
    );

    return next();
  } catch (error: any) {
    log.error("Validation error:", error);
    res.status(400).json({ errors: error.errors });
    return;
  }
};

export default validate;
