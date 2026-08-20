// Auth utilities: PBKDF2 hashing (Web Crypto) + D1 sessions + RBAC
import type { Context, Next } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

export type Bindings = { DB: D1Database }
export type AuthUser = { id: number; email: string; name: string; role: string }

const ITERATIONS = 100000

export async function hashPassword(password: string, saltHex?: string): Promise<{ hash: string; salt: string }> {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16))
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    keyMaterial, 256
  )
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) }
}

export async function verifyPassword(password: string, salt: string, expectedHash: string): Promise<boolean> {
  const { hash } = await hashPassword(password, salt)
  if (hash.length !== expectedHash.length) return false
  let diff = 0
  for (let i = 0; i < hash.length; i++) diff |= hash.charCodeAt(i) ^ expectedHash.charCodeAt(i)
  return diff === 0
}

function bytesToHex(b: Uint8Array): string { return Array.from(b).map(x => x.toString(16).padStart(2, '0')).join('') }
function hexToBytes(h: string): Uint8Array { return new Uint8Array(h.match(/.{2}/g)!.map(x => parseInt(x, 16))) }

export function newSessionId(): string {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(32)))
}

const SESSION_COOKIE = 'saraya_session'
const SESSION_HOURS = 12

export async function createSession(db: D1Database, userId: number, ip: string | null): Promise<string> {
  const id = newSessionId()
  const expires = new Date(Date.now() + SESSION_HOURS * 3600 * 1000).toISOString()
  await db.prepare('INSERT INTO sessions (id, user_id, expires_at, ip) VALUES (?, ?, ?, ?)').bind(id, userId, expires, ip).run()
  return id
}

export function setSessionCookie(c: Context, sessionId: string) {
  setCookie(c, SESSION_COOKIE, sessionId, {
    httpOnly: true, secure: true, sameSite: 'Lax', path: '/', maxAge: SESSION_HOURS * 3600
  })
}

export function clearSessionCookie(c: Context) { deleteCookie(c, SESSION_COOKIE, { path: '/' }) }

export async function getSessionUser(c: Context<any>): Promise<AuthUser | null> {
  const sid = getCookie(c, SESSION_COOKIE)
  if (!sid || !/^[a-f0-9]{64}$/.test(sid)) return null
  const row = await (c.env.DB as D1Database).prepare(`
    SELECT u.id, u.email, u.name, u.role FROM sessions s
    JOIN admin_users u ON u.id = s.user_id
    WHERE s.id = ? AND s.expires_at > datetime('now') AND u.is_active = 1
  `).bind(sid).first<AuthUser>()
  return row || null
}

export async function destroySession(c: Context<any>) {
  const sid = getCookie(c, SESSION_COOKIE)
  if (sid) await (c.env.DB as D1Database).prepare('DELETE FROM sessions WHERE id = ?').bind(sid).run()
  clearSessionCookie(c)
}

// Role permission map (server-side enforcement)
const ROLE_PERMS: Record<string, string[]> = {
  super_admin: ['*'],
  content_manager: ['products', 'categories', 'services', 'projects', 'media', 'homepage', 'dashboard'],
  sales: ['leads', 'dashboard'],
  editor: ['products', 'categories', 'services', 'projects', 'homepage', 'dashboard']
}

export function hasPerm(role: string, perm: string): boolean {
  const perms = ROLE_PERMS[role] || []
  return perms.includes('*') || perms.includes(perm)
}

export function requireAuth() {
  return async (c: any, next: Next) => {
    const user = await getSessionUser(c)
    if (!user) return c.json({ error: 'غير مصرح — يجب تسجيل الدخول' }, 401)
    c.set('user', user)
    await next()
  }
}

export function requirePerm(perm: string) {
  return async (c: any, next: Next) => {
    const user = c.get('user') as AuthUser
    if (!user || !hasPerm(user.role, perm)) return c.json({ error: 'ليس لديك صلاحية لهذا الإجراء' }, 403)
    await next()
  }
}

export async function audit(db: D1Database, user: AuthUser | null, action: string, entity: string, entityId: number | null, metadata?: any, ip?: string | null) {
  try {
    await db.prepare('INSERT INTO audit_log (user_id, user_email, action, entity, entity_id, metadata, ip) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(user?.id ?? null, user?.email ?? null, action, entity, entityId, metadata ? JSON.stringify(metadata) : null, ip ?? null).run()
  } catch { /* non-fatal */ }
}

// Simple in-memory rate limiter (per-isolate; adequate for login protection)
const attempts = new Map<string, { count: number; reset: number }>()
export function rateLimit(key: string, max = 8, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now()
  const rec = attempts.get(key)
  if (!rec || now > rec.reset) { attempts.set(key, { count: 1, reset: now + windowMs }); return true }
  rec.count++
  return rec.count <= max
}
