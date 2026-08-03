# Blue Manor Academy — Proposal

Online Pre-K–12 Christian homeschool platform: self-paced curriculum,
live Zoom classes/clubs/mentorships, and a peer-to-peer student video
system ("Kids-Teach-Kids"). This directory holds the proposal for a
companion mobile/installable app centered on the live Zoom experience —
a working, deployed demo now exists (see `../app/`), and several open
items below have since been resolved through direct screen-share
observation during a live conversation with BMA, not this session's own
tooling (which couldn't reach the site directly — see AUDIT.md's
methodology note for what that limitation was and section 10 for what's
since been confirmed directly).

- [AUDIT.md](AUDIT.md) — full teardown: what Blue Manor Academy is, its
  full property map, the headline finding that it already has a
  three-year professional dev vendor (LaSoft), and (section 10) direct
  confirmation of the real logged-in product — Parent Dashboard, Credit
  Chart, Parent Library, and real class schedule
- [SCOPE.md](SCOPE.md) — the proposal: a companion app (not a platform
  rebuild) built around one-tap Zoom join, offline curriculum access, and
  push reminders, plus the real complications — COPPA/child-data
  compliance, the honest risk that LaSoft could just build this
  themselves, and the Nth-weekday/seasonal scheduling recurrence a real
  class feed needs to handle
- [PRICING.md](PRICING.md) — the numbers
- [PITCH_SCRIPT.md](PITCH_SCRIPT.md) — pitch call script

## Open items before this can become a fixed build

1. **Confirm whether LaSoft has already been asked about, or is already
   building, a native app.** Still the single fact most likely to change
   everything else in this proposal.
2. ~~Get a direct crawl/walkthrough of the live site~~ — done via direct
   screen-share (AUDIT.md section 10). One correction that came out of
   it: the logged-in app lives at `www.bluemanoracademy.com/accounts/*`,
   not the separate `fe.bluemanoracademy.com` subdomain this pass's
   indirect sources had pointed to — worth confirming directly whether
   `fe.` is a legacy/parallel interface.
3. Confirm what API/data access exists for class schedules, curriculum,
   and progress data — nothing here is public today, and the real
   schedule's recurrence pattern (AUDIT.md section 10) is more complex
   than assumed.
4. Confirm Zoom account tier and ownership model (shared vs.
   per-instructor).
5. ~~Confirm current pricing/trial length~~ — done (14-day trial,
   AUDIT.md sections 6 and 10). Founder family size and current
   HQ/location are still unconfirmed — public sources disagree on both.
6. Get a real legal read on COPPA and Apple/Google child-data app-store
   policies before committing to a fixed scope or price for anything
   touching child accounts or the Kids-Teach-Kids video feature.
