# TaxNarrate MVP

**A Tiered Tax Education & Compliance Platform for Nigeria’s 2026 Tax Act**

---

## 📌 Overview

**TaxNarrate** is a mobile-first, tiered tax education and compliance platform designed to support individuals, SMEs, and corporate entities through Nigeria’s **2026 Unified Tax Act** transition.

The MVP demonstrates a **Lite → Secure → Secure+** progression model, allowing users to start with low-friction tax insights and upgrade to higher security and compliance features only when required.

This approach balances:

* Mass adoption
* Regulatory compliance
* Cost efficiency
* Enterprise-grade architecture

---

## 🎯 Objectives of the MVP

* Demonstrate readiness for the 2026 tax regime
* Validate UX-driven monetization through compliance needs
* Showcase a scalable backend architecture using feature gating
* Position Simplex Business Solutions as a compliance infrastructure provider

---

## 🧩 Application Modes

### 1️⃣ Lite Mode (No Login)

**Purpose:** Education & awareness

* Basic tax estimation
* 2025 vs 2026 comparison
* Savings preview (limited)
* No data persistence
* No identity verification

> Designed to drive adoption and trust with zero friction.

---

### 2️⃣ Secure Mode (Authenticated)

**Purpose:** Compliance readiness

* User authentication (Email/OTP)
* Identity capture (NIN / RC Number)
* Detailed tax breakdown
* Limited history tracking
* Document generation (basic)

> Activated when users need accuracy, saving, or compliance confidence.

---

### 3️⃣ Secure+ Mode (Premium / Enterprise)

**Purpose:** Full compliance & audit readiness

* Multi-year tax history
* AI-generated explanations & narration
* Compliance audit trail
* Advanced exports (PDF, CSV)
* Corporate-ready reporting

> Designed for salary earners, SMEs, and corporates with regulatory exposure.

---

## 🧭 User Types Supported

| User Type             | Supported Modes              |
| --------------------- | ---------------------------- |
| Individual (PAYE)     | Lite, Secure, Secure+        |
| SME                   | Secure, Secure+              |
| Corporate (Mid/Large) | Secure+, Enterprise (Future) |

Pricing and features vary by user type and compliance exposure.

---

## 🖥️ MVP Pages

### Public (Lite Mode)

* Landing Page
* Lite Tax Calculator
* Lite Results Page

### Authenticated

* Authentication Page
* Mode Selection / Upgrade Page
* User Dashboard
* Profile & Identity Page
* Tax Breakdown Page
* History & Tracking Page
* Documents & Exports Page
* Settings & Security Page

---

## ⚙️ Core Features

* Progressive mode-based access control
* Single tax rule engine (2025 & 2026 laws)
* Feature gating via entitlements
* UX-driven upgrade prompts
* Compliance health indicators
* Simulated NRS readiness (mocked APIs)

---

## 🧱 Assumed Technical Architecture

### Frontend

* React / React Native
* TailwindCSS / Styled Components
* Framer Motion (animations & transitions)

### Backend (Conceptual for MVP)

* Node.js API layer
* Stateless tax rule engine
* Feature flag & entitlement service
* Identity & compliance service (Secure modes)
* Audit & logging service (Secure+)

> ⚠️ Note: Backend services are mocked in this MVP for demonstration purposes.

---

## 🔐 Security Philosophy

Security is **not forced upfront**.

Instead:

* Lite Mode avoids all sensitive data
* Secure Mode activates identity & compliance services
* Secure+ enables audit, logging, and historical persistence

This minimizes risk while maximizing adoption.

---

## 📈 Monetization Strategy

* Free Lite Mode for user acquisition
* Paid Secure tiers driven by:

  * Data persistence needs
  * Compliance deadlines
  * Export & audit requirements
* Pricing varies by:

  * Individual
  * SME
  * Corporate scale

---

## 🚀 MVP Status

* ✅ UI/UX complete
* ✅ Business logic defined
* ✅ Mode & pricing strategy finalized
* ⏳ Live NRS integration (Post-MVP)
* ⏳ Payment gateway integration (Post-MVP)

---

## 🔮 Future Enhancements

* Live NRS Tax ID verification
* Mandatory e-Invoicing (QR & CSID)
* Employer payroll upload & H1 automation
* Multi-language AI narration
* White-label for accounting firms

---

## 🏢 Built For

**Simplex Business Solutions**
Positioned as a long-term compliance technology partner for Nigeria’s evolving tax landscape.
