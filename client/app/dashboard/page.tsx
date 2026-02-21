import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      hasCompletedOnboarding: true,
      healthProfile: {
        select: {
          bloodPressure: true,
          hasDiabetes: true,
          smokes: true,
          activityLevel: true,
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
      monitoringSessions: {
        orderBy: { startedAt: "desc" },
        take: 30, // Fetch the last 30 sessions for history and streak logic
        select: {
          id: true,
          mode: true,
          startedAt: true,
          finalScore: true,
          avgPulseRate: true,
          avgPrv: true,
          triageStatus: true,
          alertFailure: true,
          aiAdvice: true,
        },
      },
    },
  });

  if (!user?.hasCompletedOnboarding) {
    redirect("/onboarding/health-profile");
  }

  return (
    <DashboardClient
      userName={user?.name || "User"}
      emergencyContacts={user?.emergencyContacts ?? []}
      healthProfile={user?.healthProfile ?? null}
      monitoringSessions={(user?.monitoringSessions as any) ?? []}
    />
  );
}
