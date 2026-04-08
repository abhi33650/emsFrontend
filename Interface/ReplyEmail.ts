// export interface ReplyEmailPayload {
//   fromEmail: string;
//   toEmail: string;
//   subject: string;
//   body: string;
//   inReplyTo: string;
//    file?: File;
//   // threadid:string
// }

// export interface ReplyEmailResponse {
//   success: boolean;
//   data?: unknown;
//   message?: string;
// }


export interface ReplyEmailPayload {
  fromEmail: string;
  toEmail: string;
  subject: string;
  body: string;
  inReplyTo: string;
  file?: File;
   emailId: string | number;
}

export interface ReplyEmailResponse {
  success: boolean;
  data?: unknown;
  message?: string;
}