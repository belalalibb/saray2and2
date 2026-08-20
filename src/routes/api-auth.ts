import { Hono } from 'hono'
import type { Bindings, Vars } from '../lib'
import { hashPassword, getCookie, audit } from '../lib'

const auth = new Hono<{ Bindings: Bindings; Variables: Vars }>()

const COOKIE = 'admin_session'
const WEEK = 7 * 24 * 3600

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json().catch(() => ({}))
  if (!email || !password) return c.json({ error: 'البريد وكلمة المرور مطلوبان' }, 400)
  const user: any = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(String(email).toLowerCase().trim()).first()
  if (!user || user.password_hash !== await hashPassword(password)) return c.json({ error: 'بيانات الدخول غير صحيحة' }, 401)
  if (!user.is_active) return c.json({ error: 'الحساب معطل — تواصل مع المدير' }, 403)

  const sid = crypto.randomUUID() + '-' + crypto.randomUUID()
  await c.env.DB.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime('now', '+7 days'))").bind(sid, user.id).run()
  await c.env.DB.prepare("UPDATE users SET last_login_at = datetime('now') WHERE id = ?").bind(user.id).run()
  await audit(c.env.DB, user, 'login', 'auth')

  c.header('Set-Cookie', `${COOKIE}=${sid}; HttpOnly; Path=/; Max-Age=${WEEK}; SameSite=Lax`)
  return c.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
})

auth.post('/logout', async (c) => {
  const sid = getCookie(c.req.header('Cookie'), COOKIE)
  if (sid) await c.env.DB.prepare('DELETE FROM sessions WHERE id = ?').bind(sid).run()
  c.header('Set-Cookie', `${COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`)
  return c.json({ success: true })
})

auth.get('/me', async (c) => {
  const sid = getCookie(c.req.header('Cookie'), COOKIE)
  if (!sid) return c.json({ user: null }, 401)
  const row: any = await c.env.DB.prepare(
    "SELECT u.id, u.name, u.email, u.role, u.is_active FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > datetime('now')"
  ).bind(sid).first()
  if (!row || !row.is_active) return c.json({ user: null }, 401)
  return c.json({ user: row })
})

// Middleware factory used by admin routes
export async function requireAuth(c: any, next: any) {
  const sid = getCookie(c.req.header('Cookie'), COOKIE)
  if (!sid) return c.json({ error: 'غير مصرح — سجل الدخول' }, 401)
  const row: any = await c.env.DB.prepare(
    "SELECT u.id, u.name, u.email, u.role, u.is_active FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.id = ? AND s.expires_at > datetime('now')"
  ).bind(sid).first()
  if (!row || !row.is_active) return c.json({ error: 'انتهت الجلسة — سجل الدخول مجدداً' }, 401)
  c.set('user', row)
  await next()
}

export default auth
