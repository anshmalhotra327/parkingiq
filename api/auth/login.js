import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { cors, store, JWT_SECRET } from '../_lib.js'

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).end()
  const { badge_id, password } = req.body
  const officer = store.officers.find(o => o.badge_id === badge_id)
  if (!officer) return res.status(401).json({ error: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, officer.password)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ id: officer.id, badge_id: officer.badge_id, role: officer.role }, JWT_SECRET, { expiresIn: '12h' })
  const { password: _, ...safe } = officer
  res.json({ token, officer: safe })
}
