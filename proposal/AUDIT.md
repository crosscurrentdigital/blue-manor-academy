# AUDIT.md — Blue Manor Academy, site & product teardown

Recon target: https://www.bluemanoracademy.com/ (and its connected properties,
traced below). **Methodology caveat, stated up front:** the live-fetch tool
this audit would normally use to crawl the site directly (pull real nav
labels, exact page copy, current prices verbatim) returned HTTP 403 for
every URL attempted this session — including unrelated control URLs,
confirming it was a tooling outage, not this site specifically blocking us.
Everything below is built from search-engine indexing, cached review sites,
directory listings, an ESA-vendor portal, and — most usefully — the
academy's own contracted dev agency's public case study. **Before this
becomes a signed proposal, a direct crawl of the live site is needed** to
verify exact current nav copy, page inventory, and pricing. Treat specific
numbers below as "last publicly confirmed," not "confirmed today."

## 1. What Blue Manor Academy actually is

Not a restaurant-style "get them online" gap like prior audits in this
repo — **this is already a digital-native business.** Blue Manor Academy
(BMA) is a subscription online Christian homeschool platform, Pre-K
through 12th grade, founded by Britton LaTulippe (also the author of 70+
children's books and an early-learning curriculum line sold separately
under the "Blue Manor Education" brand). The product combines:

- A **self-paced curriculum library** (literature-based e-books with
  "scrolling text and audio," organized by grade/subject).
- **Live classes, clubs, and mentorships over Zoom** — the piece the
  build request specifically flagged, e.g. Early Reader Class, Art Club,
  Chess Club, Animation Club, 3D Modeling & Printing, Read Aloud Club,
  Parent Q&A.
- **"Kids-Teach-Kids"** — a peer-to-peer *asynchronous* video system
  (students upload their own instructional videos to a channel; other
  students watch/interact). This is separate from the live Zoom classes —
  worth being precise about in any pitch, since both get called "video"
  in marketing copy but they're different systems with different
  engineering implications (recorded upload/playback vs. live
  scheduled meetings).
- Gamification, progress tracking, and a parent dashboard.

## 2. The site already has a professional dev vendor — this is the headline finding

