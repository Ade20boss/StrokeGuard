import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://127.0.0.1:8000';

// Registers / refreshes the patient's profile on the Python backend.
// Called automatically before a sync if the backend returns 404.
async function ensurePatientProfile(sessionUserId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: sessionUserId },
    include: {
      healthProfile: true,
      emergencyContacts: { orderBy: { createdAt: 'asc' }, take: 1 },
    },
  });

  if (!user) return;

  let emergencyContact = '+10000000000';
  if (user.emergencyContacts.length > 0) {
    const rawPhone = user.emergencyContacts[0].phone.replace(/\D/g, '');
    emergencyContact = rawPhone.startsWith('1') ? `+${rawPhone}` : `+1${rawPhone}`;
  }

  const age = user.healthProfile?.dob
    ? new Date().getFullYear() - new Date(user.healthProfile.dob).getFullYear()
    : 30;
  const hasDiabetes = user.healthProfile?.diabetesStatus === 'yes';
  const smokes = user.healthProfile?.smokingStatus === 'active';
  let historyStr = 'None';
  if (hasDiabetes && smokes) historyStr = 'Diabetes, Smokes';
  else if (hasDiabetes) historyStr = 'Diabetes';
  else if (smokes) historyStr = 'Smokes';

  await fetch(`${EXTERNAL_API_URL}/api/v1/patient/profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      patient_id: sessionUserId,
      name: user.name || 'Patient',
      age,
      history: historyStr,
      recent_activity: user.healthProfile?.activityLevel || 'Sitting',
      emergency_contact: emergencyContact,
    }),
  });
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      pulseRates, prvScore, isExercising, source, mode, lifestyleScore, 
      finalRiskScore, riskLevel, systolic, diastolic, latitude, longitude 
    } = await req.json();
    console.log('>>> INTERNAL SYNC START:', { pulseRatesCount: pulseRates?.length, prvScore, mode });

    if (!pulseRates || pulseRates.length < 30) {
      console.warn('>>> INTERNAL SYNC REJECTED: Not enough readings', pulseRates?.length);
      return NextResponse.json({ error: 'pulseRates must contain at least 30 readings' }, { status: 422 });
    }

    const syncPayload = {
      patient_id: session.user.id,
      mode: mode === 'ACTIVE' ? 'DEEP_SCAN' : 'QUICK_SCAN',
      pulse_rate_history: pulseRates,
      prv_score: prvScore ?? 0,
      aha_lifestyle_score: lifestyleScore ?? 50,
      is_exercising: !!isExercising,
      final_risk_score: finalRiskScore,
      systolic: systolic ?? 120,
      diastolic: diastolic ?? 80,
      latitude: latitude ?? null,
      longitude: longitude ?? null,
    };

    // Proxy request to the external StrokeGuard backend
    let backendRes = await fetch(`${EXTERNAL_API_URL}/api/v1/vitals/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syncPayload),
    });

    // ── Auto-register profile on 404 and retry ──────────────────────────────
    // This handles fresh sessions/reloads where the Python backend hasn't
    // seen this patient yet (its SQLite DB was cleared or this is a new server).
    // We auto-register the profile and immediately retry the sync.
    if (backendRes.status === 404) {
      console.warn(`>>> SYNC 404 for patient ${session.user.id} — auto-registering profile and retrying…`);
      await ensurePatientProfile(session.user.id);

      backendRes = await fetch(`${EXTERNAL_API_URL}/api/v1/vitals/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(syncPayload),
      });
    }

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error('External Backend Error:', backendRes.status, errorText);
      return NextResponse.json({ error: 'Backend error' }, { status: backendRes.status });
    }

    const backendData = await backendRes.json();
    
    // Map risk level to triage status if not provided by backend
    let triageStatus = backendData.status || 'GREEN';
    if (riskLevel === 'High Risk') triageStatus = 'RED';
    else if (riskLevel === 'Medium Risk') triageStatus = 'YELLOW';
    else if (riskLevel === 'Low Risk') triageStatus = 'GREEN';

    const computedScore = finalRiskScore ?? (triageStatus === 'RED' ? 20 : triageStatus === 'YELLOW' ? 50 : 85);

    // Calculate averages
    const avgPulseRate = pulseRates.reduce((a: number, b: number) => a + b, 0) / pulseRates.length;

    // ── Database Synchronization ──
    const newSession = await prisma.monitoringSession.create({
      data: {
        userId: session.user.id,
        mode: mode === 'ACTIVE' ? 'ACTIVE' : 'QUICK_CHECK',
        triageStatus: triageStatus,
        backendSdnn: backendData.hrv || prvScore,
        finalScore: computedScore,
        alertFailure: backendData.alert_failure || false,
        aiAdvice: backendData.ai_coach || null,
        avgPulseRate,
        avgPrv: prvScore,
        vitals: {
          create: pulseRates.map((pr: number) => ({
            pulseRate: pr,
            prvSdnn: prvScore ?? 0,
          })),
        }
      },
    });

    console.log('>>> PRISMA SESSION CREATED:', newSession.id, { triageStatus, finalScore: computedScore });
    revalidatePath('/dashboard');

    return NextResponse.json({ 
      success: true, 
      session_id: newSession.id,
      backend_data: backendData 
    });

  } catch (error) {
    console.error('Vitals sync API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
