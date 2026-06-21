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

  const minCount = parseInt(req.query.min_count) || 3
  const all = JSON.parse(readFileSync(join(DATA, 'heatmap_data.json'), 'utf8'))
  const points = all.filter(p => p.count >= minCount)
  const maxCount = points.reduce((m, p) => Math.max(m, p.count), 0)

  res.json({ points, max_count: maxCount, total_points: points.length })
}