This is the single most important thing this audit found, and it changes
the entire shape of the opportunity relative to prior audits in this repo.
BMA's own contracted agency, **LaSoft** ("Web & Mobile Development
Agency"), publishes a public case study
([lasoft.org/blue-manor-academy](https://lasoft.org/blue-manor-academy/))
stating:

- BMA came to them with an existing platform built by a *prior* vendor,
  needing performance/code-quality work.
- LaSoft **converted the platform from a monolith to a microservices
  architecture**.
- LaSoft built: a data-visualization progress dashboard, the
  peer-to-peer video system (Kids-Teach-Kids), a customizable-curriculum
  system, an admin panel, a content library UI, and gamification.
- LaSoft **redesigned the checkout system and main dashboard**, which the
  client credits with an immediate subscriber increase.
- **BMA has been working with LaSoft for three years** and reports being
  "very happy" with the results.

Practically: there is no "legacy static site with no ordering system"
gap here. The backend, checkout, dashboard, admin panel, and even a
custom video system are already built and actively maintained by a named
agency with a multi-year relationship. Any pitch here has to be honest
that **we would not be the first or only technical option BMA has** — see
SCOPE.md section (k) for how this should shape the ask.

## 3. Full property map — everything traced this pass

| Property | What it is | Confirmed via |
|---|---|---|
| `www.bluemanoracademy.com` | Marketing site + auth | Direct listing, search snippets |
| `www.bluemanoracademy.com/accounts/login/` | Parent login | Search-indexed URL |
| `www.bluemanoracademy.com/accounts/terms/` | Terms of use | Search-indexed URL |
| `fe.bluemanoracademy.com` | The actual logged-in app (a separate "frontend" subdomain/SPA — distinct deploy from the marketing site) | Search-indexed, incl. a live sub-route `fe.bluemanoracademy.com/challenges-categories` (a "Challenges" curriculum category screen) |
| `bluemanoracademy.kit.com` | Email newsletter / blog posts, run on Kit (ConvertKit) | Search-indexed ("Posts \| Blue Manor Homeschool Academy") |
| `blue-manor-academy.getrewardful.com` | Affiliate/referral program portal (Rewardful) | Search-indexed login page |
| `bluemanoreducation.com` | Sister brand/site — sells the standalone curriculum e-books and merch (the original product line, pre-dating the Academy subscription), has its own `/about/`, `/100-ebooks-free/`, and a WordPress-style `/wp-content/` asset path | Search-indexed |
| `vimeo.com/user12287929` | Video hosting (likely recorded lessons) | Search-indexed |
| YouTube — two channels: "Blue Manor Academy" and "Blue Manor Education" | Video content, separate from Vimeo | Search-indexed playlists |
| Facebook `facebook.com/bluemanoracademy` | Primary social presence | Search-indexed |
| Instagram `@bluemanor` | ~749 followers | Search-indexed |
| `app.nh.scholarshipfund.org/esa/esa_parent/esa_vendors/11830` | New Hampshire Education Freedom Account (ESA) vendor listing, on a multi-state platform ("Theodore") used by school-choice programs | Search-indexed |

**Not resolved this pass, needs direct confirmation:** whether BMA is
listed as an approved ESA vendor in states beyond New Hampshire (the
"Theodore" platform powers ESA vendor listings for multiple states'
programs — this is a real, growing funding channel for homeschool
products and worth asking about directly, since ESA programs often
require attendance/progress reporting that an app could help satisfy).

## 4. No native app anywhere — the actual, real gap

Direct searches for a "Blue Manor" education app on both the App Store
and Google Play returned nothing — every "Blue [something] Academy" app
that surfaced was a different, unrelated school. **This is the honest gap
that matches what the build request is aiming at**: a real, actively-paid
subscription product, with a live-video component (Zoom) and daily-habit
content (curriculum, clubs), that today lives entirely inside a browser
tab — no home-screen presence, no push notifications, no native
"join your class" flow.

## 5. How live classes/Zoom actually work today (best available picture)

Live classes, clubs, and mentorships run **over Zoom**, described
consistently across sources as a scheduled, instructor-led format (not
the peer video system in section 1). What we could **not** confirm
without a direct site crawl or a conversation with BMA:

- Whether joining a Zoom class today is a plain link inside the browser
  dashboard, or something more integrated already.
- What Zoom account tier they're on (Pro vs. Business — this caps
  meeting duration, participant count, and whether the Zoom Meeting SDK
  vs. a plain join-link is even a live option).
- Whether one shared Zoom account hosts all classes/clubs/mentorships, or
  each instructor has their own.
- Whether classes are recorded and posted back into the curriculum
  library, or are live-only.

This is exactly the kind of open question this repo's prior audits price
a short paid discovery spike to close (see PRICING.md item 1) rather than
guess at.

## 6. Pricing (confirmed directly — see section 10)

- **$25/student/month** — full Pre-K–12 curriculum.
- **+$27/month** — optional add-on for live classes/clubs/mentorships.
- **Family plan caps at $177/month** regardless of student count.
- **14-day free trial** — confirmed directly from the live site's own
  current header (section 10). A "30-Day" figure also seen came from an
  older recorded tutorial video with a stale number, not the current
  site — 14-day is current and safe to quote.

## 7. Reputation — mixed vintage, needs a fresh pull

Most indexed reviews (Hope in the Chaos, Kingdom First Homeschool, Tots
and Me, Farm Fresh Adventures, 1+1+1=1, Life with Moore Babies) are
enthusiastic but largely reviewing the **earlier e-book curriculum
product** (2013–2015 vintage in several cases), not the current live-class
Academy platform. Consistent praise across reviews: literature-based
content with real depth, faith/character integration woven into lessons,
responsive support team, low prep burden for parents. One recurring,
minor note: using the curriculum on a full computer "all the time" was
called cumbersome by at least one reviewer, vs. reading on a tablet —
mild independent evidence that a lighter, more mobile-native experience
is genuinely wanted, not just a good idea in the abstract. **No aggregate
star rating was found on Google, Yelp, or Trustpilot this pass** — do not
quote a rating anywhere until pulled directly.

## 8. Founder/company facts — confirm before quoting, same discipline as prior audits

- **Company size:** 1–10 employees (ZoomInfo/Datanyze), HQ listed at 418
  W Indian Rocks St, Meridian, Idaho — but the founder's own LinkedIn
  lists his location as Corpus Christi, TX. Don't state either as "the"
  company location without confirming which is current/accurate.
- **Founder's family size is inconsistent across public sources** —
  described variously as a father of six, seven, and eleven children in
  different places. Exactly the "Stacey vs. Stacie" problem from the
  Piesano's audit: pick one publicly and it may be wrong. Confirm
  directly before using it in any pitch material.
- Britton LaTulippe is also listed as "president" of the related "Blue
  Manor Education" book/curriculum entity — worth confirming whether
  Blue Manor Academy and Blue Manor Education are the same legal entity
  or a parent/sister-company structure, since that affects who actually
  signs a contract.

## 9. What this means for an app build, at a glance

Unlike a "your site says you don't do this" gap, the honest framing here
is: **a genuinely good, actively-run, professionally-engineered product
with real customers, that has never had a dedicated installable app** —
and whose core differentiator (live human connection via Zoom classes,
clubs, and mentorships) is exactly the kind of thing a phone's home
screen and push notifications make meaningfully better, while a browser
tab does not. See SCOPE.md for what we're proposing and — just as
important — what we're deliberately not proposing (rebuilding anything
LaSoft already owns).

## 10. Direct observation update — the real logged-in product, seen live

