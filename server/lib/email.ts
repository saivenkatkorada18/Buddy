import { Resend } from 'resend';

const resendApiKey = process.env.RESEND_API_KEY || '';
const fromEmail = process.env.FROM_EMAIL || 'BorrowBuddy <onboarding@resend.dev>';

export const resend = new Resend(resendApiKey);

// In Resend sandbox mode, emails can only be delivered to the registered account owner
const REGISTERED_RESEND_OWNER_EMAIL = 'saivenkatkorada18@gmail.com';

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  deliveredTo?: string;
}

async function sendWithFallback(params: {
  to: string;
  subject: string;
  html: string;
}): Promise<EmailResult> {
  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      // If Resend sandbox restricts to account owner, fallback to owner email
      if (error.message?.includes('only send testing emails to your own email address') || (error as any).statusCode === 403) {
        console.warn(`[Resend Sandbox] Forwarding email to verified account owner: ${REGISTERED_RESEND_OWNER_EMAIL}`);
        const fallbackHtml = `
          <div style="background:#fff3cd;padding:12px 16px;border:1px solid #ffeeba;border-radius:8px;margin-bottom:16px;font-family:sans-serif;font-size:13px;color:#856404;">
            <strong>ℹ️ Resend Sandbox Notice:</strong> This email was requested for <code>${params.to}</code> and delivered to your registered Resend inbox (<code>${REGISTERED_RESEND_OWNER_EMAIL}</code>).
          </div>
          ${params.html}
        `;
        const retry = await resend.emails.send({
          from: fromEmail,
          to: [REGISTERED_RESEND_OWNER_EMAIL],
          subject: params.subject,
          html: fallbackHtml,
        });
        if (retry.data?.id) {
          return { success: true, messageId: retry.data.id, deliveredTo: REGISTERED_RESEND_OWNER_EMAIL };
        }
      }
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id, deliveredTo: params.to };
  } catch (err: any) {
    return { success: false, error: err.message || 'Unknown email error' };
  }
}


/**
 * Send 6-digit OTP verification email to student
 */
export async function sendVerificationOtpEmail(
  toEmail: string,
  name: string,
  otpCode: string
): Promise<EmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #0d9488, #0f766e); padding: 32px 24px; text-align: center; color: white; }
          .content { padding: 32px 28px; }
          .otp-box { background: #f0fdfa; border: 2px dashed #0d9488; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0; }
          .otp-code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #0f766e; margin: 0; font-family: monospace; }
          .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;font-size:24px;font-weight:700;">🤝 BorrowBuddy</h1>
            <p style="margin:6px 0 0 0;opacity:0.9;font-size:14px;">Campus Peer-to-Peer Sharing Community</p>
          </div>
          <div class="content">
            <span class="badge">Student Email Verification</span>
            <h2 style="margin-top:0;font-size:20px;color:#1e293b;">Verify Your Student Account</h2>
            <p style="color:#475569;line-height:1.6;font-size:15px;">
              Hello <strong>${name || 'Student'}</strong>,<br>
              Welcome to BorrowBuddy! Please use the 6-digit verification code below to confirm your official university email and unlock full campus borrowing access.
            </p>
            <div class="otp-box">
              <p style="margin:0 0 8px 0;font-size:12px;color:#64748b;text-transform:uppercase;font-weight:600;">Your 6-Digit OTP Code</p>
              <div class="otp-code">${otpCode}</div>
              <p style="margin:8px 0 0 0;font-size:12px;color:#0d9488;font-weight:500;">Valid for 10 minutes</p>
            </div>
            <p style="color:#64748b;font-size:13px;line-height:1.5;">
              If you did not request this verification, you can safely ignore this email.
            </p>
          </div>
          <div class="footer">
            <p style="margin:0;">BorrowBuddy Student Platform • Trusted Campus Sharing</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendWithFallback({
    to: toEmail,
    subject: `🔐 ${otpCode} is your BorrowBuddy student verification code`,
    html,
  });
}

/**
 * Send Due Date Reminder Email
 */
export async function sendDueDateReminderEmail(
  toEmail: string,
  borrowerName: string,
  itemName: string,
  campus: string,
  dueDate: string
): Promise<EmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px 24px; text-align: center; color: white; }
          .content { padding: 32px 28px; }
          .card { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 12px; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;font-size:24px;font-weight:700;">⏰ Due Date Reminder</h1>
            <p style="margin:6px 0 0 0;opacity:0.9;font-size:14px;">BorrowBuddy Campus Community</p>
          </div>
          <div class="content">
            <span class="badge">Return Due Tomorrow</span>
            <h2 style="margin-top:0;font-size:20px;color:#1e293b;">Reminder: Your loan is due tomorrow!</h2>
            <p style="color:#475569;line-height:1.6;font-size:15px;">
              Hi <strong>${borrowerName}</strong>,<br>
              This is a friendly reminder that your borrowed item is scheduled for return tomorrow.
            </p>
            
            <div class="card">
              <div style="margin-bottom:10px;font-size:16px;font-weight:700;color:#92400e;">📦 ${itemName}</div>
              <div style="font-size:14px;color:#78350f;margin-bottom:6px;"><strong>📍 Return Location:</strong> ${campus}</div>
              <div style="font-size:14px;color:#78350f;"><strong>📅 Due Date:</strong> ${dueDate}</div>
            </div>

            <p style="color:#475569;font-size:14px;line-height:1.5;">
              🌟 <strong>Keep your Trust Score high!</strong> Returning items on time boosts your campus reputation score and keeps items available for fellow classmates.
            </p>
          </div>
          <div class="footer">
            <p style="margin:0;">BorrowBuddy • Student Peer-to-Peer Sharing</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendWithFallback({
    to: toEmail,
    subject: `Reminder: Your ${itemName} loan is due tomorrow at ${campus}!`,
    html,
  });
}

