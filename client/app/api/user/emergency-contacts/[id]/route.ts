import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

const ContactUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().min(5).optional(),
  relationship: z.string().min(2).optional(),
});

// PATCH /api/user/emergency-contacts/[id] — Update an existing emergency contact
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = ContactUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Verify ownership before update
    const existing = await prisma.emergencyContact.findUnique({
      where: { id: params.id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const contact = await prisma.emergencyContact.update({
      where: { id: params.id },
      data: validated.data,
      select: { id: true, name: true, phone: true, relationship: true },
    });

    return NextResponse.json({ contact });
  } catch (error) {
    console.error("[PATCH /api/user/emergency-contacts/[id]]", error);
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 });
  }
}

// DELETE /api/user/emergency-contacts/[id] — Remove an emergency contact
export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Verify ownership before delete
    const existing = await prisma.emergencyContact.findUnique({
      where: { id: params.id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.emergencyContact.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/user/emergency-contacts/[id]]", error);
    return NextResponse.json({ error: "Failed to delete contact" }, { status: 500 });
  }
}
