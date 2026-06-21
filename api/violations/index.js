import { cors, verifyToken, store } from '../_lib.js'

export default function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  const p = verifyToken(req)
  if (!p) return res.status(401).json({ error: 'Unauthorized' })

  if (req.method === 'GET') {
    const limit  = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0
    return res.json({ violations: store.violations.slice(offset, offset + limit), total: store.violations.length, limit, offset })
  }

  if (req.method === 'POST') {
    const { vehicle_number, vehicle_type, violation_type, latitude, longitude, location, notes } = req.body
    if (!vehicle_number || !violation_type) return res.status(400).json({ error: 'vehicle_number and violation_type required' })
    const id = 'VIO' + Date.now()
    const v  = {
      id, vehicle_number, vehicle_type: vehicle_type || 'UNKNOWN',
      violation_type, latitude, longitude, location: location || '',
      police_station: store.officers.find(o => o.id === p.id)?.station || 'Unknown',
      officer_id: p.id, notes: notes || '', status: 'pending',
      created_at: new Date().toISOString(),
    }
    store.violations.unshift(v)
    return res.status(201).json({ id, status: 'created' })
  }
  res.status(405).end()
}
