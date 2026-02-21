import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const HealthProfileSchema = z.object({
  dob: z.string().optional().nullable(),
  biologicalSex: z.string().optional().nullable(),
  height: z.coerce.number().optional().nullable(),
  weight: z.coerce.number().optional().nullable(),
  country: z.string().optional().nullable(),
  bloodPressure: z.string().optional().nullable(),
  hasDiabetes: z.boolean().optional(),
  smokes: z.boolean().optional(),
  activityLevel: z.string().optional().nullable(),
});

// GET /api/user/health-profile — Fetch the current user's health profile
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.healthProfile.findUnique({
    where: { userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ profile: null }, { status: 200 });
  }

  return NextResponse.json({ profile });
}

// PUT /api/user/health-profile — Create or update health profile (upsert)
export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = HealthProfileSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { dob, biologicalSex, height, weight, country, bloodPressure, hasDiabetes, smokes, activityLevel } = validated.data;

    const profileData = {
      dob: dob ? new Date(dob) : null,
      biologicalSex: biologicalSex ?? undefined,
      height: height ?? undefined,
      weight: weight ?? undefined,
      country: country ?? undefined,
      bloodPressure: bloodPressure ?? undefined,
      hasDiabetes: hasDiabetes ?? undefined,
      smokes: smokes ?? undefined,
      activityLevel: activityLevel ?? undefined,
    };

    const profile = await prisma.healthProfile.upsert({
      where: { userId: session.user.id },
      update: profileData,
      create: { userId: session.user.id, ...profileData },
    });

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("[PUT /api/user/health-profile]", error);
    return NextResponse.json({ error: "Failed to save health profile" }, { status: 500 });
  }
}
