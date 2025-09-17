# Healthcare Claims Fraud Detection System

A secure, AI-powered web platform connecting hospitals and insurance companies for streamlined healthcare claim processing with advanced fraud detection capabilities.

---

## Features

- **Digital Claim Submission**:  
  Hospitals can submit claims online with automated validation and document management.

- **AI Fraud Detection**:  
  Uses advanced machine learning algorithms and LLMs to analyze submitted claims, flag suspicious patterns, and provide fraud scores with explanations.

- **Multi-Stage Review**:  
  Claims go through a hospital pre-review and an insurance company final review for accuracy and fraud prevention.

- **Real-time Analytics**:  
  Interactive dashboards for insurers with fraud scores, risk trends, top contributing features, and actionable insights.

---

## Workflow

1. **Hospital Login & Claim Submission**
   - Hospitals authenticate and submit claims with patient, treatment, and document details.
   - Documents (bills, prescriptions, etc.) are uploaded and attached to claims.

2. **AI/LLM Fraud Analysis**
   - Claims are analyzed for fraud using both rules-based logic and LLMs (e.g., Gemini API).
   - Each claim receives a fraud score (0–100), risk level (low/medium/high), flags, and detailed explanations.

3. **Multi-Stage Review**
   - Claims undergo internal hospital review, are updated with notes, and then sent to insurance companies.
   - Insurance reviewers see AI results, claim details, and can approve, deny, or flag claims.

4. **Analytics & Audit Trails**
   - All actions are logged for transparency (submission, review, approval, denial).
   - Dashboards display fraud trends, high-risk claims, and top feature contributions.

---

## Tech Stack

- **Frontend**: React + TypeScript, TailwindCSS
- **Backend/Logic**: TypeScript (in-browser/service layer), mock data/services (can be extended to real API)
- **AI Integration**: LLM-based risk analysis (Gemini API, mock logic for demo)
- **Icons/UI**: Lucide-react

---

## Project Structure

```
src/
  components/           # UI components for hospital/insurance portals
    shared/             # Shared layout, navigation, landing page
    hospital/           # Claim submission, claim history, etc.
    insurance/          # Fraud analytics dashboard, review interfaces
  services/             # Fraud detection, claims, LLM integration logic
  data/                 # Mock data for claims, users, audit logs
  types/                # TypeScript interfaces: Claim, Patient, AuditLog, etc.
  contexts/             # Auth and state management
public/
  index.html            # Entry point
```

---

## Key Files

- `src/components/shared/LandingPage.tsx`: Showcases platform features and workflow.
- `src/components/hospital/ClaimSubmissionForm.tsx`: Claim entry & document upload.
- `src/services/fraudDetectionService.ts`: Mock AI fraud scoring logic.
- `src/services/geminiService.ts`: LLM-based claim analysis.
- `src/components/insurance/FraudAnalyticsDashboard.tsx`: Analytics for insurers.

---

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gurugsv7/frauddetection.git
   cd frauddetection
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the app:**  
   Go to `http://localhost:5173` (or as indicated in terminal).

---

## Extending & Customizing

- **Backend integration**: Swap mock services with real APIs and databases.
- **LLM/AI service**: Plug in actual AI services for live fraud detection.
- **Role-based access**: Expand with more granular user roles and permissions.

---

## License

MIT

---

## Author

[gurugsv7](https://github.com/gurugsv7)
