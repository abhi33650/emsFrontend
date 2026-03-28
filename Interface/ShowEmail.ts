export interface ShowEmail {
  isRead: boolean; 
  Id: string | number;
  Subject: string;
  Fromemail: string;
  Body: string;
  RecivedDate: string;
  RegNo: string;
  DaysAgo: string;
  ThreadId: string | null;
  MessageId: string;
  remark?: string;
  remarkby?: number;
  Email: string;
}


