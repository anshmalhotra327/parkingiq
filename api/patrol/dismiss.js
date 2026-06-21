import { cors, verifyToken, store } from '../_lib.js'

export default function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' })
  const { id } = req.query
  const rec = store.recommendations.find(r => r.id === id)
  if (rec) rec.status = 'dismissed'
  res.json({ status: 'dismissed' })
}
