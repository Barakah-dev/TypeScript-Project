import { Express, Request, Response } from "express";
import {
  createPostHandler,
  updatePostHandler,
  getPostHandler,
  deletePostHandler,
} from "./controller/postController";
import { createUserHandler } from "./controller/userController";
import {
  createUserSessionHandler,
  invalidateUserSessionHandler,
  getUserSessionsHandler,
} from "./controller/sessionController";
import { validateRequest, requiresUser } from "./middleware";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/userSchema";
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
} from "./schema/postSchema";

export default function (app: Express) {
  // Healthcheck route
  // app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register user route
  app.post("/api/users", validateRequest(createUserSchema), createUserHandler);

  // Login route
  app.post(
    "/api/sessions",
    validateRequest(createUserSessionSchema),
    createUserSessionHandler
  );

  // Get the user's sessions (requires authentication)
  app.get("/api/sessions", requiresUser, getUserSessionsHandler);

  // Logout route (requires authentication)
  app.delete("/api/sessions", requiresUser, invalidateUserSessionHandler);

  // Create a post (requires authentication and validation)
  app.post(
    "/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post (requires authentication and validation)
  app.put(
    "/api/posts/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // Get a specific post
  app.get("/api/posts/:postId", getPostHandler);

  // Delete a post (requires authentication and validation)
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}
