# SpaceHealth — Two-Person Action Plan (Sat–Sun)

Nov 14, 2026 · @Narayan

**SpaceHealth doc set:** SpaceHealth — Astronaut Health Self-Monitoring (Space Apps 2026 Plan) (what and why) · SpaceHealth — Team Workflow by Role (roles and handoffs) · SpaceHealth — Two-Person Action Plan (Sat–Sun) (time-boxed tasks, tracked) · SpaceHealth — Research Workbook (B) (B's research file)

Two people, one coding agent and Claude as research support ship a tested v1 by Saturday 22:00 and submit by Sunday 20:00, leaving a buffer before the deadline. Every task has an owner, a time box, and a "done when" outcome; a phase only starts when its gate check passes.

## At a glance

&#91;embedded content: roadmap · 7 phases, 6 gates\]

Each diamond is a 10-minute gate call; the next phase starts only when its gate passes. Bands are not drawn to time scale.

## Who does what

Each area has exactly one owner who decides, and the other person reviews. In the tables below, **A** = Member A (you), **B** = Member B (teammate), **Agent** = the coding agent driven by A, **Claude** = research support.

| Who | Owns | Decides | Reviews |
| --- | --- | --- | --- |
| **A — you (AI, physics)** | Output contract, simulated-mission generator, baseline engine, modules, radiation and bone physics, tests, deployment, video edit | Code, model choice, architecture | B's specs for feasibility |
| **B — teammate (biology)** | Problem list, signal map, normal ranges and illness effects, detection rules, action cards, pass rules, science text | Anything biological or medical | Simulated data and app wording for realism and clarity |
| **Agent** | Writing code to A's briefs, including the whole dashboard | Nothing; it proposes | Its own tests |
| **Claude** | First drafts of B's research files from the literature; review of agent output and of the plan | Nothing; it drafts | Specs vs. sources |

Scope cuts are decided by A and B together, and when in doubt, cut.

## How we work

One repo holds every file, one chat carries quick pings, and a 10-minute call at each gate is the only scheduled meeting.

**Where things live (share).**

| What | Where | Rule |
| --- | --- | --- |
| Code and research files | GitHub repo (public) | Single source of truth for code. Only A pushes; B's research reaches the repo through A |
| Plan, workflow, this action plan | These three docs | Update the Status column as you go; comment on anything unclear |
| Quick questions, "ready" pings | One Discord channel | Nothing decided in chat counts until it is in the Decision log below |
| Screenshots for review | Same chat thread | Post one after every screen the agent builds |
| B's research (problems, signals, scenarios, rules, cards) | Research Workbook doc (shared link) | B fills its tables with Claude; A converts each finished section into repo files and pushes |

**How we hand off (build).**

1. **B (research):** fills a section of the Research Workbook with Claude, then posts on Discord: `READY: <section> — <one line on what changed>` with the workbook link.
2. **A:** converts that section into the repo file (or pastes it to the coding agent: "turn this table into `research/signals.yaml`"), pushes, and replies `PUSHED: <file>` within 15 minutes, or `QUESTION:` with one specific question.
3. **A (code):** pushes small commits and posts a screenshot or `PUSHED: <what>` on Discord after each finished piece.
4. **The task owner** sets Status to Done here. For B's tasks, "committed" in the tables below means "finished in the workbook and pushed by A".

Commit messages start with the area: `research:`, `sim:`, `engine:`, `module:`, `ui:`, `docs:`. Small commits, often.

**How we discuss.**

- **Gate calls, 10 minutes, fixed agenda:** (1) does the gate pass, yes or no; (2) what is blocked; (3) what we cut or move. Log the result.
- **Blocked for more than 20 minutes:** call the other person immediately; don't wait for the gate.
- **Disagreement:** the owner of that area decides (biology → B, code → A). Scope cuts are joint.
- **Asking Claude:** B can comment on any of these docs and tag Claude for drafts or source checks. A pastes the coding agent's summaries here for review.

**If a gate fails.** Spend at most 30 minutes fixing it. If it still fails, cut the smallest piece that makes it pass (for example, drop one scenario or one module), log the cut, and move on. Never let a gate slip by more than an hour.

## Phase 0 — Kickoff and contract (Sat 11:45–12:30)

Goal: agree what we build and freeze the shared format, so both people can work in parallel from 12:30.

| # | Time | Owner | Task | Done when (outcome) | Status |
| --- | --- | --- | --- | --- | --- |
| 0.1 | 11:45–11:55 | A + B | Kickoff call: skim the plan and workflow docs, confirm name, the 5 v1 problems, and roles | Decisions in the Decision log | Not started |
| 0.2 | 11:55–12:15 | A | Create public repo, invite B, add CI, paste the brief into the coding agent | B can open the repo; CI runs green on an empty test; agent has replied with its plan | Not started |
| 0.3 | 11:55–12:20 | B + Claude | `research/problems.md`: the 5 v1 problems, why each matters, one source each | File committed; A has read it | Not started |
| 0.4 | 12:05–12:25 | B + Claude | `research/signals.yaml`: every signal with name, unit, sensor, frequency, normal range | Every signal the 5 problems need is listed with units | Not started |
| 0.5 | 12:10–12:30 | A + Agent | Output types and `mock_output.json` (shape from the workflow doc's contract section) | Mock file loads in a test; B has checked the field names | Not started |

**Gate G0 (12:30, 10-min call).** Pass if: the signal list and the output format are frozen. Any later change to either needs both A and B to agree.

## Phase 1 — Foundations (Sat 12:30–15:00)

Goal: a simulated mission exists, the baseline engine works on it, and every detection rule is written down.

| # | Time | Owner | Task | Done when (outcome) | Status |
| --- | --- | --- | --- | --- | --- |
| 1.1 | 12:30–13:30 | B + Claude | Scenario files S1–S5: four crew members' normal ranges; for each injected problem, which signals change, by how much, from which day; pass rule per scenario | `sim/scenarios/*.yaml` committed; every effect size marked as an assumption | Not started |
| 1.2 | 12:30–14:00 | A + Agent | Mission generator: reads scenarios, outputs 4 crew × 194 days, fixed seed | `mission_signals.json` exists; a quick plot shows the S2 infection by eye | Not started |
| 1.3 | 13:30–14:45 | A + Agent | Baseline engine: pre-flight median, robust spread, daily z-score, CuSum | Unit tests pass against numbers A checked by hand | Not started |
| 1.4 | 13:30–14:45 | B + Claude | Detection rule per v1 problem (`manifest.yaml`): signals, baseline window, Watch/Act rules, hard limits, sources | 5 manifests committed; A confirms each is codeable | Not started |
| 1.5 | 12:45–14:45 | Agent (A reviews) | Design tokens, then the Today screen built on the mock file | Screenshot in chat; B can tell each tile's meaning within 5 seconds | Not started |

**Gate G1 (15:00, 10-min call).** Pass if: engine tests are green, the S2 plot shows the infection, all 5 manifests are in, and Today renders. If a manifest is missing, A starts on the other four.

## Phase 2 — Modules and tests (Sat 15:00–18:00)

Goal: the five modules produce real statuses, every scenario is tested automatically, and the action cards are written.

| # | Time | Owner | Task | Done when (outcome) | Status |
| --- | --- | --- | --- | --- | --- |
| 2.1 | 15:00–16:30 | A + Agent | Build the 5 modules from the manifests (sleep, cardio, immune, radiation with dose physics, mood) | Every module returns status, reason and evidence for every crew member and day | Not started |
| 2.2 | 16:00–17:15 | A + Agent | Status and action engine (3-alert limit), then automated scenario tests S1–S5 | Test report lists pass or fail per scenario | Not started |
| 2.3 | 15:00–16:30 | B + Claude | Action cards: steps, recheck time, when to call the medical officer, one source each | 5–7 cards committed, each under 80 words | Not started |
| 2.4 | 16:30–17:30 | B | Biology check of the simulated data and first results; tune effect sizes if unrealistic | B signs off "plausible" in chat, or files specific fixes | Not started |
| 2.5 | 15:00–17:45 | Agent (A reviews) | Domain detail screen (baseline band) and Action card screen, on the mock file | Screenshots in chat; B approves the wording | Not started |

**Gate G2 (18:00, 10-min call).** Pass if: at least 4 of 5 scenarios pass. For a failing one, decide together whether B adjusts the rule or A fixes the code; it must pass by G3.

## Phase 3 — Interface and v1 release (Sat 18:00–22:00)

Goal: the real mission runs in the app, a judge can replay it and take the reaction test, and v1 is live at a public link. **Part 1 ends here.**

| # | Time | Owner | Task | Done when (outcome) | Status |
| --- | --- | --- | --- | --- | --- |
| 3.1 | 18:00–19:00 | A + Agent | Swap the mock for the real output file | App shows the simulated mission; no console errors | Not started |
| 3.2 | 19:00–20:30 | A + Agent | Check-in screen with PVT-B, plus the scoring function | A 3-minute run gives reaction time and lapses; works with mouse, touch and keyboard | Not started |
| 3.3 | 19:30–21:00 | A + Agent | Replay bar and Validation panel | Scrubbing to day 40 shows the infection flag; the panel shows all 5 scenarios | Not started |
| 3.4 | 18:30–20:00 | B | Usability test as "the astronaut": find what's wrong, why, what to do; take a check-in; find the dose budget | Ranked list of issues in chat; top 3 fixed by 21:30 | Not started |
| 3.5 | 20:00–21:30 | B + Claude | README science section: problems, method, assumptions list, references | Section committed; every number in the app traces to a source or a stated assumption | Not started |
| 3.6 | 21:00–21:45 | A | Deploy a live demo (optional; the public GitHub repo is our required project link), add test badge, open the link in a private window | Public link works on a phone and a laptop | Not started |

**Gate G3 (22:00, 10-min call).** Pass if: every box in the plan doc's Part 1 checklist is ticked. Then stop: fix only blockers until 23:30, and both sleep at least 6 hours. A rested Sunday is worth more than one extra feature.

## Phase 4 — Part 2 build (Sun 08:00–12:00)

Goal: cover the remaining hazards and add the crew medical officer's view, without breaking v1. Tasks are in cut order: drop from the bottom if behind.

| # | Time | Owner | Task | Done when (outcome) | Status |
| --- | --- | --- | --- | --- | --- |
| 4.1 | 08:00–09:30 | B + Claude | Specs and cards for bone, vision (SANS self-check) and cabin air; scenario S6 (missed exercise) | 3 manifests, 3 cards, 1 scenario committed | Not started |
| 4.2 | 09:00–11:30 | A + Agent | Bone-loss projection (physics), Amsler-grid vision check in check-in, cabin-air module | S6 passes; all v1 tests still green | Not started |
| 4.3 | 09:30–11:30 | B, then Agent | CMO view: B defines what each astronaut can choose to share; Agent builds the crew grid | Hidden items never appear in the CMO view (tested) | Not started |
| 4.4 | 10:30–12:00 | A + Agent | Stretch: adaptive baseline or multivariate score, compared with the simple rules in the Validation panel | Panel shows both methods' detection days and false alarms | Not started |

**Gate G4 (12:00, 10-min call).** Pass if: new modules work and every earlier test still passes. Anything unfinished is cut, not carried.

## Phase 5 — Polish and story (Sun 12:00–17:00)

Goal: the product feels finished and the story is ready to record. At 17:00 features freeze; after that, only bug fixes.

| # | Time | Owner | Task | Done when (outcome) | Status |
| --- | --- | --- | --- | --- | --- |
| 5.1 | 12:00–13:00 | A + Agent | Stretch: comms-blackout simulation and health-log export (cut first if behind) | Escalation queues during blackout and sends after; export downloads | Not started |
| 5.2 | 13:00–14:30 | A + B | Joint polish pass: every screen, wording, empty states, phone layout, accessibility | Both agree nothing on screen confuses a first-time viewer | Not started |
| 5.3 | 14:00–15:30 | B + Claude | Project page text: challenge, solution, science, how we tested, NASA and partner resources used, references | Draft in a shared doc; A has read it | Not started |
| 5.4 | 14:30–15:30 | A + Claude | Final 30-second video script from the storyboard, with the real numbers from the Validation panel | Script timed to 30 s when read aloud | Not started |
| 5.5 | 15:30–17:00 | A | Screen recordings for each shot | Every shot in the script has a clip | Not started |

**Gate G5 (17:00, 10-min call).** Pass if: features are frozen, the deployed app matches the recordings, and the project page draft is complete.

## Phase 6 — Submit (Sun 17:00–20:00)

Goal: submitted by 20:00, hours before the deadline. Confirm the exact deadline with your local event at kickoff and log it.

| # | Time | Owner | Task | Done when (outcome) | Status |
| --- | --- | --- | --- | --- | --- |
| 6.1 | 17:00–18:30 | A | Edit the video: 30 seconds or less, captions on, public link | Plays in a private window; length is 30 s or less | Not started |
| 6.2 | 17:30–18:30 | B | Fill the submission form from the project page draft; cite every resource used | Every source in the README is also on the form | Not started |
| 6.3 | 18:30–20:00 | A + B | Final check and submit | Checklist below all ticked, then submitted | Not started |

**Final checklist (both people tick it together).**

- [ ] Both members confirmed as participants at the same Local Event
- [ ] Public GitHub repo (this is our "Link to Final Project"); README explains setup in 3 steps
- [ ] Demo video is 30 seconds or less, on YouTube or Google Drive, opens in a private window with no sign-in, has English subtitles
- [ ] Every form field filled in English (see the Plan's Submission package section)
- [ ] At least one NASA data source or resource named in the NASA Data field (required for Global Awards)
- [ ] AI-tool use disclosed in the README and project page: Claude for research, organizing and drafting; coding agent for code under our direction; AI-generated code acknowledged in text and metadata; any AI-generated image or video watermarked
- [ ] No images, video or voices of anyone under 18
- [ ] Disclaimer present: research prototype, simulated data, not a medical device
- [ ] "Terms and Conditions" and "Confirm All Work is Original" boxes ticked, "Submit for Judging" clicked, confirmation banner seen

## Decision log

Every decision from a gate call or chat goes here, newest first; if it isn't here, it isn't decided.

| When | Decision | Decided by | Why |
| --- | --- | --- | --- |
| Sat 11:45 (to confirm at 0.1) | Project name: SpaceHealth (decided Sat 11:49) | A + B | Team choice |
| Sat 11:45 (to confirm at 0.1) | v1 problems: sleep, cardio, immune, radiation, mood | A + B | Covers the challenge's named risks and is detectable with simple sensors |
| Sat 11:45 (to confirm at 0.1) | No LLM in the detection path; TypeScript stack | A | Testable, offline, repeatable results |
| Sat 11:45 (to confirm at 0.1) | *Submission deadline: Sun Nov 15, 11:59 p.m. local time (submission guide); we target 20:00* | A + B | Sets the Sunday buffer |
