import { Resend } from 'resend'

// Initialized lazily so build-time collection doesn't throw on missing key
function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM = 'Amiquz <noreply@amiquz.com>'
const BASE_URL = 'https://amiquz.com'

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f8fafc;margin:0;padding:0;">
  <div style="max-width:560px;margin:40px auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0f172a,#1e3a8a);padding:28px 32px;">
      <span style="color:white;font-size:22px;font-weight:800;letter-spacing:-0.5px;">Amiquz</span>
      <span style="color:#93c5fd;font-size:13px;margin-left:8px;">Legal Platform</span>
    </div>
    <div style="padding:32px;">${content}</div>
    <div style="background:#f8fafc;padding:16px 32px;border-top:1px solid #e2e8f0;text-align:center;">
      <p style="color:#94a3b8;font-size:12px;margin:0;">
        Amiquz · <a href="${BASE_URL}" style="color:#94a3b8;text-decoration:none;">amiquz.com</a>
      </p>
    </div>
  </div>
</body>
</html>`
}

export async function sendEnquiryNotification({
  lawyerEmail,
  lawyerName,
  lawyerId,
  clientName,
  clientPhone,
  clientEmail,
  issueDescription,
}: {
  lawyerEmail: string
  lawyerName: string
  lawyerId: string
  clientName: string
  clientPhone: string
  clientEmail?: string | null
  issueDescription: string
}) {
  const emailRow = clientEmail
    ? `<tr><td style="padding:6px 0;color:#64748b;font-size:14px;width:100px;">Email</td><td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${clientEmail}</td></tr>`
    : ''

  const html = baseTemplate(`
    <h2 style="color:#0f172a;margin:0 0 6px;font-size:20px;">New Enquiry Received</h2>
    <p style="color:#64748b;margin:0 0 24px;font-size:14px;">Hi ${lawyerName}, a potential client has sent you an enquiry on Amiquz.</p>

    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#64748b;font-size:14px;width:100px;">Name</td><td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${clientName}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:14px;">Phone</td><td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${clientPhone}</td></tr>
        ${emailRow}
      </table>
    </div>

    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin-bottom:28px;">
      <p style="margin:0 0 6px;color:#92400e;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Issue Description</p>
      <p style="margin:0;color:#78350f;font-size:14px;line-height:1.6;">${issueDescription}</p>
    </div>

    <a href="${BASE_URL}/lawyers/${lawyerId}" style="display:inline-block;background:#1d4ed8;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;">View Your Profile →</a>
    <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Reply directly to the client using the contact details above.</p>
  `)

  return getResend().emails.send({ from: FROM, to: lawyerEmail, subject: `New enquiry from ${clientName} – Amiquz`, html })
}

export async function sendApprovalNotification({
  lawyerEmail,
  lawyerName,
  lawyerId,
}: {
  lawyerEmail: string
  lawyerName: string
  lawyerId: string
}) {
  const html = baseTemplate(`
    <h2 style="color:#0f172a;margin:0 0 6px;font-size:20px;">Your profile is live!</h2>
    <p style="color:#64748b;margin:0 0 20px;font-size:14px;">Hi ${lawyerName}, your Amiquz profile has been reviewed and approved.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#14532d;font-size:14px;line-height:1.6;">
        ✅ Your profile is now publicly visible to clients searching for lawyers on Amiquz.<br>
        ✅ Clients can send you enquiries directly from your profile.<br>
        ✅ You'll receive an email each time a new enquiry comes in.
      </p>
    </div>

    <a href="${BASE_URL}/lawyers/${lawyerId}" style="display:inline-block;background:#1d4ed8;color:white;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;">View Your Public Profile →</a>
    <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Questions? Reply to this email or reach us at founders@amiquz.com</p>
  `)

  return getResend().emails.send({ from: FROM, to: lawyerEmail, subject: 'Your Amiquz profile is now live 🎉', html })
}

export async function sendBookingConfirmation({
  userEmail,
  userName,
  lawyerName,
  slot,
  amount,
}: {
  userEmail: string
  userName: string
  lawyerName: string
  slot: string
  amount: number
}) {
  const html = baseTemplate(`
    <h2 style="color:#0f172a;margin:0 0 6px;font-size:20px;">Booking Confirmed</h2>
    <p style="color:#64748b;margin:0 0 20px;font-size:14px;">Hi ${userName}, your consultation has been booked.</p>

    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:28px;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#64748b;font-size:14px;width:120px;">Lawyer</td><td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${lawyerName}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:14px;">Slot</td><td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">${slot}</td></tr>
        <tr><td style="padding:6px 0;color:#64748b;font-size:14px;">Amount Paid</td><td style="padding:6px 0;color:#0f172a;font-size:14px;font-weight:600;">₹${amount}</td></tr>
      </table>
    </div>

    <p style="color:#64748b;font-size:14px;margin:0;">The lawyer will reach out to confirm the meeting link or call details.</p>
    <p style="color:#94a3b8;font-size:12px;margin-top:20px;">Questions? Contact us at founders@amiquz.com</p>
  `)

  return getResend().emails.send({ from: FROM, to: userEmail, subject: `Consultation booked with ${lawyerName} – Amiquz`, html })
}
