# SpaceHealth — Astronaut Health Self-Monitoring (Space Apps 2026 Plan)

Nov 14, 2026 · @Narayan

**SpaceHealth doc set:** SpaceHealth — Astronaut Health Self-Monitoring (Space Apps 2026 Plan) (what and why) · SpaceHealth — Team Workflow by Role (roles and handoffs) · SpaceHealth — Two-Person Action Plan (Sat–Sun) (time-boxed tasks, tracked) · SpaceHealth — Research Workbook (B) (B's research file)

## The challenge, explained

NASA is asking for software that helps astronauts look after their own health on long missions, when doctors on Earth are far away and slow to reach. The software has to collect health information, help the astronaut understand what it means, and help them decide what to do about it. Those three verbs (gather, evaluate, act) are the whole brief, and a strong entry has to deliver all three, not just a dashboard of numbers.

**Why this problem exists.** In space the body changes. Radiation damages cells, weightlessness thins bone and weakens the heart and blood vessels, months in a small sealed cabin with the same few people strain sleep and mood, and the closed air and water can carry their own hazards. NASA groups these into five hazards: radiation, isolation and confinement, distance from Earth, altered gravity, and a hostile closed environment. The challenge text names the results it cares about: immune changes, bone loss, cardiovascular events and behavioral health problems.

**Why it is the astronaut's job.** On the space station a flight surgeon on the ground watches crew health almost in real time. On a Mars trip, a message can take up to 20 minutes each way, and there are blackout periods with no contact at all. So the crew has to notice problems themselves, early, and know what to do. NASA's own medical planners call this "Earth-independent medical operations" and are already designing decision-support tools for it, which tells us this challenge is close to a real NASA need.

**What they are actually demanding, in plain terms.**

1. **Gather health indicators.** Pull in measurements that reveal the problems above: heart rate and heart rate variability, sleep, reaction time and mood, radiation dose, exercise done, vision symptoms, cabin air. Some come from sensors automatically; some the astronaut enters.
2. **Let the astronaut evaluate their status.** Turn raw numbers into a clear answer to "am I OK?", and show why. A number like "62 bpm" means nothing on its own; "9 beats above your normal for three nights" does.
3. **Let them act.** When something is off, tell them what to do next, how soon to recheck, and when to call the crew medical officer.
4. **Fit the setting.** It must work with no internet, take little time from a busy crew, and be trustworthy enough that a highly trained person will rely on it.

**What we need to build.** A working prototype app, not slides about an app. It needs a data layer (fed by a realistic simulated mission, since real astronaut data at this detail is not public), an evaluation engine that compares each astronaut to their own pre-flight normal, a set of action cards, and a clean interface that shows all of it in seconds. It must be built so other people can add new health checks later.

**How we will be judged.** Space Apps scores projects on five equal criteria: Impact, Creativity, Validity (is it scientifically sound and would it work), Relevance (does it answer this exact challenge), and Presentation. The submission is a demo of at most a 30-second video or seven slides, plus a public project page and code link. Every resource we use must be cited, and we should show which NASA and partner resources we drew on. At least one NASA data source or resource is required for Global Awards. The guide also requires us to disclose where AI tools were used. The concept is the team's own; Claude helps research the literature, organize the plan and draft documents over several iterations, and a coding agent writes code under A's direction. We state exactly that in the project form and README.

**Testable and demonstrable, by design.** Because we generate the mission data ourselves, we know exactly when each problem starts: we inject an infection on day 40, a solar storm on day 72, a week of bad sleep on day 95. That lets us prove the app works with numbers ("flagged the infection 2 days before symptoms, zero false alarms in the quiet weeks") and lets judges watch it happen by replaying the mission at high speed. Part 1 below lists the exact scenarios and pass criteria.

*Note: the challenge page blocked my automated reader, so this is based on the challenge text you pasted plus NASA sources. Please paste the page's Objectives, Considerations and Resources tabs so I can check we are hitting every listed point and using their suggested data.*

## Concept

**SpaceHealth** is an offline-first health co-pilot that learns each astronaut's own normal before launch, flags meaningful drift during the mission, and turns every flag into a short, evidence-backed action card the crew can carry out without waiting on Earth.

**The problem, in the challenge's terms.** Long missions stack five hazards (NASA's RIDGE: radiation, isolation, distance, gravity, hostile/closed environment). Beyond the Moon, comms delay and blackouts mean the crew must detect, diagnose and act on its own. NASA's Exploration Medical Capability work calls this Earth-Independent Medical Operations (EIMO) and specifically names passive monitoring for early warning signs, trend highlighting, and reduced crew cognitive load as goals for a crew decision-support system.

