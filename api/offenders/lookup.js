import { cors, verifyToken } from '../_lib.js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA = join(__dirname, '../../public/data')

export default function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (!verifyToken(req)) return res.status(401).json({ error: 'Unauthorized' })

  const plate = (req.query.plate || '').toUpperCase()
  if (!plate) return res.status(400).json({ error: 'plate required' })

  const lookup = JSON.parse(readFileSync(join(DATA, 'offender_lookup.json'), 'utf8'))
  const rec = lookup[plate]

  if (!rec) return res.json({ found: false, vehicle_number: plate })

  res.json({
    found: true,
    vehicle_number: plate,
    total_violations: rec.t,
    risk_score: rec.s,
    risk_label: rec.l,
    violation_rate_per_day: rec.r,
    first_seen: rec.f,
    last_seen: rec.e,
    towing_priority: rec.s > 40,
    escalate_to_rto: rec.s > 50,
  })
}
