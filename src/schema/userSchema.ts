import { object, string, ref } from "yup";

// Schema for user creation
export const createUserSchema = object({
  body: object({
    name: string()
      .required("Name is required")
      .max(50, "Name should not exceed 50 characters"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be at least 6 characters.")
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "Password can only contain Latin letters, numbers, and certain special characters (_ . -)."
      ),
    passwordConfirmation: string()
      .required("Password confirmation is required")
      .oneOf([ref("password")], "Passwords must match"),
    email: string()
      .required("Email is required")
      .email("Must be a valid email address"),
  }),
});

// Schema for user session (login)
export const createUserSessionSchema = object({
  body: object({
    email: string()
      .required("Email is required")
      .email("Must be a valid email address"),
    password: string()
      .required("Password is required")
      .min(6, "Password is too short - should be at least 6 characters.")
      .matches(
        /^[a-zA-Z0-9_.-]*$/,
        "Password can only contain Latin letters, numbers, and certain special characters (_ . -)."
      ),
  }),
});
