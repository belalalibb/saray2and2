// ENG-003 — Auth API: login / logout / me
import { Hono } from 'hono'
import type { Bindings } from '../lib/auth'
import {
  verifyPassword, createSession, setSessionCookie, destroySession,
  getSessionUser, audit, rateLimit
} from '../lib/auth'

const auth = new Hono<{ Bindings: Bindings }>()

auth.post('/login', async (c) => {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  if (!rateLimit('login:' + ip)) {
    return c.json({ error: 'محاولات كثيرة — حاول مرة أخرى بعد قليل' }, 429)
  }
  let body: any
  try { body = await c.req.json() } catch { return c.json({ error: 'بيانات غير صالحة' }, 400) }
  const email = String(body.email || '').trim().toLowerCase()
  const password = String(body.password || '')
  if (!email || !password) return c.json({ error: 'البريد وكلمة المرور مطلوبان' }, 400)

  const user = await c.env.DB.prepare(
    'SELECT id, email, name, role, password_hash, password_salt, is_active FROM admin_users WHERE lower(email) = ?'
  ).bind(email).first<any>()

  if (!user || !user.is_active) return c.json({ error: 'بيانات الدخول غير صحيحة' }, 401)
  const ok = await verifyPassword(password, user.password_salt, user.password_hash)
  if (!ok) {
    await audit(c.env.DB, null, 'login_failed', 'admin_users', user.id, { email }, ip)
    return c.json({ error: 'بيانات الدخول غير صحيحة' }, 401)
  }

  const sid = await createSession(c.env.DB, user.id, ip)
  setSessionCookie(c, sid)
  await c.env.DB.prepare('UPDATE admin_users SET last_login_at = datetime("now") WHERE id = ?').bind(user.id).run()
  await audit(c.env.DB, { id: user.id, email: user.email, name: user.name, role: user.role }, 'login', 'admin_users', user.id, null, ip)
  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

auth.post('/logout', async (c) => {
  await destroySession(c)
  return c.json({ success: true })
})

auth.get('/me', async (c) => {
  const user = await getSessionUser(c)
  if (!user) return c.json({ user: null }, 401)
  return c.json({ user })
})

export default auth
