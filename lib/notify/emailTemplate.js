// Branded HTML e-mails (verification code, "problem registered", "status update").
//
// Pure functions: they take plain values and return { subject, html, text }. Nothing here
// sends anything, so the look can be changed without touching the notification rules.
//
// Built the way e-mail clients need it: tables, inline CSS, a bulletproof button, no web
// fonts, no external CSS and no JavaScript. The logo is a normal <img> pointing at
// the website (see LOGO_PATH), so it is never attached to the mail.
import { PARTY } from '@/data/party';

// The logo is NOT attached to the mail (Gmail would list it as an attachment). It is loaded
// from the website, so SITE_URL must be the public https address of the deployed site.
export const LOGO_PATH = '/email-logo.png';

const C = {
  ink: '#14213D',
  soft: '#2A3654',
  saffron: '#E85D2C',
  marigold: '#F4A300',
  marigoldLight: '#FFC94D',
  banyan: '#0B6E4F',
  chakra: '#1D3E82',
  ivory: '#FBF6EC',
  paper: '#F5EEDD',
  line: '#E8DFCB',
  muted: '#6B7280',
};
const FONT = "'Segoe UI','Noto Sans Devanagari','Mangal',Roboto,'Helvetica Neue',Arial,sans-serif";

const STATUS_FLOW = ['Submitted', 'Verified', 'Referred', 'Follow-up', 'Resolved'];
const STATUS_COLOR = {
  Submitted: C.saffron,
  Verified: C.chakra,
  Referred: '#B97A00',
  'Follow-up': C.chakra,
  Resolved: C.banyan,
  Pending: C.muted,
};
const STATUS_HI = {
  Submitted: 'दर्ज हुई',
  Verified: 'सत्यापित',
  Referred: 'आगे भेजी गई',
  'Follow-up': 'फ़ॉलो-अप जारी',
  Resolved: 'हल हुई',
  Pending: 'लंबित',
};

const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
const multiline = (v) => esc(v).replace(/\r?\n/g, '<br>');

// ---------------------------------------------------------------- building blocks

function button(href, label) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:28px auto 4px;">
    <tr>
      <td align="center" bgcolor="${C.saffron}" style="border-radius:12px;">
        <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:15px 34px;font-family:${FONT};font-size:16px;font-weight:700;line-height:1;color:#ffffff;text-decoration:none;border-radius:12px;">${esc(label)} &rarr;</a>
      </td>
    </tr>
  </table>`;
}

// size 'code' = short 6-digit code, 'ticket' = long ticket number (shrinks on phones, never wraps)
function infoBox({ label, value, mono = false, color = C.ink, size = 'code' }) {
  const ticket = size === 'ticket';
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 8px;">
    <tr>
      <td align="center" bgcolor="${C.ivory}" style="border:2px dashed ${C.marigold};border-radius:14px;padding:22px 16px;">
        <div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">${esc(label)}</div>
        <div class="${ticket ? 'ticket' : 'code'}" style="margin-top:10px;font-family:${mono ? "'Courier New',Consolas,monospace" : FONT};font-size:${ticket ? '26px' : '34px'};font-weight:800;letter-spacing:${ticket ? '3px' : '8px'};color:${color};${ticket ? 'white-space:nowrap;' : 'word-break:break-all;'}">${esc(value)}</div>
      </td>
    </tr>
  </table>`;
}

