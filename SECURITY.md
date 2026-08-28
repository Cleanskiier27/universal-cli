# Security Policy

## Supported Versions

This repository is actively developed on the `main` branch. Security fixes
are applied to the latest state of `main`; older snapshots are not
separately maintained.

## Reporting a Vulnerability

If you discover a security vulnerability in this repository, please report
it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Use [GitHub Security Advisories](../../security/advisories/new) to
   privately report the issue to the maintainers, or contact the
   repository owner directly through their GitHub profile.
3. Include as much detail as possible:
   - A description of the vulnerability and its potential impact.
   - Steps to reproduce, including any relevant request payloads, scripts,
     or configuration.
   - The affected file(s) or endpoint(s).

## What to Expect

- We will acknowledge receipt of your report as soon as possible.
- We will investigate and, where confirmed, work on a fix.
- We will keep you informed of progress until the issue is resolved.
- We ask that you give us a reasonable amount of time to address the issue
  before any public disclosure.

## Scope

In scope:
- Application code in this repository (servers, APIs, dashboards, mobile
  app source) that is intended for deployment or production use.

Out of scope:
- Denial-of-service testing against shared or production infrastructure.
- Social engineering, phishing, or physical security testing.
- Automated scanning that generates excessive load without prior
  coordination with the maintainers.
- Third-party dependencies (report these upstream to the respective
  project instead).

## Disclosure

We follow a coordinated disclosure process: vulnerabilities are kept
private until a fix is available, after which details may be published
(for example, via a GitHub Security Advisory).
