import { Request, Response, NextFunction } from 'express'

export function validateToneRequest(req: Request, res: Response, next: NextFunction) {
  const { text, tone } = req.body

  if (!text || typeof text !== 'string') {
    return res.status(400).json({
      error: 'Text is required and must be a string'
    })
  }

  if (!tone || typeof tone !== 'string') {
    return res.status(400).json({
      error: 'Tone is required and must be a string'
    })
  }

  const validTones = [
    'formal', 'casual', 'friendly', 'academic', 
    'creative', 'technical', 'persuasive', 'humorous', 'empathetic'
  ]

  if (!validTones.includes(tone)) {
    return res.status(400).json({
      error: `Invalid tone. Must be one of: ${validTones.join(', ')}`
    })
  }

  if (text.trim().length === 0) {
    return res.status(400).json({
      error: 'Text cannot be empty'
    })
  }

  if (text.length > 5000) {
    return res.status(400).json({
      error: 'Text is too long. Maximum 5000 characters allowed.'
    })
  }

  next()
}