function statusPill(status) {
  const color = STATUS_COLOR[status] || C.ink;
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:6px auto 4px;">
    <tr>
      <td align="center" bgcolor="${color}" style="border-radius:999px;padding:10px 26px;font-family:${FONT};font-size:17px;font-weight:800;color:#ffffff;letter-spacing:.3px;">
        ${esc(status)}${STATUS_HI[status] ? ` <span style="font-weight:600;opacity:.9;">· ${esc(STATUS_HI[status])}</span>` : ''}
      </td>
    </tr>
  </table>`;
}

// Five-step tracker. "Pending" is a side-state, so it gets no tracker.
function progress(status) {
  const at = STATUS_FLOW.indexOf(status);
  if (at < 0) return '';
  const cells = STATUS_FLOW.map((step, i) => {
    const done = i < at;
    const current = i === at;
    const fill = done ? C.banyan : current ? C.saffron : '#ffffff';
    const border = done ? C.banyan : current ? C.saffron : C.line;
    const text = done || current ? '#ffffff' : C.muted;
    return `
      <td align="center" valign="top" width="20%" style="padding:0 2px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center"><tr>
          <td align="center" valign="middle" width="30" height="30" bgcolor="${fill}" style="width:30px;height:30px;border-radius:15px;border:2px solid ${border};font-family:${FONT};font-size:13px;font-weight:800;color:${text};line-height:30px;">${done ? '&#10003;' : i + 1}</td>
        </tr></table>
        <div style="margin-top:7px;font-family:${FONT};font-size:11px;line-height:14px;font-weight:${current ? 800 : 600};color:${current ? C.ink : C.muted};">${esc(step)}</div>
      </td>`;
  }).join('');
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 4px;">
    <tr><td style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.muted};padding-bottom:14px;" align="center">Progress</td></tr>
    <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table></td></tr>
  </table>`;
}

function quote(title, text) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 4px;">
    <tr>
      <td bgcolor="${C.ivory}" style="border-left:4px solid ${C.marigold};border-radius:10px;padding:16px 18px;">
        <div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};">${esc(title)}</div>
        <div style="margin-top:8px;font-family:${FONT};font-size:15px;line-height:24px;color:${C.ink};">${multiline(text)}</div>
      </td>
    </tr>
  </table>`;
}

const p = (html, extra = '') =>
  `<p style="margin:0 0 14px;font-family:${FONT};font-size:15px;line-height:25px;color:${C.soft};${extra}">${html}</p>`;

// ---------------------------------------------------------------- page frame

function layout({ preheader, eyebrow, title, titleHi, body, siteUrl }) {
  const site = siteUrl.replace(/\/$/, '');
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <title>${esc(title)}</title>
  <style>
    @media only screen and (max-width:620px) {
      .wrap { width:100% !important; }
      .px { padding-left:22px !important; padding-right:22px !important; }
      .h1 { font-size:24px !important; line-height:31px !important; }
      .ticket { font-size:19px !important; letter-spacing:1px !important; }
      .code { font-size:30px !important; letter-spacing:6px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background:${C.paper};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.paper}">
    <tr><td align="center" style="padding:24px 12px 32px;">

      <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
        <!-- tricolour thread -->
        <tr><td style="border-radius:18px 18px 0 0;overflow:hidden;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
            <td height="6" width="34%" bgcolor="${C.saffron}" style="height:6px;font-size:0;line-height:0;">&nbsp;</td>
            <td height="6" width="32%" bgcolor="#ffffff" style="height:6px;font-size:0;line-height:0;">&nbsp;</td>
            <td height="6" width="34%" bgcolor="${C.banyan}" style="height:6px;font-size:0;line-height:0;">&nbsp;</td>
          </tr></table>
        </td></tr>

        <!-- brand header -->
        <tr><td align="center" bgcolor="#ffffff" class="px" style="padding:30px 36px 22px;">
          <a href="${esc(site)}" target="_blank" style="text-decoration:none;">
            <img src="${esc(site)}${LOGO_PATH}" width="84" height="84" alt="${esc(PARTY.fullName)}" style="display:block;margin:0 auto;border:0;outline:none;width:84px;height:84px;">
          </a>
          <div style="margin-top:14px;font-family:${FONT};font-size:20px;line-height:26px;font-weight:800;color:${C.ink};">${esc(PARTY.fullName)}</div>
          <div style="margin-top:3px;font-family:${FONT};font-size:16px;line-height:24px;font-weight:700;color:${C.saffron};">${esc(PARTY.hindiName)}</div>
        </td></tr>

        <!-- title band -->
        <tr><td align="center" bgcolor="${C.ink}" class="px" style="padding:30px 36px 32px;">
          <div style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${C.marigold};">${esc(eyebrow)}</div>
          <div class="h1" style="margin-top:10px;font-family:${FONT};font-size:28px;line-height:36px;font-weight:800;color:${C.ivory};">${esc(title)}</div>
          ${titleHi ? `<div style="margin-top:6px;font-family:${FONT};font-size:16px;line-height:24px;font-weight:600;color:${C.marigoldLight};">${esc(titleHi)}</div>` : ''}
        </td></tr>

        <!-- content -->
        <tr><td bgcolor="#ffffff" class="px" style="padding:32px 36px 34px;">
          ${body}
        </td></tr>

        <!-- footer -->
        <tr><td bgcolor="${C.ink}" align="center" class="px" style="padding:26px 36px 28px;border-radius:0 0 18px 18px;">
          <div style="font-family:${FONT};font-size:14px;font-weight:800;color:${C.ivory};">${esc(PARTY.fullName)}</div>
          <div style="margin-top:2px;font-family:${FONT};font-size:13px;color:${C.marigoldLight};">${esc(PARTY.hindiName)}</div>
          <div style="margin:14px 0 0;font-family:${FONT};font-size:12px;line-height:20px;color:#B8C0D4;">
            ${esc(PARTY.address)}<br>
            ${esc(PARTY.phone)} &nbsp;·&nbsp; <a href="mailto:${esc(PARTY.socials.email)}" style="color:#B8C0D4;text-decoration:underline;">${esc(PARTY.socials.email)}</a>
          </div>
          <div style="margin-top:14px;"><a href="${esc(site)}" target="_blank" style="font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1px;color:${C.marigold};text-decoration:none;">${esc(site.replace(/^https?:\/\//, ''))}</a></div>
        </td></tr>
      </table>

      <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
        <tr><td align="center" class="px" style="padding:18px 30px 0;font-family:${FONT};font-size:11px;line-height:18px;color:${C.muted};">
          This is an automated message — please do not reply to it.<br>
          यह एक स्वचालित संदेश है, कृपया इसका उत्तर न दें।
        </td></tr>
      </table>

    </td></tr>
  </table>
</body>
</html>`;
}

