/**
 * Stroke Risk Score Logic
 * Based on American Heart Association (AHA) Life's Essential 8
 * and real-time rPPG (remote photoplethysmography) metrics.
 *
 * Score Scaling: 100 = Perfect Health, 0 = Highest Risk.
 */

export interface AHABaseline {
  bloodPressure: string;
  diabetesStatus: string; // 'no' | 'unsure' | 'yes'
  smokingStatus: string;  // 'never' | 'former' | 'active'
  familyHistory: string;  // 'no' | 'unsure' | 'yes'
  activityLevel: string;  // '5+' | '3-4' | '1-2' | '0'
}

export interface WebcamMetrics {
  pulseRate: number;
  sdnnMs: number;
  pulseRateHistory: number[];
  isExercising: boolean;
}

// ─── PART 1: AHA LIFESTYLE SCORE (60% weight) ────────────────────────────────

export function calculateAHAScore(answers: AHABaseline): number {
  let score = 0;

  // 1. Blood Pressure (25 pts)
  const bp = parseBP(answers.bloodPressure);
  if (!bp) {
    score += 12; // Unknown — neutral fallback
  } else {
    const { systolic, diastolic } = bp;
    if (systolic < 120 && diastolic < 80)      score += 25;
    else if (systolic < 130 && diastolic < 80) score += 18;
    else if (systolic < 140 || diastolic < 90) score += 10;
    else                                       score += 0;
  }

  // 2. Smoking (15 pts)
  if      (answers.smokingStatus === 'never')   score += 15;
  else if (answers.smokingStatus === 'former')  score += 9;
  else                                          score += 0;

  // 3. Diabetes (10 pts)
  if      (answers.diabetesStatus === 'no')     score += 10;
  else if (answers.diabetesStatus === 'unsure') score += 6;
  else                                          score += 0;

  // 4. Family History (5 pts)
  if      (answers.familyHistory === 'no')      score += 5;
  else if (answers.familyHistory === 'unsure')  score += 3;
  else                                          score += 1;

  // 5. Physical Activity (5 pts)
  if      (answers.activityLevel === '5+')      score += 5;
  else if (answers.activityLevel === '3-4')     score += 4;
  else if (answers.activityLevel === '1-2')     score += 2;
  else                                          score += 0;

  return Math.min(60, score);
}

/**
 * FIX: parseBP previously returned { systolic: NaN, diastolic: NaN } for
 * inputs like "120/", "/80", "120/ ", or " / ". Any NaN in the BP object
 * poisoned the entire score chain via NaN + number = NaN.
 *
 * Now returns null for ANY input that doesn't produce two finite integers,
 * which causes calculateAHAScore to use the safe neutral fallback (12 pts).
 */
function parseBP(bpStr: string | null | undefined): { systolic: number; diastolic: number } | null {
  if (!bpStr || typeof bpStr !== 'string') return null;

  const parts = bpStr.split('/');
  if (parts.length !== 2) return null;

  const systolic = parseInt(parts[0].trim(), 10);
  const diastolic = parseInt(parts[1].trim(), 10);

  // Guard: reject NaN, Infinity, or physiologically impossible values
  if (
    !Number.isFinite(systolic) ||
    !Number.isFinite(diastolic) ||
    systolic < 50 || systolic > 300 ||
    diastolic < 30 || diastolic > 200
  ) {
    return null;
  }

  return { systolic, diastolic };
}

// ─── PART 2: REAL-TIME WEBCAM SCORE (40% weight) ─────────────────────────────

// Signal A: Pulse Rate Score (15 pts)
export function scorePulseRate(pulseRate: number, isExercising: boolean): number {
  // FIX: guard against NaN / undefined before any comparison
  if (!Number.isFinite(pulseRate)) return 8; // neutral fallback

  if (isExercising) return 10;

  if      (pulseRate >= 55 && pulseRate <= 75)  return 15; // Optimal
  else if (pulseRate > 75 && pulseRate <= 85)   return 11; // Normal
  else if (pulseRate > 85 && pulseRate <= 100)  return 6;  // Elevated
  else if (pulseRate > 100)                     return 0;  // Tachycardia
  else                                          return 8;  // Bradycardia / low
}

// Signal B: PRV / SDNN Score (20 pts)
export function scorePRV(sdnnMs: number): number {
  // FIX: guard against NaN / undefined
  if (!Number.isFinite(sdnnMs) || sdnnMs < 0) return 10; // neutral fallback

  if      (sdnnMs >= 80)               return 20; // Excellent
  else if (sdnnMs >= 50)               return 16; // Healthy
  else if (sdnnMs >= 35)               return 11; // Borderline high
  else if (sdnnMs >= 20)               return 6;  // Borderline low
  else if (sdnnMs > 0 && sdnnMs < 20)  return 0;  // At risk
  else                                 return 10; // Zero / no data
}

// Signal C: Pulse Rate Stability Score (5 pts)
export function scorePulseStability(pulseRateHistory: number[]): number {
  // FIX: filter out any NaN values before computing statistics
  const clean = (pulseRateHistory ?? []).filter((v) => Number.isFinite(v));
  if (clean.length < 5) return 3; // neutral fallback

  const mean = clean.reduce((a, b) => a + b, 0) / clean.length;
  const variance = clean.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / clean.length;
  const stdDev = Math.sqrt(variance);

  if      (stdDev < 3)  return 5;
  else if (stdDev < 6)  return 4;
  else if (stdDev < 10) return 2;
  else                  return 0;
}

// ─── PART 3: COMBINED FINAL SCORE ────────────────────────────────────────────

export function calculateFinalRiskScore(
  baseline: AHABaseline,
  metrics: WebcamMetrics,
) {
  const lifestyleScore = calculateAHAScore(baseline);
  const prScore        = scorePulseRate(metrics.pulseRate, metrics.isExercising);
  const prvScore       = scorePRV(metrics.sdnnMs);
  const stabilityScore = scorePulseStability(metrics.pulseRateHistory);

  const webcamScore = prScore + prvScore + stabilityScore;
  const rawScore    = lifestyleScore + webcamScore;

  // FIX: if somehow a NaN still slips through (future-proofing), clamp to a
  // safe mid-range value rather than letting NaN reach the UI.
  const finalScore = Number.isFinite(rawScore)
    ? Math.max(1, Math.min(100, rawScore))
    : 50; // safe neutral fallback — avoids NaN gauge display

  const riskLevel =
    finalScore >= 70 ? 'Low Risk' :
    finalScore >= 40 ? 'Moderate Risk' :
    'High Risk';

  return {
    total:     finalScore,
    lifestyle: lifestyleScore,
    realtime:  webcamScore,
    breakdown: {
      pulseRate: prScore,
      prv:       prvScore,
      stability: stabilityScore,
    },
    riskLevel,
  };
}