**What makes our take distinct (three bets):**

1. **Personal baselines, not population thresholds.** Astronauts are an elite N-of-1 population. We follow the Stanford wearables work (Li 2017, Mishra 2020, Alavi 2022): build each person's healthy range, then detect deviations with transparent statistics (rolling robust z-score + CuSum). Every flag can say *why*.
2. **Evaluate → Act, not just dashboards.** Each signal maps to a status (green / watch / act), a one-line explanation, and a protocol card with countermeasures, retest timing, and when to escalate to the crew medical officer.
3. **A three-minute day.** The daily check-in is a 3-minute PVT-B reaction test plus three mood/symptom taps; everything else is passive (wearable, dosimeter, habitat sensors). Low effort is a safety feature, not just a UX nicety.

**Scope guardrail.** SpaceHealth supports self-assessment and decision-making; it does not diagnose. Every action card ends with an escalation path. Detection uses transparent statistics, not an LLM, so every flag is testable, repeatable and works offline.

## Science backbone

Every module is anchored to a published finding and a NASA standard where one exists; the app shows the citation on each card. This table is the contract between research and code.

| Domain (hazard) | Key evidence | Signal we track | v1 model | Example action card |
| --- | --- | --- | --- | --- |
| Sleep & alertness (isolation, distance) | ISS crews averaged \~6.1 h sleep vs 8.5 h scheduled; hypnotics used widely (Barger 2014). PVT-B: 3-min test, lapse = RT > 355 ms, validated vs 10-min PVT (Basner 2011). Cognition battery is a NASA standard measure (Basner 2015). | Sleep duration (actigraphy), PVT-B mean 1/RT + lapses, KSS sleepiness | Personal baseline z-score; 3-day rolling sleep debt | "Alertness low: avoid EVA-critical tasks next 4 h, light + sleep plan, retest PVT tonight" |
| Cardiovascular (gravity) | Long-duration crews show more post-flight orthostatic intolerance; on landing day only 2 of 6 ISS vs 52 of 65 Shuttle astronauts completed a tilt test (Lee 2015). Twins Study: carotid changes. | Resting HR, HRV (RMSSD), BP, SpO2 | Baseline deviation + CuSum on overnight RHR | "RHR up 3 nights: hydrate, check symptoms, repeat; escalate if + fever" |
| Immune (radiation, stress) | Latent herpesvirus shedding rises in flight; 61% of ISS astronauts shed ≥1 virus (Rooney 2019). Wearables catch infection pre-symptomatically via RHR rise (Mishra 2020; Alavi 2022: \~80% detected at/before symptoms). | Overnight RHR, skin temp, symptom taps, sleep + stress load | Composite "immune strain" score from RHR/temperature deviation + stress/sleep | "Possible infection onset: isolate utensils, saliva test, rest, notify CMO" |
| Bone & muscle (gravity) | Hip BMD loss \~1.2–1.5%/month, spine 0.8–0.9%/month; hip strength \~2.5%/month (Lang 2004). | Exercise minutes and load (ARED-style), days in microgravity | Projected cumulative hip/spine loss, slowed by exercise adherence (assumption flagged) | "Behind on resistive load 4 days: add session; projected hip loss now X%" |
| Vision / SANS (gravity) | \~66–70% of long-duration crew show SANS signs; severity tracks mission length (NASA 2023 clinical update). | Self-test: Amsler grid, near-acuity chart, symptom check | Change vs personal baseline; any new distortion = act | "New distortion reported: log, schedule OCT imaging, notify CMO" |
| Radiation | Career limit 600 mSv effective dose; 250 mSv per solar particle event (NASA-STD-3001). | Dosimeter dose rate + cumulative dose, SPE alerts | Running dose vs mission and career budget; SPE alarm | "SPE alert: go to storm shelter now; dose budget remaining 37%" |
| Behavioral health (isolation) | Subjective self-rating often misses impairment, "huge disconnect" under sleep loss (Basner). Cognition and mood are part of NASA standard measures. | 3-tap mood/stress/social check-in, PVT trend | Baseline deviation + sustained-low flag (7-day window) | "Mood down 5 days: private journaling prompt, schedule family call, talk to CMO" |
| Habitat (hostile/closed) | NASA lists temperature, pressure, lighting, noise, microbes as closed-environment risks. | CO2, temperature, noise (simulated feed) | Fixed operational thresholds | "CO2 high in sleep station: ventilate; note headaches" |

