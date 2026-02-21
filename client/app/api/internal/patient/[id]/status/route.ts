import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL || 'http://127.0.0.1:8000';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    // Security check: only allow fetching own status
    if (!session?.user?.id || session.user.id !== params.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const backendRes = await fetch(`${EXTERNAL_API_URL}/api/v1/patient/${params.id}/status`, {
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
    
    // The BFF simply proxies the calculated state down to the UI.
    return NextResponse.json(data);

  } catch (error) {
    console.error("Status API error:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
