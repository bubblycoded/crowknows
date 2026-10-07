<div align="center">
  <img src="assets/logo.png" alt="crowknows" width="260" />
</div>

<p align="center"><em>a daily rhythm, kept in your pocket.</em></p>

<br />

crowknows is a small habit tracker and daily schedule for one person. Your
day is laid out as a handful of blocks — morning, midday, afternoon,
evening — and inside each block sit the few things that make it count.
Open it, tap what you've done, close it. It installs on your phone like an
app, signs you in with your own account, and keeps your days in a database
that only you can read.

<br />

## The third eye

Picture the crow with three eyes. One looks back at what you did. One is on
what you're doing right now. One watches what's next. Most systems for getting
organized only manage one of those. This one is shaped around all three:
the close-of-day ritual looks back, the block you're in is the present, and
tomorrow's single priority is the eye that looks ahead.

<br />

## What it does

**Lays the day out in blocks.** Each block has a time, a purpose, and a short
checklist. Open the one you're in; ignore the rest until it's their turn.

**Sorts what matters.** Every habit belongs to one of three tiers, each with
its own color: **Foundation** (the things the rest of the day stands on),
**Deep Work** (the hours that move your real goals), and **Pleasure** (the
things that make the rest worth doing). All three count.

**Counts your steps.** A daily step meter with a goal, and a target for each
walk or movement block, so ten thousand is a sum of small things rather than
one big thing.

**Belongs to you.** You sign in with your own account, every row is locked to
that account, and a copy of your day is kept on the device too.

<br />

## How to use it to get organized and stay goal-oriented

The app is deliberately simple, so the leverage is in how you use it.

1. **Pick one thing each morning.** Not a list — one priority. Put it in
   your first block and protect it. Everything else is allowed to be
   ordinary.
2. **Do the Foundation tier first, every day.** Sleep, water, food,
   movement. On a bad day, a finished Foundation is still a good day.
3. **Guard your Deep Work blocks.** Give each one a single project, phone out
   of the room. Two focused hours beat six scattered ones, and a block with
   one project in it is easy to check off honestly.
4. **Schedule Pleasure like you'd schedule a meeting.** Rest and play that
   only happen "if there's time" don't happen. Here they're a tier with a
   checkbox.
5. **Turn goals into daily actions.** For every goal, ask what small thing
   done *every day* would move it, and add that as a habit under a Deep Work
   block — "write 500 words", "practice 30 minutes", "one outreach email".
   A goal with no daily action is a wish.
6. **Check in as you go.** Tap when you finish something, not at night from
   memory. The block's counter (`2/3`) is the whole feedback loop.
7. **Close the loop at night.** Spend ten minutes on the close-of-day
   block: write down what happened, and set tomorrow's single priority
   *before* you sleep, so the morning has nothing to decide.
8. **Aim for a good day, not a perfect one.** Nothing here punishes a missed
   habit; it just shows you what's still open. A 70% day, repeated, is a
   life.

<br />

## Make it your own

The schedule lives in one file: `src/data/scheduleHabits.js`. Each block has
a time, title, phase, tier, optional step target, and its list of habits.
The default schedule is the author's own day — replace it with yours. Change
`DAILY_STEP_GOAL` for a different step target, or `TIER_META` to recolor the
tiers.

<br />

## Running it

```
npm install
cp .env.local.example .env.local   # then fill in your Supabase values
npm run dev                        # http://localhost:5173
npm run build && npm run lint
```

You need a free [Supabase](https://supabase.com) project:

1. Run `supabase-setup.sql` in the SQL Editor. It creates the table and the
   row-level security that keeps each person's days private.
2. Under Authentication, add your user, then turn off public sign-ups.
3. Put the project URL and the **publishable** key in `.env.local`.

Those two `VITE_` values are public by design — they ship in the browser, and
the security comes from row-level security and sign-in. Never put a secret or
`service_role` key in a `VITE_` variable.

To deploy, connect the repo to [Vercel](https://vercel.com), add the same two
variables, and push to `main`. To install it as an app: on iPhone, open the
site in Safari and choose Share → Add to Home Screen; on Android, use
Chrome's Install option.

<br />

## Where things stand

| | |
|---|---|
| daily schedule — blocks, phases, tiers | done |
| habit check-offs with per-block progress | done |
| steps meter with per-block targets | done |
| installable app (PWA) | done |
| sign-in, per-user data, row-level security | done |
| streaks and history view | next |

<br />

<p align="center"><sub>built for one person, one day at a time, on purpose.</sub></p>