**Why personal baselines are scientifically defensible.** Snyder's group showed each person's baseline differs and that deviations from it flag illness, including Lyme disease before symptoms (Li 2017). Their real-time CuSum and RHR methods reached 72–80% sensitivity in a large cohort (Alavi 2022). The Twins Study and Inspiration4/SOMA show that most spaceflight changes are individual and return toward baseline after flight, which is exactly the shape a baseline model handles.

**Honest limits we state up front.** Bone-loss rates come from 4–6-month ISS flights and may not extrapolate to multi-year missions (Lang 2004). Thresholds are demo values, not clinical cut-offs. All in-app data is synthetic.

## Product & UX design

The whole app answers three questions in order: **How am I? Why? What do I do now?** Five screens carry it.

1. **Today (status board).** Header: crew member, mission day, comms delay, radiation budget left. Eight domain tiles (sleep, cardio, immune, bone, vision, radiation, mood, habitat), each with status word + icon + colour, and one line of reason ("RHR +9 bpm vs your baseline, 3 nights"). At most three "Needs attention" cards above the tiles.
2. **Daily check-in (about 3 minutes).** PVT-B reaction test, then three taps: mood, stress, any symptoms. Finishes with "Today vs your normal" in one sentence.
3. **Domain detail.** Trend chart with the personal baseline drawn as a shaded band, mission events marked on the timeline (SPE, illness, missed exercise). A "Why flagged" box shows the rule in plain words and the citation.
4. **Action card.** Checklist of steps, a retest timer, "Done" and "Escalate to CMO" buttons. Escalation queues a message for the ground and shows the expected reply time given comms delay. Completing a card is logged so the model can tell whether the action helped.
5. **Mission timeline.** Everything that happened, newest first, filterable by domain. Doubles as the exportable health log.

**Status rules (same everywhere).**

| Status | Meaning | Default rule (tunable per module) |
| --- | --- | --- |
| Nominal (green) | Inside your personal range | \|z\| < 2 |
| Watch (amber) | Drifting; recheck | 2 ≤ \|z\| < 3, or CuSum alarm, or 2 consecutive days out of range |
| Act (red) | Do the action card now | \|z\| ≥ 3 sustained, or a hard limit (dose, new vision symptom, SPE) |

**Design principles.**

- **Calm by default.** No more than three active alerts; lower-priority ones collapse into "also watching". Alert fatigue is a documented failure mode of monitoring systems.
- **Never colour alone.** Every status carries a word and an icon (accessibility, and cabin lighting varies).
- **Explain every number.** Tap any value to see baseline, deviation, method, source paper.
- **Big targets, dark-first theme.** Usable on a tablet with gloves or in a sleep station.
- **Astronaut owns the data.** Crew member chooses what is shared with the CMO and the ground; private by default for mood/journal entries. This supports honest self-reporting.
- **Offline-first.** Everything computes on device; sync to ground is store-and-forward.

**Visual direction.** Mission-control calm, not sci-fi chrome: neutral dark surfaces, one accent colour, status colours reserved for status, a monospace for numbers. Ask the coding agent to build a small token set (colours, spacing, type) first so every screen stays consistent.

## Architecture & contributor model

