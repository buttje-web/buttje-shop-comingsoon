import nodemailer from "nodemailer";

// Transaktionaler Versand ueber das bestehende Postfach shop@buttje.at
// (Port 587, STARTTLS). Zugangsdaten ausschliesslich aus Server-Env-Vars.
// Interne Systemnamen tauchen in keiner Mail auf.

const ABSENDER = '"buttje" <shop@buttje.at>';

function transport() {
  const user = process.env.SHOP_SMTP_USER;
  const pass = process.env.SHOP_SMTP_PASS;
  if (!user?.trim() || !pass?.trim()) throw new Error("SMTP-Zugangsdaten fehlen.");
  return nodemailer.createTransport({
    host: "smtp.ionos.de",
    port: 587,
    secure: false, // STARTTLS
    requireTLS: true,
    auth: { user: user.trim(), pass: pass.trim() },
  });
}

/** Reiner Verbindungs-/Login-Test ohne Versand (EHLO + STARTTLS + AUTH). */
export async function pruefeSmtpVerbindung(): Promise<void> {
  await transport().verify();
}

export async function sendeBestaetigungsMail(an: string, link: string): Promise<void> {
  const text = [
    "Fast geschafft.",
    "",
    "Sie möchten zur Eröffnung des buttje Shops informiert werden.",
    "Bitte bestätigen Sie Ihre Anmeldung mit diesem Link:",
    "",
    link,
    "",
    "Der Link ist 7 Tage gültig. Wenn Sie sich nicht eingetragen haben,",
    "ignorieren Sie diese E-Mail einfach.",
    "",
    "buttje e.U. · Wien",
    "shop.buttje.at",
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="de">
<body style="margin:0;padding:0;background:#0E0E12;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0E0E12;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">
        <tr><td style="padding-bottom:28px;">
          <span style="font-family:Inter,Helvetica,Arial,sans-serif;font-size:26px;font-weight:800;letter-spacing:-1px;color:#F4F4F6;">buttje</span>
        </td></tr>
        <tr><td style="font-family:Inter,Helvetica,Arial,sans-serif;color:#F4F4F6;">
          <p style="margin:0 0 14px;font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:-0.3px;">Fast geschafft.</p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:rgba(244,244,246,0.74);">
            Sie möchten zur Eröffnung des buttje Shops informiert werden.
            Bitte bestätigen Sie Ihre Anmeldung mit einem Klick.
          </p>
          <p style="margin:0 0 28px;">
            <a href="${link}" style="display:inline-block;padding:13px 26px;border:1px solid rgba(244,244,246,0.34);color:#F4F4F6;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">Anmeldung bestätigen</a>
          </p>
          <p style="margin:0 0 6px;font-size:12.5px;line-height:1.6;color:rgba(244,244,246,0.52);">
            Der Link ist 7 Tage gültig. Wenn Sie sich nicht eingetragen haben,
            ignorieren Sie diese E-Mail einfach.
          </p>
        </td></tr>
        <tr><td style="padding-top:28px;border-top:1px solid rgba(244,244,246,0.14);font-family:Inter,Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:rgba(244,244,246,0.52);">
          © 2026 buttje e.U. · Wien &nbsp;·&nbsp; <a href="https://shop.buttje.at" style="color:rgba(244,244,246,0.52);">shop.buttje.at</a>
          &nbsp;·&nbsp; <a href="https://shop.buttje.at/impressum" style="color:rgba(244,244,246,0.52);">Impressum</a>
          &nbsp;·&nbsp; <a href="https://shop.buttje.at/datenschutz" style="color:rgba(244,244,246,0.52);">Datenschutz</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await transport().sendMail({
    from: ABSENDER,
    to: an,
    subject: "Bitte bestätigen: Ihre Anmeldung — buttje",
    text,
    html,
  });
}
