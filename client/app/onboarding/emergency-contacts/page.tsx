import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import EmergencyContactsForm from "@/components/onboarding/EmergencyContactsForm";
import { redirect } from "next/navigation";

export default async function EmergencyContactsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const contacts = await prisma.emergencyContact.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  return <EmergencyContactsForm initialContacts={contacts.map(c => ({
    id: c.id,
    name: c.name,
    relationship: c.relationship,
    phone: c.phone,
    initials: c.name.split(" ").map(n => n[0]).join("").toUpperCase()
  }))} />;
}