The system is a pipeline of swappable parts: data adapters in, one shared schema, one baseline engine, and one self-contained plugin per health domain. A contributor can add a sensor, a domain, or an action card without touching anything else.

&#91;embedded content: system architecture · sense, understand, act\]

All sources normalize into one schema; the baseline engine is the only path to a status; outcomes of completed action cards are logged back for evaluation.

**Recommended stack (v1).** TypeScript end to end: React + Vite front end as an installable offline web app (PWA), engine and modules in a shared TypeScript package, Zod for schema validation, Recharts or visx for charts. One language keeps the coding agent fast and makes the "runs on the crew tablet, no server" story literal. A `research/` folder of Python notebooks validates each model on public data without touching the app. Alternative if your coder prefers Python: FastAPI engine + React UI, at the cost of hosting a server for the demo.

**Repo layout.**

```
spacehealth/
  packages/core/        schema, baseline engine, status engine
  modules/
    sleep-alertness/
      manifest.yaml     inputs, thresholds, citation keys
      model.ts          compute(series, baseline) -> Indicator
      cards/*.md        protocol cards (front-matter + steps)
      model.test.ts
    cardio/  immune/  bone/  vision/  radiation/  mood/  habitat/
  adapters/             synthetic, wearable-csv, dosimeter
  sim/                  mission generator + scenarios/*.yaml
  app/                  React UI + design tokens
  research/             notebooks validating models
  docs/                 CONTRIBUTING, module guide, evidence log
```

**The module contract (what makes it open to others).** Each domain module exports one function and one manifest:

- `manifest.yaml`: id, name, hazard (RIDGE), input signal types, baseline window, thresholds, citation keys, which cards it can trigger.
- `compute(signals, baseline) → { status, score, reason, evidence[], cardId }`. Pure function, no UI code, unit-testable with a scenario file.
- `cards/*.md`: Markdown with front-matter (`trigger`, `retestAfter`, `escalateIf`) so clinicians and writers can edit protocols without code.

**Contribution paths.** Scientists add or refine a module; designers improve cards and screens; data people write adapters; anyone can add a scenario YAML (e.g. "week-long CO2 excursion") that doubles as a regression test. Ship with CONTRIBUTING.md, a "new module" issue template, `good first issue` labels, an open-source licence (Apache-2.0 suggested), and an evidence log where every threshold links to its source.

## Part 1 — v1: a working, tested demo (Saturday)

By Saturday night we have one deployed link where a judge can replay a 180-day mission for a 4-person crew, watch problems appear and get caught, open the action card, and take a real 3-minute reaction test. Everything below exists to make that true.

**1. Synthetic mission generator (`sim/`).** Daily and nightly values, not raw sensor streams, which keeps it fast and easy to inspect.

- Crew of 4, each with their own normal (different resting HR, sleep need, reaction time).
- 14 pre-flight days to learn the baseline, then 180 mission days.
- Signals per day: overnight resting HR, HRV (RMSSD), sleep hours, skin-temperature change, PVT-B mean reaction time and lapses, mood and stress (1–5), exercise minutes, radiation dose, cabin CO2.
- Realistic noise and weekday rhythm, plus a scenario file (`scenarios/*.yaml`) that injects events on chosen days. All injected effect sizes are demo assumptions, labelled as such in the file.
- Fixed random seed, so every run and every test gives the same mission.

**2. Baseline engine (`packages/core`).** Pre-flight median and robust spread (MAD × 1.4826) per person per signal, an optional 28-day rolling update like the Stanford RHR method, a z-score per day, and a one-sided CuSum to catch slow drift that never crosses a single-day threshold.

**3. Five v1 modules.** Sleep & alertness, cardiovascular, immune strain, radiation, mood. Each follows the module contract and ships with its action card(s).

**4. Five screens.** Today, Daily check-in (with a playable PVT-B: random 1–4 s gaps, 3 minutes, lapse = reaction over 355 ms), Domain detail with baseline band, Action card, and a **Mission replay bar**: play/pause, speed, scrub to any day, crew-member switcher. Replay is our demo engine.

