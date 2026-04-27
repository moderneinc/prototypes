# Voice

How strings read in the Construct system. Tone principles extracted from the artifacts, with concrete dos and don'ts drawn from `context/` where possible.

Voice is in scope because it's how the visual layer *speaks*. What commands do, what flags exist, and which surfaces emit which strings are out of scope (those are behavioral / IA decisions for a later phase).

## Provenance

The voice rules have two origins, and it matters to know which is which.

**Extracted from the artifacts.** The tone principles (direct address, action-oriented imperatives, concrete over abstract, no-blame framing, named things over jargon) are grounded in both source artifacts. Annie and Jayd both wrote this way consistently across their mock-ups. The rules name what was already there.

**Synthesized from observed patterns.** The grammar conventions table — ALL-CAPS section headers, gerund action verbs for transient state, past-participle for completed sub-tasks, specific punctuation rules, number-leading counts, recovery action verb list — was not written down in any artifact. It was codified by naming recurring patterns that both authors used without stating as rules. The original CLI had an implicit voice; this document makes it explicit.

The distinction matters because synthesized conventions carry more revision risk than extracted ones. If product or engineering observes that the grammar conventions don't match how the CLI is actually evolving, the conventions should be revised — they were never mandated by the source material, only inferred from it.

## Tone principles

### 1. Direct and second-person

Address the user. Use *you* / *your* sparingly but naturally — the imperative voice does most of the work.

> ✓ Connect to your Moderne tenant.
> ✓ Configure where the CLI stores LSTs.
> ✗ This command configures the location used by the CLI for storing LSTs.
> ✗ The user must specify a tenant URL.

### 2. Action-oriented imperatives

Lead with the verb the user would take. Most lines start with the action.

> ✓ Run a recipe.
> ✓ Add a build config.
> ✓ Point the CLI at a different directory.
> ✓ Refresh your login.
> ✗ Recipe execution can be triggered by …
> ✗ The CLI provides functionality to add a build config.

### 3. Concrete over abstract

Name the thing. Replace generic descriptions with specific facts, file names, defaults, and example values.

