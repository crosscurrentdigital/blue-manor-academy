# PRICING.md — Blue Manor Academy

Working numbers based on AUDIT.md and SCOPE.md. Structured the same way
as prior builds in this repo: a small paid discovery spike to close real
unknowns before committing to a fixed build price — except here the
spike has to resolve more than a single POS question, because unlike a
restaurant's menu and hours, none of BMA's class schedule, curriculum
data, or Zoom setup is publicly visible. This spike is doing real work,
not a formality.

## 1. Discovery & compliance spike — $1,200, due to start

Wider than prior single-question spikes in this repo, because there are
genuinely more unknowns to close before a fixed build number is honest:

- Confirm what API/data access exists (or would need to be built) for
  class schedule, curriculum library, and progress data — the
  foundation everything else in the build reads from.
- Confirm Zoom account tier and ownership model (single vs.
  per-instructor accounts) — determines the actual join-flow logic.
- Confirm whether LaSoft has already been asked about, or is already
  building, a native app — this alone could make the rest of the spike
  moot (SCOPE.md section k).
- A real legal/compliance pass on COPPA and Apple/Google child-data app
  policies (SCOPE.md section e) — not a generic checklist, an actual
  review scoped to what this specific app would collect and display.

- **$1,200 flat**, due before the spike starts.
- **Fully credited toward the build price below** if BMA proceeds.
- Non-refundable if run and the project doesn't proceed — real work
  either way, same reasoning as every prior spike in this repo.

## 2. The build — $11,500, fixed

Priced above the $6,900 Piesano's build because this scope includes
genuinely more surface area: two distinct user roles (parent/kid) instead
of one, timezone-aware live-class scheduling for an international
audience, offline content caching (a meaningfully bigger engineering
lift than a cart-and-checkout flow), integration against a third party's
existing (undocumented, pre-spike) API rather than data we control
ourselves, and the added compliance work COPPA/app-store child policies
require that a restaurant ordering app never touches.

Everything in SCOPE.md section (c):

- The "Today" home screen (live classes/clubs/mentorships + assigned
  curriculum + new Kids-Teach-Kids content)
- One-tap Zoom join via deep link, with timezone-correct scheduling
- Push notification reminders (class starting soon, new peer content,
  progress/streak nudges, billing/renewal notices)
- Offline caching of self-paced curriculum content
- Separate parent and kid modes
- PWA install ("add to home screen") — live from day one, no store
  review required

**$11,500 flat**, contingent on the discovery spike confirming the API
access this build depends on exists or can be built at reasonable added
cost — if the spike finds BMA's data isn't accessible at all without a
larger backend project, this number would need to be re-scoped, not
silently absorbed.

Payment structure: 50% ($5,750) to start, 50% on launch.

## 3. Optional — App store listings (Apple + Google) — $1,800

Unlike the Piesano's build, where store listings were explicitly
downplayed (single-location business, no benefit from national
discovery), **this one is a real recommendation, not just an available
add-on** — see SCOPE.md section (h). Priced higher than the Piesano's
equivalent ($1,200) because a Kids Category/Designed for Families
submission carries real additional review requirements beyond a standard
listing.

## 4. Optional — Zoom Meeting SDK embedded video (phase 2) — priced separately once scoped

Not part of the default build (SCOPE.md section d). A materially bigger
engineering and ongoing-maintenance commitment than the deep-link
default, worth pricing specifically once BMA has used the deep-link
version and knows whether the "stay inside our app" gain is worth it.

## 5. Optional — Ongoing hosting/support — $125/mo

Higher than the Piesano's $75/mo given the added surface area (push
infrastructure, offline cache invalidation, Zoom-link data sync) even
though this app is still self-service by design. Month to month, cancel
anytime.

## What to actually say

> "Here's the honest version: you already have a real platform and a
> vendor who's done good work on it for three years — I'm not here to
> replace any of that. What you don't have anywhere is an app on a home
> screen, and for a product where the actual differentiator is showing
> up to a live Zoom class on time, that's a real, specific gap. $1,200
> gets us real answers on what your systems expose, what Zoom setup
> you're running, whether LaSoft's already got this on their roadmap,
> and a real legal read on the kid-data rules a new app has to follow —
> all of that comes off the final price if we move forward. The build
> itself is $11,500 flat: a home screen for today's classes and lessons,
> one-tap join with the timezone math done correctly, offline lesson
> access, and it stays install-and-forget rather than one more system
> for your team to run. Half to start, half at launch."

Skip the SDK-embedded-video option, the store-listing upsell, and the
hosting retainer unless asked — same discipline as every prior pricing
doc in this repo: these are answers to questions that haven't come up
yet.

## Timeline & effort

- **Discovery spike: ~1 week elapsed.** The actual work (compliance
  read, poking at whatever API surface exists) is a few days of effort;
  the calendar time is mostly BMA's own response speed on API access,
  Zoom account details, and the LaSoft question.
- **Build: 3–5 weeks of effort, ~4–7 weeks elapsed**, broken down:

  | Piece | Size | Why |
  |---|---|---|
  | "Today" screen (curriculum + class data) | Medium→Large | The single biggest swing factor — depends entirely on whether BMA's API is clean or undocumented/needs new endpoints on their side |
  | Zoom deep-link join + timezone scheduling | Small–Medium | Well-understood problem, no SDK/review overhead |
  | Push notifications | Medium | Reuses the Web Push/VAPID pattern from this shop's prior builds (Piesano's, Elks Theatre) rather than starting from zero |
  | Offline curriculum caching | Medium–Large | New pattern for this shop — no prior build has done offline content caching |
  | Parent/kid dual-mode | Medium | Real auth/role separation, not a toggle |
  | PWA polish (icons, install flow) | Small | Fully repeatable pattern at this point |
  | COPPA compliance implementation | Medium | Sized by what the discovery spike's legal review finds |

  For comparison: the Piesano's build in this repo (comparable feature
  count — ordering, live tracker, loyalty, push, admin panel) ran about
  a week of hands-on build time, but had no third-party API dependency.
  This build does, and that dependency — not raw feature count — is
  what widens the range.

- **Not in the range above:** app store submission (add 1–2 weeks,
  mostly Apple/Google review-queue time — a Kids Category submission
  runs longer than a standard listing) and the Zoom SDK embedded-video
  option (its own 3–4+ week project, priced separately per item 4).