**5. Validation panel.** One screen that runs every scenario and shows, per injected event: detected or not, how many days early or late, and false alerts in quiet periods. This is our answer to "Validity" and is unusual for a hackathon entry.

**Test scenarios and pass criteria.**

| # | Scenario (injected) | Signals changed | Expected result | Pass if |
| --- | --- | --- | --- | --- |
| S1 | Quiet mission, no events | none | Mostly green | No Act alerts; at most 1 Watch per crew member per 30 days |
| S2 | Infection: physiology shifts day 40, symptoms logged day 42 | RHR up, HRV down, skin temp up, then symptom tap | Immune Watch, then Act, infection card | First flag on or before day 42 (symptom day) |
| S3 | Solar particle event, day 72 | One-day dose spike | Radiation Act, shelter card, budget updated | Act the same day; cumulative dose correct to the unit |
| S4 | Sleep restriction, days 95–101 | Sleep down, PVT slower, more lapses | Sleep & alertness Watch, then Act | Watch within 2 days of onset; Act by day 4 |
| S5 | Slow mood decline, days 140–160 | Mood and stress drift, no single bad day | Mood Watch via CuSum | Flagged before day 155; no flag in S1 |

**Testing layers.** Unit tests for the engine (known inputs give known z and CuSum), one test per module per scenario (the table above, automated), and a smoke test that the app builds and loads the demo mission. The coding agent should make these tests run in CI on every push so the README can show a green badge.

**Done when (end of Part 1).**

- [ ] Public link loads the demo mission in under 3 seconds
- [ ] All five scenarios pass in the test suite and in the Validation panel
- [ ] Every flag shows reason, baseline, and citation
- [ ] PVT-B check-in works with mouse, touch, and keyboard
- [ ] README with setup, screenshots, and how to add a module

**Not in v1.** Bone, vision and habitat modules, CMO view, ground sync, real device import. These are Part 2.

## Part 2 — v2: breadth, crew view, polish (Sunday)

Part 2 only starts once every Part 1 box is ticked. It adds the remaining hazards, the crew-medical-officer angle, and the submission package, in priority order so we can stop at any line and still have a coherent product.

1. **Bone & muscle module.** Projected hip and spine loss from days in microgravity, using the ISS rates (hip about 1.2–1.5% per month, spine 0.8–0.9%), with exercise adherence as an adjustable slowing factor. Scenario S6: exercise skipped days 120–130 → Bone Watch. The adherence factor is a labelled assumption.
2. **Vision (SANS) self-check.** A digital Amsler grid and near-vision chart in the check-in; any new distortion goes straight to Act with an imaging and CMO card.
3. **Habitat module.** Cabin CO2, temperature and noise against fixed operating limits, linked to symptoms (headache, poor sleep).
4. **CMO view.** Crew grid of statuses, showing only what each astronaut chose to share. Shows the privacy model working.
5. **Ground sync + export.** A "comms window" simulation: messages queue during blackout, send when the link is back, with the delay shown. Export the health log as IEEE 1752 / Open mHealth-style JSON.
6. **Multivariate anomaly (stretch).** A Mahalanobis-distance score across signals, as used in the Stanford smartwatch work, shown beside the simple rules so judges see we compared methods.
7. **Real-data sanity check (stretch).** Run the cardio/immune detector on a public wearable dataset in `research/` and report the result in the README. Only if time allows; synthetic validation is the core.
8. **Submission package.** 30-second video, project page text, references list, screenshots, and a 1-page "how to contribute a module" guide.

**Optional offline explainer (stretch, after item 6).** A small open model runs inside the browser with WebLLM on WebGPU, downloaded once and cached so it works with no internet. It only rewrites the engine's fixed facts into plain answers ("Why is my immune tile amber?"), never sets a status, and falls back to template text when the model isn't loaded or the device lacks WebGPU.

## Timeline, roles, and the coding-agent brief

We build engine-first and test-first, so the UI is drawn on top of something already proven. Times are Central; confirm your local event's exact submission deadline and keep a 2-hour buffer before it.

