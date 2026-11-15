# SpaceHealth — Recommended Changes Before Building

**Date:** November 14, 2026  
**For:** SpaceHealth (two-person NASA Space Apps 2026 team)  
**Status:** Proposed revisions; review and adopt before implementation

This is a **change request**, not a replacement for your existing research. Keep your three existing documents, but apply the edits below. The priority is a *working, reproducible, scientifically cautious* end-to-end prototype, not the maximum number of features.

## 0. Decisions to freeze now

- **Core promise:** *SpaceHealth helps an astronaut see changes relative to their own normal, understand the evidence and uncertainty, and take an appropriate next step—even offline.*
- **Mandatory v1 modules (3):** `sleep_alertness`, `physiological_change`, `radiation`. The physiological module groups signals relevant to both illness and cardiovascular monitoring; **it does not diagnose infection, immune dysfunction, or cardiovascular deconditioning**.
- **Mandatory v1 experience:** Today screen → explanation/trend → action card; mission-day replay and validation panel.
- **Optional after v1 passes:** mood trend module, browser reaction-time test, exercise adherence, habitat indicators, crew-medical-officer view. Bone-density projections, SANS self-testing, adaptive baselines, sync, and browser LLM are stretch features.
- **Stack:** React + Vite + TypeScript + Vitest + Zod + Recharts; one frontend codebase, no backend required for the demo.
- **Detection:** interpretable rules, fixed preflight baselines, no LLM determining medical status.
- **Claims:** all measurements in the demo are simulated; all effect sizes and alert thresholds are assumptions until individually verified and validated. **Do not describe the tests as clinical validation.**

---

## 1. Update `SpaceHealth — Astronaut Health Self-Monitoring (Space Apps 2026 Plan).md`

### 1.1 Replace the scope sentence under `Concept`

> **Revised concept:** SpaceHealth is an offline-first astronaut self-monitoring prototype. It compares an astronaut's measurements with their preflight baseline, flags sustained or operationally important changes, explains exactly what triggered a flag, and connects the user to a documented follow-up or escalation path. It does not determine the underlying diagnosis.

### 1.2 Replace the `Science backbone` claims with these engineering rules

| Module | What v1 can reasonably say | Inputs | Detection path | What it must **not** claim |
|---|---|---|---|---|
| Sleep / alertness | Sleep duration is lower than this person's usual range; alertness may need checking | `sleep_hours`; optional `pvt_mean_rt_ms`, `pvt_lapses` | Sustained sleep deficit; optional test-relative change | A browser PVT establishes clinical impairment |
| Physiological change | Several physiological signals have shifted together; possible causes need assessment | `rhr_bpm`, `hrv_rmssd_ms`, `skin_temp_delta_c`, `symptoms` | Persistent within-person changes + symptom-specific escalation | Diagnosis of infection, immune dysfunction, or cardiovascular deconditioning |
| Radiation | A simulated space-weather warning or dose-rate excursion requires the documented radiation workflow | `spe_warning`, `dose_rate_msv_h`, `daily_dose_msv`; history of exposure | Event signal and operational policy rules; cumulative-dose accounting | A specific dose value alone is a universal storm-shelter trigger |
| Mood (optional) | Self-reported wellbeing is changing over days | `mood_1to5`, `stress_1to5` | Ordinal trend and safety escalation | Diagnosis of psychiatric illness using z-scores |

**Important:** An exercise log is not a bone-density measurement. If an optional bone feature is built, label it *exercise adherence / bone-health risk context*. Do not display individualized predicted bone-density loss from exercise minutes unless a separate defensible model has been established.

### 1.3 Replace generic `Nominal / Watch / Act` logic

Use **four** possible evaluation states, plus a separate data-quality field:

- `nominal`: sufficient readings, no configured alert rule triggered.
- `watch`: sustained or corroborated trend; user should verify measurements or complete a check-in.
- `act`: operational warning, important symptom, or a configured escalation rule; open the relevant approved procedure.
- `unknown`: missing or insufficient readings, or unusable baseline. **Never equate missing data with health.**

