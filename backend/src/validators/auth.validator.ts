import { z } from "zod";

// Signup schema
export const registerUserSchema = z.object({
    username: z
        .string("Username is required")
        .trim()
        .min(1, "Username is required")
        .min(3, "Username must be at least 3 characters long.")
        .max(30, "Username cannot exceed 30 characters.")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores.")
        .toLowerCase(),
    // name: z.object({
    //     first: z
    //         .string("First name is required")
    //         .trim()
    //         .min(3, "First name must be at least 3 characters long.")
    //         .max(20, "First name cannot exceed 20 characters.")
    //         .toLowerCase(),
    //     last: z
    //         .string()
    //         .trim()
    //         .min(3, "Last name must be at least 3 characters long.")
    //         .max(20, "Last name cannot exceed 20 characters.")
    //         .toLowerCase()
    //         .optional(),
    // }),
    firstName: z
        .string("First name is required")
        .trim()
        .min(1, "First name is required")
        .min(3, "First name must be at least 3 characters long.")
        .max(20, "First name cannot exceed 20 characters.")
        .toLowerCase(),
    lastName: z
        .string()
        .trim()
        .min(3, "Last name must be at least 3 characters long.")
        .max(20, "Last name cannot exceed 20 characters.")
        .toLowerCase()
        .optional(),
    gender: z.enum(
        ["male", "female", "custom"],
        "Selection must be either male, female, or custom",
    ),
    dob: z
        .string("DOB is required")
        .trim()
        .min(1, "DOB is required")
        .regex(/^\d{4}-\d{2}-\d{2}$/, "DOB must be in YYYY-MM-DD format"),
    email: z
        .string("Email is required")
        .trim()
        .min(1, "Email is required")
        .email("Invalid email")
        .toLowerCase(),
    mobileNumber: z
        .string()
        .transform((val) => val.replace(/\s+/g, ""))
        .refine((val) => {
            return /^(?:\+91|91|0)?[6-9]\d{9}$/.test(val);
        }, "Invalid Indian mobile number")
        .optional(),
    password: z
        .string("Password is required")
        .trim()
        .min(1, "Password is required")
        .min(8, "Password must be at least 8 characters long.")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[^A-Za-z0-9]/, "Must contain a special character"),
});