1. **Sat 11:45–12:30 · Phase 0.** Kickoff, repo, frozen output format and signal list.
2. **Sat 12:30–15:00 · Phase 1.** Mission generator, baseline engine, detection rules.
3. **Sat 15:00–18:00 · Phase 2.** Five modules, action cards, scenario tests.
4. **Sat 18:00–22:00 · Phase 3.** Real data in the app, check-in, replay, validation panel, deploy. **Part 1 done.**
5. **Sun 08:00–12:00 · Phase 4.** Bone, vision, cabin air, CMO view.
6. **Sun 12:00–17:00 · Phase 5.** Polish, project page, video script and recordings.
7. **Sun 17:00–20:00 · Phase 6.** Video, submission form, final check, submit.

Owners, "done when" outcomes and status for every task are tracked in the Action Plan.

**Roles.** A (AI, physics) owns the model and backend, drives the coding agent through the dashboard, deploys, and edits the video. B (biology) owns the research (problems, signals, scenarios, rules, action cards) in the Research Workbook, tests the app as "the astronaut", and writes the science text. The coding agent builds to A's briefs. Claude drafts research for B to verify, reviews agent output, and drafts the pitch script.

**Brief to paste into the coding agent (Part 1).**

```
Build "SpaceHealth", an offline-first astronaut health self-monitoring web app
(NASA Space Apps 2026, Health Monitoring Software challenge).

CORE IDEA: learn each astronaut's pre-flight normal, flag drift in flight,
show why, and give an action card. Gather -> Evaluate -> Act.

STACK: TypeScript monorepo. React + Vite PWA, Zod schemas, Recharts or visx,
Vitest. No backend; all compute in the browser. Deploy static (Vercel or
GitHub Pages). GitHub Actions CI runs tests on every push.

REPO:
  packages/core   schema, baseline engine, status engine
  modules/<id>/   manifest.yaml, model.ts, cards/*.md, model.test.ts
  adapters/       synthetic (v1)
  sim/            seeded mission generator + scenarios/*.yaml
  app/            React UI + design tokens
  docs/           CONTRIBUTING.md, MODULE_GUIDE.md

DATA: 4 crew, 14 pre-flight days + 180 mission days, daily values:
rhr, hrv_rmssd, sleep_h, skin_temp_delta, pvt_mean_rt_ms, pvt_lapses,
mood_1to5, stress_1to5, exercise_min, dose_msv, co2_ppm, symptoms[].
Per-person baselines differ. Seeded RNG. Scenario YAML injects events
(see S1-S5 in the plan doc). Label all effect sizes as demo assumptions.

ENGINE: per person/signal baseline = pre-flight median and MAD*1.4826;
optional 28-day rolling update; daily z; one-sided CuSum on z.
Status: nominal |z|<2; watch 2<=|z|<3 or CuSum alarm or 2 days out;
act |z|>=3 sustained or hard limit. Radiation: cumulative vs 600 mSv
career, SPE alarm. Max 3 active alerts shown.

MODULE CONTRACT: compute(signals, baseline) ->
{ status, score, reason, evidence[], cardId }. Pure, no UI.
v1 modules: sleep-alertness, cardio, immune, radiation, mood.

SCREENS: Today (8 tiles: status word + icon + colour + 1-line reason),
Check-in (playable PVT-B: 3 min, 1-4 s random gaps, lapse > 355 ms,
false start < 100 ms; then mood/stress/symptom taps), Domain detail
(trend + shaded baseline band + events + 'why flagged' + citation),
Action card (steps, retest timer, Done, Escalate with comms delay),
Replay bar (play/pause/speed/scrub day/crew switcher),
Validation panel (per scenario: detected?, lead/lag days, false alerts).

DESIGN: dark-first, calm, one accent colour, status colours only for
status, never colour alone, large touch targets, monospace numbers.
Build tokens first.

TESTS: engine unit tests; one test per module per scenario using the
pass criteria table; app smoke test. All green before UI polish.

ORDER: sim -> engine -> modules+tests -> UI -> replay -> validation
-> deploy -> README. Report back after each step.
```

## Judging fit and 30-second demo

Each judging criterion has one concrete thing in the product that earns it; the video shows all five in 30 seconds.

