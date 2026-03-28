export interface ReplyEmailPayload {
  fromEmail: string;
  toEmail: string;
  subject: string;
  body: string;
  inReplyTo: string;
  // threadid:string
}

export interface ReplyEmailResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}