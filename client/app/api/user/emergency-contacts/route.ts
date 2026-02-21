import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(5, "Phone must be at least 5 characters"),
  relationship: z.string().min(2, "Relationship must be at least 2 characters"),
});

// GET /api/user/emergency-contacts — List all emergency contacts for the user
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.emergencyContact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, phone: true, relationship: true, createdAt: true },
  });

  return NextResponse.json({ contacts });
}

// POST /api/user/emergency-contacts — Add a new emergency contact
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = ContactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const contact = await prisma.emergencyContact.create({
      data: {
        userId: session.user.id,
        ...validated.data,
      },
      select: { id: true, name: true, phone: true, relationship: true, createdAt: true },
    });

    return NextResponse.json({ contact }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/user/emergency-contacts]", error);
    return NextResponse.json({ error: "Failed to add contact" }, { status: 500 });
  }
}
