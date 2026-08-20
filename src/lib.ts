// Shared helpers
export type Bindings = { DB: D1Database }
export type Vars = { user: any }

export async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

export const hashPassword = (pw: string) => sha256Hex(pw + ':luxfurn')

export function slugify(s: string): string {
  return (s || '')
    .toString().trim().toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'item'
}

export async function audit(db: D1Database, user: any, action: string, entity: string, entityId?: number, metadata?: any) {
  try {
    await db.prepare('INSERT INTO audit_log (user_id, user_email, action, entity, entity_id, metadata) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(user?.id ?? null, user?.email ?? null, action, entity, entityId ?? null, metadata ? JSON.stringify(metadata) : null).run()
  } catch { /* non-fatal */ }
}

// role → permissions
export const PERMS: Record<string, string[]> = {
  admin: ['*'],
  editor: ['products', 'categories', 'services', 'projects', 'homepage', 'settings'],
  sales: ['leads']
}
export function hasPerm(role: string, perm: string): boolean {
  const p = PERMS[role] || []
  return p.includes('*') || p.includes(perm)
}

export function getCookie(cookieHeader: string | undefined, name: string): string | null {
  if (!cookieHeader) return null
  const m = cookieHeader.match(new RegExp('(?:^|;\\s*)' + name + '=([^;]+)'))
  return m ? decodeURIComponent(m[1]) : null
}
