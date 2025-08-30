import { Request, Response, NextFunction } from 'express'
import NodeCache from 'node-cache'

const rateLimitCache = new NodeCache({ stdTTL: 60 }) // 1 minute TTL
const MAX_REQUESTS_PER_MINUTE = 10

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // Only apply rate limiting to the transform-tone endpoint
  if (req.path !== '/api/transform-tone' || req.method !== 'POST') {
    return next()
  }

  const clientIP = req.ip || req.connection.remoteAddress || 'unknown'
  const key = `rate_limit:${clientIP}`
  
  const currentRequests = rateLimitCache.get<number>(key) || 0

  if (currentRequests >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please try again later.',
      retryAfter: 60
    })
  }

  rateLimitCache.set(key, currentRequests + 1)
  next()
}
