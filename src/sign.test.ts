import { describe, expect, test } from "vitest";
import { getSignatureStatus, sendForSignature, type SignAdapter } from "./core.js";
const adapter: SignAdapter={vendor:"dropbox-sign",send:async r=>({vendor:r.vendor,signatureId:"sig_1",status:"sent"}),status:async id=>({vendor:"dropbox-sign",signatureId:id,status:"completed"})};
describe("sign",()=>{test("dry run sends no vendor request",async()=>expect(await sendForSignature({vendor:"boldsign",document:"a.pdf",title:"NDA",signerEmail:"a@b.com"})).toMatchObject({dryRun:true,status:"preview"}));test("fixture adapter sends",async()=>expect(await sendForSignature({vendor:"dropbox-sign",document:"a",title:"t",signerEmail:"a@b.com"},{live:true,adapter})).toMatchObject({signatureId:"sig_1"}));test("dry run reads status",async()=>expect(await getSignatureStatus("boldsign","x")).toMatchObject({dryRun:true}));});

describe("live vendor hosts",()=>{
  for (const [vendor, host, response] of [
    ["dropbox-sign", "https://api.hellosign.com/v3/signature_request/send", '{"signature_request_id":"sig_1"}'],
    ["boldsign", "https://api.boldsign.com/v1/document/send", '{"documentId":"doc_1"}'],
  ] as const) {
    test(`${vendor} posts to its real HTTPS host`, async () => {
      const fetchFn = async (url: string | URL | Request) => {
        expect(String(url)).toBe(host);
        return new Response(response, { status: 200 });
      };
      const { HttpSignAdapter } = await import("./core.js");
      const adapter = new HttpSignAdapter(vendor, "test-key", fetchFn as typeof fetch);
      await expect(adapter.send({ vendor, document: "a.pdf", title: "NDA", signerEmail: "a@b.com" })).resolves.toMatchObject({ vendor });
    });
  }
});
