# Security Policy

## Content Security Policy
> 

> **Content Security Policy** (CSP) is an added layer of security that helps to detect
and mitigate certain types of attacks, including Cross Site Scripting (XSS) and
data injection attacks. These attacks are used for everything from data theft 
to site defacement to distribution of malware.

The production site uses a [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
header to limit what resources are allowed to be loaded into the browser. This
allows:

- **Scripts**: Javascript is only permitted to be run from the originating server,
and inline scripts and the use of `eval` are prohibited.
- **XHR / `fetch`**: In addition to the originating server, requsts are permitted
to `https://api.pwnedpasswords.com`. The first 5 characters of the password's SHA-1
hash are submitted to this endpoint.
- **Images**: In addition to the originating server, images are allowed from `https://cdn.kernvalley.us`.
- **Other**: All other requests are limited to the originating server. No external
resources are permitted.
- No browser plugins (*Flash / Java*) are allowed.
- Insecure requests are upgraded to use HTTPS.
- Insecure content (*non-HTTPS*) is blocked.
- Violations of the security policy are reported to `report-uri.com`

**Note**: These protections do not apply in development environment or to outdated browsers.

## Secure Contributions
All contributions (*including from the author*) must:
- Have valid a PGP signature
- Follow coding style standards for legibility
- Be approved in a pull request
- Have no "mixed content"

## Node packages
All installed packages are used only for building the project (icons) and for
serving in development. Due to the scope of effect these can have on the project,
combined with [CSP](#content-security-policy), vulnerabilities in node packages
*should* not affect users.

Please report any vulnerabilities to any node packages to the package author.

## Reporting a Vulnerability
Since any security vulnerabilites found will most likely be in a node package or
a browser's implementation of some feature, please notifiy the author or vendor
so that they may fix the issue.

Any serious vulnerabilites that may affect users is probably going to be known
and the existence of such an issue will not be sensitive information. Please
[open an issue](https://github.com/shgysk8zer0/password-checker/issues) to report it.
