import { cors, verifyToken, store } from '../_lib.js'

export default function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const payload = verifyToken(req)
  if (!payload) return res.status(401).json({ error: 'Unauthorized' })
  const officer = store.officers.find(o => o.id === payload.id)
  if (!officer) return res.status(401).json({ error: 'Not found' })
  const { password: _, ...safe } = officer
  res.json(safe)
}
