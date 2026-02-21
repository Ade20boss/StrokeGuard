import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// GET /api/user/me — Return the current authenticated user's full profile
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      hasCompletedOnboarding: true,
      createdAt: true,
      healthProfile: {
        select: {
          dob: true,
          biologicalSex: true,
          height: true,
          weight: true,
          country: true,
          bloodPressure: true,
          hasDiabetes: true,
          smokes: true,
          activityLevel: true,
          updatedAt: true,
        },
      },
      emergencyContacts: {
        select: {
          id: true,
          name: true,
          phone: true,
          relationship: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

// PATCH /api/user/me — Update the user's name or image
export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, image } = body;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: { id: true, name: true, email: true, image: true },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("[PATCH /api/user/me]", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
