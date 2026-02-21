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

    const { pulseRates, prvScore, isExercising, source, mode } = await req.json();

    if (!pulseRates || pulseRates.length < 30) {
      return NextResponse.json({ error: 'pulseRates must contain at least 30 readings' }, { status: 422 });
    }

    // Proxy request to the external StrokeGuard backend
    const backendRes = await fetch(`${EXTERNAL_API_URL}/api/v1/vitals/sync`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patient_id: session.user.id,
        mode: mode === 'ACTIVE' ? 'DEEP_SCAN' : 'QUICK_SCAN',
        pulse_rate_history: pulseRates,
        prv_score: prvScore ?? 0,
        aha_lifestyle_score: 50, // Should be fetched from profile ideally
        is_exercising: !!isExercising,
      }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("External Backend Error:", backendRes.status, errorText);
      return NextResponse.json({ error: 'Backend error' }, { status: backendRes.status });
    }

    const backendData = await backendRes.json();
    
    const triageStatus = backendData.status || 'GREEN'; // Python returns "status"
    let computedScore = 20;
    if (triageStatus === 'YELLOW') computedScore = 60;
    if (triageStatus === 'RED') computedScore = 90;

    // Calculate averages
    const avgPulseRate = pulseRates.reduce((a: number, b: number) => a + b, 0) / pulseRates.length;

    // ── Database Synchronization ──
    // Create a new MonitoringSession with the authoritative ML results
    const newSession = await prisma.monitoringSession.create({
      data: {
        userId: session.user.id,
        mode: mode === 'ACTIVE' ? 'ACTIVE' : 'QUICK_CHECK',
        triageStatus: triageStatus,
        backendSdnn: backendData.hrv || prvScore, // Python sends back calculated hrv
        finalScore: computedScore,
        alertFailure: backendData.alert_failure || false,
        aiAdvice: backendData.ai_coach || null, // Python returns ai_coach
        avgPulseRate,
        avgPrv: prvScore,
        // Insert raw readings as VitalSamples for local charts/auditing
        vitals: {
          create: pulseRates.map((pr: number) => ({
            pulseRate: pr,
            prvSdnn: prvScore ?? 0,
          })),
        }
      },
    });

    return NextResponse.json({ 
      success: true, 
      session_id: newSession.id,
      backend_data: backendData 
    });

  } catch (error) {
    console.error("Vitals sync API error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
