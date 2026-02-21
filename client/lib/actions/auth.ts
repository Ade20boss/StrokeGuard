"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const SignUpSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function signUp(formData: FormData) {
  const validatedFields = SignUpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { fullName, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: {
        name: fullName,
        email,
        password: hashedPassword,
      },
    });
  } catch (error: any) {
    console.error("DEBUG: Prisma error during user creation:", error);
    if (error.code === "P2002") {
      return { error: { email: ["Email already in use"] } };
    }
    return { error: { message: "Something went wrong. Please try again." } };
  }

  try {
    console.log("DEBUG: Attempting signIn for email:", email);
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/onboarding/health-profile",
    });
  } catch (error) {
    console.error("DEBUG: Error during signIn:", error);
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: { message: "Invalid credentials." } };
        default:
          return { error: { message: "Something went wrong." } };
      }
    }
    // Re-throw the error so Next.js can handle redirects
    throw error;
  }
}
