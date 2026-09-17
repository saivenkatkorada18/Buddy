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

/**
 * Send official acceptance email from the Organization Team directly to the customer
 */
export async function sendOrgAcceptedRequestEmail(params: {
  customerEmail: string;
  customerName: string;
  itemName: string;
  orgName: string;
  orgContactEmail: string;
  pickupLocation: string;
  startDate: string;
  endDate: string;
  approvalNotes?: string;
  securityDeposit?: number;
}): Promise<EmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc; }
          .container { max-width: 580px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
          .header { background: linear-gradient(135deg, #10b981, #047857); padding: 32px 28px; text-align: center; color: white; }
          .content { padding: 32px 28px; color: #cbd5e1; }
          .card { background: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .highlight { color: #34d399; font-weight: 700; }
          .badge { display: inline-block; background: #064e3b; color: #6ee7b7; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; border: 1px solid #059669; }
          .button { display: inline-block; background: #10b981; color: #0f172a; font-weight: 700; padding: 12px 28px; border-radius: 10px; text-decoration: none; margin: 16px 0; font-size: 14px; }
          .footer { background: #0f172a; padding: 20px 24px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Organization Team Approved</span>
            <h1 style="margin:8px 0 0 0;font-size:24px;font-weight:800;">🎉 Request Accepted!</h1>
            <p style="margin:6px 0 0 0;opacity:0.9;font-size:14px;">${params.orgName || 'Campus Organization Team'} has approved your gear loan</p>
          </div>
          <div class="content">
            <h2 style="margin-top:0;font-size:19px;color:#f8fafc;">Hello ${params.customerName || 'Student'},</h2>
            <p style="line-height:1.6;font-size:15px;">
              Great news! Your request to borrow <span class="highlight">"${params.itemName}"</span> has been officially <strong>ACCEPTED</strong> by the <strong>${params.orgName || 'Campus Organization Team'}</strong>.
            </p>

            <div class="card">
              <div style="font-size:14px;margin-bottom:8px;color:#e2e8f0;"><strong>📦 Equipment:</strong> ${params.itemName}</div>
              <div style="font-size:14px;margin-bottom:8px;color:#e2e8f0;"><strong>🏢 Approving Organization:</strong> ${params.orgName || 'Campus Gear Team'}</div>
              <div style="font-size:14px;margin-bottom:8px;color:#e2e8f0;"><strong>🗓️ Loan Period:</strong> ${params.startDate} to ${params.endDate}</div>
              <div style="font-size:14px;margin-bottom:8px;color:#e2e8f0;"><strong>📍 Pickup Location:</strong> ${params.pickupLocation || 'Main Campus Desk'}</div>
              ${params.securityDeposit ? `<div style="font-size:14px;margin-bottom:8px;color:#e2e8f0;"><strong>🛡️ Refundable Deposit:</strong> ₹${params.securityDeposit}</div>` : ''}
              ${params.approvalNotes ? `<div style="font-size:14px;margin-top:12px;padding-top:12px;border-top:1px dashed #334155;color:#93c5fd;"><strong>💬 Team Pickup Note:</strong> "${params.approvalNotes}"</div>` : ''}
            </div>

            <p style="font-size:14px;line-height:1.6;">
              Please present your official student ID at the pickup location during regular hours to claim your gear.
            </p>
          </div>
          <div class="footer">
            <p style="margin:0 0 6px 0;">BorrowBuddy Institutional Equipment Network</p>
            <p style="margin:0;color:#475569;">Contact organization team at: ${params.orgContactEmail || 'borrowbuddy@superadmin.in'}</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendWithFallback({
    to: params.customerEmail,
    subject: `🎉 Request Accepted: "${params.itemName}" is ready for pickup!`,
    html,
  });
}

/**
 * Send custom message from Organization Team to Customer
 */
export async function sendOrgMessageToCustomerEmail(params: {
  customerEmail: string;
  customerName: string;
  itemName: string;
  orgName: string;
  messageText: string;
}): Promise<EmailResult> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc; }
          .container { max-width: 540px; margin: 0 auto; background: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; }
          .header { background: linear-gradient(135deg, #6366f1, #4f46e5); padding: 28px 24px; text-align: center; color: white; }
          .content { padding: 28px; color: #cbd5e1; }
          .message-box { background: #0f172a; border-left: 4px solid #818cf8; padding: 16px; border-radius: 8px; margin: 18px 0; font-size: 15px; color: #f1f5f9; font-style: italic; }
          .footer { background: #0f172a; padding: 18px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;font-size:22px;font-weight:700;">💬 Message from ${params.orgName || 'Organization Team'}</h1>
            <p style="margin:4px 0 0 0;opacity:0.9;font-size:13px;">Regarding your request for "${params.itemName}"</p>
          </div>
          <div class="content">
            <h2 style="margin-top:0;font-size:18px;color:#f8fafc;">Hello ${params.customerName || 'Student'},</h2>
            <p style="line-height:1.5;font-size:14px;">
              The <strong>${params.orgName || 'Campus Organization Team'}</strong> has sent you an update regarding <strong>"${params.itemName}"</strong>:
            </p>
            <div class="message-box">
              "${params.messageText}"
            </div>
          </div>
          <div class="footer">
            <p style="margin:0;">BorrowBuddy Campus Platform</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendWithFallback({
    to: params.customerEmail,
    subject: `💬 Update regarding "${params.itemName}" from ${params.orgName}`,
    html,
  });
}