/**
 * Send Borrow Request Confirmation Email
 */
export async function sendBorrowConfirmationEmail(
  toEmail: string,
  borrowerName: string,
  itemName: string,
  lenderName: string,
  startDate: string,
  endDate: string,
  campus: string
): Promise<EmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #0d9488, #059669); padding: 32px 24px; text-align: center; color: white; }
          .content { padding: 32px 28px; }
          .card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;font-size:24px;font-weight:700;">🎉 Borrow Confirmed!</h1>
            <p style="margin:6px 0 0 0;opacity:0.9;font-size:14px;">BorrowBuddy Campus Community</p>
          </div>
          <div class="content">
            <h2 style="margin-top:0;font-size:20px;color:#1e293b;">You're all set to borrow ${itemName}</h2>
            <p style="color:#475569;line-height:1.6;font-size:15px;">
              Hi <strong>${borrowerName}</strong>,<br>
              Your loan request for <strong>"${itemName}"</strong> from <strong>${lenderName}</strong> has been approved and confirmed.
            </p>
            
            <div class="card">
              <div style="font-size:14px;color:#166534;margin-bottom:6px;"><strong>📍 Pickup Campus:</strong> ${campus}</div>
              <div style="font-size:14px;color:#166534;margin-bottom:6px;"><strong>🗓️ Loan Period:</strong> ${startDate} to ${endDate}</div>
              <div style="font-size:14px;color:#166534;"><strong>👤 Lender:</strong> ${lenderName}</div>
            </div>

            <p style="color:#64748b;font-size:13px;line-height:1.5;">
              Please coordinate with ${lenderName} for the campus pickup and remember to return the item in clean, original condition by ${endDate}.
            </p>
          </div>
          <div class="footer">
            <p style="margin:0;">BorrowBuddy Student Platform • Trusted Campus Sharing</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendWithFallback({
    to: toEmail,
    subject: `🎉 Loan Confirmed: ${itemName} on BorrowBuddy`,
    html,
  });
}

/**
 * Send Borrow Request Message Email (to lender or recipient)
 */
export async function sendBorrowRequestMessageEmail(
  toEmail: string,
  recipientName: string,
  requesterName: string,
  requesterEmail: string,
  itemName: string,
  message: string,
  startDate: string,
  endDate: string,
  pickupLocation: string,
  depositText: string
): Promise<EmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #0f172a; }
          .container { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
          .header { background: linear-gradient(135deg, #4f46e5, #4338ca); padding: 32px 24px; text-align: center; color: white; }
          .content { padding: 32px 28px; }
          .quote-box { background: #f8fafc; border-left: 4px solid #4f46e5; border-radius: 8px; padding: 16px; margin: 20px 0; font-style: italic; color: #334155; }
          .card { background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 18px; margin: 20px 0; }
          .footer { background: #f1f5f9; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;font-size:24px;font-weight:700;">📬 New Borrow Request</h1>
            <p style="margin:6px 0 0 0;opacity:0.9;font-size:14px;">BorrowBuddy Campus Community</p>
          </div>
          <div class="content">
            <h2 style="margin-top:0;font-size:20px;color:#1e293b;">Hello ${recipientName || 'Student'},</h2>
            <p style="color:#475569;line-height:1.6;font-size:15px;">
              <strong>${requesterName}</strong> sent you a request to borrow <strong>"${itemName}"</strong>.
            </p>
            
            <div class="quote-box">
              "${message}"
            </div>

            <div class="card">
              <div style="font-size:14px;color:#3730a3;margin-bottom:6px;"><strong>📦 Item:</strong> ${itemName}</div>
              <div style="font-size:14px;color:#3730a3;margin-bottom:6px;"><strong>🗓️ Requested Dates:</strong> ${startDate} to ${endDate}</div>
              <div style="font-size:14px;color:#3730a3;margin-bottom:6px;"><strong>📍 Meetup Location:</strong> ${pickupLocation}</div>
              <div style="font-size:14px;color:#3730a3;margin-bottom:6px;"><strong>💰 Security Deposit:</strong> ${depositText}</div>
              <div style="font-size:14px;color:#3730a3;"><strong>👤 Requester Contact:</strong> ${requesterEmail}</div>
            </div>

            <p style="color:#64748b;font-size:13px;line-height:1.5;">
              You can coordinate directly with ${requesterName} to arrange the handoff on campus.
            </p>
          </div>
          <div class="footer">
            <p style="margin:0;">BorrowBuddy Student Platform • Trusted Campus Sharing</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendWithFallback({
    to: toEmail,
    subject: `📬 Borrow Request: ${requesterName} requested "${itemName}"`,
    html,
  });
}


