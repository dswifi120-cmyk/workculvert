import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export function randomToken(bytes = 32) {
  return randomBytes(bytes).toString("hex");
}

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const attempt = scryptSync(password, salt, 64);
  const original = Buffer.from(hash, "hex");
  return original.length === attempt.length && timingSafeEqual(original, attempt);
}

export function expiresInMinutes(minutes: number) {
  return new Date(Date.now() + minutes * 60_000);
}

export function expiresInDays(days: number) {
  return new Date(Date.now() + days * 24 * 60 * 60_000);
}
