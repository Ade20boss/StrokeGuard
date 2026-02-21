import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// POST /api/user/onboarding/complete — Mark user onboarding as finished
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { hasCompletedOnboarding: true },
      select: { id: true, hasCompletedOnboarding: true },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("[POST /api/user/onboarding/complete]", error);
    return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
  }
}
