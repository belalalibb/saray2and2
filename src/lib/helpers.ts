// Shared helpers
export function slugify(input: string): string {
  const base = (input || '').toString().trim().toLowerCase()
    .replace(/[^\u0600-\u06FFa-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
  return base || 'item-' + Date.now()
}

export function esc(s: any): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

export function nl2list(s: string | null | undefined): string[] {
  return (s || '').split('\n').map(x => x.trim()).filter(Boolean)
}

export function genRequestRef(): string {
  const d = new Date()
  const ymd = d.toISOString().slice(0, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase()
  return `QR-${ymd}-${rand}`
}

export function waLink(number: string, message: string): string {
  let n = (number || '').replace(/\D/g, '')
  if (n.startsWith('0')) n = '2' + n // Egypt country code
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`
}

export async function getSettings(db: D1Database): Promise<Record<string, string>> {
  const rows = await db.prepare('SELECT key, value FROM settings').all()
  const out: Record<string, string> = {}
  for (const r of (rows.results || []) as any[]) out[r.key] = r.value
  return out
}

export function track(db: D1Database, eventType: string, entityId: number | null, path: string) {
  db.prepare('INSERT INTO analytics_events (event_type, entity_id, path) VALUES (?, ?, ?)')
    .bind(eventType, entityId, path).run().catch(() => {})
}
