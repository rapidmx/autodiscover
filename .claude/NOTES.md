# autodiscover — Design Decisions & Session Notes

This file exists so that Claude sessions working in this repo don't re-litigate settled
decisions or re-discover the same issues from scratch. It is local to this repo (not tied to
any one machine's global Claude memory), so it travels with the code.

**Maintenance rule:** when a standing decision changes, update the section below in place
(don't just append a contradiction lower down). When a new investigation/session produces a
decision, finding, or reverted approach worth remembering, add a dated entry under Session Log.
Keep entries terse — this is a reference, not a transcript.

## Standing design decisions & constraints

- **Vulnerability/review threat model: externally-exploitable only.** Only count issues reachable
  from a downstream, untrusted HTTP client hitting a service built on this package (anonymous or
  low-privilege caller). Do NOT flag developer-only footguns or purely theoretical races with no
  concrete external trigger path.
- **Commit discipline.** Don't `git commit` unless explicitly asked, even after a full
  review-and-fix cycle with passing tests. Leave changes staged/unstaged and say so.
- **Commit message style: concise, one line per task/bug/feature — no verbose prose.** A commit
  message is a short list of one-line bullets, one per item. This mirrors JP's standing convention
  across his other repos.

## Session Log

### 2026-09-06 — Repo split: `@rapidrest/mail` → four RapidMX packages

- **This repo is `@rapidmx/autodiscover`**, carved out of the former monolith `@rapidrest/mail`
  (`d:\github\rapidrest\mail`, still present there for reference/history). It's a **new 4th
  package** not originally in the split plan — added because Autodiscover has zero code coupling
  to Exchange ActiveSync or MAPI over HTTP (it only ever touches the `Mailbox` model and builds
  response strings), so keeping it as its own package avoids duplicating it into both
  `@rapidmx/activesync` and `@rapidmx/mapi`.
- Depends on [`@rapidmx/restapi`](https://github.com/RapidMX/restapi) for the `Mailbox`
  model/repo and the `BlobStore`/`SearchProvider`/`SpamScanProvider`/`AvScanProvider`/
  `MailTransport` interfaces its test harness registers test-doubles for (even though this
  package's own routes never touch most of those — the shared integration-test `Server` fixture
  eagerly instantiates every route it discovers, which is why `testDoubles.ts` still registers all
  of them; see that file's own doc comment). Originally linked locally via Yarn Berry's
  `portal:../restapi` during development; switched to the real published `^0.1.0` once JP published
  it to npm (see the `activesync` repo's own notes for exactly why the portal approach turned out to
  be a real problem, not just a temporary convenience - it silently duplicated the
  `@rapidrest/service-core` module instance at test-runtime).
- **`vitest.config.ts`'s `ssr.noExternal` must list `@rapidmx/restapi`** alongside
  `@rapidrest/service-core`/`@rapidrest/core` - without it, Vite's SSR pipeline can load a second,
  natively-required copy of the framework packages for anything reached *through* `@rapidmx/restapi`,
  breaking static/instanceof-based state shared with the test's own directly-imported copy (see
  `activesync`'s NOTES.md for the full diagnosis - this repo's own narrower test surface didn't
  happen to trigger the symptom, but the same risk applies here too).
- **Mechanical migration gotcha, worth remembering for the sibling `activesync`/`mapi` splits too**:
  several distinct old import targets (`blob/BlobStore.js`, `transport/MailTransport.js`,
  `models/types.js`) all collapse onto the same new specifier (`@rapidmx/restapi`) once rewritten,
  which turns a mechanical per-line import rewrite into multiple separate `import ... from
  "@rapidmx/restapi"` statements — `no-duplicate-imports` correctly flags that. Fixed in
  `test/testDoubles.ts` by hand-merging into one statement (using inline `type` specifier modifiers
  to mix value and type-only imports in the same line, since `AvVerdict`/`SpamVerdict` are real
  values but the rest are types-only).
- For the original design rationale behind the Outlook/EXCH response shape (confirmed against the
  real `[MS-OXDSCLI]` spec, not assumed) and the MobileSync/EAS response shape, see the monolith's
  own `.claude/NOTES.md` (`d:\github\rapidrest\mail`) — that history wasn't duplicated here since
  it predates this repo's existence and mostly concerns code that never lived under this package's
  own directory.