Everything below was confirmed directly (screen-share, not indirect
sources) during an actual conversation with BMA — a real step up in
confidence over sections 1-9, which were built from secondary sources
this session's live-fetch tooling couldn't reach directly (see the intro
methodology note). Superseding/correcting entries are called out
explicitly rather than silently replacing what was there before.

- **The logged-in app lives at `www.bluemanoracademy.com/accounts/*`, not
  a separate `fe.` subdomain.** Section 3's property map listed
  `fe.bluemanoracademy.com` as the likely logged-in app based on indirect
  search-indexing evidence. Directly observed URLs (`/accounts/readers/`,
  `/accounts/classes/setup/4100/`, `/accounts/credit_chart/1077/`,
  `/accounts/choose_an_account/`) show the real logged-in product on the
  main domain instead. Worth confirming directly whether `fe.` is a
  legacy/parallel interface or simply wrong — don't state either as fact.
- **A real "Choose an account" screen** exists for multi-child families —
  a picker with per-child photo avatars (gold-dashed circle border) —
  confirming BMA already has its own multi-child-profile UX, independent
  of any parent/kid "mode" concept a companion app might add.
- **The Parent Dashboard's real tab structure**: Billing & Student
  Access, How to Use BMA, Parent Library, Calendar, Contact. Each child
  gets a card with a glossy gold "Visit Academy" button and three
  accordion sections — **Review & Customize** (edit profile, customize
  curriculum, restrict library/mail/Kids-Teach-Kids, toggle
  Kids-Teach-Kids/student-to-student email/comments/games on-off with
  green switches), **Assign Work** (grade level, school days/week,
  completion date, a points-remaining calculator), and **Progress
  Report** (day/week/month/year views, per-grade-level completion
  sliders). A separate **"Classes & Clubs"** button (glossy blue, not
  gold — the one clearly confirmed non-gold interactive accent) expands
  to the child's actual enrolled schedule.
- **A real, confirmed class/club schedule with real cadence** — materially
  more complete than the marketing icon row in section 1/5, and using a
  recurrence pattern (year-round on an Nth weekday, or a seasonal date
  range like "May-Aug") that a simple weekly-recurring scheduler doesn't
  capture:

  | Name | Cadence |
  |---|---|
  | Crochet Club | Year-Round, 3rd Monday, 1 PM CST |
  | Student Q&A Session | Year-Round, Monday, 2:30 PM CST |
  | Foundations of Illustration | May-Aug, Tuesday, 11 AM CST |
  | Manners & Etiquette: The Rules of Respectability | Sept-Dec, Tuesday, 2 PM CST |
  | Chess Club | Year-Round, Wednesday, 10 AM CST |
  | 3D Modeling Club | Year-Round, 3rd Wednesday, 2 PM CST |
  | Oration Class | Year-Round, 4th Friday, 2 PM CST |
  | Social Club | Year-Round, 1st Friday, 2 PM CST |
  | Stock Investing Class | Year-Round, 3rd Friday, 2 PM CST |

  This is a real scope item for SCOPE.md section (d): a companion app's
  scheduling logic needs to handle "Nth weekday of the month" and
  seasonal date-range recurrence, not just a simple weekly repeat — a
  materially different (and larger) problem than this demo's simplified
  weekly model assumed.
- **A Credit Chart** (`/accounts/credit_chart/`) — a real
  high-school-credit tracking table (9th-12th grade + a "Diploma" column,
  in a distinct blue) with per-subject point-to-credit-fraction math
  (e.g., "500 pts = 1 credit" for core subjects, "1000 pts = 2 credits"
  for electives) — a real feature confirming BMA has actual credit/
  transcript tracking for high schoolers, not just a Pre-K-8 activity
  tracker.
- **A real Parent Library** (`/parent-library/`) with three sections:
  **Books** (the founder's own book series — Revealing School, Education,
  Character, Power), **Videos** (parenting content from Britton
  LaTulippe — "Raising Children for Greatness," "Getting Your House in
  Order," "Motivating Children" — plus a "How to Use Blue Manor Academy"
  walkthrough), and **Printables** (a large, real library: seasonal
  "Manor Mom Magazine" issues, per-grade scope-and-sequence sheets,
  character/power questionnaires, merit/demerit sheets, responsibility
  and etiquette charts, phonics/math/penmanship worksheets, and more).
  This is a substantial, real content library a companion app should
  surface a path to (even just deep-linking into it), not attempt to
  rebuild.
- **A "How to Use Blue Manor Academy" tutorial video series** exists with
  a numbered lesson index: New Parent Information Meeting, Assign &
  Schedule Student Learning, How BMA Teaches History, How BMA Forms
  Christian Faith, How BMA Teaches Math, Internet Safety Features on BMA,
  High School Credits.
- **Trial length resolved**: the live site's own current header confirms
  **14-day** (AUDIT.md section 6's primary figure); a "30-Day" figure
  seen elsewhere came from an older recorded tutorial video still showing
  a stale number, not the current live site — 14-day is current, 30-day
  was a prior value. Safe to state 14-day as fact now, not "last publicly
  confirmed" hedged.
