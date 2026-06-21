import { cors, verifyToken, store } from '../_lib.js'

export default function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' })
  res.json(store.recommendations.filter(r => r.status === 'active').slice(0, 20))
}