const DISCLAIMER =
  'We do not promise a particular outcome or timeline. If you did not request this, please ignore this message.';
const DISCLAIMER_HI = 'यदि यह अनुरोध आपने नहीं किया है, तो कृपया इस संदेश को अनदेखा करें।';

const closing = () =>
  `<div style="margin-top:26px;padding-top:18px;border-top:1px solid ${C.line};font-family:${FONT};font-size:12px;line-height:20px;color:${C.muted};">${esc(DISCLAIMER)}<br>${esc(DISCLAIMER_HI)}</div>`;

// ---------------------------------------------------------------- the three e-mails

/** 6-digit verification code. */
export function otpEmail({ code, minutes = 5, siteUrl }) {
  const body = `
    ${p('Namaste,', 'font-weight:700;color:' + C.ink + ';')}
    ${p(`Use the code below to verify your email address with ${esc(PARTY.fullName)}.`)}
    ${infoBox({ label: 'Your verification code', value: code, mono: true, color: C.saffron })}
    ${p(`This code is valid for <strong>${minutes} minutes</strong> and can be used only once. <strong>Never share it with anyone</strong> — our team will never ask you for it.`, 'margin-top:18px;')}
    ${p('यह कोड केवल एक बार और ' + minutes + ' मिनट तक मान्य है। इसे किसी के साथ साझा न करें।', 'color:' + C.muted + ';font-size:13px;line-height:22px;')}
    ${closing()}`;
  return {
    subject: `Your verification code: ${code}`,
    html: layout({
      preheader: `${code} is your verification code. It is valid for ${minutes} minutes.`,
      eyebrow: 'Verification',
      title: 'Verify your email',
      titleHi: 'अपना ईमेल सत्यापित करें',
      body,
      siteUrl,
    }),
    text: [
      `Your verification code is ${code}.`,
      '',
      `It is valid for ${minutes} minutes. Do not share it with anyone.`,
      'If you did not ask for this code, please ignore this email.',
      '',
      `— ${PARTY.fullName} (${PARTY.hindiName})`,
    ].join('\n'),
  };
}

