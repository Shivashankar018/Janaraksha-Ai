# Security policy

## Scope

JanaRaksha AI is a **prototype** with fictional data. It runs entirely in the browser and has no server. The known limits (browser storage, demo logins, permission checks in the browser) are listed in [docs/security-and-privacy.md](docs/security-and-privacy.md) and do not need to be reported.

Please do report:

- a way to make the app run code from data (for example, script injection through complaint text, names or file names);
- a way that a masked ID number appears in full where it should not, or a full-number reveal that is not logged;
- a way that the police phase shows escalation data, or that one role can do another role's actions through the interface;
- a dependency or build problem that could affect people who deploy the page.

## Supported versions

| Version | Supported |
| --- | --- |
| `main` branch | ✅ |
| Older commits | ❌ |

## How to report

- Use GitHub's private reporting: **Security › Report a vulnerability** on the repository page (if the maintainers have turned it on), or
- contact the maintainers privately through their GitHub profiles.

**Do not** open a public issue for a security problem. Include the steps to reproduce, the browser and what you expected. We aim to answer within 7 days.

## Data reminder

Never include real personal data in a report. Use the demo accounts and fictional data from the [demo guide](docs/demo-guide.md).
