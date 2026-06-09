import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

interface RsvpData {
  name: string;
  attending: "yes" | "no";
  guestCount?: string;
  companions?: string;
  comment?: string;
  submittedAt: string;
  meta: {
    ip: string;
    userAgent: string;
    browser: string;
    os: string;
    device: string;
    language: string;
    screenSize: string;
    timezone: string;
    referer: string;
  };
}

// Парсим User-Agent в читаемый вид
function parseUA(ua: string): { browser: string; os: string; device: string } {
  let browser = "Неизвестно";
  let os      = "Неизвестно";
  let device  = "Десктоп";

  // Browser
  if (/YaBrowser/i.test(ua))       browser = "Яндекс Браузер";
  else if (/Edg\//i.test(ua))      browser = "Microsoft Edge";
  else if (/OPR|Opera/i.test(ua))  browser = "Opera";
  else if (/Chrome/i.test(ua))     browser = "Google Chrome";
  else if (/Safari/i.test(ua))     browser = "Safari";
  else if (/Firefox/i.test(ua))    browser = "Firefox";

  // Version
  const vMatch = ua.match(/(YaBrowser|Edg|OPR|Chrome|Safari|Firefox)[\/ ](\d+\.\d+)/);
  if (vMatch) browser += ` ${vMatch[2]}`;

  // OS
  if (/Windows NT 10/i.test(ua))    os = "Windows 10/11";
  else if (/Windows NT/i.test(ua))  os = "Windows";
  else if (/Mac OS X/i.test(ua)) {
    const v = ua.match(/Mac OS X (\d+[._]\d+)/);
    os = v ? `macOS ${v[1].replace("_", ".")}` : "macOS";
  }
  else if (/Android/i.test(ua)) {
    const v = ua.match(/Android (\d+\.\d+)/);
    os = v ? `Android ${v[1]}` : "Android";
  }
  else if (/iPhone OS/i.test(ua)) {
    const v = ua.match(/iPhone OS (\d+_\d+)/);
    os = v ? `iOS ${v[1].replace("_", ".")}` : "iOS";
  }
  else if (/Linux/i.test(ua)) os = "Linux";

  // Device
  if (/iPhone/i.test(ua))         device = "iPhone";
  else if (/iPad/i.test(ua))      device = "iPad";
  else if (/Android/i.test(ua))   device = "Android смартфон";
  else if (/Tablet/i.test(ua))    device = "Планшет";
  else if (/Mobile/i.test(ua))    device = "Мобильный";

  return { browser, os, device };
}

function buildEmailHtml(data: RsvpData): string {
  const isAttending = data.attending === "yes";
  const statusColor = isAttending ? "#1e5e1e" : "#7a1e1e";
  const statusBg    = isAttending ? "#e8f5e8" : "#f5e8e8";
  const statusText  = isAttending ? "✅ БУДЕТ НА СВАДЬБЕ" : "❌ НЕ СМОЖЕТ ПРИЙТИ";

  const row = (label: string, value: string) => value ? `
    <tr>
      <td style="padding:8px 0;color:#888;font-size:11px;letter-spacing:0.2em;
                 text-transform:uppercase;font-family:Arial,sans-serif;
                 width:140px;vertical-align:top">${label}</td>
      <td style="padding:8px 0;color:#1a1a1a;font-size:15px;
                 font-family:Georgia,serif">${value}</td>
    </tr>` : "";

  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0ece6;font-family:Georgia,serif">
<div style="max-width:560px;margin:0 auto">

  <!-- Header -->
  <div style="background:#1a1a1a;padding:28px 36px;text-align:center;border-radius:4px 4px 0 0">
    <div style="color:#f8f5f0;font-size:24px;font-weight:300;letter-spacing:0.15em">
      Данил &amp; Софья
    </div>
    <div style="color:rgba(248,245,240,0.45);font-size:10px;letter-spacing:0.5em;
                text-transform:uppercase;margin-top:8px;font-family:Arial,sans-serif">
      07 · 09 · 2026 &nbsp;·&nbsp; RSVP
    </div>
  </div>

  <!-- Status badge -->
  <div style="background:${statusBg};border:1px solid ${statusColor}33;
              padding:14px 36px;text-align:center">
    <span style="color:${statusColor};font-size:13px;letter-spacing:0.25em;
                 text-transform:uppercase;font-family:Arial,sans-serif;font-weight:600">
      ${statusText}
    </span>
  </div>

  <!-- Main info -->
  <div style="background:#fff;padding:28px 36px;border:1px solid #e8e0d8;border-top:none">
    <table style="width:100%;border-collapse:collapse">
      ${row("Гость", data.name)}
      ${isAttending ? row("Человек", data.guestCount || "1") : ""}
      ${data.companions ? row("С собой", data.companions) : ""}
      ${data.comment ? row("Пожелания", `<em style="color:#555">${data.comment}</em>`) : ""}
    </table>
  </div>

  <!-- Metadata -->
  <div style="background:#f8f5f0;padding:20px 36px;border:1px solid #e8e0d8;border-top:none">
    <div style="font-size:10px;letter-spacing:0.3em;text-transform:uppercase;
                color:#aaa;font-family:Arial,sans-serif;margin-bottom:12px">
      Техническая информация
    </div>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px">
      <tr>
        <td style="color:#999;width:130px;padding:4px 0">Устройство</td>
        <td style="color:#555">${data.meta.device} · ${data.meta.os}</td>
      </tr>
      <tr>
        <td style="color:#999;padding:4px 0">Браузер</td>
        <td style="color:#555">${data.meta.browser}</td>
      </tr>
      <tr>
        <td style="color:#999;padding:4px 0">Экран</td>
        <td style="color:#555">${data.meta.screenSize}</td>
      </tr>
      <tr>
        <td style="color:#999;padding:4px 0">Язык</td>
        <td style="color:#555">${data.meta.language}</td>
      </tr>
      <tr>
        <td style="color:#999;padding:4px 0">Часовой пояс</td>
        <td style="color:#555">${data.meta.timezone}</td>
      </tr>
      <tr>
        <td style="color:#999;padding:4px 0">IP адрес</td>
        <td style="color:#555;font-family:monospace">${data.meta.ip}</td>
      </tr>
      <tr>
        <td style="color:#999;padding:4px 0">Время</td>
        <td style="color:#555">${data.submittedAt}</td>
      </tr>
    </table>
  </div>

  <!-- Footer -->
  <div style="background:#1a1a1a;padding:14px 36px;text-align:center;border-radius:0 0 4px 4px">
    <span style="color:rgba(248,245,240,0.25);font-size:9px;letter-spacing:0.4em;
                 text-transform:uppercase;font-family:Arial,sans-serif">
      лысюк.рф
    </span>
  </div>

</div>
</body>
</html>`;
}

function saveToFile(data: RsvpData) {
  try {
    const dataDir  = path.join(process.cwd(), "data");
    const filePath = path.join(dataDir, "rsvp.json");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
    const existing: RsvpData[] = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
      : [];
    existing.push(data);
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2), "utf-8");
    console.log(`[RSVP] Saved to file. Total: ${existing.length}`);
  } catch (e) {
    console.warn("[RSVP] Could not save to file:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, attending, guestCount, companions, comment, clientMeta } = body;

    if (!name || !attending) {
      return NextResponse.json({ error: "Заполните обязательные поля" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") ?? "";
    const { browser, os, device } = parseUA(ua);

    const data: RsvpData = {
      name,
      attending,
      guestCount,
      companions,
      comment,
      submittedAt: new Date().toLocaleString("ru-RU", {
        timeZone: "Europe/Moscow",
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
      }),
      meta: {
        ip:         req.headers.get("x-forwarded-for")?.split(",")[0].trim()
                    ?? req.headers.get("x-real-ip")
                    ?? "неизвестен",
        userAgent:  ua,
        browser,
        os,
        device,
        language:   req.headers.get("accept-language")?.split(",")[0] ?? "—",
        screenSize: clientMeta?.screenSize ?? "—",
        timezone:   clientMeta?.timezone   ?? "—",
        referer:    req.headers.get("referer") ?? "прямой переход",
      },
    };

    // Сохраняем в файл (бэкап)
    saveToFile(data);

    // Отправляем письмо
    if (process.env.SMTP_USER && process.env.SMTP_PASS && process.env.NOTIFY_EMAIL) {
      const isAttending = attending === "yes";

      // Пробуем порт 587 (STARTTLS) — более универсальный чем 465
      const transporter = nodemailer.createTransport({
        host: "smtp.yandex.ru",
        port: 587,
        secure: false,      // false = STARTTLS (не SSL)
        requireTLS: true,   // обязательно шифрование
        family: 4,          // принудительно IPv4
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
      });

      // Проверяем соединение
      await transporter.verify();
      console.log("[RSVP] SMTP connection OK on port 587");

      const info = await transporter.sendMail({
        from:    `"Свадьба Лысюк" <${process.env.SMTP_USER}>`,
        to:      process.env.NOTIFY_EMAIL,
        subject: `${isAttending ? "✅" : "❌"} RSVP от ${name}`,
        html:    buildEmailHtml(data),
      });

      console.log("[RSVP] Email sent:", info.messageId, "→", process.env.NOTIFY_EMAIL);
    } else {
      console.warn("[RSVP] Email skipped — SMTP vars not set");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[RSVP] ERROR:", err);
    // Даже при ошибке отправки письма — форма считается успешной
    // (данные уже в файле)
    return NextResponse.json({ ok: true, warn: "email_failed" });
  }
}
