# SpaceHealth — Research Workbook (B)

Nov 14, 2026 · @Narayan

**SpaceHealth doc set:** SpaceHealth — Astronaut Health Self-Monitoring (Space Apps 2026 Plan) (what and why) · SpaceHealth — Team Workflow by Role (roles and handoffs) · SpaceHealth — Two-Person Action Plan (Sat–Sun) (time-boxed tasks, tracked) · SpaceHealth — Research Workbook (B) (B's research file)

This is where all research lives: Member B fills and verifies these tables with Claude, shares the link on Discord, and Member A turns each finished section into repo files. No git needed.

## How to use this workbook

Claude has pre-filled every table with a first draft from the literature. B's job is to check each row, fix what is wrong, and mark it. Checking is much faster than writing from scratch.

**B's loop for each section.**

1. Read the section's rows. For each row, set the **Review** column: *Verified* (correct as is), *Changed* (you edited it), or *Rejected* (remove it).
2. Unsure about a number? Comment on that cell and tag Claude, or ask Claude in chat. Ask for the source, not just the answer.
3. When every row is Verified or Changed, post on Discord: `READY: Section 2 Signals — changed resting HR range, added SpO2`, with this doc's link.
4. A converts the section into repo files and replies `PUSHED: research/signals.yaml`.

**Rules that keep it usable for A.**

- Don't rename the `id` columns once A has pushed them; code uses those names.
- Use the units in the column headers. Numbers only in number columns.
- Anything that is our own guess, not from a paper, goes in the Assumptions log (Section 6) too.
- Every row needs a source, or the word *assumption*.

## 1. Problems (task 0.3 → `research/problems.md`)

Five problems ship in v1 (rows 1–5); three follow on Sunday (rows 6–8). The v1 five were chosen because each can be detected in flight with a wearable, a dosimeter or a 3-minute tablet check.

| id | Problem | Hazard | Why it matters on a long mission | Detectable in flight by | Key source | Phase | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |
| sleep | Sleep loss and reduced alertness | Isolation, distance | ISS crews averaged about 6 h sleep against 8.5 h scheduled; fatigue raises error risk in critical tasks | Actigraphy + PVT-B reaction test | Barger 2014; Basner 2011 | v1 | Draft |
| cardio | Cardiovascular deconditioning | Gravity | Raises the risk of fainting on landing or after a long fall in gravity; on landing day only 2 of 6 ISS astronauts finished a tilt test | Resting HR, HRV, blood pressure | Lee 2015 | v1 | Draft |
| immune | Immune strain and infection | Radiation, stress, closed cabin | Latent viruses reactivate in most long-duration crew; no hospital to go to | Overnight resting HR, skin temperature, symptoms | Rooney 2019; Mishra 2020 | v1 | Draft |
| radiation | Radiation exposure | Radiation | Career limit 600 mSv; one solar storm can add a large dose in hours | Personal dosimeter | NASA-STD-3001 | v1 | Draft |
| mood | Mood and behavioral health | Isolation, confinement | Slow decline is hard to notice in yourself; self-ratings miss impairment | Daily mood/stress check-in, reaction-test trend | Basner 2015 | v1 | Draft |
| bone | Bone and muscle loss | Gravity | Hip loses about 1.2–1.5% bone per month; fracture risk on return | Exercise log + days in microgravity (projection) | Lang 2004 | Part 2 | Draft |
| vision | Vision changes (SANS) | Gravity | About two-thirds of long-duration crew show signs; some changes may persist | Amsler grid, near-vision self-check | NASA SANS update 2023 | Part 2 | Draft |
| air | Cabin air (CO2, noise, temperature) | Hostile/closed environment | High CO2 linked to headaches and poor sleep | Habitat sensors | to find (B) | Part 2 | Draft |

**For B to check:** is the order of importance right? Is anything major missing, for example muscle loss as its own problem, or kidney stones?

## 2. Signals (task 0.4 → `research/signals.yaml`)

Fourteen daily signals cover all eight problems. Ranges marked *verify* are Claude's general-knowledge estimates for healthy, fit adults, not from a source we opened; B should confirm or correct them. Because SpaceHealth compares each person to their own pre-flight baseline, these ranges only set realistic values for the simulation.

| id | Signal | Unit | Sensor | How often | Typical healthy range (draft) | Used by | Source | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| rhr | Overnight resting heart rate | bpm | Wearable (watch or Astroskin shirt) | Nightly | 50–70 (verify) | cardio, immune | Mishra 2020 (method) | Draft |
| hrv\_rmssd | Heart rate variability, RMSSD | ms | Wearable | Nightly | 20–100, very individual (verify) | cardio, immune | assumption | Draft |
| bp\_sys / bp\_dia | Blood pressure | mmHg | Astroskin or cuff | Daily | 100–130 / 60–85 (verify) | cardio | assumption | Draft |
| spo2 | Blood oxygen saturation | % | Wearable | Nightly | 95–100 (verify) | immune, air | Li 2017 (method) | Draft |
| skin\_temp\_delta | Skin temperature vs personal mean | °C | Wearable | Nightly | within ±0.5 (verify) | immune | Li 2017 | Draft |
| sleep\_h | Sleep duration | hours | Actigraphy (wrist) | Nightly | 6–8; ISS crews averaged about 6.1 | sleep | Barger 2014 | Draft |
| pvt\_rt\_ms | PVT-B mean reaction time | ms | Tablet test, 3 min | Daily | about 200–300 when rested (verify) | sleep, mood | Basner 2011 | Draft |
| pvt\_lapses | PVT-B lapses (reaction over 355 ms) | count | Tablet test | Daily | low single digits when rested (verify); 11 and 20 lapses split performance bands in a screening task | sleep | Basner 2011; Basner & Rubinstein 2011 | Draft |
| mood | Mood | 1–5 | Check-in | Daily | 3–5 | mood | assumption | Draft |
| stress | Stress | 1–5 | Check-in | Daily | 1–3 | mood, immune | assumption | Draft |
| symptoms | Symptoms (fever, sore throat, headache, vision change, …) | list | Check-in | Daily | none | immune, vision, air | assumption | Draft |
| exercise\_min | Exercise time | min/day | Exercise device log | Daily | ISS schedule figure to verify (B) | bone, cardio | to find (B) | Draft |
| dose\_msv | Radiation dose | mSv/day | Personal dosimeter | Daily + storm alerts | about 0.5 on the ISS; higher in deep space | radiation | NASA OCHMO brief; NASA-STD-3001 | Draft |
| co2\_ppm | Cabin CO2 | ppm | Habitat sensors | Hourly, daily mean | limit to verify (B) | air (Part 2) | to find (B) | Draft |

**For B to check:** the *verify* ranges, the exercise time on the ISS, and NASA's cabin CO2 limit. Ask Claude to look up the last two.

## 3. Scenarios (task 1.1 → `sim/scenarios/*.yaml`)

Each scenario injects one known problem into one crew member, so we know the truth and can check whether SpaceHealth catches it. Mission day 1 is launch; pre-flight days are −14 to −1. **All effect sizes are demo assumptions**: B should judge whether they look physiologically plausible, not exact.

| id | What happens | Crew | Days | Signal changes (draft) | Ground truth | Pass rule | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | Quiet mission, nothing injected | All 4 | 1–180 | Normal noise only | No problem exists | No Act; at most 1 Watch per person per 30 days | Draft |
| S2 | Respiratory infection | C2 | 40–48 | From day 40: rhr +6 to +10 bpm, hrv −20%, skin temp +0.3 to +0.5 °C; day 42: symptoms logged (sore throat, fatigue); recovers by 48 | Symptom day 42 | First Watch or Act on or before day 42 | Draft |
| S3 | Solar particle event | All 4 | 72 | One-day dose spike (draft 40 mSv; must stay below the 250 mSv event limit) | Event day 72 | Radiation Act on day 72; cumulative dose correct | Draft |
| S4 | Sleep restriction (busy week) | C3 | 95–101 | sleep about 5 h; pvt\_rt +10 to 15%; lapses +3 to +5 per test | Onset day 95 | Watch by day 97, Act by day 98 | Draft |
| S5 | Slow mood decline | C4 | 140–160 | mood falls about 0.07/day (4 → 2.6); stress rises about 0.05/day; no single dramatic day | Onset day 140 | Mood Watch before day 155; nothing in S1 | Draft |
| S6 (Part 2) | Exercise skipped | C1 | 120–130 | exercise\_min near 0 | Onset day 120 | Bone Watch by day 125 | Draft |

**For B to check:** are the infection changes realistic for a mild infection? Is a 40 mSv one-day storm dose a fair demo value? Should S5 include sleep changes too, since mood and sleep usually move together?

## 4. Detection rules (task 1.4 → `modules/<id>/manifest.yaml`)

One row per v1 module. "z" means how many robust standard deviations today's value sits from the person's own pre-flight baseline; A computes it, B decides which signals and how many days count.

| Module | Signals (direction) | Baseline window | Watch when | Act when | Hard limit | Card | Sources | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| sleep | sleep\_h (low), pvt\_rt\_ms (high), pvt\_lapses (high) | 14 pre-flight days | 2 nights with sleep z ≤ −2, or PVT z ≥ 2 | 3-night sleep debt and PVT z ≥ 3, or lapses ≥ 11 | none | sleep-alertness-low | Barger 2014; Basner 2011; Basner & Rubinstein 2011 | Draft |
| cardio | rhr (high), hrv\_rmssd (low), bp (high or low) | 14 pre-flight + 28-day rolling | Any signal \|z\| ≥ 2 for 2 days, or CuSum alarm on rhr | \|z\| ≥ 3 for 2 days | to set (B) | cardio-drift | Lee 2015; Mishra 2020 (method) | Draft |
| immune | rhr (high), skin\_temp\_delta (high), hrv (low), symptoms | 14 pre-flight + 28-day rolling | 2 of 3 signals z ≥ 2 for 2 nights | Watch + any symptom, or 2 of 3 signals z ≥ 3 | Fever symptom → Act | immune-possible-infection | Mishra 2020; Alavi 2022; Rooney 2019 | Draft |
| radiation | dose\_msv (cumulative and daily) | not baseline-based | Mission dose passes 50% of planned budget | Storm alert or daily dose far above normal | 600 mSv career; 250 mSv per event | radiation-shelter, radiation-budget | NASA-STD-3001 | Draft |
| mood | mood (low), stress (high), pvt trend | 14 pre-flight days | CuSum alarm on mood or stress (slow drift) | Mood z ≤ −3 for 3 days, or any self-harm-related answer | Crisis answer → Act + CMO immediately | mood-low | Basner 2015 (assessment) | Draft |

**For B to check:** are the signal directions and day counts sensible? Should cardio's blood-pressure limits be fixed values instead of personal ones? The mood crisis rule needs careful wording; Claude can draft a safe card.

## 5. Action cards (task 2.3 → `modules/<id>/cards/*.md`)

Each card tells the astronaut what to do now, when to check again, and when to call the crew medical officer (CMO). Cards support decisions; they never diagnose. Keep each under 80 words, imperative, plain language. These are drafts for B to correct.

| Card id | Shown when | Do now | Recheck | Escalate to CMO if | Review |
| --- | --- | --- | --- | --- | --- |
| immune-possible-infection | Immune Watch or Act | Log symptoms and temperature. Use your own cup and utensils. Rest; drink fluids. Wipe shared surfaces. | Tonight's readings and tomorrow's check-in | Fever, breathing trouble, rash or blisters, or Act lasts 2 days | Draft |
| sleep-alertness-low | Sleep Watch or Act | Avoid starting safety-critical tasks alone for the next few hours if possible. Plan a protected sleep window tonight; dim lights and screens an hour before. | PVT-B after next sleep | Act lasts 3 days, or you need sleep medication more than planned | Draft |
| radiation-shelter | Storm alert or dose spike | Go to the storm shelter now and follow the mission's radiation procedure. Wear your dosimeter. | When the all-clear is given | Always notify; log time in shelter | Draft |
| radiation-budget | Mission dose passes 50% of budget | Review planned spacewalks with the crew. Note remaining budget on today's plan. | Weekly | Budget forecast exceeds the mission plan | Draft |
| cardio-drift | Cardio Watch or Act | Hydrate. Check for dizziness when moving. Confirm today's exercise is done. Repeat a resting measurement in 1 hour. | Tomorrow morning | Chest pain, fainting or palpitations, or Act lasts 2 days | Draft |
| mood-low | Mood Watch or Act | You are not alone in this; many crews hit a low patch. Pick one: talk to a crewmate, schedule a private call home, or book time with the ground support team. A short private journal entry can help. | 3 days | Act status, or thoughts of harming yourself → contact the CMO and ground support now | Draft |

**For B to check:** wording, medical safety, and anything that should never be said. For the mood card, keep the escalation line exactly this clear.

## 6. Assumptions log and sources

Everything we chose ourselves, rather than took from a paper, is listed here so judges can see we know the difference.

| # | Assumption | Where used | Why it is reasonable | Owner |
| --- | --- | --- | --- | --- |
| A1 | Healthy ranges marked *verify* in Section 2 | Simulation | General physiology; only used to make realistic fake data | B |
| A2 | Infection effect sizes in S2 | Simulation, S2 test | Wearable studies show resting HR rises before symptoms; exact size is our choice | B |
| A3 | 40 mSv storm dose in S3 | Simulation, S3 test | Large but under NASA's 250 mSv per-event limit | B |
| A4 | Watch at \|z\| ≥ 2, Act at \|z\| ≥ 3 | All modules | Common statistical convention; tuned on S1 false-alarm rate | A + B |
| A5 | 14 pre-flight days give a usable baseline | Engine | Short but workable for a demo; real missions have months of pre-flight data | A |

**Sources (the full list with links is in the main plan doc's References).** Barger 2014 (sleep); Basner 2011 and Basner & Rubinstein 2011 (PVT-B); Basner 2015 (Cognition battery); Lee 2015 (orthostatic intolerance); Rooney 2019 (viral reactivation); Li 2017, Mishra 2020, Alavi 2022 (wearable baselines); Lang 2004 (bone); NASA SANS update 2023; NASA-STD-3001 and the OCHMO radiation brief.
