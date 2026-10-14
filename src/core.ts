export type Vendor = "dropbox-sign" | "boldsign";
export interface SignRequest { vendor: Vendor; document: string; title: string; signerEmail: string; signerName?: string; }
export interface SignatureStatus { vendor: Vendor; signatureId: string; status: string; title?: string; signerEmail?: string; }
export class VendorError extends Error { constructor(message: string, public readonly status?: number) { super(message); this.name = "VendorError"; } }
export interface SignAdapter { readonly vendor: Vendor; send(request: SignRequest): Promise<SignatureStatus>; status(signatureId: string): Promise<SignatureStatus>; }
function keyFor(v: Vendor): string { return v === "dropbox-sign" ? "DROPBOX_SIGN_API_KEY" : "BOLDSIGN_API_KEY"; }
export class HttpSignAdapter implements SignAdapter {
  constructor(readonly vendor: Vendor, private readonly apiKey = process.env[keyFor(vendor)], private readonly fetchFn: typeof fetch = fetch) {}
  private base(): string { return this.vendor === "dropbox-sign" ? "https://api.hellosign.com/v3" : "https://api.boldsign.com/v1"; }
  private ensureKey(): string { if (!this.apiKey) throw new VendorError(`${keyFor(this.vendor)} is required for --live`); return this.apiKey; }
  async send(request: SignRequest): Promise<SignatureStatus> {
    const key = this.ensureKey(); const url = this.vendor === "dropbox-sign" ? `${this.base()}/signature_request/send` : `${this.base()}/document/send`;
    let r: Response; try { r = await this.fetchFn(url,{method:"POST",headers:{authorization:`Bearer ${key}`,"content-type":"application/json"},body:JSON.stringify(request)}); } catch(e) { throw new VendorError(String(e)); }
    const body = await r.text(); if (!r.ok) throw new VendorError(body || `vendor returned ${r.status}`,r.status); const data = body ? JSON.parse(body) : {}; const id = data.signature_request_id ?? data.documentId ?? data.id; if (!id) throw new VendorError("vendor response did not include a signature id"); return {vendor:this.vendor,signatureId:id,status:data.status ?? "sent",title:request.title,signerEmail:request.signerEmail};
  }
  async status(signatureId: string): Promise<SignatureStatus> {
    const key = this.ensureKey(); const url = this.vendor === "dropbox-sign" ? `${this.base()}/signature_request/${encodeURIComponent(signatureId)}` : `${this.base()}/document/properties?documentId=${encodeURIComponent(signatureId)}`;
    let r: Response; try { r = await this.fetchFn(url,{headers:{authorization:`Bearer ${key}`}}); } catch(e) { throw new VendorError(String(e)); }
    const body=await r.text(); if(!r.ok) throw new VendorError(body || `vendor returned ${r.status}`,r.status); const d=body?JSON.parse(body):{}; return {vendor:this.vendor,signatureId,status:d.status ?? d.documentStatus ?? d.signature_request?.is_complete ? "completed" : "unknown",title:d.title,signerEmail:d.signerEmail};
  }
}
export function dryRunSend(request: SignRequest): SignatureStatus & {dryRun:true} { return {dryRun:true,vendor:request.vendor,signatureId:"dry-run",status:"preview",title:request.title,signerEmail:request.signerEmail}; }
export function dryRunStatus(vendor: Vendor, signatureId: string): SignatureStatus & {dryRun:true} { return {dryRun:true,vendor,signatureId,status:"preview"}; }
export async function sendForSignature(request: SignRequest, options: {live?:boolean; adapter?:SignAdapter} = {}): Promise<SignatureStatus | (SignatureStatus & {dryRun:true})> { return options.live ? (options.adapter ?? new HttpSignAdapter(request.vendor)).send(request) : dryRunSend(request); }
export async function getSignatureStatus(vendor: Vendor, signatureId: string, options: {live?:boolean; adapter?:SignAdapter} = {}): Promise<SignatureStatus | (SignatureStatus & {dryRun:true})> { return options.live ? (options.adapter ?? new HttpSignAdapter(vendor)).status(signatureId) : dryRunStatus(vendor,signatureId); }
