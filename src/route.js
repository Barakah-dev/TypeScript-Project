"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const postController_1 = require("./controller/postController");
const userController_1 = require("./controller/userController");
const sessionController_1 = require("./controller/sessionController");
const middleware_1 = require("./middleware");
const userSchema_1 = require("./schema/userSchema");
const postSchema_1 = require("./schema/postSchema");
function default_1(app) {
    // Healthcheck route
    // app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
    // Register user route
    app.post("/api/users", (0, middleware_1.validateRequest)(userSchema_1.createUserSchema), userController_1.createUserHandler);
    // Login route
    app.post("/api/sessions", (0, middleware_1.validateRequest)(userSchema_1.createUserSessionSchema), sessionController_1.createUserSessionHandler);
    // Get the user's sessions (requires authentication)
    app.get("/api/sessions", middleware_1.requiresUser, sessionController_1.getUserSessionsHandler);
    // Logout route (requires authentication)
    app.delete("/api/sessions", middleware_1.requiresUser, sessionController_1.invalidateUserSessionHandler);
    // Create a post (requires authentication and validation)
    app.post("/api/posts", [middleware_1.requiresUser, (0, middleware_1.validateRequest)(postSchema_1.createPostSchema)], postController_1.createPostHandler);
    // Update a post (requires authentication and validation)
    app.put("/api/posts/:postId", [middleware_1.requiresUser, (0, middleware_1.validateRequest)(postSchema_1.updatePostSchema)], postController_1.updatePostHandler);
    // Get a specific post
    app.get("/api/posts/:postId", postController_1.getPostHandler);
    // Delete a post (requires authentication and validation)
    app.delete("/api/posts/:postId", [middleware_1.requiresUser, (0, middleware_1.validateRequest)(postSchema_1.deletePostSchema)], postController_1.deletePostHandler);
}
