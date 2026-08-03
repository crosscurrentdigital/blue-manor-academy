# SCOPE.md — The Proposal

Blue Manor Academy, an online Pre-K–12 Christian homeschool platform
(curriculum + live Zoom classes/clubs/mentorships + peer video). Full
teardown in `AUDIT.md`. Read that first — the short version is: **this is
not a green-field digital gap.** BMA already runs a professionally built,
actively maintained platform (checkout, dashboard, admin panel, a custom
peer-video system) through a three-year relationship with an agency
called LaSoft. The one real, confirmed gap is that none of it lives on a
home screen: no installable/native app, anywhere, for a product whose
core value is showing up to a live Zoom class on time.

## a. What this solves

The ask, reframed from "build us an app" into something specific and
honest: **make the live, human part of Blue Manor Academy — Zoom classes,
clubs, mentorships — something a family gets reminded about and joins in
one tap, from a home-screen icon, instead of something they have to
remember to go log into a browser for.** Layered on top: offline-capable
access to the self-paced curriculum, since the product is literature/
audio content that doesn't need a live connection to consume, and at
least one independent review already noted that "on a computer all the
time" is more friction than reading on a tablet.

## b. What we found

Full detail in AUDIT.md. In short: a small (1–10 employee), founder-run
business with a real, praised product and a genuine three-year
professional dev relationship already in place. No native app exists
anywhere for it. Live classes/clubs/mentorships run over Zoom, apparently
accessed through the browser dashboard, with no confirmed push-reminder
or one-tap-join flow. Founder-facts and company-location details
disagree across public sources the same way Piesano's owner-name and
hours did — don't repeat any of them as fact until confirmed directly.

## c. What we are proposing

**A companion app, not a platform rebuild.** Deliberately scoped to sit
*next to* the existing LaSoft-built dashboard/checkout/admin system, not
replace or duplicate it:

- **A "Today" home screen.** One glance: today's live classes/clubs/
  mentorships (if any), today's assigned self-paced curriculum items, and
  any new Kids-Teach-Kids content from channels the student follows.
  This is the actual daily-habit surface a browser bookmark can't be.
- **One-tap Zoom join, with real scheduling logic.** Push notification
  15 minutes before a class starts, tap to join — launching the native
  Zoom app (or Zoom's web client as fallback) rather than making a family
  hunt down a link in a dashboard. Timezone-aware by design: BMA's own
  marketing already describes clubs meeting "students from around the
  world," so a fixed-time class needs to display correctly whether a
  family is in Idaho or overseas — get this wrong and half the point of
  a reminder system (showing up on time) breaks silently.
- **Offline curriculum caching.** Download today's (or this week's)
  self-paced lesson content — e-book pages, audio — for use without a
  live connection. Directly answers the "cumbersome on a computer all the
  time" friction noted in AUDIT.md section 7, and fits a homeschool
  family's actual usage pattern (car trips, spotty rural connectivity,
  reading before bed) better than a browser tab requires.
- **"Resume where you left off" in the Library.** Raised directly: BMA's
  real Parent Library has no progress tracking today — a family has to
  remember on their own where they stopped in a book or video (AUDIT.md
  section 10). Confirmed already planned on BMA's side, but demonstrated
  here as a real, working feature — a per-item saved position, correct
  across a browser refresh or a different day, needing no backend at
  all. Not a claim this replaces whatever BMA ships; proof it's a small,
  genuinely buildable piece either way.
- **Push notifications, beyond just class reminders** — new
  Kids-Teach-Kids content from followed channels, streak/progress
  nudges tied to the existing gamification LaSoft built, and parent-side
  billing/renewal notices.
- **Joining class needs zero gate; Family/billing is the one thing that
  does.** Today, Schedule, Library, and Kids-Teach-Kids are always the
  app's default, ungated view — a kid should never have to unlock
  anything, switch a mode, or wait for a parent to hand off a device to
  reach a live class that's starting. The only PIN-gated page is Family
  (billing, progress dashboards — already exist server-side per AUDIT.md
  section 2, this app should read from that, not rebuild it — and
  multi-child management), reached via a small "Parent tools" control.
  That gate is also the right place to actually confirm what's real: a
  demo build tried the opposite design first (default to a "parent" view,
  require an explicit hand-off into a "kid" one) and it was flagged
  immediately as exactly the kind of blocker this proposal should not
  introduce.

## d. The Zoom integration, specifically — two real approaches, one clear default

This is the part the build request called out directly, so it's worth
being precise about the actual technical choice, not just saying "Zoom
integration" as a phrase:

