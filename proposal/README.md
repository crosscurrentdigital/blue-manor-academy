# Blue Manor Academy — Proposal (scoping stage)

Online Pre-K–12 Christian homeschool platform: self-paced curriculum,
live Zoom classes/clubs/mentorships, and a peer-to-peer student video
system ("Kids-Teach-Kids"). This directory holds the scoping-stage
proposal for a companion mobile/installable app centered on the live
Zoom experience — no build has started yet, and unlike this repo's
Piesano's Pacchia proposal, **the live-fetch tooling needed to crawl the
site directly was unavailable this entire session** (confirmed via a
control-URL test, not specific to this site), so this pass was built
from search-engine indexing, cached reviews, an ESA-vendor directory, and
the academy's own contracted dev agency's public case study rather than a
direct site crawl.

- [AUDIT.md](AUDIT.md) — full teardown: what Blue Manor Academy is, its
  full property map (marketing site, logged-in app subdomain, newsletter,
  affiliate portal, sister storefront, socials, ESA listing), and —the
  headline finding — that it already has a three-year professional dev
  vendor (LaSoft) who built its backend, dashboard, checkout, and a
  custom video system
- [SCOPE.md](SCOPE.md) — the proposal: a companion app (not a platform
  rebuild) built around one-tap Zoom join, offline curriculum access, and
  push reminders, plus the two real complications — COPPA/child-data
  compliance, and the honest risk that LaSoft could just build this
  themselves
- [PRICING.md](PRICING.md) — the numbers
- [PITCH_SCRIPT.md](PITCH_SCRIPT.md) — pitch call script (scoping-stage
  narration, not a live demo)

## Open items before this can become a fixed build

1. **Confirm whether LaSoft has already been asked about, or is already
   building, a native app.** This is the single fact most likely to
   change everything else in this proposal — ask it first.
2. Get a direct crawl/walkthrough of the live site and the logged-in
   `fe.bluemanoracademy.com` app — this pass relied on indirect sources
   only.
3. Confirm what API/data access exists for class schedules, curriculum,
   and progress data — nothing here is public today.
4. Confirm Zoom account tier and ownership model (shared vs.
   per-instructor).
5. Confirm current pricing/trial length, founder family size, and
   current HQ/location — public sources disagree on all three.
6. Get a real legal read on COPPA and Apple/Google child-data app-store
   policies before committing to a fixed scope or price for anything
   touching child accounts or the Kids-Teach-Kids video feature.
