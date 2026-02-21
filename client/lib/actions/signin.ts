"use server";

import { signIn as authSignIn } from "@/auth";
import { AuthError } from "next-auth";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    await authSignIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard", // Or wherever they should go if already onboarded
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials." };
        default:
          return { error: "Something went wrong." };
      }
    }
    throw error;
  }
}
