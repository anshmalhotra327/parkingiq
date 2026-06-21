import { cors, verifyToken, store } from '../_lib.js'

export default function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' })
  const { id } = req.query
  if (id === 'all') {
    store.alerts.forEach(a => { a.is_read = 1 })
  } else {
    const a = store.alerts.find(a => a.id === id)
    if (a) a.is_read = 1
  }
  res.json({ status: 'ok' })
}