| Criterion | What earns it | Where judges see it |
| --- | --- | --- |
| Impact | Directly serves NASA's Earth-independent medical operations need; the same baseline method works for remote and Antarctic crews on Earth | Project page opening line |
| Creativity | Personal baselines + action cards + live reaction test, instead of a generic vitals dashboard | Today screen, PVT-B |
| Validity | Every threshold cited; scenario tests with measured lead time and false-alarm rate | Validation panel, README badge |
| Relevance | Covers all challenge hazards: immune, bone, cardiovascular, behavioral, plus radiation and habitat | Eight domain tiles |
| Presentation | Calm, consistent design; one clear story | The video |

**30-second storyboard.**

This follows the timing the submission guide recommends. Record our own voices (an AI voice would need disclosure) and burn in English subtitles.

1. **0:00–0:02 · Who we are.** Team name and both names over the title card.
2. **0:02–0:05 · The challenge.** "On the way to Mars, astronauts must spot their own health problems."
3. **0:05–0:10 · Name and tagline.** "SpaceHealth knows your normal, flags what isn't, and tells you what to do." Today screen.
4. **0:10–0:20 · How it works.** Replay to day 40: Immune turns amber two days before symptoms (real lead time from the Validation panel), tap "Why", action card. Wi-Fi switched off on screen: it still works. Caption: built on NASA health standards and research.
5. **0:20–0:30 · The future.** Validation panel all green; "Open modules anyone can add, for Mars crews, Antarctic stations, and remote workers on Earth." End card with repo link.

## Submission package

Judges score mainly from the project page, so every form field below is drafted by Sunday 15:30 and checked against the submission guide before we click Submit. Deadline: Sunday Nov 15, 11:59 p.m. local time; we target 20:00.

| Form field | What we put there | Drawn from | Owner |
| --- | --- | --- | --- |
| Project Name | SpaceHealth | — | A |
| High-Level Project Summary | What we built, how it answers the challenge, why it matters, in 3–4 sentences | Concept; The challenge, explained | B drafts, A edits |
| Link to Project Demo | 30-second video, public YouTube or Drive link, English subtitles | 30-second demo storyboard | A |
| Link to Final Project | Public GitHub repo; README links the live demo | Repo | A |
| Detailed Project Description | What it does, how it works, benefits, what we hope to achieve, tools and languages used | Science backbone; Architecture; Part 1 | B and A |
| Use of AI tools | Claude: literature research, organizing the plan, drafting docs; coding agent: code under our direction; any AI-made image or video watermarked | This plan | A |
| NASA Data | The NASA resources below (at least one is required for Global Awards) | List below | B |
| Space Agency Partner Data and Other References | CSA Bio-Monitor (Astroskin), every paper, library, tool, image and code source used | References | B |

**NASA data and resources (candidates; A is searching for more datasets).**

- **NASA-STD-3001 radiation limits** (600 mSv career, 250 mSv per event): used directly in the radiation module.
- **NASA Human Research Program hazards (RIDGE) and evidence reports**: structure our eight health domains.
- **NASA Open Science Data Repository (OSDR)**, including Inspiration4 crew data: candidate for realistic signal ranges or a validation check.
- **NASA Twins Study**: supports the personal-baseline approach.
- **NASA Exploration Medical Capability work on Earth-independent medical operations**: frames the problem.
- **Partner:** CSA Bio-Monitor / Astroskin, the ISS smart shirt our sensor set mirrors. Add ESA or JAXA datasets if found.

**Other rules from the guide.** Both members must be confirmed participants at the same Local Event. All content must be in English. No images, video or voices of anyone under 18. List every resource used, even open-source ones.

## Risks and open questions

The biggest risk is scope: eight domains is too many for one day, so v1 ships five and Part 2 is strictly ordered.

