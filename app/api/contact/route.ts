import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

function sanitize(str: string, max = 2000) {
  return str.trim().slice(0, max);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactBody;

    const name = sanitize(body.name ?? "", 120);
    const email = sanitize(body.email ?? "", 254);
    const message = sanitize(body.message ?? "", 5000);

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Please enter your name (at least 2 characters)." },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!message || message.length < 10) {
      return NextResponse.json(
        { error: "Please enter a message (at least 10 characters)." },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL ?? "tandeldarshan57@gmail.com";
    const fromEmail =
      process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>";

    // --- Production path: Resend ---
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `Portfolio contact from ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            "",
            "Message:",
            message,
          ].join("\n"),
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[contact] Resend error:", err);
        return NextResponse.json(
          { error: "Failed to send message. Please try email directly." },
          { status: 502 }
        );
      }

      return NextResponse.json({ ok: true });
    }

    // --- Dev / no-key path: log only (never fail the form in local dev) ---
    console.log("[contact] Message received (no RESEND_API_KEY set):");
    console.log({ name, email, message: message.slice(0, 200) });

    return NextResponse.json({
      ok: true,
      note: "Dev mode — email logged to server console. Set RESEND_API_KEY to send real mail.",
    });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again or email me directly." },
      { status: 500 }
    );
  }
}
