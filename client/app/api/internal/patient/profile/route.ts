import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://127.0.0.1:8000';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch user and profile from Prisma to enrich the external API call
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        healthProfile: true,
        emergencyContacts: {
            orderBy: { createdAt: 'asc' },
            take: 1
        }
      }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // External API requires E.164. We do a basic cleanup + add country code if missing.
    let emergencyContact = "+10000000000"; // fallback
    if (user.emergencyContacts.length > 0) {
       const rawPhone = user.emergencyContacts[0].phone.replace(/\D/g, '');
       emergencyContact = rawPhone.startsWith('1') ? `+${rawPhone}` : `+1${rawPhone}`;
    }

    // Map HealthProfile to the new backend schema
    const age = user.healthProfile?.dob 
       ? new Date().getFullYear() - new Date(user.healthProfile.dob).getFullYear() 
       : 30; // default
       
    let historyStr = "None";
    if (user.healthProfile?.hasDiabetes && user.healthProfile?.smokes) historyStr = "Diabetes, Smokes";
    else if (user.healthProfile?.hasDiabetes) historyStr = "Diabetes";
    else if (user.healthProfile?.smokes) historyStr = "Smokes";
    
    const recentActivity = user.healthProfile?.activityLevel || "Sitting";

    // Register user on external backend
    const backendRes = await fetch(`${EXTERNAL_API_URL}/api/v1/patient/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: session.user.id,
        name: user.name || "Patient",
        age: age,
        history: historyStr,
        recent_activity: recentActivity,
        emergency_contact: emergencyContact,
      }),
    });

    if (!backendRes.ok) {
       console.error("External Backend Profile Sync Error:", backendRes.status, await backendRes.text());
       return NextResponse.json({ error: 'Backend error' }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    return NextResponse.json({ success: true, backend_profile: data });

  } catch (error) {
    console.error("Profile sync API error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
