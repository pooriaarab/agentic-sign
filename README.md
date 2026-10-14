# Agentic Sign

Agentic Sign sends documents for signature with Dropbox Sign (the HelloSign API) and BoldSign. The default command is a dry run, so it exits successfully without a network call.

## Install

```sh
npm install agentic-sign
```

## Vendors

| Brand | Environment key | Live command |
| --- | --- | --- |
| Dropbox Sign | `DROPBOX_SIGN_API_KEY` | `agentic-sign send --vendor dropbox-sign --document nda.pdf --title NDA --email signer@example.com --live` |
| BoldSign | `BOLDSIGN_API_KEY` | `agentic-sign send --vendor boldsign --document nda.pdf --title NDA --email signer@example.com --live` |

## Quick start

This previews a Dropbox Sign request. It does not call a vendor.

```sh
npx agentic-sign send --vendor dropbox-sign --document nda.pdf --title NDA --email signer@example.com
```

Add `--live` to call a vendor. Set the vendor environment key first.

## Three uses

**CLI**

```sh
agentic-sign status --vendor boldsign --id request_123
```

**Library**

```js
import { sendForSignature } from "agentic-sign";
const result = await sendForSignature({ vendor: "boldsign", document: "nda.pdf", title: "NDA", signerEmail: "signer@example.com" });
```

**MCP**

```sh
npx agentic-sign-mcp
```

Tools: `send_for_signature` and `get_signature_status`.

## License

MIT.
