import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://127.0.0.1:8000';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendRes = await fetch(`${EXTERNAL_API_URL}/api/v1/patient/${session.user.id}/status`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!backendRes.ok) {
        if(backendRes.status === 404) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }
        console.error("External Backend Status Error:", backendRes.status, await backendRes.text());
        return NextResponse.json({ error: 'Backend error' }, { status: backendRes.status });
    }

    const data = await backendRes.json();
    
    const triageStatus = data.status || 'GREEN'; // Python API returns "status"
    let computedScore = 20;
    if (triageStatus === 'YELLOW') computedScore = 60;
    if (triageStatus === 'RED') computedScore = 90;
    
    return NextResponse.json({
        triage_status: triageStatus,
        risk_score: computedScore,
        ai_advice: data.ai_advice || data.ai_coach || null,
        alert_failure: data.alert_failure || false,
        ui_action: data.ui_action || 'PASSIVE_MONITORING',
    });

  } catch (error) {
    console.error("Status API error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
