# Agentic Sign

Send one document for signature. Read its status. Dry run is the default.

## Install

```sh
npm install agentic-sign
```

## Quick start

This previews a Dropbox Sign request. It does not call a vendor.

```sh
npx agentic-sign send --vendor dropbox-sign --document nda.pdf --title NDA --email signer@example.com
```

Add `--live` to call the vendor. Set `DROPBOX_SIGN_API_KEY` or `BOLDSIGN_API_KEY` first.

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
