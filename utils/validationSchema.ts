import { z } from "zod";

export const RoleEnum = z.enum(["USER", "ADMIN"]);



export const LoginSchema = z.object({
    email: z.string().email({message:"Email Invalid"}),
    password: z.string().min(7, { message: "Password must be at least 7 characters" }).max(12, { message: "Password must be maximum 12 characters" }),
})