/** Sent when a problem is filed. */
export function ticketCreatedEmail({ ticketId, trackUrl, name, siteUrl }) {
  const body = `
    ${p(`Namaste${name ? ` ${esc(name)}` : ''},`, 'font-weight:700;color:' + C.ink + ';')}
    ${p(`Your problem has been registered with <strong>${esc(PARTY.fullName)}</strong>. Our team will review it and keep you updated on this email address.`)}
    ${infoBox({ label: 'Your ticket number', value: ticketId, mono: true, color: C.ink, size: 'ticket' })}
    ${p('Keep this number safe. You will need it, together with this email address, to track your problem at any time.', 'text-align:center;margin-top:16px;')}
    ${progress('Submitted')}
    ${button(trackUrl, 'Track my problem')}
    ${p('आपकी समस्या दर्ज हो गई है। ऊपर दिया गया टिकट नंबर संभालकर रखें।', 'text-align:center;color:' + C.muted + ';font-size:13px;line-height:22px;margin-top:16px;')}
    ${closing()}`;
  return {
    subject: `Your problem is registered — ticket ${ticketId}`,
    html: layout({
      preheader: `Ticket ${ticketId} — your problem has been registered. Track it any time.`,
      eyebrow: 'Problem registered',
      title: 'We have received your problem',
      titleHi: 'आपकी समस्या हमें मिल गई है',
      body,
      siteUrl,
    }),
    text: [
      `Your problem has been registered with ${PARTY.fullName}.`,
      '',
      `Ticket number: ${ticketId}`,
      '',
      `Track it any time: ${trackUrl}`,
      'You will need this ticket number and this email address.',
      '',
      DISCLAIMER,
      '',
      `— ${PARTY.fullName} (${PARTY.hindiName})`,
    ].join('\n'),
  };
}

/**
 * Status change and/or a public message from the team.
 * `message` must already be empty for confidential cases (notifyCitizen guarantees that);
 * it is ignored here when `sensitive` is true as a second safety net.
 */
export function ticketUpdateEmail({ ticketId, status, statusChanged = true, message, sensitive = false, trackUrl, siteUrl }) {
  const showMessage = !sensitive && String(message || '').trim();
  const lead = statusChanged
    ? `The status of your ticket <strong>${esc(ticketId)}</strong> has changed.`
    : `There is a new message on your ticket <strong>${esc(ticketId)}</strong>.`;
  const body = `
    ${p('Namaste,', 'font-weight:700;color:' + C.ink + ';')}
    ${p(lead)}
    <div style="margin:22px 0 4px;text-align:center;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.muted};">Current status</div>
    ${statusPill(status)}
    ${showMessage ? quote('Message from our team', message) : ''}
    ${progress(status)}
    ${button(trackUrl, 'View full details')}
    <div style="margin-top:14px;text-align:center;font-family:${FONT};font-size:13px;color:${C.muted};">Ticket · <span style="font-family:'Courier New',Consolas,monospace;font-weight:700;color:${C.ink};letter-spacing:1px;">${esc(ticketId)}</span></div>
    ${closing()}`;
  return {
    subject: statusChanged ? `Update on your ticket ${ticketId}: ${status}` : `New message on your ticket ${ticketId}`,
    html: layout({
      preheader: statusChanged ? `Your ticket ${ticketId} is now: ${status}.` : `There is a new message on your ticket ${ticketId}.`,
      eyebrow: statusChanged ? 'Status update' : 'New message',
      title: statusChanged ? 'Your ticket has been updated' : 'You have a new message',
      titleHi: statusChanged ? 'आपके टिकट पर अपडेट' : 'आपके लिए एक नया संदेश',
      body,
      siteUrl,
    }),
    text: [
      statusChanged ? `The status of your ticket ${ticketId} is now: ${status}.` : `There is a new message on your ticket ${ticketId} (status: ${status}).`,
      ...(showMessage ? ['', String(message).trim()] : []),
      '',
      `Full details: ${trackUrl}`,
      '',
      DISCLAIMER,
      '',
      `— ${PARTY.fullName} (${PARTY.hindiName})`,
    ].join('\n'),
  };
}
