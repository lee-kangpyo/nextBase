export interface EmailData {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  content: string;
  attachments: File[];
  isHtml: boolean;
}