> ✓ "Often `changeit`." (default-value cue, Annie's `--password` flag)
> ✓ "The last run produced **0** data tables." (Jayd's `mod study` hint)
> ✓ "mod looks for `pom.xml`, `build.gradle(.kts)`, `build.bazel`, or `setup.py` …" (Jayd's `mod build` hint)
> ✗ "The password used to access the truststore."
> ✗ "or that the recipe produced results"
> ✗ "a supported build tool"

### 4. No blame; acknowledge ambiguity

When the CLI cannot tell distinct causes apart, surface the alternatives without committing to one. Never imply the user did something wrong unless the CLI is sure they did.

> ✓ "A few things can cause this — the org name may not match, your login may have expired, or the CLI may not be reaching Moderne right now." (Jayd's `mod git sync` hint)
> ✓ "The recipe may not emit tables, or the run failed before any were written." (Jayd's `mod study` hint)
> ✗ "You forgot to run `mod build` first."
> ✗ "Invalid input."
> ✗ "The recipe is broken."

### 5. Lower jargon density, higher named-thing density

Shrink jargon. Inflate concrete named-things. Name `pom.xml` instead of "your build configuration file"; name `PKIX path building errors` instead of "SSL trust failures."

> ✓ "Without it, commands fail with `PKIX path building errors`."
> ✗ "Without it, certain network operations may not function correctly."

### 6. Shorter lines, denser screens

The proposed surfaces are net longer than current ones (more sections, more hints, more examples), but each individual line is shorter and more directly useful. Cut filler.

> ✓ "Connect to your artifact repo for recipes." (Annie's proposed)
> ✗ "Configures the artifact repository to resolve recipes from. All subsequent recipe installation commands will use this." (current)

This is the system's "explanatory density" tuning — see `rationale.md`.

## Grammar conventions per surface

The grammar varies by surface; the same writer using the wrong form on the wrong surface produces friction. Here are the conventions, derived from D-19 and the artifacts.

| Surface | Form | Punctuation | Example |
| --- | --- | --- | --- |
| Section header | ALL CAPS noun phrase or fragment | none | `WHAT WENT WRONG`, `NEXT STEP`, `EXAMPLES` |
| Help-screen one-line summary | Imperative present, sentence case | period | `Configure the SSL trust store mod uses for HTTPS connections.` |
| Help-screen consequence prose | Declarative present, sentence case | period | `Without it, commands fail with PKIX path building errors when connecting to your tenant or artifact repos.` |
| Flag description | Imperative or noun phrase, sentence case | period | `Trust store password. Often changeit.` |
| Action header (in-flight) | Gerund, sentence case, no leading article | no period | `Loading recipe`, `Running recipe on 47 repositories`, `Searching 47 repositories` |
| Sub-task `✓` summary | Past participle / past tense, leads with count when applicable | period optional (matches in-set) | `42 repositories modified`, `5 unchanged` |
| Inline `⚠` warning line | Declarative, leads with count when applicable | period | `0 repositories searched — all 47 skipped (no search index).` |
| `? Hint:` body | Declarative present or future conditional | period | `Add a Maven, Gradle, or Bazel build config — mod looks for pom.xml, …` |
| `! Note:` body | Declarative present, often with a constraint cue | period | `Needs read AND write access.` |
| `! Error:` body (compact tier) | Declarative past, terse | period | `Unknown command 'confg'.` |
| Error `WHAT WENT WRONG` body | Declarative past or noun phrase, names the input | period | `No build tool found in /home/user/project.`, `No data table matching "RewriteSources" in the last recipe run.` |
| Error `▶ <recovery>` action verb | Imperative present | period | `Add a build config to the directory.`, `Point the CLI at a different directory that already has one.` |
| Error `▶` inlined command | Verbatim shell, placeholders in `<angle-brackets>` | none | `mod build /home/user/project --only-tool maven` |
| `▶` next-step row in `WHAT TO DO NEXT` | Verbatim command + em-dash + imperative-or-noun gloss | period on the gloss | `mod study --last-recipe-run        — View results by repo.` |
| Empty-state line | `No <noun-phrase>.` | period | `No repositories configured.` |
| Banner phrase (close) | ALL CAPS verb-phrase | none | `MOD SUCCEEDED in (3m 24s)` |
| Banner preface | ALL CAPS noun-or-statement | colon | `FAILURE: mod failed with an exception`, `PARTIAL SUCCESS:` |

## Specific phrasing rules

### The support line (D-10)

Two phrasings, position-dependent:

- **When other concrete suggestions precede it** (demoted, gray): `Still stuck? Report to support@moderne.io`
  The question framing acknowledges that the user has tried other options. Don't lead with this; lead with the actionable suggestions and let support land softly at the bottom.

- **When it's the only option** (not demoted, supporting text color): `Report to support@moderne.io`
  No question framing. The user has nothing else to try; the directive is appropriate.

In the inline / usage error tier (`error.md` Tier 2), the support line does not appear at all. Support cannot help with a typo.

### Recovery action verbs

Lead with a single concrete verb. Avoid "consider", "try", "you might", "perhaps". The action is the action.

> ✓ "Add a build config to the directory."
> ✓ "Point the CLI at a different directory that already has one."
> ✓ "Run a recipe that emits data first."
> ✗ "Try adding a build config."
> ✗ "You might want to consider running a recipe that emits data first."
> ✗ "Perhaps the org name is wrong?"

### Numbers lead in count contexts

When a line is communicating "how many of what," the number leads.

> ✓ "0 repositories searched — all 47 skipped (no search index)."
> ✓ "42 repositories modified."
> ✓ "4 repositories — 2 ready, 1 missing LST, 1 failed build."
> ✗ "Out of 47 repositories, 42 were modified."

### Flag names in prose

Flag references in prose are styled per `patterns/inline-command-reference.md` (cyan, not bold). When mentioning a flag inline, include its full form on first reference:

> ✓ "Run mod study `--last-recipe-run` to view results."
> ✓ "Or pass `--token` for a CI-friendly auth path."
> ✗ "Pass last-recipe-run to study."

### Defaults and example values

Annie's `--password` description sets the convention: name the most likely real value next to the flag.

> ✓ "Trust store password. Often `changeit`."
> ✓ "Tenant URL. Format: `https://app.moderne.io` or `https://<your-org>.moderne.io`."
> ✗ "The password used to access the trust store."
> ✗ "A URL string."

### Sensitive values

Mask but don't omit. The shape of the command stays visible.

> ✓ `--password ****` (in EXAMPLES)
> ✓ `--token ****`
> ✗ `--password <REDACTED>`
> ✗ (omitting the flag entirely from the example)

### Acknowledging ambiguity

When the CLI doesn't know which of multiple causes applies, name them together in `? Hint:`. The hint is a list of possibilities, not a guess.

> ✓ "A few things can cause this — the org name may not match, your login may have expired, or the CLI may not be reaching Moderne right now."
> ✓ "The recipe may not emit tables, or the run failed before any were written."
> ✗ "Your login expired." (when the CLI has not verified that)
> ✗ "Check the org name." (commits to one cause without grounds)

## What voice is *not*

- **Not friendly.** The system is direct, not chatty. There are no "Sorry!", no "Oops!", no exclamation points outside the `!` glyph itself, no emoji. (See `rationale.md` on the explanatory-density tuning — friendliness is not what enterprise developers running CLI commands intermittently want.)
- **Not formal.** "Please" is not used. The imperative carries the request without softening.
- **Not jargon-heavy.** Specific named things (`pom.xml`, `PKIX`) are concrete; abstract jargon ("operationalize", "leverage", "facilitate") is removed.
- **Not coy.** When the CLI has a specific recommendation, it makes it. When it doesn't have grounds, it lists alternatives. It does not equivocate to seem polite.

## Voice across the two authors — what carried over

These are the patterns where Annie and Jayd, working independently, converged. They are the strongest evidence for the voice principles above:

- Both replace "the X used to do Y" descriptions with "Do Y." (Cut the meta-description.)
- Both lead error / recovery lines with a verb.
- Both use concrete file names, command names, and example values rather than placeholders.
- Both treat the user as a capable adult (no "please", no apologies, no warnings about safe operations).
- Both demote rather than delete: support stays in errors, but at the bottom; deprecated flags can stay in help, but visually receded.

## Editorial hand-offs (not voice, but worth noting)

The system codifies tone, not authoring policy. Two questions that come up during string authoring are intentionally left open:

- *Whether* a given surface should emit a `? Hint:` block at all is an editorial call per command, not a voice rule. (The visual system says: when a hint is appropriate, it looks like this.)
- *Which* recovery actions land in a TRY block is a product / engineering call per error, not a voice rule. (The visual system says: when there are recovery actions, they read like this.)

Both of these are downstream of voice — they're authoring guidance that lives where the strings are written, not in the design system.