A single universal `|z| >= 2/3` rule is **not** appropriate for all signal types. Continuous signals may use robust z-scores; ordinal mood scores use trends; symptoms use categorical rules; radiation uses event signals, dose rate and accumulated exposure.

### 1.4 Replace the baseline-engine paragraph

For a continuous signal with sufficiently many valid preflight measurements:

```text
baseline = median(valid_preflight_values)
robust_scale = 1.4826 * MAD(valid_preflight_values)
scale = max(robust_scale, signal_specific_min_scale)
z = (current_value - baseline) / scale
```

- Require a declared minimum number of usable baseline observations (for demo, suggest 10 of the 14 preflight days; **engineering assumption**).
- Specify the `signal_specific_min_scale` for each continuous signal and test the zero-MAD case.
- Lock the baseline during the mission in v1; do **not** automatically update it using a 28-day rolling window while deterioration may be occurring.
- Do not z-score `symptoms`, `spe_warning`, or 1–5 mood/stress ratings.
- A missing signal must not silently become zero.
- If multiple signals share a source or are correlated, don't count them as statistically independent evidence.

### 1.5 Replace the mandatory UI scope

**v1 screens / views:**

1. **Today:** three modules, status word + icon, main evidence, and top actionable items. The cap of three applies only to **routine** cards—never hide operational or urgent alerts.
2. **Detail + action:** baseline chart, recent trend, data-quality label, plain-language explanation, reference or assumption label, `Recheck`, `Done`, and `Contact onboard CMO` actions.
3. **Mission replay + validation:** choose crewmember and day, play an event, see its detected day and false alerts. Link from the replay to the exact action card.

The check-in can start as simple symptom / mood entry. A full three-minute **PVT-inspired** browser test is optional and must be identified as an unvalidated prototype, not a calibrated medical instrument.

Separate the **onboard Crew Medical Officer (CMO)** from the **Earth-based flight surgeon**: alerting the onboard CMO must work without an Earth link; ground messages may be queued during blackout. Completing an action card is a recorded action, **not proof that the action caused subsequent recovery**.

### 1.6 Replace the mandatory architecture with a smaller repo

```text
spacehealth/
  src/
    engine/       types.ts, baseline.ts, evaluate.ts, actions.ts
    modules/      sleep.ts, physiological.ts, radiation.ts
    sim/          generate.ts, scenarios.ts
    data/         mission.json
    components/   Today, Detail, ActionCard, Replay, Validation
    App.tsx
  tests/          baselines, module rules, scenarios, smoke
  research/       evidence.md, assumptions.md, sources.md
  public/         offline assets
  README.md
```

Keep module functions pure and testable. Extract `packages/core`, manifests and advanced plugin architecture **only after** the vertical slice works; don't spend the first evening writing infrastructure for future contributors.

### 1.7 Replace the 30-second storyboard's unsupported claim

Do **not** narrate "detected infection two days before symptoms" unless a final independent test actually shows that result. Instead: *"On this simulated mission, SpaceHealth flags a sustained change, shows the evidence, and opens the recommended follow-up."* If the measured lead time is available, display it as a **synthetic scenario result**.

---

## 2. Update `SpaceHealth — Research Workbook (B).md`

### 2.1 Add a single signal-name contract at the start of `Section 2: Signals`

Use **exactly these IDs** in research tables, simulation output, module inputs, frontend, and tests:

