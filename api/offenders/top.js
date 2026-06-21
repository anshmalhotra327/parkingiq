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

  const limit = parseInt(req.query.limit) || 20
  const risk  = req.query.risk || null
  let all = JSON.parse(readFileSync(join(DATA, 'repeat_offenders.json'), 'utf8'))
  if (risk) all = all.filter(o => o.risk_label === risk)
  all.sort((a,b) => b.risk_score - a.risk_score)

  res.json({ offenders: all.slice(0, limit), total_in_registry: 231736 })
}
