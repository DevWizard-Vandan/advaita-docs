# Advaita Semiconductor Technologies

[![DOI](https://zenodo.org/badge/1328164402.svg)](https://doi.org/10.5281/zenodo.21855200)

**Web Portal:** [https://DevWizard-Vandan.github.io/advaita-docs/](https://DevWizard-Vandan.github.io/advaita-docs/)  
**Contact:** vandan.advaita@outlook.com  
**Location:** Pune, Maharashtra, India

---

## What We Do

We simulate how your neural network model behaves on physical **Analog In-Memory Computing (AIMC)** hardware — 8-bit crossbar NPUs that consume 70–90% less power than digital equivalents — before you commit to any silicon.

**The core deliverable:** A layer-by-layer hardware risk map that tells your engineering team:
1. Which layers will survive analog quantisation and noise (and by how much)
2. Which layers are catastrophic single points of failure (we've seen 3 layers collapse a 93.7% model to 0.0%)
3. The minimum hardware change (e.g., 10-bit ADC on 3 specific layers) that recovers 94.3% accuracy retention

We accept `.onnx` and `.pt` model files. We return a formal PDF report in 48 hours.

---

## How To Work With Us

**Tier 1 — Prototype Feasibility Evaluation:** Rs.25,000 – Rs.50,000  
48-hour turnaround. Your model in, risk map out. Runs under a mutual NDA.

**Tier 2 — Full Enterprise Audit:** Rs.1,50,000 – Rs.3,00,000  
14-day deep-dive with N=10 stochastic sweep, 365-day drift simulation, QAT retraining recipe, and 60-min executive debrief.

→ **Email:** vandan.advaita@outlook.com with subject *"Hardware Feasibility Evaluation Inquiry"*  
→ **[Service Brief](FEASIBILITY_AUDIT_SERVICE_BRIEF.md)** · **[NDA Template](NDA_template.md)** · **[SDK Verification Report](SDK_READINESS_REPORT.md)**

---

## Verified Benchmarks

| Workload | Result | Verification |
|---|---|---|
| ResNet-20 / CIFAR-10 — 5-Tier Ablation | 91.59% retention (8-Bit) · 94.32% (10-Bit ADC) | N=5 seeds, reproducible |
| 365-Day NVM Thermodynamic Drift | 0.00 W refresh power, MSE stable | IBM AIHWKit PCM model |
| Multi-Head Attention (4 crossbars) | MAE < 0.095, max 0.291 | Seed-reproducible |
| Quantisation Sweep | Digital 93.70% → 8-Bit Noise 85.82% ± 0.61% | Empirical code output |

All benchmarks archived: **DOI [10.5281/zenodo.21855201](https://doi.org/10.5281/zenodo.21855201)**

> All accuracy figures are software simulation results using IBM AIHWKit v1.1.0. Energy savings (70–90%) are literature-based projections, not silicon-measured values.

---

## Repository Structure

| Repository | Visibility | Contents |
|---|---|---|
| [`DevWizard-Vandan/Advaita`](https://github.com/DevWizard-Vandan/Advaita) | **Private** | Core compiler, feasibility engine, crossbar simulation, customer reports |
| [`DevWizard-Vandan/advaita-docs`](https://github.com/DevWizard-Vandan/advaita-docs) | **Public** | Web portal, service brief, NDA template, public benchmarks |

---

&copy; 2026 Advaita Semiconductor Technologies. All Rights Reserved.