| ID | Unit / type | v1 use | Notes |
|---|---|---|---|
| `rhr_bpm` | bpm | Required | Nightly resting HR |
| `hrv_rmssd_ms` | ms | Required | May be missing; do not replace with zero |
| `skin_temp_delta_c` | °C deviation | Required | Deviation from personal reference |
| `sleep_hours` | hours | Required | Nightly sleep estimate |
| `symptoms` | string array | Required | Explicit categories; no numeric z-score |
| `spe_warning` | boolean | Required | Space-weather / mission alert separate from dosimeter |
| `dose_rate_msv_h` | mSv/h | Required for storm event | Simulated time-stamped event or intraday sample |
| `daily_dose_msv` | mSv/day | Required | Additive daily exposure |
| `prior_career_dose_msv` | mSv | Optional context | Prior missions; must not be silently assumed zero |
| `pvt_mean_rt_ms` | ms | Optional | PVT-inspired browser assessment |
| `pvt_lapses` | count | Optional | Criteria and browser limitations documented |
| `mood_1to5` | integer 1–5 | Optional | Ordinal; not z-scored |
| `stress_1to5` | integer 1–5 | Optional | Ordinal; not z-scored |
| `exercise_minutes` | min/day | Later | Adherence metric, not BMD |
| `co2_ppm` | ppm | Later | Habitat-specific operational threshold |

**Remove/rename** old IDs in every file: `rhr`, `hrv_rmssd`, `sleep_h`, `pvt_rt_ms`, `dose_msv`, `mood`, `stress`, etc. For any signal without a verified source, keep the numeric range labelled `simulation assumption`. Distinguish actual sensor readings from synthetic, manual, and calculated values.

### 2.2 Replace the v1 scenario set

| ID | Required? | Scenario | Minimum automated pass condition |
|---|---|---|---|
| S1 | Yes | Quiet mission across four crewmembers | No `act` without a defined cause; report routine false alerts per 100 crewmember-days |
| S2 | Yes | Physiological change begins day 40; symptoms on day 42 | `watch` or `act` by day 42, with the correct evidence fields and **no claim of infection diagnosis** |
| S3 | Yes | Day-72 simulated SPE warning and time-stamped dose-rate increase | Operational `act` on warning, correct integrated daily/mission dose, correct card |
| S4 | Yes | Sleep restriction days 95–101 | `watch` by day 97; any escalation rule must be internally consistent with available inputs |
| N1 | Yes | High HR after exercise / normal context without illness | No automatic 'infection' diagnosis or unjustified emergency alert |
| N2 | Yes | Missing wearable readings / insufficient baseline | `unknown` where applicable; no false `nominal`, no crash |
| S5 | Later | Slow mood decline | Use ordinal trend rules; not a z-score with possible zero MAD |
| S6 | Later | Missed exercise | Adherence notice; not quantified bone-density loss |

Retain the current effect sizes as **draft simulation assumptions**. Keep scenario onset, symptom onset, alert time, and recovery time as different fields. A symptom being recorded on day 42 does not prove an infection existed or was detected earlier.

### 2.3 Replace the generic detection table with module-specific rules

**Sleep:** check at least two consecutive short-sleep nights against the person's fixed baseline. An `act` requires a clearly documented combination (e.g. continued restriction plus reported impairment or a separate operational decision); don't use a `pvt_lapses >= 11` threshold as a universal medical rule.

**Physiological change:** require sustained changes in at least two available signals, record their directions, and show confounders where available. Symptoms may trigger a separate action based on severity. Display **"physiological change"** or **"possible illness—check symptoms"**, not **"infection detected"**.

**Radiation:** an authoritative `spe_warning` triggers a procedure card without waiting for a full day's accumulated dose. Separately integrate actual simulated dose-rate samples (units and time intervals matter), compute daily and mission cumulative doses, and present career exposure only if supplied. The cited 250 mSv reference-event criterion must **not** be treated as a generic event-alert trigger; check the NASA standard's exact interpretation with the source.

**Mood later:** trend analysis using scores and explicit safety language. A potentially urgent self-harm disclosure must not be placed behind routine alert limits or deferred to a future asynchronous message.

### 2.4 Replace the action-card template

Every card should contain:

