# SERVICE ENGAGEMENT LETTER

**Document ID:** `ADV-ENG-[CLIENT-REF]-2026`  
**Date:** [DATE]  
**Reference NDA:** `ADV-NDA-[CLIENT-REF]-2026` (or N/A if no NDA executed)

---

**From:**  
Advaita Semiconductor Technologies  
Pune, Maharashtra, India  
vandan.advaita@outlook.com

**To:**  
[CLIENT COMPANY NAME]  
[Client address]  
[Client contact name and email]

---

Dear [Client contact name],

This letter confirms the scope, deliverables, and commercial terms of the engagement between Advaita Semiconductor Technologies ("**Advaita**") and [CLIENT COMPANY NAME] ("**Client**") for a Hardware-Aware Feasibility Audit.

---

## 1. Scope of Work

Advaita will perform the following services (the "**Services**"):

| Phase | Timeline | Activity |
|---|---|---|
| **Phase 1 — Model Ingestion & Baseline** | Days 1–3 | Client supplies PyTorch checkpoint (`.pt` / `.pth`) or ONNX graph (`.onnx`). Advaita runs digital FP32 baseline evaluation to confirm model loads and measures reference accuracy. |
| **Phase 2 — Hardware Simulation** | Days 4–10 | Advaita maps the model onto $512 \times 512$ AIMC crossbar tiles using IBM AIHWKit. Conducts 5-tier ablation sweep (FP32 control → 8-bit quantization → noise injection at σ=0.01 → σ=0.05 → 10-bit ADC recovery) across N=5 stochastic noise seeds. Runs per-layer single-layer noise injection telemetry to identify risk concentration. |
| **Phase 3 — Report Delivery & Debrief** | Days 11–14 | Advaita delivers the Feasibility Report (PDF) including: hardware resource map, accuracy degradation ladder, layer-level risk concentration matrix, and actionable engineering recommendations. |

**Deliverables:**
- Hardware Feasibility Report (PDF, minimum 6 sections as defined above)
- Raw results JSON with per-tier and per-layer telemetry
- Two benchmark figures (accuracy vs. precision chart; layer sensitivity heatmap)
- [Optional at Tier 2] 60-minute technical executive debrief call via video conference

---

## 2. Client Responsibilities

The Client shall:
1. Supply the model file and any necessary evaluation dataset within 3 business days of engagement start.
2. Specify the target hardware configuration (crossbar array size, desired bit-depth range) or accept Advaita's standard $512 \times 512$ configuration.
3. Designate a technical point of contact available for clarifying questions during Phases 1–2.

---

## 3. Fees & Payment Terms

| Engagement Tier | Scope | Fee (INR) | Fee (USD approx.) |
|---|---|---|---|
| **Tier 1 — Starter Report** | 5-tier ablation, PDF report | ₹50,000 | ~$600 |
| **Tier 2 — Engineering Audit** | Full layer sensitivity map, 60-min debrief | ₹1,50,000 | ~$1,800 |
| **Tier 3 — Enterprise NRE** | Full simulation, Zenodo-indexed record, quarterly retainer available | ₹3,00,000–₹5,00,000 | ~$3,600–$6,000 |

**Selected Tier:** [TIER] at [FEE]

**Payment Schedule:**
- **50% upfront** upon countersignature of this letter — ₹[AMOUNT] due by [DATE].
- **50% on delivery** of the final report — ₹[AMOUNT] due within 7 days of report delivery.

Payment via bank transfer (NEFT/IMPS) or international wire. Details provided on invoice.

---

## 4. Intellectual Property

- The Client retains full IP ownership of the supplied model, weights, and architecture.
- Advaita retains IP ownership of its simulation methodology, hardware-mapping algorithm, and feasibility analysis framework.
- The Feasibility Report is delivered to the Client for their internal use. Client may reference or cite the report externally with Advaita's written consent.
- Advaita may use anonymized, aggregate benchmark statistics (no model weights or client-identifying information) for internal R&D and public capability demonstrations unless the Client requests otherwise in writing.

---

## 5. Confidentiality

Both Parties are bound by the Mutual NDA referenced above (or by the confidentiality obligations implied herein if no separate NDA is executed). Advaita will not share the Client's model files or results with any third party.

---

## 6. Limitation of Liability

This engagement provides simulation-based analysis. Results represent modeled hardware behavior and do not constitute a guarantee of physical silicon performance. Advaita's total liability under this engagement shall not exceed the fees paid by the Client under this letter.

---

## 7. Term & Termination

This engagement commences on [START DATE] and concludes upon delivery of the final report. Either Party may terminate with 5 business days' written notice; fees for work completed to date are non-refundable.

---

## 8. Governing Law

This letter and the engagement it governs shall be subject to the laws of India. Disputes shall be resolved in the courts of Pune, Maharashtra, India.

---

## Acceptance

By signing below, both Parties agree to the terms of this Service Engagement Letter.

| Party | Name | Title | Signature | Date |
|---|---|---|---|---|
| **Advaita Semiconductor Technologies** | Vandan Sharma | Founder | ________________ | [DATE] |
| **[CLIENT COMPANY NAME]** | [Name] | [Title] | ________________ | [DATE] |

---

*Questions? Contact vandan.advaita@outlook.com before signing.*
