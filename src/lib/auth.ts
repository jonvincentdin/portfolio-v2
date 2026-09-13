import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";

const DATA_ROOT = path.join(process.cwd(), ".data");
const CHALLENGE_PATH = path.join(DATA_ROOT, "auth-challenge.json");
const RATE_PATH = path.join(DATA_ROOT, "auth-rate.json");
const SESSION_PATH = path.join(DATA_ROOT, "auth-sessions.json");
const COOKIE_NAME = "owner_session";
const OTP_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

type Challenge = { id: string; hash: string; createdAt: number; expiresAt: number; attempts: number };
type RateState = Record<string, number[]>;
type Sessions = Record<string, number>;

function readJson<T>(filePath: string, fallback: T): T {
  if (!fs.existsSync(filePath)) return fallback;
  try { return JSON.parse(fs.readFileSync(filePath, "utf8")) as T; } catch { return fallback; }
}

function writeJson(filePath: string, value: unknown) {
  fs.mkdirSync(DATA_ROOT, { recursive: true, mode: 0o700 });
  const temp = `${filePath}.${process.pid}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(value), { mode: 0o600 });
  fs.renameSync(temp, filePath);
}

function digest(value: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(value).digest("hex");
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret) return secret;
  if (process.env.NODE_ENV !== "production") return "local-development-secret";
  throw new Error("AUTH_SECRET is required in production.");
}

export function getOwnerEmail() {
  return process.env.OWNER_EMAIL?.trim() || "hello@example.com";
}

function pruneRateState(state: RateState, now: number) {
  for (const key of Object.keys(state)) {
    state[key] = state[key].filter((timestamp) => timestamp > now - 60 * 60 * 1000);
    if (state[key].length === 0) delete state[key];
  }
}

export class AuthRateLimitError extends Error {}
export class AuthConfigurationError extends Error {}
export class AuthDeliveryError extends Error {}

function getEmailConfiguration() {
  const ownerEmail = process.env.OWNER_EMAIL?.trim();
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.AUTH_FROM_EMAIL?.trim() || "Portfolio <onboarding@resend.dev>";

  if (!ownerEmail) throw new AuthConfigurationError("OWNER_EMAIL is not configured.");
  if (!apiKey && process.env.AUTH_DEV_MODE !== "true") {
    throw new AuthConfigurationError("RESEND_API_KEY is not configured.");
  }
  return { ownerEmail, apiKey, from };
}

export async function requestOwnerCode(ipAddress: string) {
  const emailConfiguration = getEmailConfiguration();
  const now = Date.now();
  const rate = readJson<RateState>(RATE_PATH, {});
  pruneRateState(rate, now);
  const requests = rate[ipAddress] ?? [];
  if (requests.length >= 5 || requests.at(-1) && now - requests.at(-1)! < RESEND_COOLDOWN_MS) {
    throw new AuthRateLimitError("Too many verification requests.");
  }
  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");
  const challenge: Challenge = { id: crypto.randomUUID(), hash: digest(code), createdAt: now, expiresAt: now + OTP_TTL_MS, attempts: 0 };

  if (emailConfiguration.apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${emailConfiguration.apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from: emailConfiguration.from, to: [emailConfiguration.ownerEmail], subject: "Portfolio owner verification code", text: `Your portfolio verification code is ${code}. It expires in 10 minutes.` }),
      });
      if (!response.ok) {
        const detail = await response.text();
        console.error(`[owner-auth] Resend rejected OTP delivery (${response.status}): ${detail}`);
        throw new AuthDeliveryError("Resend rejected the verification email.");
      }
    } catch (error) {
      if (error instanceof AuthDeliveryError) throw error;
      console.error("[owner-auth] Resend request failed:", error);
      throw new AuthDeliveryError("The verification email could not be sent.");
    }
  } else if (process.env.AUTH_DEV_MODE === "true") {
    console.info(`[owner-auth] development verification code: ${code}`);
  }

  rate[ipAddress] = [...requests, now];
  writeJson(RATE_PATH, rate);
  writeJson(CHALLENGE_PATH, challenge);
}

export async function verifyOwnerCode(code: string) {
  const challenge = readJson<Challenge | null>(CHALLENGE_PATH, null);
  if (!challenge || challenge.expiresAt < Date.now() || challenge.attempts >= MAX_ATTEMPTS) return false;
  challenge.attempts += 1;
  writeJson(CHALLENGE_PATH, challenge);
  const expected = Buffer.from(challenge.hash, "hex");
  const actual = Buffer.from(digest(code), "hex");
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return false;

  const token = crypto.randomBytes(32).toString("hex");
  const sessions = readJson<Sessions>(SESSION_PATH, {});
  sessions[digest(token)] = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  writeJson(SESSION_PATH, sessions);
  fs.rmSync(CHALLENGE_PATH, { force: true });
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL_SECONDS });
  return true;
}

export async function getOwnerSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;
  const sessions = readJson<Sessions>(SESSION_PATH, {});
  const key = digest(token);
  const expiresAt = sessions[key];
  if (!expiresAt) return false;
  if (expiresAt <= Math.floor(Date.now() / 1000)) {
    delete sessions[key];
    writeJson(SESSION_PATH, sessions);
    return false;
  }
  return true;
}

export async function logoutOwner() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    const sessions = readJson<Sessions>(SESSION_PATH, {});
    delete sessions[digest(token)];
    writeJson(SESSION_PATH, sessions);
  }
  cookieStore.delete(COOKIE_NAME);
}
