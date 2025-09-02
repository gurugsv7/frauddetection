// Gemini API integration for OCR and claim analysis (frontend-only).
// WARNING: API key is exposed in frontend code.

const GEMINI_API_KEY = "AIzaSyAOwMf44jod9-cgIGEmKLfjZjy0BOvq0Cg";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + GEMINI_API_KEY;

export async function analyzeClaimWithGemini(
  file: File | null,
  formData: Record<string, any>
): Promise<any> {
  let base64 = "";
  let mimeType = "";
  if (file) {
    const fileData = await file.arrayBuffer();
    base64 = btoa(String.fromCharCode(...new Uint8Array(fileData)));
    mimeType = file.type;
  }

  // Combine all form data and instruct Gemini to return structured JSON for dashboard analytics
  const prompt = `
You are an insurance claim fraud detection assistant. Analyze the following claim submission, which includes:

1. Patient Information:
- Full Name
- Date of Birth
- Gender
- Insurance ID / Policy Number
- Self-Claim (Yes/No)
- If not self-claim: Relationship to Insured

2. Provider Information:
- Provider ID (e.g., NPI / hospital code)
- Hospital / Clinic Name
- Provider Location (City, State, ZIP)

3. Claim / Treatment Information:
- Admission Date
- Discharge Date (if applicable)
- Diagnosis Code (ICD-10)
- Procedure Code (CPT/HCPCS)
- Claim Amount
- Pre-Authorization Number (if required)
- Claim Type (Initial / Resubmission / Corrected)

4. Supporting Evidence:
- Uploaded Medical Documents (bills, prescriptions, discharge summary, lab reports, etc.)

Inputs:
${JSON.stringify(formData, null, 2)}

If a document is provided, extract its text and use it to supplement the analysis.

Return a JSON object with these fields:
{
  "fraudScore": number (0-100),
  "riskLevel": "low"|"medium"|"high",
  "fraudFlags": string[],
  "explanatoryReasons": string[], // Always provide detailed reasons for the risk score. For low risk, list positive indicators and explain why the claim appears genuine and not fraudulent.
  "topFeatureContributions": [{ "name": string, "value": number }],
  "peerComparison": { "providerValue": number, "peerAvg": number },
  "historicalTrend": number[],
  "recentSimilarCases": [{ "id": string, "summary": string }],
  "claimTypeBreakdown": { [type: string]: number },
  "detectionDashboard": { "flagged": number, "approved": number, "monthlyStats": number[] },
  "summary": string
}
`;
// Always provide detailed reasons for the risk score in "explanatoryReasons". For low risk, list positive indicators and explain why the claim appears genuine and not fraudulent.

  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [{ text: prompt }];
  if (file && base64) {
    parts.push({
      inlineData: {
        mimeType,
        data: base64
      }
    });
  }

  const res = await fetch(GEMINI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts }] })
  });

  if (!res.ok) throw new Error("Gemini API error");

  const data = await res.json();
  // Try to parse JSON from Gemini's response
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let result: any = {};
  try {
    result = JSON.parse(text);
  } catch {
    result = { summary: text };
  }
  return result;
}
