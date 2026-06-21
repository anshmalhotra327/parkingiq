import { cors, verifyToken, store } from '../_lib.js'

export default function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const p = verifyToken(req)
  if (!p) return res.status(401).json({ error: 'Unauthorized' })
  if (!['commander','dcp'].includes(p.role)) return res.status(403).json({ error: 'Forbidden' })
  const { id, status } = req.query
  const v = store.violations.find(v => v.id === id)
  if (v) v.status = status
  res.json({ id, status })
}
