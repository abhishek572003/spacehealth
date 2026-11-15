# SpaceHealth — Build Plan (Claude × Codex × Narayan)

**Version:** v0.2 (merged) · **Created:** Sat 2026-11-14 17:10 CST · **Deadline:** Sun 2026-11-15 23:59 local, target submit **Sun 20:00**
**History:** v0.2 applies Narayan's decisions D1–D5 (`DECISIONS.md`).
**Precedence:** `Instructions.txt` > `DECISIONS.md` > `Discussion.md` (Refinement v1) > older three docs (historical inputs, not modified).

---

## 1. Ground rules

1. **Claude does all non-coding work** (research, downloads of papers/data, specs, task briefs, reviews, wording, logs, reports). **Codex writes all code** (incl. parsing scripts for downloaded data, tests, build). Claude does not commit production code; Codex does not decide medical wording, thresholds, scope or dataset choice.
2. **Narayan decides** scope, model selection, material thresholds, dataset selection, licensing, publication. Nothing is marked "accepted" without Narayan's response ⓒ.
3. **Three independent modules** — `research/`, `model/`, `dashboard/` — each runnable and testable alone, coupled only through `contracts/`.
4. **Grounded:** every number tagged `evidence-backed` (source ID + page/table), `engineering assumption` (A-ID), or `unverified`. Downloaded ≠ verified ⓒ. Unavailable sources are reported to Narayan, never substituted silently ⓒ.
5. **Refinement v1 non-negotiables:** statuses `nominal/watch/act/unknown`; missing ≠ nominal; no silent zero-imputation; no diagnosis language; fixed preflight baseline; urgent/operational alerts never hidden by the 3-routine-card cap; all demo data labelled simulated; results called "synthetic-scenario results".
6. **One log per kind:** decisions → `DECISIONS.md` (root, single log; replaces Codex's proposed `docs/decisions.md`); model runs → `model/EXPERIMENT_LOG.md`; handoffs → `handoffs/`.

---

## 2. Repository layout = module boundaries

```text
SpaceHealth/
  plan.md  DECISIONS.md  REQUIREMENTS.md  README.md
  contracts/                    COUPLING LAYER (Claude: spec · Codex: schemas + tests)
    CONTRACT.md                   human spec: fields, units, semantics, examples
    *.schema.json                 JSON Schema (source of truth)
    fixtures/valid/*.json         golden files used by BOTH model and dashboard tests
    fixtures/invalid/*.json       must be rejected by both validators
  research/                     OWNER: Claude (Narayan/B verify)
    sources.md                    source manifest: ID, citation, DOI/URL, claim, page/table, access, local file, status
    papers/                       downloaded open-access originals + checksums.txt
    data/raw/<dataset>/           NASA/public data, untouched, with PROVENANCE.md (URL, date, size, sha256, licence)
    data/DATA_INVENTORY.md        fitness-for-use per dataset; what we could NOT get
    signals.yaml scenarios.yaml rules.yaml cards.yaml
    assumptions.md evidence.md model_candidates.md
  model/                        Python 3.11 (D1). Codex code · Claude spec/review
    spacehealth_model/            sim/, baseline/, detectors/, modules/, evaluate/, export/
    tests/                        pytest
    configs/                      frozen experiment configs (YAML)
    reports/                      machine-generated reports (toy / full / holdout)
    EXPERIMENT_LOG.md
    requirements.txt (+ lock)
  dashboard/                    React + Vite + TS + Zod + Recharts + Vitest. Codex code · Claude UX spec · Narayan feedback
    public/data/                  model exports copied here at integration (static, offline)
  handoffs/
    tasks/TASK-###.md             Claude → Codex
    reports/TASK-###.md           Codex → Claude
    reviews/TASK-###.md           Claude verdict
```

**Independence tests:**
- research: `research/` is reviewable with no code; `sources.md` statuses + checksums match files.
- model: `pytest model/tests` and `python -m spacehealth_model.run --config ...` run with no Node, no network.
- dashboard: `npm test` + `npm run build` run on `contracts/fixtures/valid/` with no Python.
- integration: model export validates against `contracts/` → copied to `dashboard/public/data/` → e2e smoke test.

---

## 3. Who does what

| Area | Claude (non-coding) | Codex (coding) | Narayan |
|---|---|---|---|
| Research | Literature search; download open-access papers + NASA/public data; source manifest; evidence/assumptions; signals/scenarios/rules/cards drafts; list what couldn't be fetched | Parsing/conversion scripts for downloaded data (e.g. dose-rate files → JSON), with tests | Downloads paywalled/gated items; B-role verification of medical wording; dataset choice |
| Contracts | `CONTRACT.md` spec | JSON Schema, pydantic (model), Zod (dashboard), valid/invalid fixtures, cross-validator tests | Freezes at G0 |
| Model | Candidate list from literature; experiment protocol, metrics, pass/fail; interpret reports; recommend keep/discard | Simulator, baseline, detectors, modules, evaluation harness, exporters, tests; runs experiments; writes reports + log rows | Picks model(s) and thresholds |
| Dashboard | Screen-by-screen UX spec + acceptance criteria; all on-screen copy (from `cards.yaml`); screenshot review | App, tests, offline build, offline smoke test | Feedback rounds |
| Integration | Checklist + claim audit | Wire-up, e2e smoke test | Go/no-go |
| Submission | README science/limitations/AI-use section, project text, video script, final report | README setup/run section, deploy | Records video, publishes, submits |

---

## 4. Claude ↔ Codex workflow (D3: Narayan runs Codex)

```text
Claude: handoffs/tasks/TASK-###.md ──► Codex (run by Narayan)
   ▲                                          │
   │                                          ▼
Claude: handoffs/reviews/TASK-###.md ◄── Codex: code + tests + handoffs/reports/TASK-###.md
   ├─ PASS → DECISIONS.md / EXPERIMENT_LOG.md updated → next task
   └─ FIX  → TASK-###-fixN with exact failing items (max 2 rounds → escalate to Narayan)
```

- **TASK template:** Goal · Context files to read · Inputs · Outputs (paths) · Contract refs · Acceptance commands + expected results · Out of scope · Allowed packages (else stop and ask) · Report path.
- **REPORT template:** Built · Files changed · Commands run + raw output · Deviations + why · New packages (also in `REQUIREMENTS.md`) · Open questions.
- **Review checks (Claude):** acceptance commands re-run by Claude; contract conformance; no hard-coded medical copy; no diagnosis language; missing→unknown; no test-set tuning; claims match evidence.
- Codex never edits `research/`, `DECISIONS.md`, `plan.md`; Claude never edits `model/` or `dashboard/` source. Shared: `contracts/` (Claude edits `CONTRACT.md`, Codex edits schemas/fixtures), `REQUIREMENTS.md` (both append).
- Gates are reviewed by Narayan; Claude posts a short gate summary.

**Collaboration points:** (1) contract freeze, (2) simulation realism check, (3) model selection, (4) card/explanation copy, (5) integration + claim audit. Any signal-ID change = one task touching research + model + dashboard + tests together.

---

## 5. Contract additions to resolve at G0 (from Codex draft ⓒ + Discussion §4)

Start from Discussion §4 types exactly, plus:
- `checkin_completed: boolean` on `DailyReading` so `symptoms: []` = "reported none" and a skipped check-in is distinguishable.
- Per-signal `provenance`: `sensor | manual | synthetic | calculated` (all demo values `synthetic`).
- `prior_career_dose_msv: number | null` per crew (null = unknown, never 0).
- `doseCoverage` on daily dose: fraction of the day covered by samples; incomplete coverage shown, not presented as a complete total.
- `ScenarioTruth` records (onset, symptom, recovery days) kept separate from readings so the dashboard can show truth only in Replay/Validation.

---

## 6. Module plans

### 6.1 Research (Claude)
1. `sources.md` from the existing reference list + new searches; download every open-access PDF; record checksum.
2. **Download report to Narayan:** (a) downloaded, (b) you need to download (paywalled/gated — exact URL/DOI), (c) unobtainable.
3. NASA / public data candidates (Claude checks access, size, schema, fitness; Narayan selects before heavy use):
   - **NASA DONKI** SEP/flare events (CCMC) → realistic S3 timing.
   - **MSL RAD** dose rates (NASA PDS) → realistic deep-space dose-rate profile and units.
   - **NASA OSDR** (Inspiration4/SOMA accessions) → check for any per-day physiology usable for ranges; omics will not be used to "validate" wearable alerts ⓒ.
   - **NASA-STD-3001 Vol 1/2 + OCHMO radiation brief** → exact interpretation of 600 mSv / 250 mSv.
   - **Stanford COVID-19 wearables (Mishra 2020)** — public, non-NASA → optional real-data sanity check of the physiological detector.
4. signals / scenarios / rules / cards / assumptions per Discussion §2, every number labelled.
5. `model_candidates.md`: literature rationale per detector.

### 6.2 Model (Codex builds · Claude designs · Narayan selects)
Use-case constraints: ~14 preflight days (small n), must explain "why flagged", runs offline, returns `unknown` on missing/insufficient data, alert fatigue matters.

| ID | Candidate | Basis | Purpose |
|---|---|---|---|
| M1 | Robust z (median/MAD, fixed preflight, min-scale) + persistence k-of-n, ≥2 signals | Discussion §1.4; Li 2017 | **Default** (built first in vertical slice) |
| M0 | Population fixed thresholds | Comparator | Shows value of personal baselines |
| M2 | One-sided CuSum on robust z | Alavi 2022 | Slow drift |
| M3 | EWMA chart | SPC literature | Slow-drift alternative |
| M4 | Mahalanobis distance, shrinkage covariance | Stanford smartwatch work | Correlated multi-signal |
| M5 | Isolation Forest | ML comparator | Expected to be rejected (n=14, interpretability) — documents why |
| R | Radiation: warning rule + dose-rate integration | NASA-STD-3001 | Correctness (units, integration rule, coverage), not a statistical model |

**Order (Codex draft ⓒ: no model sweep before the vertical slice works):**
1. **Vertical slice:** M1 on S2 end-to-end (sim → detect → export → fixture-valid).
2. **Toy:** 1 crewmember, S2/N1/N2 + hand-checkable edge cases (zero MAD, non-finite, insufficient baseline, missing current) × 3 dev seeds, M0–M5 → discard clearly bad ones (logged with reason).
3. **Full:** 4 crew × (14 + 180) days, S1–S4/N1/N2, 20 dev seeds, surviving candidates.
4. **Freeze config → Holdout:** new seeds + perturbed effect sizes, run once; all results incl. failures reported. Any later change = new run + new holdout designation ⓒ.
5. Optional real-data sanity check, reported separately as non-astronaut evidence.

**Each log row ⓒ:** experiment ID, rationale/source IDs, candidate + config hash, code commit, dependency versions, seeds (dev/holdout), effect sizes, noise/missingness assumptions, metrics, failures, artifact paths, reviewer verdict.
**Metrics:** detection (y/n), onset/symptom/detection/recovery days separately, delay, missed events, watch/act counts, routine false alerts per 100 evaluable crew-days (with denominator), unknown-day counts. Checks: no future-data leakage, no silent zero, no urgent card hidden.

### 6.3 Dashboard (Codex builds · Claude specs · Narayan iterates)
Screens (Discussion §1.5): **Today** → **Detail + Action card** → **Replay + Validation**. Built first on `contracts/fixtures/valid/`. v0 → screenshots → Narayan feedback → TASK per round. Onboard-CMO action vs queued ground message are distinct; no button pretends to send without a channel ⓒ. Offline pass = production build, assets cached, browser offline, reload, exercise replay/detail/action paths; record browser + result ⓒ.

### 6.4 Integration
Model exports `mission.json`, `indicators.json`, `validation.json` → validate → `dashboard/public/data/`. e2e smoke: build, load, replay to S2 day 42 shows physiological-change card with evidence; day 72 shows radiation `act`.

---

## 7. Gates & timeline (compressed; starting 17:10 Sat)

| Gate | Target | Claude | Codex | Pass |
|---|---|---|---|---|
| **G0 Contract** | Sat 19:30 | `CONTRACT.md`, `signals.yaml`, sources + download report, TASK-001/002 | Scaffold, schemas (JSON Schema + pydantic + Zod), fixtures, cross-validation tests, app shell | Narayan approves contract; both validators accept valid / reject invalid fixtures |
| **G1 Vertical slice + dashboard v0** | Sat 23:30 | S2 assumptions, rules, cards, experiment protocol, reviews | Sim + M1 + physiological module + export; dashboard v0 on fixtures; toy run M0–M5 | S2 e2e in model; toy report logged; v0 screenshots to Narayan |
| **G2 Core complete + full run** | Sun 10:00 | Interpret full results, recommend; feedback task | Sleep + radiation; S1–S4/N1/N2 tests; full run; holdout | Narayan picks model; required scenarios automated; holdout reported |
| **G3 Integration + UI feedback** | Sun 14:30 | Integration checklist, claim audit, feedback tasks | Wire-up, e2e, offline smoke | e2e + offline pass; feedback addressed |
| **G4 Submission** | Sun 20:00 | README science, project text, video script, final report from logs | README setup, deploy | Discussion §3.4 checklist ticked |

Cut order (Discussion §6): PVT → mood → CMO grid → habitat → … Real-data sanity check and M5 are cut before any core item. If a gate fails: ≤30 min fix, then propose a cut to Narayan — never remove required tests or change ground truth ⓒ.

---

## 8. Requirements (full list in `REQUIREMENTS.md`)

| Need | Status | Decision |
|---|---|---|
| Python 3.11 + venv `model/.venv` | 3.11.9 present; venv being created | D5 ✅ |
| numpy, pandas, scipy, scikit-learn, pytest, pydantic, jsonschema, pyyaml, matplotlib | installing into venv | D5 ✅ |
| Node.js LTS v26.13.1 + npm (user-level `~/.local/node`, no sudo) | installing | D5 ✅ |
| Dashboard npm packages (react, vite, typescript, zod, recharts, vitest, + PWA/offline plugin TBD) | Codex installs at TASK-002, logs versions | — |
| Codex CLI 0.169.0 | present | D3 ✅ |
| git | repo initialised | D4 ✅ |

---

## 9. Logs → final report
`DECISIONS.md` (decisions) · `model/EXPERIMENT_LOG.md` (runs) · `research/sources.md` + `DATA_INVENTORY.md` (evidence, gaps) · `handoffs/` (task/report/review trail; also documents AI-tool use for the submission form).
