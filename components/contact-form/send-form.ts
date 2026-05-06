'use server';

import { Resend } from 'resend';

import { Message } from '@/components/contact-form/message';

interface SendFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendForm({
  name,
  email,
  subject,
  message,
}: SendFormData) {
  const resend = new Resend(process.env.RESEND_KEY);

  return await resend.emails.send({
    from: 'info@stephaniegiorgis.ch',
    to: 'info@stephaniegiorgis.ch',
    subject,
    react: Message({ name, email, subject, message }),
  });
}
