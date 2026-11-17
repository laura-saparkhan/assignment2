# Assignment 2 — Playwright test automation + CI pipeline

End-to-end UI tests for [Practice Software Testing](https://practicesoftwaretesting.com/),
written with Playwright Test and TypeScript using the Page Object Model.

The suite covers registration, login, password recovery, product comparison and a
full purchase flow (9 tests in 5 spec files). The project description is in
[docs/Description.md](docs/Description.md).

## CI

[![Playwright Tests](https://github.com/laura-saparkhan/assignment2/actions/workflows/playwright.yml/badge.svg?branch=main)](https://github.com/laura-saparkhan/assignment2/actions/workflows/playwright.yml)

**CI system:** GitHub Actions. It was chosen because it is built into GitHub, where
this repository already lives, so it needs no server of its own and no webhook
configuration. It is free for public repositories, and its build matrix provides
test sharding out of the box, which is exactly what the parallelism requirement
needs. GitLab CI and Jenkins would both require either moving the repository or
running and exposing a server locally for no added benefit here.

**Pipeline** (`.github/workflows/playwright.yml`):

- runs on **every push to every branch and on every pull request** (plus
  `workflow_dispatch` for manual timing runs);
- `actions/setup-node` with `cache: npm` caches `~/.npm` keyed on
  `package-lock.json`, then `npm ci` installs from the lock file;
- Chromium is installed with its system dependencies
  (`npx playwright install --with-deps chromium`);
- the **full** suite runs with no `--grep` / `--project` filter, split into
  **4 shards** (`--shard=i/4`) that run in parallel with `fail-fast: false`;
- the `merge-reports` job then merges the shards' blob reports into one HTML
  report and one combined JUnit file;
- `concurrency` cancels a superseded run when a new push lands on the same branch.

**Artefacts** (all kept for **14 days**, uploaded with `if: ${{ !cancelled() }}`
so they also exist when tests fail):

| Artefact | Contents |
| --- | --- |
| `playwright-report` | merged HTML report for all 4 shards |
| `test-results-1` … `test-results-4` | traces, screenshots, videos and the per-shard `reports/junit.xml` |
| `junit-report` | merged `reports/junit-merged.xml` |
| `blob-report-1` … `blob-report-4` | intermediate blob reports (1 day, consumed by the merge job) |

A trace is opened by downloading `test-results-N` and running
`npx playwright show-trace trace.zip`, or by dropping the file onto
[trace.playwright.dev](https://trace.playwright.dev).

**CI-specific configuration** (`playwright.config.ts`, active when `CI=true`):

| Setting | Value on CI | Why |
| --- | --- | --- |
| `forbidOnly` | `true` | a forgotten `test.only` fails the run instead of silently running one test and reporting green |
| `retries` | `2` | the suite runs against a live public site; an unstable test is marked *flaky* rather than red |
| `workers` | `2` | GitHub-hosted runners have 2–4 vCPUs |
| `reporter` | `list`, `blob`, `junit` | readable logs, mergeable per-shard output, machine-readable XML |
| `trace` | `on-first-retry` | a trace of exactly the attempt that failed |
| `screenshot` / `video` | `only-on-failure` / `retain-on-failure` | failure evidence without bloating green runs |
| `fullyParallel` | `true` | `--shard` splits individual tests, not whole files, so no shard sits idle |

Locally the same config falls back to `retries: 0` and the familiar HTML reporter,
so nothing about the Assignment 1 workflow changes.

`baseURL` is read from the `BASE_URL` repository variable
(Settings → Secrets and variables → Actions → Variables) and falls back to
`https://practicesoftwaretesting.com`. No credentials are hardcoded: test accounts
are registered at runtime with generated unique e-mail addresses.

### Runtime

| Configuration | Total run time | Run tests step (slowest shard) | Run |
| --- | --- | --- | --- |
| 1 job, no sharding | _X min Y s_ | _X min Y s_ | [run](LINK) |
| 4 shards + merge | _X min Y s_ | _X min Y s_ | [run](LINK) |

Median of 3 runs triggered via `workflow_dispatch`.

**Conclusion:** _to be written from the measured numbers._

### Running locally

```bash
npm ci
npx playwright install --with-deps chromium

# normal local run (HTML report, no retries)
npx playwright test
npx playwright show-report

# exactly what CI does, on one machine
CI=true npx playwright test          # PowerShell: $env:CI="true"; npx playwright test
```

Reproducing the sharding and the report merge locally (the blob reporter clears its
folder before each run, so each shard's archive is copied aside first):

```bash
mkdir -p all-blob-reports
CI=true npx playwright test --shard=1/2 && cp blob-report/*.zip all-blob-reports/
CI=true npx playwright test --shard=2/2 && cp blob-report/*.zip all-blob-reports/
npx playwright merge-reports --config merge.config.ts ./all-blob-reports
npx playwright show-report
```

The workflow file itself can be executed locally with
[act](https://github.com/nektos/act) and Docker:

```bash
act push -P ubuntu-latest=catthehacker/ubuntu:act-latest \
         --artifact-server-path ./.act-artifacts
```

### Repository layout

```
.github/workflows/playwright.yml   CI pipeline (4 shards + merge job)
playwright.config.ts               test config, with the CI branch
merge.config.ts                    config used by `playwright merge-reports`
tests/                             spec files and test helpers
pages/                             Page Objects
fixtures/pages.fixture.ts          fixture that injects the Page Objects
docs/                              assignment documentation and AI usage log
```
