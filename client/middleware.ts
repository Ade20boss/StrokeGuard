import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use only the edge-compatible authConfig here (no Prisma, no bcrypt).
// The full auth.ts with PrismaAdapter is used only in server-side pages/actions.
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
