import { z } from "zod";

export const RoleEnum = z.enum(["STUDENT", "TEACHER"]);

export const SignUpSchema= z.object({
    email: z.string().email({message:"Invalid Email"}),
    password: z.string().min(5, { message: "Password must be at least 5 characters" }).max(10, { message: "Password must be maximum 10 characters" }),
 role:RoleEnum
})

export const LoginSchema = z.object({
    email: z.string().email({message:"Invalid Email"}),
    password: z.string().min(5, { message: "Password must be at least 5 characters" }).max(10, { message: "Password must be maximum 10 characters" }),
})