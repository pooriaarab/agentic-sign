# agentic-sign

[![npm version](https://img.shields.io/npm/v/agentic-sign)](https://www.npmjs.com/package/agentic-sign) [![Downloads/month](https://img.shields.io/npm/dm/agentic-sign)](https://www.npmjs.com/package/agentic-sign) [![License: MIT](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/license/mit)

agentic-sign is an open-source TypeScript electronic signature wrapper with dry-run previews and experimental HTTP routes for Dropbox Sign and BoldSign.

## Install

```sh
npm install agentic-sign
```

Requires Node.js 18 or later. Includes TypeScript declarations and three runtime dependencies.

## Preview your first signature request

```sh
npx agentic-sign send --vendor dropbox-sign --document nda.pdf --title NDA --email signer@example.com
```

Expect JSON with `"dryRun":true`, `"signatureId":"dry-run"`, and `"status":"preview"`.
The preview requires no credentials, file, or network request. It does not validate the document.

```js
import { sendForSignature } from "agentic-sign";
const result = await sendForSignature({
  vendor: "boldsign", document: "nda.pdf", title: "NDA",
  signerEmail: "signer@example.com"
});
console.log(result.status); // preview
```

## Features and coverage

- Preview signature sends and status lookups without vendor calls.
- Inject a custom `SignAdapter` into library calls.
- Return vendor, signature ID, status, and optional request metadata.

| Integration | Send route | Status route | Verification |
| --- | --- | --- | --- |
| Dropbox Sign (HelloSign API) | Experimental scaffold | Experimental scaffold | Mocked HTTP only; no credential check |
| BoldSign | Experimental scaffold | Experimental scaffold | Mocked HTTP only; no credential check |

One `HttpSignAdapter` selects two vendor routes. These routes do not establish working document delivery.

## Runtime surfaces

CLI commands: `send` and `status`; flags: `--help` and `--version`.
`send` requires `--vendor`, `--document`, `--title`, and `--email`; `--name` is optional.
`status` requires `--vendor` and `--id`. Both commands default to dry run.

```sh
npx agentic-sign status --vendor boldsign --id demo
npx agentic-sign-mcp
```

The Model Context Protocol (MCP) server exposes `send_for_signature` and `get_signature_status` over standard input/output.
Both tools default to dry run. The library also exports `getSignatureStatus`, dry-run helpers, `HttpSignAdapter`, and `VendorError`.

## Behavior limits

Live CLI calls require `--live`; library calls and MCP tools require `live: true`.
Export `DROPBOX_SIGN_API_KEY` or `BOLDSIGN_API_KEY` before a live call. The package does not load `.env` files.
The HTTP adapter sends the generic request as JSON with Bearer authentication for both vendors.
It does not read local files, upload document bytes, or map requests into vendor-specific signing fields.
Response handling assumes top-level signature IDs; vendor response compatibility remains unverified.
The status expression maps truthy status values to `completed`; treat live status results as unreliable.
There is no retry policy, explicit timeout, webhook receiver, or managed signing service.
Version 0.1.x interfaces can change. No public case studies are published in this repository.

## Links and license

[Package](https://www.npmjs.com/package/agentic-sign) · [Dropbox Sign API](https://developers.hellosign.com/) · [BoldSign API](https://developers.boldsign.com/)

MIT license.
