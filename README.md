# RapidMX: Autodiscover

[![CI](https://github.com/RapidMX/autodiscover/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/RapidMX/autodiscover/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/RapidMX/autodiscover/badge.svg?branch=main)](https://coveralls.io/github/RapidMX/autodiscover?branch=main)
[![npm version](https://img.shields.io/npm/v/@rapidmx/autodiscover)](https://www.npmjs.com/package/@rapidmx/autodiscover)

Autodiscover support for a [`@rapidmx/restapi`](https://github.com/RapidMX/restapi)-based mail server — lets
a real mail client find this deployment's [`@rapidmx/activesync`](https://github.com/RapidMX/activesync)
(EAS) and [`@rapidmx/mapi`](https://github.com/RapidMX/mapi) server URLs from just an email address: classic
POX (`POST /autodiscover/autodiscover.xml`, serving either the EAS-only MobileSync response or, when a real
Outlook desktop client requests it via `AcceptableResponseSchema`, an Outlook/EXCH response pointing at the
MAPI/HTTP endpoint) and the modern JSON variant Microsoft calls "Autodiscover v2"
(`GET /autodiscover/autodiscover.json/v1.0/<email>?Protocol=ActiveSync`, EAS only — this package has no
separate JSON discovery variant for MAPI).

Both endpoints are intentionally unauthenticated, matching Autodiscover v2's own spec design: they reveal
nothing but deployment-wide server URLs (not secrets) once the requested address is confirmed to belong to a
real mailbox — real mailbox access is still fully gated by the JWT-protected EAS/MAPI/REST layers. For a real
device to find these endpoints at all, the deployment's DNS needs a `CNAME` record for
`autodiscover.<your-domain>` (and, optionally, a `_autodiscover._tcp` `SRV` record) pointing at wherever this
server is mounted — an ops/deployment task, not something this package configures.

## Usage

Mount `AutodiscoverRouteMongo`/`AutodiscoverRouteSQL` (from `@rapidmx/autodiscover/mongo` or `/sql`) with a
one-line subclass supplying your deployment's EAS and MAPI URLs:

```ts
import { AutodiscoverRouteMongo } from "@rapidmx/autodiscover/mongo";
import { RouteDecorators } from "@rapidrest/service-core";
const { Route } = RouteDecorators;

@Route("/autodiscover")
export class MyAutodiscoverRoute extends AutodiscoverRouteMongo {
    protected readonly easUrl = "https://mail.example.com/Microsoft-Server-ActiveSync";
    protected readonly mapiUrl = "https://mail.example.com/mapi/emsmdb";
}
```

Requires a [`@rapidmx/restapi`](https://github.com/RapidMX/restapi)-backed `Mailbox` model to resolve
addresses against.

## Status

Complete. This package was carved out of the former `@rapidrest/mail` monolith — see `.claude/NOTES.md` for
the split's own rationale and history.
