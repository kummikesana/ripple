# App Store Connect listing content

Reference copy for the App Store Connect submission form. Pulled directly from
what the app actually does (see app.js, privacy.html, api/) — update this file
if the app's data use or feature set changes.

## Basics

- **Name:** Ripple
- **Subtitle** (30 chars max): `Small swaps, real impact`
- **Category:** Lifestyle (primary) — Health & Fitness is a reasonable secondary pick
- **Age rating:** 4+ (no objectionable content, no user-generated content visible to others beyond anonymized aggregate numbers)

## Promotional text (170 chars, editable anytime without a new review)

> Try one small sustainable swap, see the real impact it makes, and grow a little garden as you go. No guilt, no ads, no pressure — just small ripples.

## Description (4000 chars max)

> Ripple is a friendly way to try small, sustainable swaps — refilling a bottle, taking a shorter shower, a vegetarian meal — and actually see what they add up to.
>
> Log a swap and Ripple shows you the real number behind it: kilograms of CO2 avoided, grams of plastic skipped, euros saved. Not vague encouragement — the actual math, every time.
>
> **Grow a garden, not a guilt trip.** Every good choice grows one of three small plots — Planet, People, Prosperity — because sustainability isn't just carbon, it's fairness and your wallet too. Miss a day? Nothing resets. Ripple never nags.
>
> **A quiz that actually fits you.** Answer a few honest questions and Ripple suggests swaps that match where you're starting from — simple ones if you're just beginning, bigger ones (like volunteering an hour, or buying secondhand) once you're ready for more.
>
> **Today's real air quality.** Opt in once and see the actual US AQI for where you are — not a vague "fair/poor" label, the real number people recognize from other air quality apps — plus how it compares to a few cities around the world.
>
> **You're not doing this alone.** See a running total of what everyone using Ripple has done together, and — if you've checked today's air — what people nearby are doing too. No profiles, no leaderboard, just good company.
>
> **Built to be trusted, not tracked.** No ads. No account required — everything works as a guest, saved only on your device. Sign in only if you want your garden to follow you to a new phone. Every fact in the app is sourced from real places: the UN, the EU, government data — never guesses.
>
> Small choices. Real ripples.

## Keywords (100 chars max, comma-separated, no spaces needed)

```
sustainability,habit,eco,carbon,footprint,climate,garden,green,air quality,aqi,plastic,impact
```

## Support URL

`https://ripple-mu-rosy.vercel.app/privacy.html` (or set up a dedicated support page/email if you'd rather not point support at the privacy page)

## Marketing URL (optional)

`https://ripple-mu-rosy.vercel.app`

## Copyright

`© 2026 [your name / entity]` — fill in whoever legally owns the app (you, or an entity if you set one up)

---

## App Privacy ("nutrition label") answers

Based on exactly what the code collects (see app.js, api/aqi.py, api/ask.py,
privacy.html). Walk through App Store Connect's privacy questionnaire with
these answers:

| Data type | Collected? | Linked to identity? | Used for tracking? | Notes |
|---|---|---|---|---|
| **Precise Location** | Yes, if the person opts in | **No** — not linked | No | Sent to `/api/aqi` only when they tap "Show today's air"; used to compute AQI and, if known, add to an anonymized city-wide total (no per-person id stored at all — see `supabase/city_stats.sql`) |
| **Email Address** | Yes, only if they choose to sign in | **Yes** — linked (tied to their account) | No | Only collected via optional Google/Apple sign-in, to sync their garden across devices. Guests never share this. |
| **Other User Content** (logged swaps, quiz answers, garden progress) | Yes | Linked only if signed in; otherwise stays local-only and is never collected by the developer at all | No | Guests: 100% on-device (localStorage), never leaves the phone. Signed-in: synced to Supabase tied to their account, to follow them across devices. |
| **Usage Data / Analytics** | No | — | No | No analytics or ad SDKs integrated. |
| **Identifiers / Advertising Data** | No | — | No | No ads, no ad network. |

**"Data Used to Track You" section:** answer **No** across the board — nothing in Ripple is used to track the person across other companies' apps or websites.

**Third parties data passes through** (for App Review's benefit, not shown to users as separate line items unless Apple asks):
- OpenWeatherMap — receives lat/lon only when "today's air" is used, to return AQI + city name
- Supabase — receives email + garden progress, but only for people who choose to sign in
- Google Gemini (or whichever provider `SUSTAINABILITY_PROVIDER` is set to) — receives only the text of a question typed into "Ask," no identity attached

## Export compliance

Already handled in code: `ios/App/App/Info.plist` now sets
`ITSAppUsesNonExemptEncryption = false`, which tells Apple the app only uses
the standard HTTPS/TLS encryption built into iOS (no custom or proprietary
crypto) — this is Apple's standard exemption, and setting this key means the
export-compliance question won't pop up on every single TestFlight/App Store
upload.