```yaml
id: physiological-change
status: watch
heading: Physiological change detected
why: "Resting HR and skin-temperature deviation rose for multiple nights."
uncertainty: "These changes are nonspecific and do not establish an infection."
do_now:
  - "Review symptoms and confirm measurement quality."
  - "Follow the mission-approved symptom assessment procedure."
recheck: "At the next scheduled check or according to approved procedure."
onboard_escalation: "Contact the onboard CMO if concerning symptoms are present."
ground_escalation: "Use the approved crew-to-ground medical channel when available."
source_ids: []
assumption_ids: []
```

**B must verify** all medical and procedural language. A citation in a paper does not automatically establish a flight-approved treatment. For a critical radiation warning, reference a **mission-specific approved procedure**, not self-invented medical instructions. Preserve privacy controls for mood and journals without preventing mandatory safety escalation.

### 2.5 Expand `Section 6: Assumptions log`

Add at least:

- `A6`: 10 valid preflight days and each signal-specific minimum scale.
- `A7`: 2-day or 3-day persistence rules and any alert priorities.
- `A8`: Simulated SPE warning time, dose-rate profile and numerical integration method.
- `A9`: Confounder and missing-data simulation.
- `A10`: Data-sharing and escalation permissions in the demo.
- `A11`: Training/test seed choices, noise distributions, effect-size ranges.

For every material number, label **evidence-backed**, **engineering assumption**, or **unverified**. Keep the original papers and NASA resources as the evidence library; don't silently replace their claims with these recommended choices.

---

## 3. Update `SpaceHealth — Two-Person Action Plan (Sat–Sun).md`

### 3.1 Change the first milestone

**Old:** Freeze all 14 signals and build the complete five-module engine in parallel with UI.  
**New:** Freeze one signal contract, one status contract and one complete vertical slice: `simulated event → detection → explanation → action card → replay → test`.

### 3.2 Replace phases with dependency-based gates

| Gate | A (software) | B (science) | Pass condition |
|---|---|---|---|
| G0: Contract | Types, units, schema validation, repo, basic app | Verify v1 signal table and naming | Same IDs and units in code, tables and tests; app loads mock data |
| G1: Vertical slice | S2 generator, baseline, physiological module, detail screen and card | Verify S2 assumptions and action wording | One simulated crewmember/day runs end to end; unit and smoke tests pass |
| G2: Complete core | Add sleep, radiation, replay, local caching | Verify module-specific rules, N1/N2 control cases | S1–S4 + N1/N2 tested; no unknown data shown as normal |
| G3: Independent check | Hold-out seeds/effect sizes, compute metrics and failures | Review false alerts and unsupported claims | Report *all* results, including failures; no demo-only hardcoding |
| G4: Submission ready | Deploy/test offline, record demo, publish README | Source audit, submission text, medical-language review | Public demo and links work; screenshots/video match working code |

**No optional module starts before G2 passes.** If a gate fails, cut scope instead of hiding the failure or changing ground truth to make the metric green.

### 3.3 Define exact team handoffs

- **B → A:** one verified table with IDs, units, assumptions, source IDs and action-card wording. B should focus on *claims and medically relevant errors*, not making every screen perfect.
- **A → B:** a screenshot and machine-generated test report after each working vertical slice; B tests as a first-time astronaut.
- **Both:** keep one short decision log and one canonical file for the data contract. Changes to a signal ID require updating tests together.
- **Coding agent:** may write code and tests; neither agent-generated code nor research drafts count as verified without the owners' checks.

### 3.4 Update the acceptance checklist

- [ ] Three core modules work end to end; an event opens a justified action card.
- [ ] Fixed baseline handles zero MAD and insufficient history.
- [ ] Missing data is `unknown`, not `nominal`.
- [ ] Radiation uses SPE warning plus dose-rate and cumulative calculations; units tested.
- [ ] A simulated infection is **not** displayed as a confirmed diagnosis.
- [ ] Onboard CMO and delayed ground communication are distinct actions.
- [ ] S1–S4 and negative controls N1/N2 run automatically; a held-out run is documented.
- [ ] No arbitrary alert cap suppresses critical warnings.
- [ ] Production app can be opened and used offline **after initial install/cache**.
- [ ] README explains simulated data, sources, assumptions, limitations, AI-tool use and how to run the project.
- [ ] NASA challenge Resources and current event/submission rules checked against the official pages by the team.
- [ ] 30-second demo makes only claims supported by the final working build.