| Risk | Fallback |
| --- | --- |
| Synthetic data looks fake or rigged | Publish the scenario files and seed; state effect sizes as assumptions; show S1 quiet-mission false-alarm rate, not just hits |
| Judges see "just thresholds" | Show CuSum catching the slow mood decline that no single-day threshold catches; Part 2 adds a multivariate method for comparison |
| PVT-B timing is off in browsers | Use `performance.now()` and `pointerdown`; note it is a demo, not a validated instrument |
| Over-claiming medicine | Every card says it supports, not replaces, the CMO; no diagnoses, only "possible" and next steps |
| Running out of time Sunday | Part 2 is ordered; stop at any item and submit |

**Open questions for you.**

- [ ] Paste the challenge page's Objectives, Considerations and Resources tabs so Claude can check coverage and cite their listed data.
- [ ] Confirm the exact submission deadline with the local event and log it in the Action Plan.

**Answered:** two-person team (A: AI and physics, B: biology); name SpaceHealth; TypeScript stack; no LLM in the detection path.

**Disclaimer for the project page.** SpaceHealth is a research prototype using simulated data. It is not a medical device and does not diagnose.

## References

These are the sources the plan relies on; all must also be cited on the project page.

**NASA framing and standards**

- NASA Human Research Program, [Five hazards of human spaceflight](https://www.nasa.gov/hrp/hazards)
- NASA, [The Human Body in Space](https://www.nasa.gov/humans-in-space/the-human-body-in-space/)
- Easter et al., [Earth Independent Medical Operations (EIMO)](https://ntrs.nasa.gov/citations/20230016189), NASA HRP 2024
- Russell et al., [The value of a spaceflight clinical decision support system for EIMO](https://www.pubmed.gov/37344482/), npj Microgravity 2023
- NASA OCHMO, [Radiation protection technical brief (NASA-STD-3001)](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf)

**Physiology evidence**

- Garrett-Bakelman et al., [The NASA Twins Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC7580864), Science 2019
- Overbey et al., [Space Omics and Medical Atlas (SOMA)](https://soma.weill.cornell.edu/apps/SOMA_Browser), Nature 2024
- Lang et al. 2004, bone loss in long-duration flight, [summary via National Academies](https://www.nap.edu/read/11467/chapter/10)
- Lee et al., [Orthostatic intolerance after ISS and Shuttle missions](https://www.pubmed.gov/26630196/), 2015
- Rooney et al., [Herpes virus reactivation in astronauts](https://pmc.ncbi.nlm.nih.gov/articles/PMC6374706), Front Microbiol 2019
- NASA, [SANS 2023 clinical update](https://ntrs.nasa.gov/citations/20220014606)
- Barger et al. 2014, sleep deficiency and hypnotic use in astronauts, [summary](https://www.news-medical.net/news/20140810/Space-missions-affect-sleep-patterns-in-astronauts.aspx), Lancet Neurology

**Cognition and alertness**

- Basner et al., [Development and validation of the Cognition test battery](https://www.med.upenn.edu/uep/cognition.html), Aerosp Med Hum Perform 2015
- Basner, Mollicone, Dinges, [Brief PVT (PVT-B) validity and sensitivity](https://pmc.ncbi.nlm.nih.gov/articles/PMC3197786), Acta Astronautica 2011

**Personal-baseline detection methods**

- Li et al., [Wearable biosensors reveal health-related information](https://med.stanford.edu/news/all-news/2017/01/wearable-sensors-can-tell-when-you-are-getting-sick.html), PLOS Biology 2017
- Mishra et al., [Pre-symptomatic detection of COVID-19 from smartwatch data](https://www.nature.com/articles/s41551-020-00640-6), Nat Biomed Eng 2020
- Alavi et al., [Real-time alerting system using wearable data](https://www.nature.com/articles/s41591-021-01593-2), Nature Medicine 2022

**Data, hardware and standards**

- [NASA Open Science Data Repository (OSDR)](https://registry.opendata.aws/nasa-osdr/), includes Inspiration4 crew data
- Canadian Space Agency, [Bio-Monitor / Astroskin](https://www.asc-csa.gc.ca/eng/sciences/astroskin.asp): the real ISS smart-shirt our sensor list mirrors
- [IEEE 1752.1 Open mHealth standard](https://standards.ieee.org/ieee/1752.1/6982/)
- Space Apps, [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) (judging criteria, 30 s / 7-slide limit)
