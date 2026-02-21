"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const HealthProfileSchema = z.object({
  dob: z.string().optional(),
  biologicalSex: z.string().optional(),
  height: z.coerce.number().optional(),
  weight: z.coerce.number().optional(),
  country: z.string().optional(),
});

const RiskAssessmentSchema = z.object({
  bloodPressure: z.string().optional(),
  hasDiabetes: z.coerce.boolean().optional(),
  smokes: z.coerce.boolean().optional(),
  activityLevel: z.string().optional(),
});

export async function saveHealthProfile(formData: FormData) {
  const session = await auth();
  console.log("Session in saveHealthProfile:", JSON.stringify(session, null, 2));
  
  if (!session?.user?.id) {
    console.error("No session user ID found in saveHealthProfile");
    return { error: "You must be logged in." };
  }

  const payload = Object.fromEntries(formData.entries());
  console.log("Health Profile payload received:", payload);

  const validatedFields = HealthProfileSchema.safeParse(payload);

  if (!validatedFields.success) {
    console.error("Validation failed in saveHealthProfile:", validatedFields.error);
    return { error: "Invalid fields provided." };
  }

  const { dob, biologicalSex, height, weight, country } = validatedFields.data;

  try {
    console.log("Upserting health profile for user:", session.user.id);
    const result = await prisma.healthProfile.upsert({
      where: { userId: session.user.id },
      update: {
        dob: dob ? new Date(dob) : null,
        biologicalSex,
        height,
        weight,
        country,
      },
      create: {
        userId: session.user.id,
        dob: dob ? new Date(dob) : null,
        biologicalSex,
        height,
        weight,
        country,
      },
    });
    console.log("Upsert result:", JSON.stringify(result, null, 2));
  } catch (error: any) {
    console.error("Prisma error in saveHealthProfile:", error);
    return { error: "Failed to save health profile: " + error.message };
  }

  revalidatePath("/onboarding/health-profile");
  redirect("/onboarding/emergency-contacts");
}

export async function saveRiskAssessment(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in." };
  }

  const validatedFields = RiskAssessmentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return { error: "Invalid fields provided." };
  }

  const { bloodPressure, hasDiabetes, smokes, activityLevel } = validatedFields.data;

  try {
    await prisma.healthProfile.update({
      where: { userId: session.user.id },
      data: {
        bloodPressure,
        hasDiabetes: !!hasDiabetes,
        smokes: !!smokes,
        activityLevel,
      },
    });
  } catch (error) {
    return { error: "Failed to save risk assessment." };
  }

  revalidatePath("/onboarding/risk-assessment");
  redirect("/onboarding/smartwatch-pairing");
}

const ContactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  relationship: z.string().min(2),
});

export async function addEmergencyContact(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const validated = ContactSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validated.success) return { error: "Invalid data" };

  try {
    await prisma.emergencyContact.create({
      data: {
        userId: session.user.id,
        ...validated.data,
      },
    });
    revalidatePath("/onboarding/emergency-contacts");
    revalidatePath("/dashboard");
    revalidatePath("/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to add contact" };
  }
}

export async function deleteEmergencyContact(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  try {
    await prisma.emergencyContact.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/onboarding/emergency-contacts");
    revalidatePath("/dashboard");
    revalidatePath("/contacts");
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete contact" };
  }
}

export async function finalizeOnboarding() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { hasCompletedOnboarding: true },
  });

  redirect("/dashboard");
}
