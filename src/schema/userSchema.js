"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserSessionSchema = exports.createUserSchema = void 0;
const yup_1 = require("yup");
// Schema for user creation
exports.createUserSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        name: (0, yup_1.string)()
            .required("Name is required")
            .max(50, "Name should not exceed 50 characters"),
        password: (0, yup_1.string)()
            .required("Password is required")
            .min(6, "Password is too short - should be at least 6 characters.")
            .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters, numbers, and certain special characters (_ . -)."),
        passwordConfirmation: (0, yup_1.string)()
            .required("Password confirmation is required")
            .oneOf([(0, yup_1.ref)("password")], "Passwords must match"),
        email: (0, yup_1.string)()
            .required("Email is required")
            .email("Must be a valid email address"),
    }),
});
// Schema for user session (login)
exports.createUserSessionSchema = (0, yup_1.object)({
    body: (0, yup_1.object)({
        email: (0, yup_1.string)()
            .required("Email is required")
            .email("Must be a valid email address"),
        password: (0, yup_1.string)()
            .required("Password is required")
            .min(6, "Password is too short - should be at least 6 characters.")
            .matches(/^[a-zA-Z0-9_.-]*$/, "Password can only contain Latin letters, numbers, and certain special characters (_ . -)."),
    }),
});