1. **Deep-link join (the default we're proposing).** The app holds the
   meeting ID/link (pulled from BMA's existing class-schedule data) and
   launches the native Zoom app via its documented URL scheme, or Zoom's
   web client as a fallback if Zoom isn't installed. Low engineering
   lift, no Zoom developer account or SDK licensing needed, works
   immediately, and matches exactly what a family would do manually today
   — just with the friction (finding the link, remembering the time)
   removed.
2. **Zoom Meeting SDK, embedded in-app (optional, phase 2).** Video runs
   *inside* our app's UI instead of switching to Zoom's own app. This is
   a materially bigger build — Zoom SDK app review/approval, SDK key/
   secret management, and meaningfully more engineering and ongoing
   maintenance surface — for a UX gain (staying in one app) that may not
   matter much to a family that already has Zoom installed for a dozen
   other things. We'd only recommend this once the deep-link version is
   live and BMA specifically wants the fully embedded experience.

**Open question that gates both approaches equally** (see PRICING.md item
1): what Zoom account tier BMA runs, and whether one shared account or
per-instructor accounts host classes — this determines whether
"one-tap join" is a single predictable link pattern or something we need
to look up per-class from BMA's own scheduling data.

### Chess Club specifically — same deep-link pattern, a different vendor

Raised directly during scoping: could Chess Club integrate with
**ChessKid** (Chess.com's kids' platform — lessons, puzzles, and a Club/
Classroom management tool most scholastic chess programs already use)?
Checked directly: **ChessKid has no public embed API or SDK for
third-party apps.** Chess.com's own public API covers chess.com game/
stats data, not ChessKid — unsurprising, since ChessKid is COPPA-locked-
down specifically because its users are kids. Embedding actual gameplay
inside this app isn't realistically buildable without ChessKid's direct
cooperation, and that's a real vendor conversation to have, not something
to assume into scope or price against.

**What is buildable, using the exact same pattern as the Zoom link
above:** a secondary deep link out to ChessKid from the Chess Club
schedule card — practice puzzles and casual games between live sessions,
not embedded inside our UI. This requires BMA to actually run a ChessKid
Club/Classroom (a free tier exists — 20 free gold accounts for a new
classroom teacher, an Enterprise tier at 100+ registered kids) — **not
yet confirmed whether BMA has one**. Same discipline as everything else
unconfirmed in this proposal: don't assume it, ask directly, and the
Chess Club card simply doesn't show the ChessKid button if the answer is
no.

## e. The compliance layer this build introduces — said plainly, not buried

BMA serves children under 13 directly, not just their parents. A new
mobile app that touches child accounts, push notifications, and
particularly the Kids-Teach-Kids video feature (children's videos,
potentially viewable by other students) has real **COPPA** (Children's
Online Privacy Protection Act) obligations, plus Apple's and Google's own
app-store policies for apps directed at or used by children (restricted
SDKs/ad networks, stricter data-collection and parental-consent rules,
and — if listed under Apple's Kids Category or Google's Designed for
Families program — additional review requirements). This is not a
reason not to build this; BMA is presumably already handling this on the
web platform today. It **is** a reason to scope a real legal/compliance
review as part of discovery rather than discover a gap after submission
to the app stores — see PRICING.md item 1.

## f. What we are explicitly not proposing to touch

To keep this honest and scoped: we are not proposing to rebuild the
checkout flow, the parent progress dashboard, the admin panel, the
curriculum-customization system, or the Kids-Teach-Kids upload/hosting
backend. LaSoft already built all of that (AUDIT.md section 2) and, per
their own case study, BMA is happy with it. This app is a new,
additive surface that reads from BMA's existing systems (class schedule,
curriculum library, progress data) rather than a second system that
competes with them.

## g. What we need from Blue Manor Academy directly

- **API/data access** to the existing class schedule, curriculum
  library, and progress data this app needs to read from — the single
  biggest unknown, since none of it is public (unlike, say, a restaurant
  menu). This is most of what the discovery spike in PRICING.md item 1
  resolves.
- **Zoom account details** — tier, single vs. per-instructor accounts
  (SCOPE.md section d).
- **Whether BMA runs a ChessKid Club/Classroom for Chess Club** (SCOPE.md
  section d) — gates whether the Chess Club schedule card shows a
  ChessKid link at all.
- **Whether LaSoft is still actively engaged**, and whether they'd be
  building against the same systems — worth knowing up front rather than
  learning mid-project that two vendors are touching the same API.
- **Which states currently accept BMA for ESA funding** (AUDIT.md
  section 3) — a real, growing acquisition channel that a "find a
  program near you" or ESA-reporting-friendly feature could plausibly
  support later, worth a direct conversation even though it's out of
  scope for this build.
- **Real class/club schedule data and its recurrence pattern** (AUDIT.md
  section 10) — confirmed real classes recur on an Nth-weekday-of-month
  or seasonal-date-range basis, not simple weekly repeats. **This is
  already solved in the demo, not just flagged**: the join countdown and
  a real "Add to Calendar" export (a genuine `.ics` file, RFC 5545
  `RRULE` — `BYDAY=3MO` for "3rd Monday," a bounded `UNTIL` for a
  seasonal range) both run on the actual recurrence rule, verified
  against the real cadence in section 10. What's still open is only the
  *data feed* — reading this from BMA's real system instead of this
  demo's hand-entered sample — not the underlying scheduling logic.
- **Founder/company facts to confirm before any customer-facing copy** —
  family size, and which HQ/location is current (AUDIT.md section 8).

## h. PWA and app store — the opposite recommendation from a single-location build

Prior proposals in this repo default to PWA-only (installable from the
browser, no store listing) because a single-location delivery business
gets no real benefit from national app-store discovery — someone three
states away installing a local pizza app is a support problem, not a
customer. **BMA is the opposite case.** It's a subscription product with
a national (and per its own marketing, international) audience actively
capable of searching "Christian homeschool app" in an app store. A real
App Store/Google Play listing has genuine acquisition value here, not
just an installability convenience. We'd still ship the installable PWA
first (faster, no store review, testable immediately), but recommend
budgeting for store submission as a near-term follow-on rather than a
someday-maybe option — see PRICING.md item 3.

## i. Risks and unknowns

Stated plainly:

- **This tooling pass never got a live crawl of the site** (AUDIT.md
  intro) — everything here needs a direct confirmation pass before this
  becomes a signed proposal.
- **LaSoft is a real, active, three-year incumbent vendor.** The honest
  risk: BMA's simplest path might be asking LaSoft to build this instead
  of bringing in a second vendor. See section (k) below for how we'd
  answer that directly if asked.
- **No API documentation exists publicly** for BMA's class schedule,
  curriculum, or progress data — this app can't be priced as a fixed
  build until discovery confirms what's actually available to read from
  and how.
- **Zoom account tier/ownership model is unconfirmed** (section d) —
  affects whether "one-tap join" is simple or requires per-instructor
  lookup logic.
- **COPPA and app-store child-data policy compliance** (section e) is
  real, non-optional scope, not a checkbox — needs a real legal review,
  not an assumption that "BMA already handles this so we're fine,"
  since a *new* app collecting/displaying data (even just reading
  existing video content into a new UI) can trigger its own review
  obligations independent of what the web platform already does.
- **Founder-fact and HQ-location inconsistencies** (AUDIT.md section 8)
  — don't quote either version anywhere customer-facing.
- **No aggregate review-platform rating found** (AUDIT.md section 7) —
  don't quote one.
- **The demo's test-send push endpoint is intentionally unauthenticated**
  (no admin gate, unlike the real build's design) — caught in an internal
  audit: anyone holding a previously-leaked `PushSubscription` object
  (endpoint + keys, not something exposed in this app's own UI) could
  trigger a real notification to that device, with no rate limit. Fine
  for a single-user pitch demo; the real build's admin-gated send
  (section (f)) doesn't have this gap, and it isn't something to carry
  into anything beyond the demo.

## j. Could this just be a feature request to LaSoft instead?

Worth answering as directly as Piesano's SCOPE.md answered "should they
just switch to Square" — **yes, plausibly, and that's a real
competitive risk to this pitch, not something to talk around.** LaSoft
already owns the backend, the dashboard, and a working peer-video system;
architecturally they are the vendor with the least integration risk,
since they already know BMA's data model.

What we'd bring instead: a team that's built this exact category of thing
before — installable PWA/companion apps with real Web Push, service
workers, and offline caching, shipped and verified end to end (see this
repo's own Piesano's build for a working reference, not a claim) — and
the ability to move fast on a narrowly-scoped companion app without
touching or risking BMA's production checkout/dashboard/admin system,
which is exactly the part neither BMA nor LaSoft would want a second
vendor anywhere near. The honest pitch: **let LaSoft keep owning the
core platform; let us own a fast, focused, install-and-forget layer for
the Zoom/live-class experience specifically** — a scoped, low-blast-radius
add-on, not a vendor swap.

## k. Fit assessment — genuine addition, or a redundant second app?

Genuine addition, conditional on one thing we don't yet know: **whether
BMA has already asked LaSoft for a native app and gotten either a "yes,
in progress" or a "not on our roadmap."** If LaSoft is already building
this, we'd be walking into a duplicate effort — worth asking directly,
first, before any other discovery work. If it's genuinely not on
LaSoft's roadmap (plausible — their public case study describes web
platform work, not a mobile app), then this is a clean, additive
opportunity: a real product gap, on a real business, that doesn't require
displacing anyone.
