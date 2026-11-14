const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const BLOCKED_LOCAL = new Set([
  "test",
  "testing",
  "fake",
  "asdf",
  "asdfasdf",
  "qwerty",
  "junk",
  "trash",
  "spam",
  "example",
  "null",
  "void",
  "nobody",
  "no-reply",
  "noreply",
  "foo",
  "bar",
  "baz",
]);

const BLOCKED_DOMAINS = new Set([
  "example.com",
  "example.org",
  "example.net",
  "example.edu",
  "test.com",
  "test.test",
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.info",
  "guerrillamailblock.com",
  "sharklasers.com",
  "yopmail.com",
  "yopmail.fr",
  "tempmail.com",
  "temp-mail.org",
  "temp-mail.io",
  "10minutemail.com",
  "10minutemail.net",
  "trashmail.com",
  "trash-mail.com",
  "discard.email",
  "getnada.com",
  "maildrop.cc",
  "fakeinbox.com",
  "dispostable.com",
  "mailnesia.com",
  "throwawaymail.com",
  "emailondeck.com",
  "moakt.com",
  "mintemail.com",
  "spam4.me",
  "mytemp.email",
  "tmpmail.org",
  "tmpmail.net",
  "mailcatch.com",
  "inboxkitten.com",
  "burnmail.com",
  "guerrillamail.de",
  "grr.la",
  "mailnull.com",
  "tempinbox.com",
  "trashmail.de",
  "mailforspam.com",
  "spamgourmet.com",
]);

export type EmailCheck =
  | { ok: true; email: string }
  | { ok: false; reason: string };

export function checkEmail(input: string): EmailCheck {
  const email = input.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
    return { ok: false, reason: "Enter a valid email address." };
  }
  const [local, domain] = email.split("@");
  if (!local || !domain || local.length > 64) {
    return { ok: false, reason: "Enter a valid email address." };
  }
  if (
    domain === "localhost" ||
    domain.endsWith(".invalid") ||
    domain.endsWith(".test") ||
    domain.endsWith(".example") ||
    domain.endsWith(".localhost")
  ) {
    return { ok: false, reason: "That email domain cannot be subscribed." };
  }
  const localCore = local.split("+")[0] ?? local;
  if (BLOCKED_LOCAL.has(localCore) || BLOCKED_DOMAINS.has(domain)) {
    return {
      ok: false,
      reason: "Use a real email address. Test and disposable addresses are blocked.",
    };
  }
  if (/^(test|fake|asdf|junk)\d*$/.test(localCore)) {
    return {
      ok: false,
      reason: "Use a real email address. Test and disposable addresses are blocked.",
    };
  }
  return { ok: true, email };
}

/** True when an env value was left blank or still has an obvious stand-in. */
export function isUnset(value: string | undefined | null): boolean {
  if (!value) return true;
  const lower = value.trim().toLowerCase();
  if (!lower) return true;
  return (
    lower === "unset" ||
    lower === "none" ||
    lower === "changeme" ||
    lower === "placeholder" ||
    lower === "todo" ||
    lower.includes("your_") ||
    lower.includes("your-") ||
    lower.includes("placeholder") ||
    lower.includes("changeme")
  );
}

/** From-address check: unset, placeholder, or not a real mailbox. */
export function isPlaceholderFrom(value: string | undefined | null): boolean {
  if (isUnset(value)) return true;
  const trimmed = value!.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("example.com") ||
    lower.includes("example.org") ||
    lower.includes("yourdomain") ||
    lower.includes("todo@")
  ) {
    return true;
  }
  return !trimmed.includes("@");
}