---

## 4. Canonical TypeScript data contract (paste into the coding brief)

```ts
type Status = 'nominal' | 'watch' | 'act' | 'unknown';
type Quality = 'valid' | 'missing' | 'insufficient' | 'suspect';

type DailyReading = {
  crewId: string;
  missionDay: number; // -14..-1 preflight; 1..180 mission
  rhr_bpm: number | null;
  hrv_rmssd_ms: number | null;
  skin_temp_delta_c: number | null;
  sleep_hours: number | null;
  symptoms: string[]; // include separate missingness flag if not collected
  daily_dose_msv: number | null;
  mood_1to5?: number | null;
  stress_1to5?: number | null;
  pvt_mean_rt_ms?: number | null;
  pvt_lapses?: number | null;
};

type RadiationEvent = {
  crewId: string;
  missionDay: number;
  timeHoursFromDayStart: number;
  spe_warning: boolean;
  dose_rate_msv_h: number | null;
};

type Indicator = {
  crewId: string;
  missionDay: number;
  moduleId: 'sleep_alertness' | 'physiological_change' | 'radiation';
  status: Status;
  dataQuality: Quality;
  reason: string;
  evidence: Array<{
    signalId: string;
    value: number | boolean | string | null;
    unit?: string;
    baseline?: number;
  }>;
  cardId?: string;
  sourceIds: string[];
  assumptionIds: string[];
};
```

**Implementation notes:** `DailyReading` and `RadiationEvent` are separate because a day-72 storm warning should not have to wait until the end-of-day record. The simulator must document the numerical integration rule used to derive daily dose. The cumulative mission dose should be derived from daily dose values (not independently randomized). A `symptoms: []` means *explicitly reported no symptoms*; a skipped check-in requires a different missing-data indicator.

---

## 5. Paste this revised instruction to the coding agent

> Build a working prototype of SpaceHealth, a fully client-side, offline-capable React + Vite + TypeScript app. First create the exact signal and indicator types in Section 4, Zod validators, and unit tests. Then implement **one complete vertical slice** for synthetic physiological change: seeded 14-day preflight baseline + 180-day mission, zero-MAD-safe fixed baseline, signal-quality checks, detection reason, trend chart, action card, and replay. Only after that works, add sleep and radiation modules. Radiation has separate time-stamped SPE warnings/dose-rate samples and integrated dose. Provide four statuses: nominal, watch, act, unknown. Never show missing data as nominal, never diagnose infection, and never hide urgent alerts under the three-routine-card cap. Add S1–S4 and N1/N2 tests plus a held-out seed/effect-size run; report false alerts and detection delays as **synthetic-scenario results**. Use a simple `src/` repo before introducing packages or plugin manifests. Include an offline production-build smoke test, source/assumption labels and a README disclaimer. Do not implement bone projection, SANS, an LLM, adaptive baselines or ground sync until the core tests and public demo work.

---

## 6. Explicit cuts if time is short

Cut in this order: **browser PVT → mood trend → CMO crew grid → habitat → bone projection → SANS → advanced plugin registry → adaptive baseline → ML/LLM → ground sync**. Keep the physiological vertical slice, sleep + radiation if feasible, the honest validation report and a working demo.

**Non-negotiable:** Don't cut clarity about simulated data, unknown/missing measurements, critical escalation paths, or the distinction between a detector flag and a medical diagnosis.

## 7. Final message for judges

> **SpaceHealth is an offline-first astronaut health-monitoring prototype that learns an individual's preflight normal, detects sustained or operationally important changes, and converts them into explainable next steps. We tested it using published, reproducible simulated mission scenarios—including normal variation and missing data—not clinical astronaut outcomes. It is a research prototype, not a diagnostic or medical device.**
